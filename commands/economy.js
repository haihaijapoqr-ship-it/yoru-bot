import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, addToInventory, removeFromInventory } from '../utils/database.js';
import { config, weapons } from '../config.js';

export async function handleProfile(message) {
  const user = getUser(message.author.id);
  
  const xpNeeded = user.level * 100;
  const progressBar = createProgressBar(user.xp, xpNeeded, 10);

  const embed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(`${config.emojis.moon} Hacker Profile`)
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
    .addFields(
      { name: '📊 Level', value: `**${user.level}**`, inline: true },
      { name: '✨ XP', value: `${user.xp}/${xpNeeded}\n${progressBar}`, inline: true },
      { name: '❤️ Emotion XP', value: `**${user.emotionXP}**`, inline: true },
      { name: `${config.emojis.credits} Credits`, value: `**${user.credits}₿**`, inline: true },
      { name: `${config.emojis.fragment} Fragments`, value: `**${user.fragments}**`, inline: true },
      { name: `${config.emojis.energy} Energy`, value: `**${user.energy}/10⚡**`, inline: true },
      { name: '⚔️ Equipped Weapon', value: user.equipped || '*None*', inline: false }
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}

export async function handleInventory(message) {
  const user = getUser(message.author.id);

  if (user.inventory.length === 0) {
    return message.reply(`${config.emojis.inventory} Your inventory is empty! Use \`yoru shop\` to buy items.`);
  }

  const itemCounts = {};
  user.inventory.forEach(item => {
    itemCounts[item] = (itemCounts[item] || 0) + 1;
  });

  let description = '';
  for (const [itemName, count] of Object.entries(itemCounts)) {
    const weapon = weapons.find(w => w.name === itemName);
    const emoji = weapon?.emoji || '📦';
    const equipped = user.equipped === itemName ? '⚡ **[EQUIPPED]**' : '';
    description += `${emoji} **${itemName}** x${count} ${equipped}\n`;
  }

  const embed = new EmbedBuilder()
    .setColor(config.colors.secondary)
    .setTitle(`${config.emojis.inventory} Your Inventory`)
    .setDescription(description || 'Empty')
    .setFooter({ text: 'Use `yoru equip <weapon>` to equip an item' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}

export async function handleShop(message) {
  let description = '**Welcome to the Cyber Shop!**\n\n';
  
  const rarityEmojis = {
    Common: '⚪',
    Rare: '🔵',
    Epic: '🟣',
    Legendary: '🟡'
  };

  weapons.forEach((weapon, index) => {
    const rarityEmoji = rarityEmojis[weapon.rarity] || '⚪';
    description += `**${index + 1}.** ${weapon.emoji} **${weapon.name}** ${rarityEmoji}\n`;
    description += `   ├ Rarity: ${weapon.rarity}\n`;
    description += `   ├ Attack: +${weapon.attack}\n`;
    description += `   └ Price: ${weapon.price}₿\n\n`;
  });

  description += `\nUse \`yoru buy <number>\` to purchase an item!`;

  const embed = new EmbedBuilder()
    .setColor(config.colors.secondary)
    .setTitle(`${config.emojis.terminal} Cyber Shop`)
    .setDescription(description)
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}

export async function handleBuy(message, args) {
  const itemNumber = parseInt(args[0]);

  if (!itemNumber || itemNumber < 1 || itemNumber > weapons.length) {
    return message.reply(`❌ Invalid item number! Use \`yoru shop\` to see available items.`);
  }

  const weapon = weapons[itemNumber - 1];
  const user = getUser(message.author.id);

  if (user.credits < weapon.price) {
    return message.reply(`${config.emojis.credits} Not enough credits! You need ${weapon.price}₿ but only have ${user.credits}₿.`);
  }

  user.credits -= weapon.price;
  addToInventory(user.userId, weapon.name);

  const embed = new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle(`✅ Purchase Successful!`)
    .setDescription(
      `${weapon.emoji} You bought **${weapon.name}**!\n\n` +
      `**Stats:**\n` +
      `├ Rarity: ${weapon.rarity}\n` +
      `├ Attack: +${weapon.attack}\n` +
      `└ Paid: ${weapon.price}₿\n\n` +
      `${config.emojis.credits} Remaining credits: **${user.credits}₿**\n\n` +
      `Use \`yoru equip ${weapon.name}\` to equip it!`
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}

export async function handleEquip(message, args) {
  const weaponName = args.join(' ');

  if (!weaponName) {
    return message.reply('❌ Please specify a weapon to equip! Example: `yoru equip Cyber Katana`');
  }

  const user = getUser(message.author.id);

  if (!user.inventory.includes(weaponName)) {
    return message.reply(`❌ You don't own **${weaponName}**! Check \`yoru inventory\`.`);
  }

  const weapon = weapons.find(w => w.name === weaponName);

  user.equipped = weaponName;
  updateUser(user.userId, user);

  const embed = new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle('⚡ Weapon Equipped!')
    .setDescription(
      `${weapon?.emoji || '⚔️'} **${weaponName}** is now equipped!\n\n` +
      `Attack Power: **+${weapon?.attack || 0}**`
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}

function createProgressBar(current, max, length = 10) {
  const percentage = Math.min(current / max, 1);
  const filled = Math.floor(percentage * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
