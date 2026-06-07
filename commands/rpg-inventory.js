import { EmbedBuilder } from 'discord.js';
import { getUser, equipWeapon, equipArmor, calculateStats } from '../utils/rpg-database.js';
import { createDarkFantasyEmbed } from '../utils/realmshatter-embeds.js';
import { RARITIES, EMOJIS, REALMSHATTER_COLORS } from '../data/realmshatter-config.js';

export async function handleInventory(message, args) {
  const user = getUser(message.author.id);
  const category = args[0]?.toLowerCase() || 'all';
  
  if (category === 'weapons' || category === 'weapon' || category === 'w') {
    return showWeapons(message, user);
  } else if (category === 'armor' || category === 'a') {
    return showArmor(message, user);
  } else if (category === 'resources' || category === 'r') {
    return showResources(message, user);
  } else {
    return showAll(message, user);
  }
}

async function showWeapons(message, user) {
  if (!user.weapons || user.weapons.length === 0) {
    return message.reply(`${EMOJIS.sigil} You have no weapons! Complete expeditions to find loot.`);
  }
  
  let description = `**Your Sigil Arms Collection**\n\n`;
  
  user.weapons.forEach((weapon, index) => {
    const rarityData = RARITIES[weapon.rarity];
    const equipped = weapon.equipped ? ' **[EQUIPPED]**' : '';
    description += `**${index + 1}.** ${weapon.emoji} ${rarityData.emoji} **${weapon.name}**${equipped}\n`;
    description += `   Lv${weapon.level} ${weapon.rarity} | +${weapon.attack} ATK`;
    if (weapon.breakBonus > 0) {
      description += ` | +${(weapon.breakBonus * 100).toFixed(1)}% Break`;
    }
    description += `\n\n`;
  });
  
  description += `Use \`/equip weapon <number>\` to equip a weapon!`;
  
  const embed = createDarkFantasyEmbed(
    `${EMOJIS.sigil} Sigil Arms`,
    description,
    REALMSHATTER_COLORS.secondary
  );
  
  await message.channel.send({ embeds: [embed] });
}

async function showArmor(message, user) {
  if (!user.armor || user.armor.length === 0) {
    return message.reply(`${EMOJIS.aegis} You have no armor! Complete expeditions to find loot.`);
  }
  
  let description = `**Your Aegis Gear Collection**\n\n`;
  
  user.armor.forEach((armor, index) => {
    const rarityData = RARITIES[armor.rarity];
    const equipped = armor.equipped ? ' **[EQUIPPED]**' : '';
    description += `**${index + 1}.** ${armor.emoji} ${rarityData.emoji} **${armor.name}**${equipped}\n`;
    description += `   Lv${armor.level} ${armor.rarity} | +${armor.defense} DEF | +${armor.hpBonus} HP`;
    if (armor.phaseBonus > 0) {
      description += ` | +${(armor.phaseBonus * 100).toFixed(1)}% Phase`;
    }
    description += `\n\n`;
  });
  
  description += `Use \`/equip armor <number>\` to equip armor!`;
  
  const embed = createDarkFantasyEmbed(
    `${EMOJIS.aegis} Aegis Gear`,
    description,
    REALMSHATTER_COLORS.secondary
  );
  
  await message.channel.send({ embeds: [embed] });
}

async function showResources(message, user) {
  if (!user.craftingMaterials || Object.keys(user.craftingMaterials).length === 0) {
    return message.reply(`🌿 You have no resources! Use \`/forage\` to gather materials.`);
  }
  
  let description = `**Your Crafting Resources**\n\n`;
  
  for (const [resourceId, amount] of Object.entries(user.craftingMaterials)) {
    const resourceName = resourceId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    description += `🌿 **${resourceName}:** ${amount}\n`;
  }
  
  const embed = createDarkFantasyEmbed(
    `🌿 Resources`,
    description,
    REALMSHATTER_COLORS.success
  );
  
  await message.channel.send({ embeds: [embed] });
}

