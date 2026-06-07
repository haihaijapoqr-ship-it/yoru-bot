import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';
import { calculateCombatStats, simulateCombat, generateBoss } from '../utils/combat-engine.js';
import { generateLoot } from '../utils/loot-generator.js';

const EMOJIS = {
  boss: '👑',
  error: '❌',
  success: '✅',
  loot: '💎'
};

export async function handleBoss(message) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  if (user.level < 100) {
    return message.reply(`${EMOJIS.error} You must be Level 100 to challenge the Eclipsed Monarch!`);
  }

  if (user.stamina < 50) {
    return message.reply(`${EMOJIS.error} You need 50 stamina to challenge the boss!`);
  }

  user.stamina -= 50;

  const playerStats = calculateCombatStats(user);
  const boss = generateBoss('eclipsed_monarch');

  const result = simulateCombat(playerStats, boss.stats, 'You', boss.name);

  if (!result.victory) {
    saveUser(user);
    const embed = createRPGEmbed(
      `${EMOJIS.error} Defeated by the Eclipsed Monarch`,
      `**${boss.name}** overwhelmed you!\n\n` +
      `**Combat Log:**\n${result.log.join('\n')}\n\n` +
      `The darkness consumes your hope...\n` +
      `You lost 50 stamina.`,
      'error'
    );
    return message.reply({ embeds: [embed] });
  }

  const xpGain = 5000;
  const luminiteGain = 10000;
  user.xp += xpGain;
  user.luminite += luminiteGain;
  user.astralShards += 50;
  user.fractureKeys += 10;

  const legendaryLoot = [];
  for (let i = 0; i < 3; i++) {
    const loot = generateLoot(100, 7, 6);
    if (loot.type === 'weapon') {
      user.weapons.push(loot);
    } else {
      user.armor.push(loot);
    }
    legendaryLoot.push(loot);
  }

  saveUser(user);

  let description = `🎉 **YOU DEFEATED THE ECLIPSED MONARCH!** 🎉\n\n` +
    `After an epic battle, you have shattered the darkness and restored the realms!\n\n` +
    `**Combat Log:**\n${result.log.join('\n')}\n\n` +
    `**Rewards:**\n` +
    `✨ +${xpGain} XP\n` +
    `💎 +${luminiteGain} Luminite\n` +
    `🌟 +50 Astral Shards\n` +
    `🗝️ +10 Fracture Keys\n\n` +
    `**Legendary Loot:**\n` +
    legendaryLoot.map(item => 
      `${item.rarity.emoji} **${item.name}** (${item.rarity.name})`
    ).join('\n') +
    `\n\n**The realms are saved... for now.**`;

  const embed = createRPGEmbed(
    `${EMOJIS.boss} VICTORY OVER THE ECLIPSED MONARCH!`,
    description,
    'success'
  );

  await message.reply({ embeds: [embed] });
}
