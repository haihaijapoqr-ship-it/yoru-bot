import discord
from discord import app_commands
from discord.ext import commands
import random
from utils.embeds import create_game_embed, create_error_embed
from database.models import Database

class Weapons(commands.Cog):
    """Weapon shop, inventory, and equipment management"""
    
    def __init__(self, bot):
        self.bot = bot
        self.db = bot.db
    
    @app_commands.command(name="shop", description="🛒 View the weapon shop")
    async def shop(self, interaction: discord.Interaction):
        """Display all available weapons"""
        await interaction.response.defer()
        
        weapons = await self.db.get_all_weapons()
        
        if not weapons:
            embed = create_error_embed("Shop Empty", "No weapons available!")
            await interaction.followup.send(embed=embed)
            return
        
        # Group by rarity
        rarity_order = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
        grouped = {r: [] for r in rarity_order}
        
        for weapon in weapons:
            if weapon['rarity'] in grouped:
                grouped[weapon['rarity']].append(weapon)
        
        shop_text = ""
        for rarity in rarity_order:
            if grouped[rarity]:
                rarity_emoji = {
                    "Common": "⚪", "Uncommon": "🟢", "Rare": "🔵",
                    "Epic": "🟣", "Legendary": "🟠", "Mythic": "🔴"
                }
                shop_text += f"\n**{rarity_emoji[rarity]} {rarity}**\n"
                for w in grouped[rarity]:
                    shop_text += f"`{w['weapon_id']}` **{w['name']}** - ⚔️ {w['attack']} ATK | ₿ {w['price']}\n"
        
        embed = create_game_embed(
            "⚔️ Weapon Shop",
            f"Welcome to the Arsenal! Use `/buy <weapon_id>` to purchase.\n{shop_text}"
        )
        embed.set_footer(text="Forge higher rarity weapons with /forge")
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="buy", description="💰 Buy a weapon from the shop")
    @app_commands.describe(weapon_id="The ID of the weapon to buy")
    async def buy(self, interaction: discord.Interaction, weapon_id: str):
        """Purchase a weapon"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Get weapon info
        weapon = await self.db.get_weapon(weapon_id)
        if not weapon:
            embed = create_error_embed("Invalid Weapon", f"Weapon `{weapon_id}` not found!")
            await interaction.followup.send(embed=embed)
            return
        
        # Check if already owned
        inventory = await self.db.get_inventory(user_id)
        if any(item['weapon_id'] == weapon_id for item in inventory):
            embed = create_error_embed("Already Owned", f"You already own **{weapon['name']}**!")
            await interaction.followup.send(embed=embed)
            return
        
        # Check credits
        stats = await self.db.get_game_stats(user_id)
        if stats['credits'] < weapon['price']:
            embed = create_error_embed(
                "Insufficient Credits",
                f"You need **₿{weapon['price']}** but only have **₿{stats['credits']}**"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Purchase weapon
        await self.db.add_to_inventory(user_id, weapon_id)
        await self.db.update_game_stats(user_id, credits=stats['credits'] - weapon['price'])
        
        rarity_emoji = {
            "Common": "⚪", "Uncommon": "🟢", "Rare": "🔵",
            "Epic": "🟣", "Legendary": "🟠", "Mythic": "🔴"
        }
        
        embed = create_game_embed(
            "Purchase Successful!",
            f"{rarity_emoji.get(weapon['rarity'], '⚔️')} **{weapon['name']}** acquired!\n\n"
            f"⚔️ Attack: **{weapon['attack']}**\n"
            f"💫 Rarity: **{weapon['rarity']}**\n"
            f"₿ Paid: **{weapon['price']}** (Balance: {stats['credits'] - weapon['price']})\n\n"
            f"Use `/equip {weapon_id}` to equip it!"
        )
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="inventory", description="🎒 View your weapon collection")
    async def inventory(self, interaction: discord.Interaction):
        """Display player's weapon inventory"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        inventory = await self.db.get_inventory(user_id)
        stats = await self.db.get_game_stats(user_id)
        
        if not inventory:
            embed = create_error_embed(
                "Empty Inventory",
                "You don't own any weapons yet! Check `/shop` to buy some."
            )
            await interaction.followup.send(embed=embed)
            return
        
        inventory_text = ""
        for item in inventory:
            weapon = await self.db.get_weapon(item['weapon_id'])
            if weapon:
                equipped_mark = "✅ " if item['weapon_id'] == stats.get('equipped_weapon') else ""
                inventory_text += f"{equipped_mark}`{weapon['weapon_id']}` **{weapon['name']}** - ⚔️ {weapon['attack']} ATK ({weapon['rarity']})\n"
        
        embed = create_game_embed(
            "🎒 Your Arsenal",
            f"{inventory_text}\n"
            f"**Total Weapons:** {len(inventory)}\n\n"
            f"Use `/equip <weapon_id>` to equip a weapon"
        )
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="equip", description="⚔️ Equip a weapon from your inventory")
    @app_commands.describe(weapon_id="The ID of the weapon to equip")
    async def equip(self, interaction: discord.Interaction, weapon_id: str):
        """Equip a weapon for duels"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Check ownership
        inventory = await self.db.get_inventory(user_id)
        if not any(item['weapon_id'] == weapon_id for item in inventory):
            embed = create_error_embed(
                "Not Owned",
                f"You don't own weapon `{weapon_id}`! Check `/inventory`"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Get weapon info
        weapon = await self.db.get_weapon(weapon_id)
        
        # Equip weapon
        await self.db.update_game_stats(user_id, equipped_weapon=weapon_id)
        
        embed = create_game_embed(
            "Weapon Equipped!",
            f"⚔️ **{weapon['name']}** is now equipped!\n"
            f"Attack Power: **{weapon['attack']}**\n"
            f"Rarity: **{weapon['rarity']}**\n\n"
            f"Your attack damage in duels has been updated!"
        )
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="sell", description="💸 Sell a weapon for 50% of its value")
    @app_commands.describe(weapon_id="The ID of the weapon to sell")
    async def sell(self, interaction: discord.Interaction, weapon_id: str):
        """Sell weapons for credits (50% refund)"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Check ownership
        inventory = await self.db.get_inventory(user_id)
        if not any(item['weapon_id'] == weapon_id for item in inventory):
            embed = create_error_embed(
                "Not Owned",
                f"You don't own weapon `{weapon_id}`!"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Get weapon info
        weapon = await self.db.get_weapon(weapon_id)
        sell_price = weapon['price'] // 2
        
        # Remove from inventory
        await self.db.remove_from_inventory(user_id, weapon_id)
        
        # Add credits
        stats = await self.db.get_game_stats(user_id)
        await self.db.update_game_stats(user_id, credits=stats['credits'] + sell_price)
        
        # Unequip if equipped
        if stats.get('equipped_weapon') == weapon_id:
            await self.db.update_game_stats(user_id, equipped_weapon=None)
        
        embed = create_game_embed(
            "Weapon Sold",
            f"💸 **{weapon['name']}** sold for ₿ **{sell_price}**\n"
            f"New balance: ₿ **{stats['credits'] + sell_price}**"
        )
        
        await interaction.followup.send(embed=embed)
    
    @app_commands.command(name="forge", description="🔨 Forge a higher rarity weapon using fragments")
    @app_commands.describe(
        weapon1="First weapon ID to sacrifice",
        weapon2="Second weapon ID to sacrifice"
    )
    async def forge(self, interaction: discord.Interaction, weapon1: str, weapon2: str):
        """Combine two weapons + fragments to create higher rarity weapon"""
        await interaction.response.defer()
        
        user_id = str(interaction.user.id)
        
        # Check ownership of both weapons
        inventory = await self.db.get_inventory(user_id)
        owned_ids = [item['weapon_id'] for item in inventory]
        
        if weapon1 not in owned_ids or weapon2 not in owned_ids:
            embed = create_error_embed(
                "Missing Weapons",
                "You must own both weapons to forge them!"
            )
            await interaction.followup.send(embed=embed)
            return
        
        if weapon1 == weapon2:
            embed = create_error_embed(
                "Invalid Combination",
                "You can't forge the same weapon with itself!"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Get weapon data
        w1 = await self.db.get_weapon(weapon1)
        w2 = await self.db.get_weapon(weapon2)
        
        # Check fragments requirement
        stats = await self.db.get_game_stats(user_id)
        required_fragments = 10
        
        if stats['fragments'] < required_fragments:
            embed = create_error_embed(
                "Insufficient Fragments",
                f"You need **{required_fragments}** 💠 Fragments (You have: {stats['fragments']})"
            )
            await interaction.followup.send(embed=embed)
            return
        
        # Forge success (70% chance)
        success = random.random() < 0.7
        
        # Consume materials
        await self.db.remove_from_inventory(user_id, weapon1)
        await self.db.remove_from_inventory(user_id, weapon2)
        await self.db.update_game_stats(user_id, fragments=stats['fragments'] - required_fragments)
        
        # Unequip if equipped
        if stats.get('equipped_weapon') in [weapon1, weapon2]:
            await self.db.update_game_stats(user_id, equipped_weapon=None)
        
        if success:
            # Determine result rarity (higher than inputs)
            rarity_tiers = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
            max_input_tier = max(
                rarity_tiers.index(w1['rarity']),
                rarity_tiers.index(w2['rarity'])
            )
            
            result_tier = min(max_input_tier + 1, len(rarity_tiers) - 1)
            result_rarity = rarity_tiers[result_tier]
            
            # Get random weapon of that rarity
            all_weapons = await self.db.get_all_weapons()
            candidates = [w for w in all_weapons if w['rarity'] == result_rarity]
            
            if candidates:
                result_weapon = random.choice(candidates)
                await self.db.add_to_inventory(user_id, result_weapon['weapon_id'])
                
                rarity_emoji = {
                    "Common": "⚪", "Uncommon": "🟢", "Rare": "🔵",
                    "Epic": "🟣", "Legendary": "🟠", "Mythic": "🔴"
                }
                
                embed = create_game_embed(
                    "🔨 Forge Successful!",
                    f"✨ You created {rarity_emoji.get(result_rarity, '⚔️')} **{result_weapon['name']}**!\n\n"
                    f"⚔️ Attack: **{result_weapon['attack']}**\n"
                    f"💫 Rarity: **{result_weapon['rarity']}**\n\n"
                    f"**Sacrificed:**\n"
                    f"• {w1['name']}\n"
                    f"• {w2['name']}\n"
                    f"• {required_fragments} Fragments"
                )
            else:
                # Refund fragments if no weapons available
                await self.db.update_game_stats(user_id, fragments=stats['fragments'])
                embed = create_error_embed(
                    "Forge Error",
                    "No weapons available at this rarity tier. Fragments refunded."
                )
        else:
            embed = create_error_embed(
                "🔨 Forge Failed!",
                f"The forge crumbled! You lost:\n"
                f"• {w1['name']}\n"
                f"• {w2['name']}\n"
                f"• {required_fragments} Fragments\n\n"
                f"Better luck next time! (70% success rate)"
            )
        
        await interaction.followup.send(embed=embed)

async def setup(bot):
    await bot.add_cog(Weapons(bot))
