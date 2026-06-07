import { EmbedBuilder } from 'discord.js';
import { getUser, calculateStats, regenStamina } from '../utils/rpg-database.js';
import { createRPGEmbed, createDarkFantasyEmbed } from '../utils/realmshatter-embeds.js';
import { EMOJIS, REALMSHATTER_COLORS } from '../data/realmshatter-config.js';

export async function handleStats(message) {
  const user = getUser(message.author.id);
  const stats = calculateStats(message.author.id);
  
  let description = `**${message.author.username}'s Combat Statistics**\n\n`;
  
  description += `**Core Stats:**\n`;
  description += `${EMOJIS.hp} HP: **${stats.hp}**\n`;
  description += `⚔️ Attack: **${stats.attack}**\n`;
  description += `🛡️ Defense: **${stats.defense}**\n\n`;
  
  description += `**Advanced Stats:**\n`;
  description += `💥 Break Chance: **${(stats.breakChance * 100).toFixed(1)}%** (Crit chance, cap: 60%)\n`;
  description += `🔥 Break Damage: **${stats.breakDamage.toFixed(2)}x** (Crit multiplier)\n`;
  description += `👻 Phase Chance: **${(stats.phaseChance * 100).toFixed(1)}%** (Dodge chance, cap: 30%)\n`;
  description += `✨ Fortune Flux: **${stats.fortuneFlux.toFixed(2)}x** (Loot rarity bonus)\n\n`;
  
  description += `**Stat Formula:**\n`;
  description += `• HP = 100 + (Level × 20) + Gear Bonuses\n`;
  description += `• Attack = Weapon + (Level × 3)\n`;
  description += `• Defense = Armor + (Level × 3)\n\n`;
  
  if (user.legacy) {
    description += `**Legacy Bonuses:** ${user.legacy.emoji} ${user.legacy.name}\n`;
  }
  
  if (user.equippedWeapon) {
    description += `**Weapon:** ${user.equippedWeapon.name} (+${user.equippedWeapon.attack} ATK)\n`;
  }
  
  if (user.equippedArmor) {
    description += `**Armor:** ${user.equippedArmor.name} (+${user.equippedArmor.defense} DEF)\n`;
  }
  
  if (user.activeCompanion) {
    description += `**Active Companion:** ${user.activeCompanion.name}\n`;
  }
  
  const embed = createDarkFantasyEmbed(
    '📊 Detailed Statistics',
    description,
    REALMSHATTER_COLORS.primary
  );
  
  await message.reply({ embeds: [embed] });
}

export async function handleBalance(message) {
  const user = getUser(message.author.id);
  
  let description = `**${message.author.username}'s Wallet**\n\n`;
  
  description += `💎 **Luminite:** ${user.luminite}\n`;
  description += `   *Main currency for purchases and upgrades*\n\n`;
  
  description += `🌟 **Astral Shards:** ${user.astralShards}\n`;
  description += `   *Rare crafting material for powerful upgrades*\n\n`;
  
  description += `🗝️ **Fracture Keys:** ${user.fractureKeys}\n`;
  description += `   *Used to enter Fracture dungeons (F1-F7)*\n`;
  
  const embed = createDarkFantasyEmbed(
    '💰 Currency & Resources',
    description,
    REALMSHATTER_COLORS.luminite
  );
  
  await message.reply({ embeds: [embed] });
}

export async function handleStamina(message) {
  const user = getUser(message.author.id);
  regenStamina(message.author.id);
  
  const updatedUser = getUser(message.author.id);
  const staminaPercent = (updatedUser.stamina / 100) * 100;
  
  let barLength = 20;
  let filledBars = Math.floor((updatedUser.stamina / 100) * barLength);
  let emptyBars = barLength - filledBars;
  let staminaBar = '▰'.repeat(filledBars) + '▱'.repeat(emptyBars);
  
  let description = `**${message.author.username}'s Stamina**\n\n`;
  
  description += `${EMOJIS.energy} **${updatedUser.stamina}/100** (${staminaPercent.toFixed(0)}%)\n`;
  description += `${staminaBar}\n\n`;
  
  description += `**Stamina System:**\n`;
  description += `• Regenerates **1 stamina per minute**\n`;
  description += `• Maximum capacity: **100**\n`;
  description += `• Expedition costs: **10 stamina**\n`;
  description += `• Forage costs: **5 stamina**\n\n`;
  
  if (updatedUser.stamina < 100) {
    const minutesUntilFull = 100 - updatedUser.stamina;
    description += `**Time until full:** ${minutesUntilFull} minutes\n`;
  } else {
    description += `✅ **Stamina is full!**\n`;
  }
  
  const embed = createDarkFantasyEmbed(
    '⚡ Stamina Status',
    description,
    REALMSHATTER_COLORS.energy
  );
  
  await message.reply({ embeds: [embed] });
}

