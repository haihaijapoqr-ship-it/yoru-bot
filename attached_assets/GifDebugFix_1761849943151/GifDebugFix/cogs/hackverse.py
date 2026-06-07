import discord
from discord import app_commands
from discord.ext import commands
import random
from datetime import datetime, timedelta
from utils.embeds import create_game_embed, create_error_embed
from utils.cache import cooldown_manager
from database.models import Database
from utils.checks import calculate_xp_for_level

class Hackverse(commands.Cog):
    """The Hackverse - Core hacking and economy game loop"""
    
    def __init__(self, bot):
        self.bot = bot
        self.db = bot.db
    
    @app_commands.command(name="hack", description="🎮 Hack a node to earn credits, fragments, and XP")
    async def hack(self, interaction: discord.Interaction):
        """Hack nodes for rewards - costs 1 energy, 15s cooldown"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Check cooldown
        if cooldown_manager.is_on_cooldown(user_id, "hack"):
            remaining = cooldown_manager.get_remaining_time(user_id, "hack")
            embed = create_error_embed(
                "Cooldown Active",
                f"⏰ You must wait **{remaining}s** before hacking again."
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Get player stats
        stats = await self.db.get_game_stats(user_id)
        
        # Check energy
        if stats['energy'] < 1:
            embed = create_error_embed(
                "No Energy",
                "⚡ You're out of energy! Energy regenerates 1 per 10 minutes (max 10)."
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Consume energy
        await self.db.update_game_stats(user_id, energy=stats['energy'] - 1)
        
        # Generate rewards
        credits_earned = random.randint(150, 400)
        fragments_earned = random.randint(0, 2)
        xp_earned = random.randint(20, 50)
        
        # Update stats
        new_credits = stats['credits'] + credits_earned
        new_fragments = stats['fragments'] + fragments_earned
        new_game_xp = stats['game_xp'] + xp_earned
        new_hacks = stats['total_hacks'] + 1
        
        await self.db.update_game_stats(
            user_id,
            credits=new_credits,
            fragments=new_fragments,
            game_xp=new_game_xp,
            total_hacks=new_hacks
        )
        
        # Check for level up
        current_level = stats['game_level']
        new_level = 1
        while calculate_xp_for_level(new_level + 1) <= new_game_xp:
            new_level += 1
        
        level_up_msg = ""
        if new_level > current_level:
            await self.db.update_game_stats(user_id, game_level=new_level)
            level_up_msg = f"\n\n🎉 **LEVEL UP!** You are now level {new_level}!"
        
        # Set cooldown
        cooldown_manager.set_cooldown(user_id, "hack", 15)
        
        # Random hack targets
        targets = ["Corporate Server", "Data Vault", "Security Node", "Financial Hub", 
                   "Crypto Wallet", "Black ICE", "Neural Network", "Quantum System"]
        target = random.choice(targets)
        
        embed = create_game_embed(
            "Hack Successful",
            f"🎯 **Target:** {target}\n"
            f"```\n"
            f"BREACH SUCCESSFUL\n"
            f">> Extracting data...\n"
            f">> Transfer complete\n"
            f"```\n\n"
            f"**Rewards:**\n"
            f"₿ Credits: **+{credits_earned}** (Total: {new_credits})\n"
            f"💠 Fragments: **+{fragments_earned}** (Total: {new_fragments})\n"
            f"⭐ XP: **+{xp_earned}** (Total: {new_game_xp})\n"
            f"⚡ Energy: **{stats['energy'] - 1}/10**"
            f"{level_up_msg}"
        )
        embed.set_footer(text=f"Total Hacks: {new_hacks} | Cooldown: 15s")
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="scan", description="🔍 Scan the network for random rewards")
    async def scan(self, interaction: discord.Interaction):
        """Scan for rewards - unlocks at level 5, 20s cooldown"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Get stats
        stats = await self.db.get_game_stats(user_id)
        
        # Check level requirement
        if stats['game_level'] < 5:
            embed = create_error_embed(
                "Level Too Low",
                f"🔒 You must be level **5** to use scan (Current: {stats['game_level']})"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Check cooldown
        if cooldown_manager.is_on_cooldown(user_id, "scan"):
            remaining = cooldown_manager.get_remaining_time(user_id, "scan")
            embed = create_error_embed(
                "Cooldown Active",
                f"⏰ You must wait **{remaining}s** before scanning again."
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Generate rewards (better than work, but random)
        reward_type = random.choice(["credits", "fragments", "both", "jackpot"])
        
        if reward_type == "credits":
            credits = random.randint(200, 500)
            fragments = 0
            xp = random.randint(15, 30)
            msg = f"₿ **+{credits} Credits**"
        elif reward_type == "fragments":
            credits = 0
            fragments = random.randint(3, 6)
            xp = random.randint(20, 40)
            msg = f"💠 **+{fragments} Fragments**"
        elif reward_type == "both":
            credits = random.randint(150, 300)
            fragments = random.randint(1, 3)
            xp = random.randint(25, 45)
            msg = f"₿ **+{credits} Credits** | 💠 **+{fragments} Fragments**"
        else:  # jackpot
            credits = random.randint(600, 1000)
            fragments = random.randint(5, 10)
            xp = random.randint(50, 80)
            msg = f"🎰 **JACKPOT!** ₿ **+{credits} Credits** | 💠 **+{fragments} Fragments**"
        
        # Update stats
        await self.db.update_game_stats(
            user_id,
            credits=stats['credits'] + credits,
            fragments=stats['fragments'] + fragments,
            game_xp=stats['game_xp'] + xp
        )
        
        # Set cooldown
        cooldown_manager.set_cooldown(user_id, "scan", 20)
        
        findings = ["encrypted database", "hidden cache", "abandoned wallet", 
                    "data leak", "secret vault", "backup server"]
        finding = random.choice(findings)
        
        embed = create_game_embed(
            "Network Scan Complete",
            f"🔍 **Found:** {finding}\n"
            f"```\n"
            f"SCAN RESULTS\n"
            f">> Analyzing signals...\n"
            f">> Data recovered\n"
            f"```\n\n"
            f"**Rewards:**\n{msg}\n⭐ XP: **+{xp}**"
        )
        embed.set_footer(text=f"Cooldown: 20s | Unlocked at Level 5")
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="work", description="💼 Complete a job to earn credits and XP")
    async def work(self, interaction: discord.Interaction):
        """Work for credits and XP - 30s cooldown"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Check cooldown
        if cooldown_manager.is_on_cooldown(user_id, "work"):
            remaining = cooldown_manager.get_remaining_time(user_id, "work")
            embed = create_error_embed(
                "Cooldown Active",
                f"⏰ You must wait **{remaining}s** before working again."
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Get stats
        stats = await self.db.get_game_stats(user_id)
        
        # Generate rewards
        credits_earned = random.randint(80, 180)
        xp_earned = random.randint(10, 25)
        
        # Update stats
        await self.db.update_game_stats(
            user_id,
            credits=stats['credits'] + credits_earned,
            game_xp=stats['game_xp'] + xp_earned
        )
        
        # Set cooldown
        cooldown_manager.set_cooldown(user_id, "work", 30)
        
        jobs = [
            ("Code Runner", "Delivered encrypted packages"),
            ("Data Miner", "Extracted valuable information"),
            ("Network Guard", "Monitored security systems"),
            ("Script Debugger", "Fixed critical vulnerabilities"),
            ("Digital Artist", "Created holographic designs"),
            ("Tech Support", "Helped clueless users")
        ]
        job_name, job_desc = random.choice(jobs)
        
        embed = create_game_embed(
            f"Work Complete: {job_name}",
            f"💼 {job_desc}\n\n"
            f"**Payment:**\n"
            f"₿ Credits: **+{credits_earned}** (Total: {stats['credits'] + credits_earned})\n"
            f"⭐ XP: **+{xp_earned}**"
        )
        embed.set_footer(text="Cooldown: 30s | Honest work never fails")
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="daily", description="🎁 Claim your daily rewards with streak bonuses")
    async def daily(self, interaction: discord.Interaction):
        """Claim daily rewards - 24 hour cooldown with streak system"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Get stats
        stats = await self.db.get_game_stats(user_id)
        
        # Check if daily is available
        if stats['last_daily']:
            try:
                last_daily = datetime.fromisoformat(stats['last_daily'])
                now = datetime.now()
                time_diff = now - last_daily
                
                if time_diff < timedelta(hours=24):
                    remaining = timedelta(hours=24) - time_diff
                    hours = int(remaining.total_seconds() // 3600)
                    minutes = int((remaining.total_seconds() % 3600) // 60)
                    
                    embed = create_error_embed(
                        "Daily Already Claimed",
                        f"⏰ Come back in **{hours}h {minutes}m** to claim again!"
                    )
                    await interaction.followup.send(embed=embed)
                    return
                
                # Check if streak continues (claimed within 48 hours)
                if time_diff < timedelta(hours=48):
                    new_streak = stats['daily_streak'] + 1
                else:
                    new_streak = 1  # Streak broken
            except:
                new_streak = 1
        else:
            new_streak = 1
        
        # Calculate rewards (increase with streak)
        base_credits = 500
        base_fragments = 2
        base_xp = 50
        
        streak_multiplier = min(1 + (new_streak - 1) * 0.1, 2.0)  # Max 2x at 11 day streak
        
        credits_earned = int(base_credits * streak_multiplier)
        fragments_earned = int(base_fragments * streak_multiplier)
        xp_earned = int(base_xp * streak_multiplier)
        
        # Bonus energy on daily
        energy_bonus = min(stats['energy'] + 5, 10)
        
        # Update stats
        await self.db.update_game_stats(
            user_id,
            credits=stats['credits'] + credits_earned,
            fragments=stats['fragments'] + fragments_earned,
            game_xp=stats['game_xp'] + xp_earned,
            energy=energy_bonus,
            daily_streak=new_streak,
            last_daily=datetime.now().isoformat()
        )
        
        embed = create_game_embed(
            "Daily Rewards Claimed!",
            f"🎁 **Streak: {new_streak} day(s)** (Multiplier: {streak_multiplier:.1f}x)\n\n"
            f"**Rewards:**\n"
            f"₿ Credits: **+{credits_earned}** (Total: {stats['credits'] + credits_earned})\n"
            f"💠 Fragments: **+{fragments_earned}** (Total: {stats['fragments'] + fragments_earned})\n"
            f"⭐ XP: **+{xp_earned}**\n"
            f"⚡ Energy: **Restored to {energy_bonus}/10**\n\n"
            f"Come back tomorrow to continue your streak!"
        )
        embed.set_footer(text="Cooldown: 24 hours | Streak breaks after 48h")
        
        await interaction.followup.send(embed=embed)

async def setup(bot):
    await bot.add_cog(Hackverse(bot))
