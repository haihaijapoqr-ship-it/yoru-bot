import discord
from datetime import datetime

COLORS = {
    'purple': 0x9D4EDD,
    'cyan': 0x00F5FF,
    'pink': 0xFF006E,
    'green': 0x00FF9F,
    'red': 0xFF006E,
    'yellow': 0xFFD60A
}

def create_embed(title: str, description: str = "", color: str = 'purple') -> discord.Embed:
    embed = discord.Embed(
        title=title,
        description=description,
        color=COLORS.get(color, COLORS['purple']),
        timestamp=datetime.utcnow()
    )
    embed.set_footer(text="Yoru System v1.0 — Stay luminous 🌙")
    return embed

def create_error_embed(title: str, description: str = "") -> discord.Embed:
    embed = discord.Embed(
        title=f"❌ {title}",
        description=description,
        color=COLORS['red'],
        timestamp=datetime.utcnow()
    )
    embed.set_footer(text="Yoru System v1.0 — Stay luminous 🌙")
    return embed

def create_game_embed(title: str, description: str = "") -> discord.Embed:
    embed = discord.Embed(
        title=title,
        description=description,
        color=COLORS['purple'],
        timestamp=datetime.utcnow()
    )
    embed.set_footer(text="Yoru System v1.0 — Stay luminous 🌙")
    return embed

def create_success_embed(message: str) -> discord.Embed:
    embed = discord.Embed(
        title="✅ Success",
        description=message,
        color=COLORS['green'],
        timestamp=datetime.utcnow()
    )
    embed.set_footer(text="Yoru System v1.0 — Stay luminous 🌙")
    return embed

def create_info_embed(title: str, description: str) -> discord.Embed:
    embed = discord.Embed(
        title=title,
        description=description,
        color=COLORS['cyan'],
        timestamp=datetime.utcnow()
    )
    embed.set_footer(text="Yoru System v1.0 — Stay luminous 🌙")
    return embed
