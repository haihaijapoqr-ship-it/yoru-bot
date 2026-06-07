import discord
from discord import app_commands
from discord.ext import commands
from utils.embeds import create_embed, create_info_embed

class Core(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="ping", description="Check the bot's latency")
    async def ping(self, interaction: discord.Interaction):
        latency = round(self.bot.latency * 1000)
        embed = create_info_embed(
            "🏓 Pong!",
            f"Latency: **{latency}ms**"
        )
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="help", description="View all available commands")
    async def help(self, interaction: discord.Interaction):
        embed = create_embed(
            "🌙 Yoru Bot - Command List",
            "Here are all available commands!",
            color='purple'
        )
        
        embed.add_field(
            name="💞 Anime Actions",
            value="`/kiss` `/hug` `/cuddle` `/pat` `/handhold`\n`/poke` `/bonk` `/bite` `/lick` `/yeet`\n`/blush` `/smile` `/wink` `/wave` `/cry` `/happy`\n`/slap` `/kick` `/highfive` `/nom` `/dance`",
            inline=False
        )
        
        embed.add_field(
            name="🎮 Hackverse Game",
            value="`/hack` `/scan` `/work` `/daily`\n`/profile` `/stats` `/leaderboard`",
            inline=False
        )
        
        embed.add_field(
            name="⚔️ Weapons & Combat",
            value="`/shop` `/buy` `/inventory` `/equip` `/sell` `/forge`\n`/duel`",
            inline=False
        )
        
        embed.add_field(
            name="ℹ️ Utility",
            value="`/ping` `/help` `/serverinfo` `/userinfo` `/avatar`",
            inline=False
        )
        
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="serverinfo", description="View server information")
    async def serverinfo(self, interaction: discord.Interaction):
        guild = interaction.guild
        
        embed = create_embed(
            f"📊 {guild.name}",
            f"Server information and statistics",
            color='cyan'
        )
        
        embed.set_thumbnail(url=guild.icon.url if guild.icon else None)
        embed.add_field(name="👑 Owner", value=guild.owner.mention if guild.owner else "Unknown", inline=True)
        embed.add_field(name="👥 Members", value=str(guild.member_count), inline=True)
        embed.add_field(name="📅 Created", value=guild.created_at.strftime("%Y-%m-%d"), inline=True)
        
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="userinfo", description="View user information")
    async def userinfo(self, interaction: discord.Interaction, user: discord.Member = None):
        user = user or interaction.user
        
        embed = create_embed(
            f"👤 {user.name}",
            f"User information",
            color='cyan'
        )
        
        embed.set_thumbnail(url=user.display_avatar.url)
        embed.add_field(name="ID", value=str(user.id), inline=True)
        embed.add_field(name="Joined Server", value=user.joined_at.strftime("%Y-%m-%d") if user.joined_at else "Unknown", inline=True)
        embed.add_field(name="Account Created", value=user.created_at.strftime("%Y-%m-%d"), inline=True)
        
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="avatar", description="View a user's avatar")
    async def avatar(self, interaction: discord.Interaction, user: discord.Member = None):
        user = user or interaction.user
        
        embed = create_embed(
            f"🖼️ {user.name}'s Avatar",
            "",
            color='cyan'
        )
        embed.set_image(url=user.display_avatar.url)
        
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Core(bot))
