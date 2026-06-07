import discord
from discord import app_commands
from discord.ext import commands
from utils.embeds import create_success_embed, create_error_embed

class Config(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="setprefix", description="Set the bot prefix (admin only)")
    @app_commands.checks.has_permissions(administrator=True)
    async def setprefix(self, interaction: discord.Interaction, prefix: str):
        embed = create_success_embed(f"Prefix set to `{prefix}` (Note: Slash commands are preferred!)")
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="setmodrole", description="Set moderator role (admin only)")
    @app_commands.checks.has_permissions(administrator=True)
    async def setmodrole(self, interaction: discord.Interaction, role: discord.Role):
        embed = create_success_embed(f"Moderator role set to {role.mention}")
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Config(bot))
