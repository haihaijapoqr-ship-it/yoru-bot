import { EmbedBuilder } from 'discord.js';
import { REALMSHATTER_COLORS, EMOJIS } from '../data/realmshatter-config.js';

export function createDarkFantasyEmbed(title, description, color = REALMSHATTER_COLORS.primary) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RealmShatter v1.0 — Venture into the Fractures 🌑' })
    .setTimestamp();
}

export function createProfileEmbed(user, stats, author) {
  const xpNeeded = user.level * 100;
  const progressBar = createProgressBar(user.xp, xpNeeded, 10);
  
  const legacyText = user.legacy ? `${user.legacy.emoji} ${user.legacy.name}` : '*None - use `/legacy` to choose*';
  const weaponText = user.equippedWeapon ? `${user.equippedWeapon.emoji} ${user.equippedWeapon.name} Lv${user.equippedWeapon.level}` : '*None*';
  const armorText = user.equippedArmor ? `${user.equippedArmor.emoji} ${user.equippedArmor.name} Lv${user.equippedArmor.level}` : '*None*';
  const companionText = user.activeCompanion ? `${user.activeCompanion.emoji} ${user.activeCompanion.name} Lv${user.activeCompanion.level}` : '*None*';
  
  return new EmbedBuilder()
    .setColor(REALMSHATTER_COLORS.primary)
    .setTitle(`${EMOJIS.realm} Player Profile`)
    .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
    .addFields(
      { name: `${EMOJIS.level} Level`, value: `**${user.level}**`, inline: true },
      { name: '✨ XP', value: `${user.xp}/${xpNeeded}\n${progressBar}`, inline: true },
      { name: '❤️ Emotion XP', value: `**${user.emotionXP}**`, inline: true },
      { name: `${EMOJIS.luminite} Luminite`, value: `**${user.luminite}**`, inline: true },
      { name: `${EMOJIS.shard} Astral Shards`, value: `**${user.astralShards}**`, inline: true },
      { name: `${EMOJIS.energy} Stamina`, value: `**${user.stamina}/100**`, inline: true },
      { name: '🎭 Legacy (Class)', value: legacyText, inline: false },
      { name: `${EMOJIS.sigil} Sigil Arm`, value: weaponText, inline: true },
      { name: `${EMOJIS.aegis} Aegis Gear`, value: armorText, inline: true },
      { name: `${EMOJIS.companion} Companion`, value: companionText, inline: true },
      { name: '\u200B', value: '**⚔️ Combat Stats**', inline: false },
      { name: `${EMOJIS.hp} HP`, value: `**${Math.floor(stats.hp)}**`, inline: true },
      { name: `${EMOJIS.attack} Attack`, value: `**${Math.floor(stats.attack)}**`, inline: true },
      { name: `${EMOJIS.defense} Defense`, value: `**${Math.floor(stats.defense)}**`, inline: true },
      { name: `${EMOJIS.break} Break`, value: `**${(stats.breakChance * 100).toFixed(1)}%**`, inline: true },
      { name: `${EMOJIS.phase} Phase`, value: `**${(stats.phaseChance * 100).toFixed(1)}%**`, inline: true },
      { name: `${EMOJIS.fortune} Fortune`, value: `**${stats.fortuneFlux.toFixed(2)}x**`, inline: true }
    )
    .setFooter({ text: 'RealmShatter v1.0 — Venture into the Fractures 🌑' })
    .setTimestamp();
}

export function createLootEmbed(item, rarity, itemType = 'item') {
  const rarityData = RARITIES[rarity] || RARITIES.Common;
  
  return new EmbedBuilder()
    .setColor(rarityData.color)
    .setTitle(`${rarityData.emoji} ${rarity} ${itemType} Obtained!`)
    .setDescription(`**${item.name}**\n\n${item.description || ''}`)
    .setFooter({ text: 'RealmShatter v1.0 — Venture into the Fractures 🌑' })
    .setTimestamp();
}

export function createCombatEmbed(title, description, color = REALMSHATTER_COLORS.crimson) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RealmShatter v1.0 — Venture into the Fractures 🌑' })
    .setTimestamp();
}

export function createProgressBar(current, max, length = 10) {
  const percentage = Math.min(current / max, 1);
  const filled = Math.floor(percentage * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

const RARITIES = {
  Common: { multiplier: 1.0, color: 0x9E9E9E, emoji: '⚪' },
  Uncommon: { multiplier: 1.15, color: 0x4CAF50, emoji: '🟢' },
  Rare: { multiplier: 1.30, color: 0x2196F3, emoji: '🔵' },
  Epic: { multiplier: 1.50, color: 0x9C27B0, emoji: '🟣' },
  Legendary: { multiplier: 1.80, color: 0xFFD700, emoji: '🟡' },
  Mythic: { multiplier: 2.10, color: 0xFF6B6B, emoji: '🔴' },
  Celestial: { multiplier: 2.40, color: 0x00D9FF, emoji: '✨' }
};

export const createRPGEmbed = createDarkFantasyEmbed;
