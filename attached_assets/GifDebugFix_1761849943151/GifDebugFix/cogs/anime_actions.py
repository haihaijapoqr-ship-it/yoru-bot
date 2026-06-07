import discord
from discord import app_commands
from discord.ext import commands
import random
from utils.api_client import anime_api
from utils.embeds import create_embed, create_error_embed
from utils.cache import cooldown_manager

class AnimeActions(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.cooldown_seconds = 5
    
    async def _execute_action(self, interaction: discord.Interaction, action: str, target: discord.Member = None):
        on_cooldown, remaining = cooldown_manager.is_on_cooldown(
            f'anime_{action}',
            interaction.user.id,
            self.cooldown_seconds
        )
        
        if on_cooldown:
            embed = create_error_embed(f"⏰ Slow down! Try again in {remaining:.1f} seconds.")
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
        
        await interaction.response.defer()
        
        gif_url = await anime_api.get_anime_gif(action)
        
        if not gif_url:
            embed = create_error_embed(f"Failed to fetch {action} GIF. Please try again!")
            await interaction.followup.send(embed=embed, ephemeral=True)
            return
        
        xp_gained = random.randint(1, 3)
        await self.bot.db.update_player_xp(interaction.user.id, emotion_xp=xp_gained)
        
        if target:
            description = f"**{interaction.user.mention}** {action}s **{target.mention}**! 💞\n+{xp_gained} Emotion XP"
        else:
            description = f"**{interaction.user.mention}** {action}s! ✨\n+{xp_gained} Emotion XP"
        
        embed = create_embed(
            title=f"💞 {action.capitalize()}!",
            description=description,
            color='pink'
        )
        embed.set_image(url=gif_url)
        
        await interaction.followup.send(embed=embed)
        cooldown_manager.set_cooldown(f'anime_{action}', interaction.user.id)
    
    @app_commands.command(name="kiss", description="Kiss someone with a cute anime GIF!")
    async def kiss(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'kiss', target)
    
    @app_commands.command(name="hug", description="Hug someone with a cute anime GIF!")
    async def hug(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'hug', target)
    
    @app_commands.command(name="cuddle", description="Cuddle someone with a cute anime GIF!")
    async def cuddle(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'cuddle', target)
    
    @app_commands.command(name="pat", description="Pat someone's head with a cute anime GIF!")
    async def pat(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'pat', target)
    
    @app_commands.command(name="handhold", description="Hold hands with someone!")
    async def handhold(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'handhold', target)
    
    @app_commands.command(name="poke", description="Poke someone with a cute anime GIF!")
    async def poke(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'poke', target)
    
    @app_commands.command(name="bonk", description="Bonk someone with a cute anime GIF!")
    async def bonk(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'bonk', target)
    
    @app_commands.command(name="bite", description="Bite someone with a cute anime GIF!")
    async def bite(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'bite', target)
    
    @app_commands.command(name="lick", description="Lick someone with a cute anime GIF!")
    async def lick(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'lick', target)
    
    @app_commands.command(name="yeet", description="Yeet someone with a cute anime GIF!")
    async def yeet(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'yeet', target)
    
    @app_commands.command(name="blush", description="Blush with a cute anime GIF!")
    async def blush(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'blush')
    
    @app_commands.command(name="smile", description="Smile with a cute anime GIF!")
    async def smile(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'smile')
    
    @app_commands.command(name="wink", description="Wink with a cute anime GIF!")
    async def wink(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'wink')
    
    @app_commands.command(name="wave", description="Wave with a cute anime GIF!")
    async def wave(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'wave')
    
    @app_commands.command(name="cry", description="Cry with a cute anime GIF!")
    async def cry(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'cry')
    
    @app_commands.command(name="happy", description="Show happiness with a cute anime GIF!")
    async def happy(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'happy')
    
    @app_commands.command(name="slap", description="Slap someone with a cute anime GIF!")
    async def slap(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'slap', target)
    
    @app_commands.command(name="akick", description="Playfully kick someone with a cute anime GIF!")
    async def kick_action(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'kick', target)
    
    @app_commands.command(name="highfive", description="High five someone with a cute anime GIF!")
    async def highfive(self, interaction: discord.Interaction, target: discord.Member):
        await self._execute_action(interaction, 'highfive', target)
    
    @app_commands.command(name="nom", description="Nom with a cute anime GIF!")
    async def nom(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'nom')
    
    @app_commands.command(name="dance", description="Dance with a cute anime GIF!")
    async def dance(self, interaction: discord.Interaction):
        await self._execute_action(interaction, 'dance')

async def setup(bot):
    await bot.add_cog(AnimeActions(bot))
