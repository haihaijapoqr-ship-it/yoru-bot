import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, addCredits, addFragments, addXP } from '../utils/database.js';
import { setCooldown, getCooldown } from '../utils/cooldowns.js';
import { formatHackMessage, getRandomMessage } from '../utils/randomText.js';
import { config, jobs } from '../config.js';

export async function handleStart(message) {
  const user = getUser(message.author.id);
  
  const embed = new EmbedBuilder()
    .setColor(config.colors.secondary)
    .setTitle(`${config.emojis.moon} Welcome to the Hackverse!`)
    .setDescription(
      `**Greetings, Data Hunter ${message.author.username}!**\n\n` +
      `You've been registered in Yoru's system. Your journey begins now in this neon-lit cyber world.\n\n` +
      `**Starting Resources:**\n` +
      `${config.emojis.credits} Credits: **${user.credits}₿**\n` +
      `${config.emojis.energy} Energy: **${user.energy}⚡**\n` +
      `${config.emojis.level} Level: **${user.level}**\n\n` +
      `Use \`yoru help\` to see all available commands and start your adventure!`
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}

export async function handleHack(message) {
  const cooldown = getCooldown(message.author.id, 'hack');
  if (cooldown > 0) {
    return message.reply(`⏰ Cooldown active! Wait ${cooldown} more seconds.`);
  }

  const user = getUser(message.author.id);

  if (user.energy < 1) {
    return message.reply(`${config.emojis.energy} Not enough energy! Use \`yoru work\` to recover.`);
  }

  const node = Math.random().toString(36).substring(2, 6).toUpperCase();
  const success = Math.random() > 0.3;

  const embed = new EmbedBuilder()
    .setColor(success ? config.colors.success : config.colors.error)
    .setTitle(`${config.emojis.terminal} Yoru Terminal`)
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  if (success) {
    const creditsEarned = Math.floor(Math.random() * 250) + 150;
    const fragmentChance = Math.random();
    const fragmentsEarned = fragmentChance > 0.7 ? 1 : 0;
    const xpEarned = Math.floor(Math.random() * 20) + 10;

    addCredits(user.userId, creditsEarned);
    if (fragmentsEarned > 0) addFragments(user.userId, fragmentsEarned);
    const xpResult = addXP(user.userId, xpEarned);
    
    user.energy -= 1;
    updateUser(user.userId, user);

    let description = `Accessing Node **${node}**...\n🔓 **Hack Successful!**\n\n`;
    description += `*${formatHackMessage('success', node)}*\n\n`;
    description += `**Rewards:**\n`;
    description += `${config.emojis.credits} +${creditsEarned}₿\n`;
    if (fragmentsEarned > 0) description += `${config.emojis.fragment} +${fragmentsEarned} Fragment\n`;
    description += `✨ +${xpEarned} XP`;
    
    if (xpResult.leveledUp) {
      description += `\n\n🎉 **Level Up!** You're now level ${xpResult.newLevel}!`;
    }

    embed.setDescription(description);
  } else {
    user.energy -= 1;
    updateUser(user.userId, user);

    embed.setDescription(
      `Accessing Node **${node}**...\n🔒 **Hack Failed!**\n\n` +
      `*${formatHackMessage('failure', node)}*\n\n` +
      `${config.emojis.energy} -1 Energy (${user.energy} remaining)`
    );
  }

  setCooldown(message.author.id, 'hack', config.cooldowns.hack);
  await message.channel.send({ embeds: [embed] });
}

export async function handleScan(message) {
  const cooldown = getCooldown(message.author.id, 'scan');
  if (cooldown > 0) {
    return message.reply(`⏰ Cooldown active! Wait ${cooldown} more seconds.`);
  }

  const user = getUser(message.author.id);

  if (user.energy < 2) {
    return message.reply(`${config.emojis.energy} Not enough energy! Need 2⚡ to scan.`);
  }

  const scanMessage = getRandomMessage('scan');
  const found = Math.random() > 0.4;

  const embed = new EmbedBuilder()
    .setColor(found ? config.colors.success : config.colors.primary)
    .setTitle(`${config.emojis.terminal} Network Scan`)
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  if (found) {
    const creditsEarned = Math.floor(Math.random() * 150) + 50;
    const fragmentsEarned = Math.floor(Math.random() * 2) + 1;
    const xpEarned = Math.floor(Math.random() * 15) + 5;

    addCredits(user.userId, creditsEarned);
    addFragments(user.userId, fragmentsEarned);
    const xpResult = addXP(user.userId, xpEarned);
    
    user.energy -= 2;
    updateUser(user.userId, user);

    let description = `${scanMessage}\n\n`;
    description += `✨ **Discovery!**\n\n`;
    description += `${config.emojis.credits} +${creditsEarned}₿\n`;
    description += `${config.emojis.fragment} +${fragmentsEarned} Fragments\n`;
    description += `✨ +${xpEarned} XP`;
    
    if (xpResult.leveledUp) {
      description += `\n\n🎉 **Level Up!** You're now level ${xpResult.newLevel}!`;
    }

    embed.setDescription(description);
  } else {
    user.energy -= 2;
    updateUser(user.userId, user);

    embed.setDescription(
      `${scanMessage}\n\n` +
      `Nothing found this time.\n\n` +
      `${config.emojis.energy} -2 Energy (${user.energy} remaining)`
    );
  }

  setCooldown(message.author.id, 'scan', config.cooldowns.scan);
  await message.channel.send({ embeds: [embed] });
}

export async function handleDaily(message) {
  const cooldown = getCooldown(message.author.id, 'daily');
  if (cooldown > 0) {
    const hours = Math.floor(cooldown / 3600);
    const minutes = Math.floor((cooldown % 3600) / 60);
    return message.reply(`⏰ Daily reward on cooldown! Wait ${hours}h ${minutes}m.`);
  }

  const user = getUser(message.author.id);
  const creditsEarned = Math.floor(Math.random() * 300) + 200;
  const fragmentsEarned = Math.floor(Math.random() * 3) + 1;
  const energyRestored = 10;

  addCredits(user.userId, creditsEarned);
  addFragments(user.userId, fragmentsEarned);
  user.energy = Math.min(user.energy + energyRestored, 10);
  updateUser(user.userId, user);

  const embed = new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle(`${config.emojis.moon} Daily Rewards Claimed!`)
    .setDescription(
      `**Welcome back, ${message.author.username}!**\n\n` +
      `Here are your daily rewards:\n\n` +
      `${config.emojis.credits} **+${creditsEarned}₿** Credits\n` +
      `${config.emojis.fragment} **+${fragmentsEarned}** Fragments\n` +
      `${config.emojis.energy} **+${energyRestored}⚡** Energy Restored\n\n` +
      `Come back tomorrow for more rewards!`
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  setCooldown(message.author.id, 'daily', config.cooldowns.daily);
  await message.channel.send({ embeds: [embed] });
}

export async function handleWork(message) {
  const cooldown = getCooldown(message.author.id, 'work');
  if (cooldown > 0) {
    return message.reply(`⏰ Cooldown active! Wait ${cooldown} more seconds.`);
  }

  const job = jobs[Math.floor(Math.random() * jobs.length)];
  const creditsEarned = Math.floor(Math.random() * (job.reward[1] - job.reward[0])) + job.reward[0];
  const jobMessage = job.messages[Math.floor(Math.random() * job.messages.length)];
  const xpEarned = Math.floor(Math.random() * 10) + 5;

  const user = getUser(message.author.id);
  addCredits(user.userId, creditsEarned);
  const xpResult = addXP(user.userId, xpEarned);
  
  user.energy = Math.min(user.energy + 1, 10);
  updateUser(user.userId, user);

  const embed = new EmbedBuilder()
    .setColor(config.colors.secondary)
    .setTitle(`${config.emojis.terminal} Work Complete`)
    .setDescription(
      `**Job:** ${job.name}\n\n` +
      `*${jobMessage}*\n\n` +
      `**Rewards:**\n` +
      `${config.emojis.credits} +${creditsEarned}₿\n` +
      `${config.emojis.energy} +1⚡ Energy\n` +
      `✨ +${xpEarned} XP` +
      (xpResult.leveledUp ? `\n\n🎉 **Level Up!** You're now level ${xpResult.newLevel}!` : '')
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  setCooldown(message.author.id, 'work', config.cooldowns.work);
  await message.channel.send({ embeds: [embed] });
}
