import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';
import { calculateCombatStats, simulateCombat } from '../utils/combat-engine.js';
import { REALMSHATTER_CONFIG } from '../data/realmshatter-config.js';

const EMOJIS = {
  pvp: '⚔️',
  rank: '🏆',
  error: '❌',
  success: '✅'
};

export async function handleDuel(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  const target = message.mentions.users.first();
  if (!target || target.id === message.author.id) {
    return message.reply(`${EMOJIS.error} Please mention a valid opponent!`);
  }

  const opponent = getUser(target.id);
  if (!opponent.legacy) {
    return message.reply(`${EMOJIS.error} Your opponent hasn't started their journey yet!`);
  }

  const playerStats = calculateCombatStats(user);
  const opponentStats = calculateCombatStats(opponent);

  const result = simulateCombat(playerStats, opponentStats, message.author.username, target.username);

  const eloChange = calculateEloChange(user.pvpElo, opponent.pvpElo, result.victory);

  if (result.victory) {
    user.pvpWins++;
    user.pvpElo += eloChange;
    opponent.pvpLosses++;
    opponent.pvpElo -= eloChange;
  } else {
    user.pvpLosses++;
    user.pvpElo -= eloChange;
    opponent.pvpWins++;
    opponent.pvpElo += eloChange;
  }

  user.pvpElo = Math.max(0, user.pvpElo);
  opponent.pvpElo = Math.max(0, opponent.pvpElo);

  saveUser(user);
  saveUser(opponent);

  const userRank = getRankFromElo(user.pvpElo);
  const embed = createRPGEmbed(
    result.victory ? `${EMOJIS.success} Victory!` : `${EMOJIS.error} Defeat!`,
    `**${message.author.username}** vs **${target.username}**\n\n` +
    `**Combat Log:**\n${result.log.join('\n')}\n\n` +
    `**Results:**\n` +
    `${result.victory ? '+' : '-'}${Math.abs(eloChange)} ELO\n` +
    `Current ELO: ${user.pvpElo}\n` +
    `Rank: ${userRank.emoji} ${userRank.name}\n` +
    `Record: ${user.pvpWins}W - ${user.pvpLosses}L`,
    result.victory ? 'success' : 'error'
  );

  await message.reply({ embeds: [embed] });
}

export async function handlePvPRank(message) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  const rank = getRankFromElo(user.pvpElo);

  let description = `**Your PvP Stats:**\n\n` +
    `**Rank:** ${rank.emoji} ${rank.name}\n` +
    `**ELO:** ${user.pvpElo}\n` +
    `**Record:** ${user.pvpWins}W - ${user.pvpLosses}L\n` +
    `**Win Rate:** ${user.pvpWins + user.pvpLosses > 0 ? ((user.pvpWins / (user.pvpWins + user.pvpLosses)) * 100).toFixed(1) : 0}%\n\n` +
    `**All Ranks:**\n` +
    REALMSHATTER_CONFIG.pvpRanks.map(r => 
      `${r.emoji} **${r.name}** - ${r.minElo}+ ELO`
    ).join('\n');

  const embed = createRPGEmbed(
    `${EMOJIS.rank} PvP Ranking`,
    description,
    'secondary'
  );

  await message.reply({ embeds: [embed] });
}

function calculateEloChange(playerElo, opponentElo, won) {
  const K = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actualScore = won ? 1 : 0;
  return Math.round(K * (actualScore - expectedScore));
}

function getRankFromElo(elo) {
  for (let i = REALMSHATTER_CONFIG.pvpRanks.length - 1; i >= 0; i--) {
    if (elo >= REALMSHATTER_CONFIG.pvpRanks[i].minElo) {
      return REALMSHATTER_CONFIG.pvpRanks[i];
    }
  }
  return REALMSHATTER_CONFIG.pvpRanks[0];
}
