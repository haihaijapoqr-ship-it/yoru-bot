import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';

const EMOJIS = {
  upgrade: '⬆️',
  weapon: '⚔️',
  armor: '🛡️',
  error: '❌',
  success: '✅'
};

export async function handleUpgrade(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  if (args.length < 2) {
    const embed = createRPGEmbed(
      `${EMOJIS.upgrade} Upgrade Equipment`,
      '**Upgrade your weapons and armor to make them more powerful!**\n\n' +
      '**How to Upgrade:**\n' +
      '`/upgrade weapon <number>` - Upgrade a weapon from your inventory\n' +
      '`/upgrade armor <number>` - Upgrade armor from your inventory\n\n' +
      '**Upgrade Cost Formula:**\n' +
      'Luminite: `(Current Level × 100) + 200`\n' +
      'Astral Shards: `Current Level`\n\n' +
      '**Benefits:**\n' +
      '+10% to all stats per level (max level 20)',
      'secondary'
    );
    return message.reply({ embeds: [embed] });
  }

  const type = args[0].toLowerCase();
  const index = parseInt(args[1]) - 1;

  if (type !== 'weapon' && type !== 'armor') {
    return message.reply(`${EMOJIS.error} Invalid type! Use 'weapon' or 'armor'.`);
  }

  const items = type === 'weapon' ? user.weapons : user.armor;
  if (index < 0 || index >= items.length) {
    return message.reply(`${EMOJIS.error} Invalid item number!`);
  }

  const item = items[index];
  const currentLevel = item.upgradeLevel || 0;

  if (currentLevel >= 20) {
    return message.reply(`${EMOJIS.error} This item is already at max level (20)!`);
  }

  const luminiteCost = (currentLevel * 100) + 200;
  const shardCost = currentLevel + 1;

  if (user.luminite < luminiteCost) {
    return message.reply(`${EMOJIS.error} You need ${luminiteCost} 💎 Luminite!`);
  }

  if (user.astralShards < shardCost) {
    return message.reply(`${EMOJIS.error} You need ${shardCost} 🌟 Astral Shards!`);
  }

  user.luminite -= luminiteCost;
  user.astralShards -= shardCost;

  item.upgradeLevel = currentLevel + 1;
  const multiplier = 1 + (item.upgradeLevel * 0.1);

  for (const stat in item.stats) {
    item.stats[stat] = Math.floor(item.baseStats[stat] * multiplier);
  }

  saveUser(user);

  const emoji = type === 'weapon' ? EMOJIS.weapon : EMOJIS.armor;
  const embed = createRPGEmbed(
    `${EMOJIS.success} Upgrade Successful!`,
    `**${item.name}** upgraded to Level ${item.upgradeLevel}!\n\n` +
    `**New Stats:**\n` +
    Object.entries(item.stats).map(([key, value]) => `${key}: ${value}`).join('\n') +
    `\n\n**Costs:**\n` +
    `-${luminiteCost} 💎 Luminite\n` +
    `-${shardCost} 🌟 Astral Shards`,
    'success'
  );

  await message.reply({ embeds: [embed] });
}
