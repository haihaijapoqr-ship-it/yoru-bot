import { EmbedBuilder } from 'discord.js';
import { getUser, updateUser, addXP, addLuminite, addAstralShards, addResource, addWeapon, addArmor, regenStamina, setCooldown, getCooldown } from '../utils/rpg-database.js';
import { createDarkFantasyEmbed } from '../utils/realmshatter-embeds.js';
import { REALMS, RESOURCES, WEAPON_CATEGORIES, RARITIES, EMOJIS, REALMSHATTER_COLORS, STAMINA_CONFIG } from '../data/realmshatter-config.js';
import { generateWeapon, generateArmor } from '../utils/loot-generator.js';

export async function handleExpedition(message) {
  const user = getUser(message.author.id);
  
  if (user.stamina < STAMINA_CONFIG.costs.expedition) {
    return message.reply(`${EMOJIS.energy} Not enough stamina! Need ${STAMINA_CONFIG.costs.expedition}, you have ${user.stamina}. Stamina regenerates at 1 per minute.`);
  }
  
  const realm = REALMS.find(r => r.id === user.currentRealm);
  if (!realm) {
    return message.reply('❌ Invalid realm! Please contact support.');
  }
  
  if (user.level < realm.unlockLevel) {
    return message.reply(`🔒 You need to be level ${realm.unlockLevel} to explore **${realm.name}**!`);
  }
  
  updateUser(message.author.id, { stamina: user.stamina - STAMINA_CONFIG.costs.expedition });
  
  const encounterRoll = Math.random();
  
  if (encounterRoll < 0.6) {
    await handleExpeditionLoot(message, user, realm);
  } else {
    await handleExpeditionCombat(message, user, realm);
  }
}

async function handleExpeditionLoot(message, user, realm) {
  const luminiteGained = Math.floor(Math.random() * 150) + 50 + (user.level * 5);
  const xpGained = Math.floor(Math.random() * 30) + 20;
  
  addLuminite(message.author.id, luminiteGained);
  const xpResult = addXP(message.author.id, xpGained);
  
  const lootRoll = Math.random();
  let lootMessage = '';
  
  if (lootRoll < 0.15) {
    const weapon = generateWeapon(user.level, realm.id);
    addWeapon(message.author.id, weapon);
    const rarityData = RARITIES[weapon.rarity];
    lootMessage = `\n\n${rarityData.emoji} **${weapon.rarity} Weapon Found!**\n${EMOJIS.sigil} **${weapon.name}** (+${weapon.attack} Attack)`;
  } else if (lootRoll < 0.25) {
    const armor = generateArmor(user.level, realm.id);
    addArmor(message.author.id, armor);
    const rarityData = RARITIES[armor.rarity];
    lootMessage = `\n\n${rarityData.emoji} **${armor.rarity} Armor Found!**\n${EMOJIS.aegis} **${armor.name}** (+${armor.defense} Defense)`;
  } else if (lootRoll < 0.50) {
    const resource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
    const amount = Math.floor(Math.random() * 3) + 1;
    addResource(message.author.id, resource.id, amount);
    lootMessage = `\n\n${resource.emoji} **Resource Found!**\n**${resource.name}** x${amount}`;
  }
  
  if (Math.random() < 0.05) {
    const shardsGained = Math.floor(Math.random() * 3) + 1;
    addAstralShards(message.author.id, shardsGained);
    lootMessage += `\n${EMOJIS.shard} **+${shardsGained} Astral Shards!**`;
  }
  
  let description = `${realm.emoji} You venture into **${realm.name}**...\n\n`;
  description += `*${getExpeditionFlavorText(realm)}*\n\n`;
  description += `**Rewards:**\n`;
  description += `${EMOJIS.luminite} +${luminiteGained} Luminite\n`;
  description += `✨ +${xpGained} XP`;
  description += lootMessage;
  
  if (xpResult.leveledUp) {
    description += `\n\n🎉 **Level Up!** You reached level ${xpResult.newLevel}!`;
    if (xpResult.newLevel === 6 || xpResult.newLevel === 16 || xpResult.newLevel === 26 || 
        xpResult.newLevel === 36 || xpResult.newLevel === 51 || xpResult.newLevel === 71) {
      const nextRealm = REALMS.find(r => r.unlockLevel === xpResult.newLevel);
      if (nextRealm) {
        description += `\n${nextRealm.emoji} **New Realm Unlocked:** ${nextRealm.name}!`;
      }
    }
  }
  
  const embed = createDarkFantasyEmbed(
    `${EMOJIS.realm} Expedition Complete`,
    description,
    realm.color
  );
  
  await message.channel.send({ embeds: [embed] });
}

