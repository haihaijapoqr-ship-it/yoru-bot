import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, calculateStats, addXP, regenStamina } from '../utils/rpg-database.js';
import { createDarkFantasyEmbed, createProfileEmbed } from '../utils/realmshatter-embeds.js';
import { LEGACIES, REALMS, EMOJIS, REALMSHATTER_COLORS } from '../data/realmshatter-config.js';

export async function handleStart(message) {
  const user = getUser(message.author.id);
  
  const embed = createDarkFantasyEmbed(
    `${EMOJIS.realm} Welcome to RealmShatter`,
    `**Greetings, Awakened One — ${message.author.username}!**\n\n` +
    `When the Shattering cracked the sky, Ether and Shadow merged, corrupting the Realms into Fractures.\n\n` +
    `You are one of the Awakened — chosen by ancient Sigils to restore balance.\n\n` +
    `**Starting Resources:**\n` +
    `${EMOJIS.luminite} Luminite: **${user.luminite}**\n` +
    `${EMOJIS.shard} Astral Shards: **${user.astralShards}**\n` +
    `${EMOJIS.energy} Stamina: **${user.stamina}/100**\n` +
    `${EMOJIS.level} Level: **${user.level}**\n\n` +
    `Choose your **Legacy** (class) with \`/legacy\`, then begin exploring with \`/expedition\`!\n\n` +
    `Use \`/help\` to see all commands.`,
    REALMSHATTER_COLORS.ether
  );

  await message.channel.send({ embeds: [embed] });
}

export async function handleProfile(message) {
  const user = getUser(message.author.id);
  regenStamina(message.author.id);
  const stats = calculateStats(message.author.id);
  
  const embed = createProfileEmbed(user, stats, message.author);
  await message.channel.send({ embeds: [embed] });
}

export async function handleLegacy(message, args) {
  const user = getUser(message.author.id);
  
  if (!args || args.length === 0) {
    let description = '**Choose your Legacy to unlock unique powers!**\n\n';
    
    LEGACIES.forEach((legacy, index) => {
      description += `**${index + 1}.** ${legacy.emoji} **${legacy.name}**\n`;
      description += `   *${legacy.description}*\n`;
      description += `   **Bonuses:**\n`;
      if (legacy.bonuses.attack) description += `   • +${((legacy.bonuses.attack - 1) * 100).toFixed(0)}% Attack\n`;
      if (legacy.bonuses.hp) description += `   • +${((legacy.bonuses.hp - 1) * 100).toFixed(0)}% HP\n`;
      if (legacy.bonuses.defense) description += `   • +${((legacy.bonuses.defense - 1) * 100).toFixed(0)}% Defense\n`;
      if (legacy.bonuses.breakChance) description += `   • +${(legacy.bonuses.breakChance * 100).toFixed(0)}% Break Chance\n`;
      if (legacy.bonuses.phaseChance) description += `   • +${(legacy.bonuses.phaseChance * 100).toFixed(0)}% Phase Chance\n`;
      if (legacy.bonuses.breakDamage) description += `   • +${((legacy.bonuses.breakDamage - 1) * 100).toFixed(0)}% Break Damage\n`;
      if (legacy.bonuses.fortuneFlux) description += `   • +${((legacy.bonuses.fortuneFlux - 1) * 100).toFixed(0)}% Fortune Flux\n`;
      description += `   **Passive:** ${legacy.passive.name} - ${legacy.passive.description}\n\n`;
    });
    
    description += `\nUse \`/legacy <number>\` to select your Legacy!`;
    if (user.legacy) {
      description += `\n\n*Current Legacy: ${user.legacy.emoji} ${user.legacy.name}*`;
    }
    
    const embed = createDarkFantasyEmbed('🎭 Choose Your Legacy', description, REALMSHATTER_COLORS.primary);
    return await message.channel.send({ embeds: [embed] });
  }
  
  const legacyNumber = parseInt(args[0]);
  if (!legacyNumber || legacyNumber < 1 || legacyNumber > LEGACIES.length) {
    return message.reply('❌ Invalid legacy number! Use `/legacy` to see all options.');
  }
  
  const selectedLegacy = LEGACIES[legacyNumber - 1];
  updateUser(message.author.id, { legacy: selectedLegacy });
  
  const embed = createDarkFantasyEmbed(
    `✨ Legacy Selected!`,
    `${selectedLegacy.emoji} You are now a **${selectedLegacy.name}**!\n\n` +
    `*${selectedLegacy.description}*\n\n` +
    `**Your passive ability:** ${selectedLegacy.passive.name}\n` +
    `${selectedLegacy.passive.description}\n\n` +
    `Your journey begins now. Venture forth into the Fractures!`,
    REALMSHATTER_COLORS.success
  );
  
  await message.channel.send({ embeds: [embed] });
}

export async function handleRealms(message) {
  const user = getUser(message.author.id);
  
  let description = '**The Seven Shattered Realms**\n\n';
  description += `When reality broke, seven realms fell into corruption.\n` +
                 `Each realm holds unique dangers, treasures, and secrets.\n\n`;
  
  REALMS.forEach(realm => {
    const unlocked = user.level >= realm.unlockLevel;
    const status = unlocked ? '🔓 Unlocked' : `🔒 Unlocks at Level ${realm.unlockLevel}`;
    const current = user.currentRealm === realm.id ? ' **[CURRENT]**' : '';
    
    description += `${realm.emoji} **${realm.name}**${current}\n`;
    description += `   Levels ${realm.levelRange[0]}-${realm.levelRange[1]} • ${status}\n`;
    description += `   *${realm.description}*\n\n`;
  });
  
  const embed = new EmbedBuilder()
    .setColor(REALMSHATTER_COLORS.void)
    .setTitle(`${EMOJIS.realm} The Shattered Realms`)
    .setDescription(description)
    .setFooter({ text: 'RealmShatter v1.0 — Venture into the Fractures 🌑' })
    .setTimestamp();
  
  await message.channel.send({ embeds: [embed] });
}

export async function handleStory(message) {
  const embed = createDarkFantasyEmbed(
    '📖 The Shattering',
    `**The Age Before:**\n` +
    `Once, the realms existed in harmony. Ether flowed pure, and Shadow stayed bound.\n\n` +
    `**The Shattering:**\n` +
    `Then came the Eclipsed Monarch, a being of unfathomable power who sought to merge all existence into one twisted reality.\n\n` +
    `When the sky cracked, Ether and Shadow collided. The seven realms shattered into Fractures — unstable zones where reality itself breaks down.\n\n` +
    `**The Awakening:**\n` +
    `Ancient Sigils chose mortals to become Awakened — warriors capable of wielding corrupted Ether without succumbing to madness.\n\n` +
    `You are Awakened. Your task: journey through the Fractures, forge powerful Sigil Arms, bond with Companions born of pure essence, and face the Monarch.\n\n` +
    `**The Final Choice:**\n` +
    `At the Eclipse Nexus, you will decide:\n` +
    `*Restore the world… or shatter it completely.*`,
    REALMSHATTER_COLORS.dark
  );
  
  await message.channel.send({ embeds: [embed] });
}
