import discord
from discord import app_commands
from discord.ext import commands
import random
from utils.embeds import create_embed

class Fun(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="8ball", description="Ask the magic 8-ball a question")
    async def eightball(self, interaction: discord.Interaction, question: str):
        responses = [
            "Yes, definitely!", "It is certain.", "Without a doubt!",
            "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
            "Don't count on it.", "My reply is no.", "Very doubtful."
        ]
        
        answer = random.choice(responses)
        embed = create_embed(
            "🎱 Magic 8-Ball",
            f"**Question:** {question}\n**Answer:** {answer}",
            color='purple'
        )
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="coinflip", description="Flip a coin")
    async def coinflip(self, interaction: discord.Interaction):
        result = random.choice(["Heads", "Tails"])
        embed = create_embed(
            "🪙 Coin Flip",
            f"The coin landed on: **{result}**!",
            color='yellow'
        )
        await interaction.response.send_message(embed=embed)
    
    @app_commands.command(name="roll", description="Roll a dice")
    async def roll(self, interaction: discord.Interaction, sides: int = 6):
        if sides < 2:
            sides = 6
        
        result = random.randint(1, sides)
        embed = create_embed(
            "🎲 Dice Roll",
            f"You rolled a **{result}** (1-{sides})",
            color='cyan'
        )
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Fun(bot))