async function handleExpeditionCombat(message, user, realm) {
  const enemy = generateEnemy(user.level, realm);
  const combatResult = simulateCombat(user, enemy);
  
  if (combatResult.victory) {
    const luminiteGained = Math.floor(Math.random() * 200) + 100 + (user.level * 10);
    const xpGained = Math.floor(Math.random() * 40) + 30;
    
    addLuminite(message.author.id, luminiteGained);
    const xpResult = addXP(message.author.id, xpGained);
    
    let description = `${realm.emoji} **Combat in ${realm.name}!**\n\n`;
    description += `You encountered: **${enemy.name}** (Lv${enemy.level})\n`;
    description += `${EMOJIS.hp} ${enemy.hp} HP | ${EMOJIS.attack} ${enemy.attack} ATK | ${EMOJIS.defense} ${enemy.defense} DEF\n\n`;
    description += `⚔️ **Victory!**\n\n`;
    description += `**Rewards:**\n`;
    description += `${EMOJIS.luminite} +${luminiteGained} Luminite\n`;
    description += `✨ +${xpGained} XP`;
    
    if (xpResult.leveledUp) {
      description += `\n\n🎉 **Level Up!** You reached level ${xpResult.newLevel}!`;
    }
    
    const embed = createDarkFantasyEmbed(
      `⚔️ Combat Victory`,
      description,
      REALMSHATTER_COLORS.success
    );
    
    await message.channel.send({ embeds: [embed] });
  } else {
    let description = `${realm.emoji} **Combat in ${realm.name}!**\n\n`;
    description += `You encountered: **${enemy.name}** (Lv${enemy.level})\n`;
    description += `${EMOJIS.hp} ${enemy.hp} HP | ${EMOJIS.attack} ${enemy.attack} ATK | ${EMOJIS.defense} ${enemy.defense} DEF\n\n`;
    description += `💀 **Defeated!**\n\n`;
    description += `You managed to escape, but gained nothing from this encounter.`;
    
    const embed = createDarkFantasyEmbed(
      `💀 Combat Defeat`,
      description,
      REALMSHATTER_COLORS.error
    );
    
    await message.channel.send({ embeds: [embed] });
  }
}

export async function handleForage(message) {
  const user = getUser(message.author.id);
  
  if (user.stamina < STAMINA_CONFIG.costs.forage) {
    return message.reply(`${EMOJIS.energy} Not enough stamina! Need ${STAMINA_CONFIG.costs.forage}, you have ${user.stamina}. Stamina regenerates at 1 per minute.`);
  }
  
  const realm = REALMS.find(r => r.id === user.currentRealm);
  updateUser(message.author.id, { stamina: user.stamina - STAMINA_CONFIG.costs.forage });
  
  const resource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
  const amount = Math.floor(Math.random() * 5) + 2;
  
  addResource(message.author.id, resource.id, amount);
  
  let description = `${realm.emoji} You forage in **${realm.name}**...\n\n`;
  description += `*${getForageFlavorText(realm)}*\n\n`;
  description += `**Found:**\n`;
  description += `${resource.emoji} **${resource.name}** x${amount}`;
  
  if (Math.random() < 0.10) {
    const bonusLuminite = Math.floor(Math.random() * 50) + 25;
    addLuminite(message.author.id, bonusLuminite);
    description += `\n${EMOJIS.luminite} +${bonusLuminite} Luminite (bonus)`;
  }
  
  const embed = createDarkFantasyEmbed(
    `🌿 Foraging Complete`,
    description,
    REALMSHATTER_COLORS.success
  );
  
  await message.channel.send({ embeds: [embed] });
}

function generateEnemy(playerLevel, realm) {
  const level = playerLevel + Math.floor(Math.random() * 3) - 1;
  const hp = 80 + (level * 25);
  const attack = 12 + (level * 4);
  const defense = 8 + (level * 3);
  
  const enemyNames = [
    'Shadow Wraith', 'Corrupted Beast', 'Void Stalker', 'Ether Phantom',
    'Dark Sentinel', 'Fractured Golem', 'Chaos Spawn', 'Nightmare Entity'
  ];
  
  return {
    name: enemyNames[Math.floor(Math.random() * enemyNames.length)],
    level,
    hp,
    attack,
    defense
  };
}

function simulateCombat(user, enemy) {
  const userStats = calculateBasicStats(user);
  const playerWinChance = userStats.attack / (userStats.attack + enemy.attack);
  
  return {
    victory: Math.random() < (playerWinChance + 0.2)
  };
}

function calculateBasicStats(user) {
  return {
    attack: 10 + (user.level * 3) + (user.equippedWeapon ? user.equippedWeapon.attack : 0),
    defense: 10 + (user.level * 3) + (user.equippedArmor ? user.equippedArmor.defense : 0)
  };
}

function getExpeditionFlavorText(realm) {
  const texts = {
    1: 'You navigate through twisted woods where shadows whisper ancient secrets...',
    2: 'Heat and ash surround you as you climb the volcanic peaks...',
    3: 'Dark mists swirl around your feet as you wade through the corrupted marsh...',
    4: 'Crystal formations sing with eerie beauty in the depths below...',
    5: 'Bitter cold bites at your skin as you traverse the frozen wasteland...',
    6: 'Gravity shifts unpredictably among the floating ruins...',
    7: 'Reality itself bends and fractures in the Eclipse Nexus...'
  };
  return texts[realm.id] || 'You explore the unknown realm...';
}

function getForageFlavorText(realm) {
  const texts = {
    1: 'You search among the corrupted roots and dark undergrowth...',
    2: 'You carefully harvest materials from the volcanic ash...',
    3: 'You gather strange flora from the void-touched swamp...',
    4: 'You extract crystalline fragments from the glowing caverns...',
    5: 'You collect frozen remnants from the eternal ice...',
    6: 'You scavenge materials from the ancient floating ruins...',
    7: 'You harvest pure Ether from reality\'s broken edge...'
  };
  return texts[realm.id] || 'You gather resources...';
}