export async function handleResources(message) {
  const user = getUser(message.author.id);
  
  const resourceTypes = [
    { id: 'emberberry', name: 'Emberberry', emoji: '🔥' },
    { id: 'voidLotus', name: 'Void Lotus', emoji: '🌑' },
    { id: 'wraithMushroom', name: 'Wraith Mushroom', emoji: '👻' },
    { id: 'starroot', name: 'Starroot', emoji: '⭐' },
    { id: 'crystalVine', name: 'Crystal Vine', emoji: '💎' },
    { id: 'nightbloom', name: 'Nightbloom Herb', emoji: '🌸' },
    { id: 'runeFossil', name: 'Rune Fossil', emoji: '🗿' },
    { id: 'astralSeed', name: 'Astral Seed', emoji: '✨' }
  ];
  
  let description = `**${message.author.username}'s Crafting Materials**\n\n`;
  
  let hasResources = false;
  
  resourceTypes.forEach(resource => {
    const amount = user.craftingMaterials[resource.id] || 0;
    if (amount > 0) {
      description += `${resource.emoji} **${resource.name}:** ${amount}\n`;
      hasResources = true;
    }
  });
  
  if (!hasResources) {
    description += `*No crafting materials yet.*\n\n`;
    description += `Use \`/forage\` to gather resources from the realms!\n`;
  } else {
    description += `\n**Tip:** Use \`/craft\` to create items from resources!\n`;
  }
  
  const embed = createDarkFantasyEmbed(
    '🌿 Crafting Resources',
    description,
    REALMSHATTER_COLORS.success
  );
  
  await message.reply({ embeds: [embed] });
}

export async function handleBackpack(message) {
  const user = getUser(message.author.id);
  
  const weaponCount = user.weapons?.length || 0;
  const armorCount = user.armor?.length || 0;
  const companionCount = user.companions?.length || 0;
  
  const weaponLimit = 40;
  const armorLimit = 40;
  const companionLimit = 20;
  
  let description = `**${message.author.username}'s Backpack**\n\n`;
  
  description += `**Inventory Capacity:**\n\n`;
  
  description += `⚔️ **Weapons:** ${weaponCount}/${weaponLimit}\n`;
  let weaponBar = createCapacityBar(weaponCount, weaponLimit);
  description += `${weaponBar}\n\n`;
  
  description += `🛡️ **Armor:** ${armorCount}/${armorLimit}\n`;
  let armorBar = createCapacityBar(armorCount, armorLimit);
  description += `${armorBar}\n\n`;
  
  description += `🐾 **Companions:** ${companionCount}/${companionLimit}\n`;
  let companionBar = createCapacityBar(companionCount, companionLimit);
  description += `${companionBar}\n\n`;
  
  description += `**Backpack Upgrades:**\n`;
  description += `• Basic: Starting capacity\n`;
  description += `• Sturdy: +10 slots (Coming soon)\n`;
  description += `• Arcane: +20 slots (Coming soon)\n`;
  description += `• Celestial: +40 slots (Coming soon)\n`;
  
  const embed = createDarkFantasyEmbed(
    '🎒 Backpack Management',
    description,
    REALMSHATTER_COLORS.secondary
  );
  
  await message.reply({ embeds: [embed] });
}

function createCapacityBar(current, max) {
  const barLength = 15;
  const filled = Math.floor((current / max) * barLength);
  const empty = barLength - filled;
  return '▰'.repeat(filled) + '▱'.repeat(empty);
}

export async function handlePing(message) {
  const sent = await message.reply('🏓 Pinging...');
  const latency = sent.createdTimestamp - message.createdTimestamp;
  
  let description = `**Bot Latency:** ${latency}ms\n`;
  description += `**API Latency:** ${Math.round(message.client.ws.ping)}ms\n\n`;
  
  if (latency < 100) {
    description += `✅ **Status:** Excellent`;
  } else if (latency < 300) {
    description += `🟡 **Status:** Good`;
  } else {
    description += `🔴 **Status:** Slow`;
  }
  
  const embed = createRPGEmbed(
    '🏓 Pong!',
    description,
    'success'
  );
  
  await sent.edit({ content: '', embeds: [embed] });
}
