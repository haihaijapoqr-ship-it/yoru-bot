import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';
import { generateLoot } from '../utils/loot-generator.js';

const EMOJIS = {
  shop: '🏪',
  buy: '💰',
  sell: '💵',
  error: '❌',
  success: '✅'
};

export async function handleShop(message) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  const shopItems = [
    { name: '🗝️ Fracture Key', price: 500, desc: 'Unlock a Fracture dungeon' },
    { name: '🌟 Astral Shard', price: 300, desc: 'Rare crafting material' },
    { name: '⚡ Stamina Potion', price: 100, desc: 'Restore 20 stamina' },
    { name: '📦 Mystery Box', price: 800, desc: 'Random rare+ equipment' }
  ];

  let description = '**Welcome to the Shattered Market!**\n\n';
  shopItems.forEach((item, index) => {
    description += `**${index + 1}. ${item.name}** - ${item.price} 💎\n${item.desc}\n\n`;
  });

  description += `**Your Luminite:** ${user.luminite} 💎\n\n` +
    `**How to Buy:** \`/buy <number>\`\n` +
    `**How to Sell:** \`/sell weapon/armor <number>\``;

  const embed = createRPGEmbed(
    `${EMOJIS.shop} Shattered Market`,
    description,
    'secondary'
  );

  await message.reply({ embeds: [embed] });
}

export async function handleBuy(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  const shopItems = [
    { name: 'Fracture Key', price: 500, key: 'fractureKeys' },
    { name: 'Astral Shard', price: 300, key: 'astralShards' },
    { name: 'Stamina Potion', price: 100, key: 'stamina', amount: 20 },
    { name: 'Mystery Box', price: 800, key: 'mysterybox' }
  ];

  const choice = parseInt(args[0]);
  if (!choice || choice < 1 || choice > shopItems.length) {
    return message.reply(`${EMOJIS.error} Invalid item number! Use \`/shop\` to see items.`);
  }

  const item = shopItems[choice - 1];

  if (user.luminite < item.price) {
    return message.reply(`${EMOJIS.error} You need ${item.price} 💎 Luminite!`);
  }

  user.luminite -= item.price;

  let purchaseDesc = `You purchased **${item.name}** for ${item.price} 💎 Luminite!\n\n`;

  if (item.key === 'mysterybox') {
    const loot = generateLoot(user.level, user.currentRealm, 3);
    if (loot.type === 'weapon') {
      user.weapons.push(loot);
    } else {
      user.armor.push(loot);
    }
    purchaseDesc += `You received: ${loot.rarity.emoji} **${loot.name}** (${loot.rarity.name})!`;
  } else if (item.key === 'stamina') {
    user.stamina = Math.min(100, user.stamina + item.amount);
    purchaseDesc += `Restored ${item.amount} stamina! Current: ${user.stamina}/100`;
  } else {
    user[item.key]++;
    purchaseDesc += `New balance: ${user[item.key]}`;
  }

  saveUser(user);

  const embed = createRPGEmbed(
    `${EMOJIS.success} Purchase Complete!`,
    purchaseDesc,
    'success'
  );

  await message.reply({ embeds: [embed] });
}

export async function handleSell(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  if (args.length < 2) {
    return message.reply(`${EMOJIS.error} Usage: \`/sell weapon/armor <number>\``);
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
  const equippedId = type === 'weapon' ? user.equippedWeapon : user.equippedArmor;

  if (item.id === equippedId) {
    return message.reply(`${EMOJIS.error} You can't sell equipped items! Unequip it first.`);
  }

  const sellValue = Math.floor(item.level * 50 * (item.rarity.multiplier || 1));
  user.luminite += sellValue;
  items.splice(index, 1);

  saveUser(user);

  const embed = createRPGEmbed(
    `${EMOJIS.success} Item Sold!`,
    `You sold **${item.name}** for ${sellValue} 💎 Luminite!\n\n` +
    `New balance: ${user.luminite} 💎`,
    'success'
  );

  await message.reply({ embeds: [embed] });
}
