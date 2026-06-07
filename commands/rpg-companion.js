import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';
import { COMPANION_FAMILIES } from '../data/realmshatter-config.js';

const EMOJIS = {
  companion: '🐾',
  bond: '💫',
  train: '⚔️',
  summon: '✨',
  error: '❌',
  success: '✅'
};

const SUMMON_COST = 300;
const BASE_STATS = { hp: 50, attack: 10, defense: 10 };

export async function handleSummon(message) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first! Use \`/legacy\` to begin.`);
  }

  let description = `**Summon a Companion**\n\n` +
    `Cost: ${SUMMON_COST} 💎 Luminite per summon\n` +
    `Starting Level: 1 (Max Level: 15)\n\n` +
    `**Companion Families:**\n\n`;
  
  COMPANION_FAMILIES.forEach((family, index) => {
    description += `**${index + 1}. ${family.emoji} ${family.name}**\n`;
    description += `   Passive: ${family.passive}\n`;
    description += `   Active: ${family.active}\n\n`;
  });

  const embed = createRPGEmbed(
    `${EMOJIS.summon} Companion Summoning`,
    description,
    'secondary'
  );

  embed.addFields({
    name: 'How to Summon',
    value: `Use \`/summon <number>\` to summon a companion from the list above.\nYour Luminite: ${user.luminite} 💎`,
    inline: false
  });

  await message.reply({ embeds: [embed] });
}

export async function handleSummonChoice(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  const choice = parseInt(args[0]);
  
  if (!choice || choice < 1 || choice > COMPANION_FAMILIES.length) {
    return message.reply(`${EMOJIS.error} Invalid choice! Use \`/summon\` to see available companions.`);
  }

  if (user.luminite < SUMMON_COST) {
    return message.reply(`${EMOJIS.error} You need ${SUMMON_COST} 💎 Luminite to summon this companion!`);
  }

  const family = COMPANION_FAMILIES[choice - 1];

  const companion = {
    id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    family: family.id,
    name: family.name,
    level: 1,
    xp: 0,
    bond: 0,
    rarity: 'Common',
    stats: {
      hp: BASE_STATS.hp,
      attack: BASE_STATS.attack,
      defense: BASE_STATS.defense
    }
  };

  user.companions.push(companion);
  user.luminite -= SUMMON_COST;
  
  if (!user.activeCompanion) {
    user.activeCompanion = companion.id;
  }

  saveUser(user);

  const embed = createRPGEmbed(
    `${EMOJIS.success} Companion Summoned!`,
    `You have summoned ${family.emoji} **${companion.name}**!\n\n` +
    `**Family:** ${family.name}\n` +
    `**Level:** 1\n` +
    `**Bond:** 0%\n` +
    `**Stats:**\n` +
    `❤️ HP: ${companion.stats.hp}\n` +
    `⚔️ ATK: ${companion.stats.attack}\n` +
    `🛡️ DEF: ${companion.stats.defense}\n\n` +
    `**Passive Ability:** ${family.passive}\n` +
    `**Active Skill:** ${family.active}\n\n` +
    `This companion is now active!`,
    'success'
  );

  await message.reply({ embeds: [embed] });
}

export async function handleCompanions(message) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  if (user.companions.length === 0) {
    return message.reply(`${EMOJIS.companion} You have no companions yet! Use \`/summon\` to get one.`);
  }

  let description = `**Your Companions** (${user.companions.length})\n\n`;
  
  user.companions.forEach((comp, index) => {
    const isActive = comp.id === user.activeCompanion ? '🌟 **ACTIVE**' : '';
    description += `**${index + 1}. ${comp.name}** ${isActive}\n` +
      `Level ${comp.level} | Bond: ${comp.bond}%\n` +
      `❤️ ${comp.stats.hp} | ⚔️ ${comp.stats.attack} | 🛡️ ${comp.stats.defense}\n\n`;
  });

  const embed = createRPGEmbed(
    `${EMOJIS.companion} Your Companions`,
    description,
    'secondary'
  );

  embed.addFields({
    name: 'Commands',
    value: '`/activate <number>` - Set active companion\n`/train` - Train your active companion',
    inline: false
  });

  await message.reply({ embeds: [embed] });
}

export async function handleActivate(message, args) {
  const user = getUser(message.author.id);
  
  if (user.companions.length === 0) {
    return message.reply(`${EMOJIS.error} You have no companions!`);
  }

  const choice = parseInt(args[0]);
  if (!choice || choice < 1 || choice > user.companions.length) {
    return message.reply(`${EMOJIS.error} Invalid companion number!`);
  }

  const companion = user.companions[choice - 1];
  user.activeCompanion = companion.id;
  saveUser(user);

  await message.reply(`${EMOJIS.success} **${companion.name}** is now your active companion!`);
}

export async function handleTrain(message) {
  const user = getUser(message.author.id);
  
  if (!user.activeCompanion) {
    return message.reply(`${EMOJIS.error} You don't have an active companion!`);
  }

  const companion = user.companions.find(c => c.id === user.activeCompanion);
  if (!companion) {
    return message.reply(`${EMOJIS.error} Active companion not found!`);
  }

  const trainCost = 50 * companion.level;
  if (user.luminite < trainCost) {
    return message.reply(`${EMOJIS.error} You need ${trainCost} 💎 Luminite to train your companion!`);
  }

  user.luminite -= trainCost;
  
  const xpGain = 50 + (companion.level * 10);
  companion.xp += xpGain;
  const xpNeeded = companion.level * 100;

  let leveledUp = false;
  if (companion.xp >= xpNeeded) {
    companion.level++;
    companion.xp -= xpNeeded;
    companion.stats.hp += 15;
    companion.stats.attack += 5;
    companion.stats.defense += 5;
    leveledUp = true;
  }

  const bondGain = Math.floor(Math.random() * 5) + 3;
  companion.bond = Math.min(100, companion.bond + bondGain);

  saveUser(user);

  let description = `You trained **${companion.name}**!\n\n` +
    `✨ +${xpGain} XP (${companion.xp}/${companion.level * 100})\n` +
    `💫 +${bondGain}% Bond (${companion.bond}%)\n`;

  if (leveledUp) {
    description += `\n🎉 **Level Up!** ${companion.name} is now Level ${companion.level}!\n` +
      `❤️ HP +15 | ⚔️ ATK +5 | 🛡️ DEF +5`;
  }

  const embed = createRPGEmbed(
    `${EMOJIS.train} Training Complete!`,
    description,
    leveledUp ? 'success' : 'secondary'
  );

  await message.reply({ embeds: [embed] });
}
