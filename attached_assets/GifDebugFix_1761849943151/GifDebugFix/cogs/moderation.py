import discord
from discord import app_commands
from discord.ext import commands
from utils.embeds import create_success_embed, create_error_embed

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="kick", description="Kick a user from the server")
    @app_commands.checks.has_permissions(kick_members=True)
    async def kick(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        try:
            await member.kick(reason=reason)
            embed = create_success_embed(f"Kicked {member.mention} for: {reason}")
            await interaction.response.send_message(embed=embed)
        except Exception as e:
            embed = create_error_embed(f"Failed to kick {member.mention}: {str(e)}")
            await interaction.response.send_message(embed=embed, ephemeral=True)
    
    @app_commands.command(name="ban", description="Ban a user from the server")
    @app_commands.checks.has_permissions(ban_members=True)
    async def ban(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        try:
            await member.ban(reason=reason)
            embed = create_success_embed(f"Banned {member.mention} for: {reason}")
            await interaction.response.send_message(embed=embed)
        except Exception as e:
            embed = create_error_embed(f"Failed to ban {member.mention}: {str(e)}")
            await interaction.response.send_message(embed=embed, ephemeral=True)
    
    @app_commands.command(name="warn", description="Warn a user")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def warn(self, interaction: discord.Interaction, member: discord.Member, reason: str):
        await self.bot.db.conn.execute(
            'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
            (interaction.guild.id, member.id, interaction.user.id, reason)
        )
        await self.bot.db.conn.commit()
        
        embed = create_success_embed(f"Warned {member.mention} for: {reason}")
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="clear", description="Clear messages")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def clear(self, interaction: discord.Interaction, amount: int):
        if amount < 1 or amount > 100:
            embed = create_error_embed("Amount must be between 1 and 100")
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        await interaction.response.defer(ephemeral=True)
        deleted = await interaction.channel.purge(limit=amount)
        embed = create_success_embed(f"Deleted {len(deleted)} messages")
        await interaction.followup.send(embed=embed, ephemeral=True)

async def setup(bot):
    await bot.add_cog(Moderation(bot))
