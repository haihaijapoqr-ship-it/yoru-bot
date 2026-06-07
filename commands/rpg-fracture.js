import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';
import { calculateCombatStats, simulateCombat } from '../utils/combat-engine.js';
import { generateLoot } from '../utils/loot-generator.js';
import { REALMSHATTER_CONFIG } from '../data/realmshatter-config.js';

const EMOJIS = {
  fracture: '🌀',
  key: '🗝️',
  error: '❌',
  success: '✅',
  loot: '💎'
};

export async function handleFracture(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  if (!args[0]) {
    const embed = createRPGEmbed(
      `${EMOJIS.fracture} Fracture Dungeons`,
      '**Enter unstable rifts for guaranteed legendary loot!**\n\n' +
      REALMSHATTER_CONFIG.fractureTiers.map(tier => 
        `**${tier.name}** (${tier.id})\n` +
        `Requires: Level ${tier.minLevel} | ${tier.keyCost} 🗝️ Fracture Keys\n` +
        `Rewards: ${tier.lootQuality} quality loot\n`
      ).join('\n') +
      '\n\n**Usage:** `/fracture <F1-F7>`',
      'secondary'
    );

    embed.addFields({
      name: 'Your Keys',
      value: `🗝️ ${user.fractureKeys} Fracture Keys`,
      inline: false
    });

    return message.reply({ embeds: [embed] });
  }

  const tierId = args[0].toUpperCase();
  const tier = REALMSHATTER_CONFIG.fractureTiers.find(t => t.id === tierId);

  if (!tier) {
    return message.reply(`${EMOJIS.error} Invalid Fracture tier! Use F1-F7.`);
  }

  if (user.level < tier.minLevel) {
    return message.reply(`${EMOJIS.error} You need to be Level ${tier.minLevel}!`);
  }

  if (user.fractureKeys < tier.keyCost) {
    return message.reply(`${EMOJIS.error} You need ${tier.keyCost} 🗝️ Fracture Keys!`);
  }

  user.fractureKeys -= tier.keyCost;

  const playerStats = calculateCombatStats(user);
  const bossStats = {
    hp: tier.bossHP,
    attack: tier.bossAttack,
    defense: tier.bossDefense,
    breakChance: 30,
    breakDamage: 40,
    phaseChance: 20
  };

  const result = simulateCombat(playerStats, bossStats, 'You', tier.bossName);

  if (!result.victory) {
    saveUser(user);
    const embed = createRPGEmbed(
      `${EMOJIS.error} Fracture Failed!`,
      `You were defeated by **${tier.bossName}** in ${tier.name}!\n\n` +
      `**Combat Log:**\n${result.log.join('\n')}\n\n` +
      `You lost ${tier.keyCost} 🗝️ Fracture Keys.`,
      'error'
    );
    return message.reply({ embeds: [embed] });
  }

  const xpGain = tier.xpReward;
  const luminiteGain = tier.luminiteReward;
  user.xp += xpGain;
  user.luminite += luminiteGain;

  const xpNeeded = user.level * 100;
  let leveledUp = false;
  while (user.xp >= xpNeeded) {
    user.level++;
    user.xp -= xpNeeded;
    leveledUp = true;
  }

  const guaranteedLoot = [];
  const minRarity = tier.lootQuality === 'Legendary+' ? 5 : 4;
  
  for (let i = 0; i < tier.guaranteedItems; i++) {
    const loot = generateLoot(user.level, user.currentRealm, minRarity);
    if (loot.type === 'weapon') {
      user.weapons.push(loot);
    } else {
      user.armor.push(loot);
    }
    guaranteedLoot.push(loot);
  }

  const shardBonus = Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 3 : 0;
  if (shardBonus > 0) {
    user.astralShards += shardBonus;
  }

  saveUser(user);

  let description = `You defeated **${tier.bossName}**!\n\n` +
    `**Combat Log:**\n${result.log.join('\n')}\n\n` +
    `**Rewards:**\n` +
    `✨ +${xpGain} XP\n` +
    `💎 +${luminiteGain} Luminite\n`;

  if (shardBonus > 0) {
    description += `🌟 +${shardBonus} Astral Shards\n`;
  }

  description += `\n**Loot:**\n` + guaranteedLoot.map(item => 
    `${item.rarity.emoji} **${item.name}** (${item.rarity.name})`
  ).join('\n');

  if (leveledUp) {
    description += `\n\n🎉 **LEVEL UP!** You are now Level ${user.level}!`;
  }

  const embed = createRPGEmbed(
    `${EMOJIS.success} Fracture Cleared!`,
    description,
    'success'
  );

  await message.reply({ embeds: [embed] });
}
