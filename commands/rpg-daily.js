import { getUser, updateUser, getCooldown, setCooldown } from '../utils/rpg-database.js';
import { createDarkFantasyEmbed } from '../utils/realmshatter-embeds.js';
import { EMOJIS, REALMSHATTER_COLORS } from '../data/realmshatter-config.js';

export async function handleDaily(message) {
  const user = getUser(message.author.id);
  
  const cooldown = getCooldown(message.author.id, 'daily');
  const now = Date.now();
  
  if (cooldown && now < cooldown) {
    const timeLeft = cooldown - now;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return message.reply(
      `${EMOJIS.error} You've already claimed your daily rewards! Come back in **${hoursLeft}h ${minutesLeft}m**.`
    );
  }
  
  const luminiteReward = 100 + (user.level * 10);
  const astralShardReward = Math.floor(user.level / 10);
  const staminaReward = 20;
  
  const bonusLuminite = Math.random() < 0.2 ? Math.floor(luminiteReward * 0.5) : 0;
  const bonusShards = Math.random() < 0.1 ? 1 : 0;
  
  const totalLuminite = luminiteReward + bonusLuminite;
  const totalShards = astralShardReward + bonusShards;
  
  const newLuminite = user.luminite + totalLuminite;
  const newShards = user.astralShards + totalShards;
  const newStamina = Math.min(user.stamina + staminaReward, 100);
  
  updateUser(message.author.id, {
    luminite: newLuminite,
    astralShards: newShards,
    stamina: newStamina
  });
  
  setCooldown(message.author.id, 'daily', 24 * 60 * 60 * 1000);
  
  let description = `**Daily Rewards Claimed!**\n\n`;
  
  description += `${EMOJIS.luminite} **Luminite:** +${totalLuminite}`;
  if (bonusLuminite > 0) {
    description += ` *(+${bonusLuminite} bonus!)*`;
  }
  description += `\n`;
  
  description += `${EMOJIS.shard} **Astral Shards:** +${totalShards}`;
  if (bonusShards > 0) {
    description += ` *(+1 bonus!)*`;
  }
  description += `\n`;
  
  description += `${EMOJIS.energy} **Stamina:** +${staminaReward}\n\n`;
  
  description += `**New Totals:**\n`;
  description += `💎 Luminite: **${newLuminite}**\n`;
  description += `🌟 Astral Shards: **${newShards}**\n`;
  description += `⚡ Stamina: **${newStamina}/100**\n\n`;
  
  description += `*Return tomorrow for more rewards!*\n`;
  description += `*Rewards scale with your level (currently Lv${user.level})*`;
  
  const embed = createDarkFantasyEmbed(
    '🎁 Daily Rewards',
    description,
    REALMSHATTER_COLORS.luminite
  );
  
  await message.reply({ embeds: [embed] });
}
