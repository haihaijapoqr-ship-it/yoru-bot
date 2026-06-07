import discord
from discord import app_commands
from discord.ext import commands
from utils.embeds import create_game_embed, create_error_embed
from database.models import Database
from utils.checks import calculate_xp_for_level

class Profile(commands.Cog):
    """Player profiles, stats, and leaderboards"""
    
    def __init__(self, bot):
        self.bot = bot
        self.db = bot.db
    
    @app_commands.command(name="profile", description="👤 View your game profile")
    @app_commands.describe(user="User to view profile (optional, defaults to yourself)")
    async def profile(self, interaction: discord.Interaction, user: discord.Member = None):
        """Display comprehensive player profile"""
        await interaction.response.defer()
        
        target = user or interaction.user
        user_id = str(target.id)
        
        # Get stats
        stats = await self.db.get_game_stats(user_id)
        
        # Get equipped weapon
        equipped_weapon = None
        if stats.get('equipped_weapon'):
            equipped_weapon = await self.db.get_weapon(stats['equipped_weapon'])
        
        # Calculate XP progress
        current_level = stats['game_level']
        current_xp = stats['game_xp']
        xp_for_current = calculate_xp_for_level(current_level)
        xp_for_next = calculate_xp_for_level(current_level + 1)
        xp_progress = current_xp - xp_for_current
        xp_needed = xp_for_next - xp_for_current
        progress_percent = int((xp_progress / xp_needed) * 100) if xp_needed > 0 else 100
        
        # Build profile
        weapon_text = f"⚔️ {equipped_weapon['name']} ({equipped_weapon['attack']} ATK)" if equipped_weapon else "⚔️ None equipped"
        
        # Win rate
        total_duels = stats['total_duels_won'] + stats['total_duels_lost']
        win_rate = (stats['total_duels_won'] / total_duels * 100) if total_duels > 0 else 0
        
        embed = discord.Embed(
            title=f"👤 {target.display_name}'s Profile",
            description="```\n"
                        f"SYSTEM ID: {user_id}\n"
                        f"STATUS: CONNECTED\n"
                        f"```",
            color=0x9D4EDD
        )
        
        embed.add_field(
            name="📊 Stats",
            value=f"```\n"
                  f"Level:    {stats['game_level']}\n"
                  f"Game XP:  {stats['game_xp']}\n"
                  f"Emo XP:   {stats['emotion_xp']}\n"
                  f"Progress: {progress_percent}% [{xp_progress}/{xp_needed}]\n"
                  f"```",
            inline=False
        )
        
        embed.add_field(
            name="💰 Resources",
            value=f"```\n"
                  f"Credits:   ₿ {stats['credits']}\n"
                  f"Fragments: 💠 {stats['fragments']}\n"
                  f"Energy:    ⚡ {stats['energy']}/10\n"
                  f"```",
            inline=True
        )
        
        embed.add_field(
            name="⚔️ Combat",
            value=f"```\n"
                  f"Weapon:   {equipped_weapon['name'] if equipped_weapon else 'None'}\n"
                  f"Attack:   {equipped_weapon['attack'] if equipped_weapon else 5}\n"
                  f"Duels Won: {stats['total_duels_won']}\n"
                  f"Win Rate:  {win_rate:.1f}%\n"
                  f"```",
            inline=True
        )
        
        embed.add_field(
            name="📈 Activity",
            value=f"```\n"
                  f"Hacks:       {stats['total_hacks']}\n"
                  f"Daily Streak: {stats['daily_streak']} days\n"
                  f"Duels Total:  {total_duels}\n"
                  f"```",
            inline=False
        )
        
        embed.set_thumbnail(url=target.display_avatar.url)
        embed.set_footer(text="Yoru System v1.0 — Stay luminous 🌙")
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="stats", description="📊 View detailed statistics")
    async def stats(self, interaction: discord.Interaction):
        """Show detailed breakdown of player statistics"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        stats = await self.db.get_game_stats(user_id)
        inventory = await self.db.get_inventory(user_id)
        
        # Calculate totals
        total_duels = stats['total_duels_won'] + stats['total_duels_lost']
        win_rate = (stats['total_duels_won'] / total_duels * 100) if total_duels > 0 else 0
        
        # Get weapon count by rarity
        rarity_counts = {"Common": 0, "Uncommon": 0, "Rare": 0, "Epic": 0, "Legendary": 0, "Mythic": 0}
        for item in inventory:
            weapon = await self.db.get_weapon(item['weapon_id'])
            if weapon and weapon['rarity'] in rarity_counts:
                rarity_counts[weapon['rarity']] += 1
        
        embed = create_game_embed(
            "📊 Detailed Statistics",
            f"**💰 Economy**\n"
            f"```\n"
            f"Credits:      ₿ {stats['credits']}\n"
            f"Fragments:    💠 {stats['fragments']}\n"
            f"Energy:       ⚡ {stats['energy']}/10\n"
            f"```\n"
            f"**⭐ Experience**\n"
            f"```\n"
            f"Game Level:   {stats['game_level']}\n"
            f"Game XP:      {stats['game_xp']}\n"
            f"Emotion XP:   {stats['emotion_xp']}\n"
            f"```\n"
            f"**⚔️ Combat Record**\n"
            f"```\n"
            f"Duels Won:    {stats['total_duels_won']}\n"
            f"Duels Lost:   {stats['total_duels_lost']}\n"
            f"Win Rate:     {win_rate:.1f}%\n"
            f"```\n"
            f"**🎮 Activities**\n"
            f"```\n"
            f"Total Hacks:  {stats['total_hacks']}\n"
            f"Daily Streak: {stats['daily_streak']} days\n"
            f"```\n"
            f"**🎒 Arsenal ({len(inventory)} weapons)**\n"
            f"```\n"
            f"Common:       {rarity_counts['Common']}\n"
            f"Uncommon:     {rarity_counts['Uncommon']}\n"
            f"Rare:         {rarity_counts['Rare']}\n"
            f"Epic:         {rarity_counts['Epic']}\n"
            f"Legendary:    {rarity_counts['Legendary']}\n"
            f"Mythic:       {rarity_counts['Mythic']}\n"
            f"```"
        )
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="leaderboard", description="🏆 View global rankings")
    @app_commands.describe(
        category="What to rank by: xp, credits, duels, hacks, or level"
    )
    @app_commands.choices(category=[
        app_commands.Choice(name="🏆 Level", value="level"),
        app_commands.Choice(name="⭐ Game XP", value="xp"),
        app_commands.Choice(name="💰 Credits", value="credits"),
        app_commands.Choice(name="⚔️ Duel Wins", value="duels"),
        app_commands.Choice(name="🎮 Total Hacks", value="hacks")
    ])
    async def leaderboard(self, interaction: discord.Interaction, category: str = "level"):
        """Display global leaderboard"""
        await interaction.response.defer()
        
        # Map category to column
        column_map = {
            "level": "game_level",
            "xp": "game_xp",
            "credits": "credits",
            "duels": "total_duels_won",
            "hacks": "total_hacks"
        }
        
        sort_column = column_map.get(category, "game_level")
        
        # Get top 10 players
        top_players = await self.db.get_leaderboard(sort_column, limit=10)
        
        if not top_players:
            embed = create_error_embed("Empty Leaderboard", "No players found!")
            await interaction.followup.send(embed=embed)
            return
        
        # Build leaderboard text
        leaderboard_text = "```\n"
        medals = ["🥇", "🥈", "🥉"]
        
        for idx, player in enumerate(top_players):
            rank = medals[idx] if idx < 3 else f"{idx + 1}."
            
            # Try to get username
            try:
                member = await interaction.guild.fetch_member(int(player['user_id']))
                username = member.display_name[:12]  # Truncate long names
            except:
                username = f"User{player['user_id'][:6]}"
            
            # Get value based on category
            if category == "level":
                value = f"Lv.{player['game_level']}"
            elif category == "xp":
                value = f"{player['game_xp']} XP"
            elif category == "credits":
                value = f"₿{player['credits']}"
            elif category == "duels":
                value = f"{player['total_duels_won']} wins"
            else:  # hacks
                value = f"{player['total_hacks']} hacks"
            
            leaderboard_text += f"{rank} {username:<12} {value}\n"
        
        leaderboard_text += "```"
        
        category_titles = {
            "level": "🏆 Top Levels",
            "xp": "⭐ Top Game XP",
            "credits": "💰 Richest Players",
            "duels": "⚔️ Duel Champions",
            "hacks": "🎮 Top Hackers"
        }
        
        embed = create_game_embed(
            category_titles.get(category, "🏆 Leaderboard"),
            leaderboard_text
        )
        embed.set_footer(text="Keep grinding to reach the top!")
        
        await interaction.followup.send(embed=embed)

async def setup(bot):
    await bot.add_cog(Profile(bot))
