import aiosqlite
import os
from typing import Optional
from datetime import datetime

class Database:
    def __init__(self, db_path: str = "data/yoru.db"):
        self.db_path = db_path
        self.conn: Optional[aiosqlite.Connection] = None
    
    async def connect(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.conn = await aiosqlite.connect(self.db_path)
        self.conn.row_factory = aiosqlite.Row
        await self._create_tables()
    
    async def _create_tables(self):
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS guild_configs (
                guild_id INTEGER PRIMARY KEY,
                prefix TEXT DEFAULT '!',
                mod_log_channel INTEGER,
                join_log_channel INTEGER,
                leave_log_channel INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS moderation_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id INTEGER,
                user_id INTEGER,
                moderator_id INTEGER,
                action TEXT,
                reason TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS warnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id INTEGER,
                user_id INTEGER,
                moderator_id INTEGER,
                reason TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS game_stats (
                user_id INTEGER PRIMARY KEY,
                credits INTEGER DEFAULT 0,
                fragments INTEGER DEFAULT 0,
                energy INTEGER DEFAULT 10,
                game_xp INTEGER DEFAULT 0,
                game_level INTEGER DEFAULT 1,
                emotion_xp INTEGER DEFAULT 0,
                last_daily TIMESTAMP,
                daily_streak INTEGER DEFAULT 0,
                total_hacks INTEGER DEFAULT 0,
                total_duels_won INTEGER DEFAULT 0,
                total_duels_lost INTEGER DEFAULT 0,
                equipped_weapon TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS weapons (
                weapon_id TEXT PRIMARY KEY,
                name TEXT UNIQUE,
                rarity TEXT,
                attack INTEGER,
                defense INTEGER DEFAULT 0,
                price INTEGER,
                description TEXT
            )
        ''')
        
        # Seed weapons if table is empty
        cursor = await self.conn.execute('SELECT COUNT(*) FROM weapons')
        count = await cursor.fetchone()
        if count[0] == 0:
            weapons_data = [
                ('data_shard', 'Data Shard', 'Common', 2, 0, 100, 'A fragment of corrupted data'),
                ('neon_dagger', 'Neon Dagger', 'Common', 3, 0, 200, 'Glowing blade of neon light'),
                ('pulse_blade', 'Pulse Blade', 'Uncommon', 5, 0, 500, 'Vibrates with electric energy'),
                ('cyber_katana', 'Cyber Katana', 'Rare', 8, 0, 1200, 'Traditional blade, cyber edge'),
                ('plasma_cutter', 'Plasma Cutter', 'Rare', 10, 0, 1800, 'Cuts through anything'),
                ('shadow_edge', 'Shadow Edge', 'Epic', 15, 0, 3500, 'Forged in darkness'),
                ('phantom_blade', 'Phantom Blade', 'Epic', 18, 0, 4500, 'Ethereal weapon of ghosts'),
                ('dragon_protocol', 'Dragon Protocol', 'Legendary', 25, 0, 8000, 'Ancient AI weapon'),
                ('yoru_edge', "Yoru's Edge", 'Legendary', 30, 0, 12000, 'The signature blade'),
                ('void_ripper', 'Void Ripper', 'Mythic', 40, 0, 25000, 'Tears through reality itself')
            ]
            await self.conn.executemany(
                'INSERT INTO weapons (weapon_id, name, rarity, attack, defense, price, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                weapons_data
            )
        
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS player_inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                weapon_id INTEGER,
                quantity INTEGER DEFAULT 1,
                acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, weapon_id)
            )
        ''')
        
        await self.conn.execute('''
            CREATE TABLE IF NOT EXISTS duel_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                challenger_id INTEGER,
                opponent_id INTEGER,
                winner_id INTEGER,
                credits_won INTEGER,
                xp_won INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        await self.conn.commit()
    
    async def create_guild_config(self, guild_id: int):
        await self.conn.execute(
            'INSERT OR IGNORE INTO guild_configs (guild_id) VALUES (?)',
            (guild_id,)
        )
        await self.conn.commit()
    
    async def get_or_create_player(self, user_id: int):
        cursor = await self.conn.execute(
            'SELECT * FROM game_stats WHERE user_id = ?',
            (user_id,)
        )
        player = await cursor.fetchone()
        
        if not player:
            await self.conn.execute(
                'INSERT INTO game_stats (user_id) VALUES (?)',
                (user_id,)
            )
            await self.conn.commit()
            
            cursor = await self.conn.execute(
                'SELECT * FROM game_stats WHERE user_id = ?',
                (user_id,)
            )
            player = await cursor.fetchone()
        
        return dict(player)
    
    async def update_player_xp(self, user_id: int, game_xp: int = 0, emotion_xp: int = 0):
        player = await self.get_or_create_player(user_id)
        
        new_game_xp = player['game_xp'] + game_xp
        new_emotion_xp = player['emotion_xp'] + emotion_xp
        
        await self.conn.execute(
            'UPDATE game_stats SET game_xp = ?, emotion_xp = ? WHERE user_id = ?',
            (new_game_xp, new_emotion_xp, user_id)
        )
        await self.conn.commit()
        
        return new_game_xp, new_emotion_xp
    
    async def update_player_credits(self, user_id: int, amount: int):
        player = await self.get_or_create_player(user_id)
        new_credits = max(0, player['credits'] + amount)
        
        await self.conn.execute(
            'UPDATE game_stats SET credits = ? WHERE user_id = ?',
            (new_credits, user_id)
        )
        await self.conn.commit()
        
        return new_credits
    
    async def close(self):
        if self.conn:
            await self.conn.close()
    
    # Game-specific methods
    async def get_game_stats(self, user_id: str):
        """Get or create player game stats"""
        user_id_int = int(user_id)
        cursor = await self.conn.execute(
            'SELECT * FROM game_stats WHERE user_id = ?',
            (user_id_int,)
        )
        player = await cursor.fetchone()
        
        if not player:
            await self.conn.execute(
                'INSERT INTO game_stats (user_id) VALUES (?)',
                (user_id_int,)
            )
            await self.conn.commit()
            
            cursor = await self.conn.execute(
                'SELECT * FROM game_stats WHERE user_id = ?',
                (user_id_int,)
            )
            player = await cursor.fetchone()
        
        return dict(player)
    
    async def update_game_stats(self, user_id: str, **kwargs):
        """Update specific fields in game_stats"""
        user_id_int = int(user_id)
        await self.get_game_stats(user_id)  # Ensure player exists
        
        # Build UPDATE query dynamically
        fields = []
        values = []
        for key, value in kwargs.items():
            fields.append(f"{key} = ?")
            values.append(value)
        
        if fields:
            query = f"UPDATE game_stats SET {', '.join(fields)} WHERE user_id = ?"
            values.append(user_id_int)
            await self.conn.execute(query, values)
            await self.conn.commit()
    
    async def get_all_weapons(self):
        """Get all weapons"""
        cursor = await self.conn.execute('SELECT * FROM weapons ORDER BY price ASC')
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
    
    async def get_weapon(self, weapon_id: str):
        """Get specific weapon by ID"""
        cursor = await self.conn.execute(
            'SELECT * FROM weapons WHERE weapon_id = ?',
            (weapon_id,)
        )
        row = await cursor.fetchone()
        return dict(row) if row else None
    
    async def get_inventory(self, user_id: str):
        """Get player's weapon inventory"""
        user_id_int = int(user_id)
        cursor = await self.conn.execute(
            'SELECT * FROM player_inventory WHERE user_id = ?',
            (user_id_int,)
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
    
    async def add_to_inventory(self, user_id: str, weapon_id: str):
        """Add weapon to player inventory"""
        user_id_int = int(user_id)
        await self.conn.execute(
            'INSERT OR IGNORE INTO player_inventory (user_id, weapon_id) VALUES (?, ?)',
            (user_id_int, weapon_id)
        )
        await self.conn.commit()
    
    async def remove_from_inventory(self, user_id: str, weapon_id: str):
        """Remove weapon from player inventory"""
        user_id_int = int(user_id)
        await self.conn.execute(
            'DELETE FROM player_inventory WHERE user_id = ? AND weapon_id = ?',
            (user_id_int, weapon_id)
        )
        await self.conn.commit()
    
    async def get_leaderboard(self, sort_by: str = 'game_level', limit: int = 10):
        """Get top players sorted by specified column"""
        query = f'SELECT * FROM game_stats ORDER BY {sort_by} DESC LIMIT ?'
        cursor = await self.conn.execute(query, (limit,))
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
