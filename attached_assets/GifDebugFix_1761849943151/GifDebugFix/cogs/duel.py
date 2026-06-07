import discord
from discord import app_commands
from discord.ext import commands
import random
from datetime import datetime
from utils.embeds import create_game_embed, create_error_embed
from utils.cache import cooldown_manager
from database.models import Database

class Duel(commands.Cog):
    """Player vs Player combat system"""
    
    def __init__(self, bot):
        self.bot = bot
        self.db = bot.db
        self.pending_duels = {}  # {challenger_id: (opponent_id, interaction)}
    
    def calculate_attack(self, stats, weapon_attack):
        """Calculate total attack damage"""
        base = weapon_attack if weapon_attack else 5  # Default 5 if no weapon
        level_bonus = stats['game_level'] * 2  # +2 ATK per level
        return base + level_bonus
    
    @app_commands.command(name="duel", description="⚔️ Challenge another player to combat")
    @app_commands.describe(opponent="The player you want to duel")
    async def duel(self, interaction: discord.Interaction, opponent: discord.Member):
        """Initiate a duel with another player"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        opponent_id = str(opponent.id)
        
        # Validation checks
        if opponent.bot:
            embed = create_error_embed("Invalid Target", "You can't duel a bot!")
            await interaction.followup.send(embed=embed)
            return
        
        if user_id == opponent_id:
            embed = create_error_embed("Invalid Target", "You can't duel yourself!")
            await interaction.followup.send(embed=embed)
            return
        
        # Check level requirement
        stats = await self.db.get_game_stats(user_id)
        if stats['game_level'] < 10:
            embed = create_error_embed(
                "Level Too Low",
                f"You must be level **10** to duel (Current: {stats['game_level']})"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Check opponent level
        opp_stats = await self.db.get_game_stats(opponent_id)
        if opp_stats['game_level'] < 10:
            embed = create_error_embed(
                "Opponent Level Too Low",
                f"{opponent.mention} must be level **10** to duel (Current: {opp_stats['game_level']})"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Check cooldown
        if cooldown_manager.is_on_cooldown(user_id, "duel"):
            remaining = cooldown_manager.get_remaining_time(user_id, "duel")
            embed = create_error_embed(
                "Cooldown Active",
                f"⏰ You must wait **{remaining}s** before dueling again."
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Create duel request
        self.pending_duels[user_id] = (opponent_id, interaction)
        
        # Create accept/decline view
        view = DuelView(self, user_id, opponent_id, interaction)
        
        embed = create_game_embed(
            "⚔️ Duel Challenge!",
            f"{interaction.user.mention} challenges {opponent.mention} to a duel!\n\n"
            f"**{interaction.user.display_name}**\n"
            f"Level: {stats['game_level']} | ATK: {self.calculate_attack(stats, await self._get_weapon_attack(user_id))}\n\n"
            f"**{opponent.display_name}**\n"
            f"Level: {opp_stats['game_level']} | ATK: {self.calculate_attack(opp_stats, await self._get_weapon_attack(opponent_id))}\n\n"
            f"{opponent.mention}, click Accept or Decline below!"
        )
        embed.set_footer(text="Duel unlocks at Level 10 | Winner gets 200-500₿ and 50-100 XP")
        
        await interaction.followup.send(embed=embed, view=view)
    
    async def _get_weapon_attack(self, user_id):
        """Get equipped weapon attack value"""
        stats = await self.db.get_game_stats(user_id)
        equipped = stats.get('equipped_weapon')
        if equipped:
            weapon = await self.db.get_weapon(equipped)
            return weapon['attack'] if weapon else 0
        return 0
    
    async def execute_duel(self, challenger_id: str, opponent_id: str, interaction: discord.Interaction):
        """Run the actual duel combat"""
        # Get both players' stats
        c_stats = await self.db.get_game_stats(challenger_id)
        o_stats = await self.db.get_game_stats(opponent_id)
        
        # Calculate attack values
        c_weapon_atk = await self._get_weapon_attack(challenger_id)
        o_weapon_atk = await self._get_weapon_attack(opponent_id)
        
        c_attack = self.calculate_attack(c_stats, c_weapon_atk)
        o_attack = self.calculate_attack(o_stats, o_weapon_atk)
        
        # HP = 100 + (level * 10)
        c_hp = 100 + (c_stats['game_level'] * 10)
        o_hp = 100 + (o_stats['game_level'] * 10)
        
        c_max_hp = c_hp
        o_max_hp = o_hp
        
        # Combat log
        battle_log = "```\n"
        turn = 1
        
        while c_hp > 0 and o_hp > 0:
            # Challenger attacks
            damage = c_attack + random.randint(-5, 5)
            o_hp -= damage
            battle_log += f"Turn {turn}: Challenger deals {damage} DMG → Opponent {max(0, o_hp)}/{o_max_hp} HP\n"
            
            if o_hp <= 0:
                break
            
            # Opponent attacks
            damage = o_attack + random.randint(-5, 5)
            c_hp -= damage
            battle_log += f"Turn {turn}: Opponent deals {damage} DMG → Challenger {max(0, c_hp)}/{c_max_hp} HP\n"
            
            turn += 1
            
            # Max 10 turns
            if turn > 10:
                break
        
        battle_log += "```"
        
        # Determine winner
        if c_hp > o_hp:
            winner_id = challenger_id
            loser_id = opponent_id
            winner_name = interaction.guild.get_member(int(challenger_id)).display_name
        else:
            winner_id = opponent_id
            loser_id = challenger_id
            winner_name = interaction.guild.get_member(int(opponent_id)).display_name
        
        # Rewards
        credits_reward = random.randint(200, 500)
        xp_reward = random.randint(50, 100)
        
        # Update winner stats
        winner_stats = await self.db.get_game_stats(winner_id)
        await self.db.update_game_stats(
            winner_id,
            credits=winner_stats['credits'] + credits_reward,
            game_xp=winner_stats['game_xp'] + xp_reward,
            total_duels_won=winner_stats['total_duels_won'] + 1
        )
        
        # Update loser stats
        loser_stats = await self.db.get_game_stats(loser_id)
        await self.db.update_game_stats(
            loser_id,
            total_duels_lost=loser_stats['total_duels_lost'] + 1
        )
        
        # Set cooldown for both
        cooldown_manager.set_cooldown(challenger_id, "duel", 45)
        cooldown_manager.set_cooldown(opponent_id, "duel", 45)
        
        # Send result
        embed = create_game_embed(
            f"⚔️ {winner_name} Wins!",
            f"{battle_log}\n"
            f"**Victory Rewards:**\n"
            f"₿ Credits: **+{credits_reward}**\n"
            f"⭐ XP: **+{xp_reward}**"
        )
        embed.set_footer(text="Cooldown: 45s | Practice makes perfect!")
        
        await interaction.followup.send(embed=embed)
        
        # Clean up
        if challenger_id in self.pending_duels:
            del self.pending_duels[challenger_id]

class DuelView(discord.ui.View):
    """View with Accept/Decline buttons for duel"""
    
    def __init__(self, cog, challenger_id: str, opponent_id: str, original_interaction):
        super().__init__(timeout=60)
        self.cog = cog
        self.challenger_id = challenger_id
        self.opponent_id = opponent_id
        self.original_interaction = original_interaction
    
    @discord.ui.button(label="Accept", style=discord.ButtonStyle.success, emoji="⚔️")
    async def accept(self, interaction: discord.Interaction, button: discord.ui.Button):
        # Check if the person clicking is the opponent
        if str(interaction.user.id) != self.opponent_id:
            await interaction.response.send_message(
                "This duel challenge isn't for you!", 
                ephemeral=True
            )
            return
        
        await interaction.response.send_message("⚔️ Duel accepted! Combat starting...", ephemeral=True)
        
        # Disable buttons
        for item in self.children:
            item.disabled = True
        await self.original_interaction.edit_original_response(view=self)
        
        # Execute duel
        await self.cog.execute_duel(self.challenger_id, self.opponent_id, self.original_interaction)
    
    @discord.ui.button(label="Decline", style=discord.ButtonStyle.danger, emoji="❌")
    async def decline(self, interaction: discord.Interaction, button: discord.ui.Button):
        # Check if the person clicking is the opponent
        if str(interaction.user.id) != self.opponent_id:
            await interaction.response.send_message(
                "This duel challenge isn't for you!", 
                ephemeral=True
            )
            return
        
        await interaction.response.send_message("You declined the duel.", ephemeral=True)
        
        # Disable buttons
        for item in self.children:
            item.disabled = True
        await self.original_interaction.edit_original_response(view=self)
        
        # Send decline message
        embed = create_error_embed(
            "Duel Declined",
            f"{interaction.user.mention} declined the challenge!"
        )
        await self.original_interaction.followup.send(embed=embed)
        
        # Clean up
        if self.challenger_id in self.cog.pending_duels:
            del self.cog.pending_duels[self.challenger_id]

async def setup(bot):
    await bot.add_cog(Duel(bot))
