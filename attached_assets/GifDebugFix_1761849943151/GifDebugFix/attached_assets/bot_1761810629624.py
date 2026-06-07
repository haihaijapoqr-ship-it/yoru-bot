import discord
from discord.ext import commands
import asyncio
from database.models import Database
from utils.security import get_token, sanitize_error_message, check_permissions
from utils.api_client import anime_api

class YoruBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        intents.guilds = True
        intents.reactions = True
        
        super().__init__(
            command_prefix="!",
            intents=intents,
            help_command=None
        )
        
        self.db = Database()
    
    async def setup_hook(self):
        print("\n" + "="*60)
        print("🚀 Starting Yoru Bot...")
        print("="*60 + "\n")
        
        await self.db.connect()
        print("✅ Database connected successfully!")
        
        cogs_to_load = [
            'cogs.core',
            'cogs.config',
            'cogs.logs',
            'cogs.moderation',
            'cogs.tickets',
            'cogs.economy',
            'cogs.leveling',
            'cogs.reaction_roles',
            'cogs.fun',
            'cogs.anime_actions',
            'cogs.hackverse',
            'cogs.weapons',
            'cogs.duel',
            'cogs.profile'
        ]
        
        print("\n📦 Loading cogs...")
        for cog in cogs_to_load:
            try:
                await self.load_extension(cog)
                print(f"  ✅ {cog}")
            except Exception as e:
                error_msg = sanitize_error_message(str(e))
                print(f"  ❌ {cog}: {error_msg}")
        
        print("\n🔄 Syncing command tree...")
        await self.tree.sync()
        print("✅ Command tree synced!")
    
    async def on_ready(self):
        print("\n" + "="*60)
        print(f"✨ Yoru is now online!")
        print(f"👤 Logged in as: {self.user}")
        print(f"🆔 Bot ID: {self.user.id}")
        print(f"🌐 Connected to {len(self.guilds)} server(s)")
        print("="*60 + "\n")
        
        for guild in self.guilds:
            perms = check_permissions(self.user, guild)
            if perms['missing_permissions']:
                print(f"⚠️  Missing permissions in {guild.name}:")
                for perm in perms['missing_permissions']:
                    print(f"   - {perm}")
        
        await self.change_presence(
            activity=discord.Activity(
                type=discord.ActivityType.watching,
                name="the Hackverse | /help"
            ),
            status=discord.Status.online
        )
    
    async def on_guild_join(self, guild: discord.Guild):
        await self.db.create_guild_config(guild.id)
        print(f"✅ Joined new server: {guild.name} (ID: {guild.id})")
        
        perms = check_permissions(self.user, guild)
        if perms['missing_permissions']:
            print(f"⚠️  Missing permissions in {guild.name}: {', '.join(perms['missing_permissions'])}")
    
    async def on_error(self, event_method: str, *args, **kwargs):
        import traceback
        error = traceback.format_exc()
        sanitized_error = sanitize_error_message(error)
        print(f"\n❌ Error in {event_method}:\n{sanitized_error}")
    
    async def close(self):
        print("\n🛑 Shutting down Yoru...")
        await anime_api.close()
        await self.db.close()
        await super().close()
        print("👋 Yoru has been shut down successfully.\n")


async def main():
    print("\n" + "="*60)
    print("🎭 YORU - Anime Game Discord Bot")
    print("🌙 The Hackverse Awaits...")
    print("="*60)
    
    token = get_token()
    
    if not token:
        print("\n⚠️  Bot cannot start without a valid token.")
        print("Please add your DISCORD_TOKEN to Replit Secrets.\n")
        return
    
    print("✅ Token validated successfully!")
    
    bot = YoruBot()
    
    try:
        await bot.start(token)
    except discord.LoginFailure:
        print("\n" + "="*60)
        print("❌ LOGIN FAILED!")
        print("="*60)
        print("Your Discord token is invalid or has been revoked.")
        print("Please regenerate your token and update Replit Secrets.")
        print("="*60 + "\n")
    except KeyboardInterrupt:
        await bot.close()
    except Exception as e:
        sanitized_error = sanitize_error_message(str(e))
        print(f"\n❌ Unexpected error: {sanitized_error}\n")
        await bot.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Bot stopped by user.\n")