async function showAll(message, user) {
  let description = `**Inventory Summary**\n\n`;
  description += `${EMOJIS.sigil} **Weapons:** ${user.weapons?.length || 0}\n`;
  description += `${EMOJIS.aegis} **Armor:** ${user.armor?.length || 0}\n`;
  description += `${EMOJIS.companion} **Companions:** ${user.companions?.length || 0}\n`;
  description += `🌿 **Resources:** ${Object.keys(user.craftingMaterials || {}).length} types\n\n`;
  description += `Use \`/inventory weapons\`, \`/inventory armor\`, or \`/inventory resources\` for details.`;
  
  const embed = createDarkFantasyEmbed(
    `${EMOJIS.realm} Inventory`,
    description,
    REALMSHATTER_COLORS.primary
  );
  
  await message.channel.send({ embeds: [embed] });
}

export async function handleEquip(message, args) {
  if (!args || args.length < 2) {
    return message.reply('Usage: `/equip <weapon/armor> <number>`\nExample: `/equip weapon 1`');
  }
  
  const type = args[0].toLowerCase();
  const itemNumber = parseInt(args[1]);
  
  if (type === 'weapon' || type === 'w') {
    return equipWeaponCommand(message, itemNumber);
  } else if (type === 'armor' || type === 'a') {
    return equipArmorCommand(message, itemNumber);
  } else {
    return message.reply('❌ Invalid type! Use `weapon` or `armor`.');
  }
}

async function equipWeaponCommand(message, itemNumber) {
  const user = getUser(message.author.id);
  
  if (!user.weapons || user.weapons.length === 0) {
    return message.reply(`${EMOJIS.sigil} You have no weapons!`);
  }
  
  if (itemNumber < 1 || itemNumber > user.weapons.length) {
    return message.reply(`❌ Invalid weapon number! You have ${user.weapons.length} weapons.`);
  }
  
  const weapon = user.weapons[itemNumber - 1];
  equipWeapon(message.author.id, weapon.id);
  
  const rarityData = RARITIES[weapon.rarity];
  const embed = createDarkFantasyEmbed(
    `⚡ Weapon Equipped!`,
    `${weapon.emoji} ${rarityData.emoji} **${weapon.name}** is now equipped!\n\n` +
    `**Stats:** Lv${weapon.level} ${weapon.rarity}\n` +
    `${EMOJIS.attack} +${weapon.attack} Attack` +
    (weapon.breakBonus > 0 ? `\n${EMOJIS.break} +${(weapon.breakBonus * 100).toFixed(1)}% Break Chance` : ''),
    REALMSHATTER_COLORS.success
  );
  
  await message.channel.send({ embeds: [embed] });
}

async function equipArmorCommand(message, itemNumber) {
  const user = getUser(message.author.id);
  
  if (!user.armor || user.armor.length === 0) {
    return message.reply(`${EMOJIS.aegis} You have no armor!`);
  }
  
  if (itemNumber < 1 || itemNumber > user.armor.length) {
    return message.reply(`❌ Invalid armor number! You have ${user.armor.length} pieces of armor.`);
  }
  
  const armor = user.armor[itemNumber - 1];
  equipArmor(message.author.id, armor.id);
  
  const rarityData = RARITIES[armor.rarity];
  const embed = createDarkFantasyEmbed(
    `⚡ Armor Equipped!`,
    `${armor.emoji} ${rarityData.emoji} **${armor.name}** is now equipped!\n\n` +
    `**Stats:** Lv${armor.level} ${armor.rarity}\n` +
    `${EMOJIS.defense} +${armor.defense} Defense\n` +
    `${EMOJIS.hp} +${armor.hpBonus} HP` +
    (armor.phaseBonus > 0 ? `\n${EMOJIS.phase} +${(armor.phaseBonus * 100).toFixed(1)}% Phase Chance` : ''),
    REALMSHATTER_COLORS.success
  );
  
  await message.channel.send({ embeds: [embed] });
}
