import { REALMSHATTER_CONFIG } from '../data/realmshatter-config.js';

export function calculateCombatStats(user) {
  const legacyData = user.legacy ? REALMSHATTER_CONFIG.legacies[user.legacy] : null;
  
  let stats = {
    hp: 100 + (user.level * 20),
    attack: 10 + (user.level * 3),
    defense: 10 + (user.level * 3),
    breakChance: 0,
    breakDamage: 0,
    phaseChance: 0,
    fortuneFlux: 0
  };

  if (user.equippedWeapon) {
    const weapon = user.weapons.find(w => w.id === user.equippedWeapon);
    if (weapon) {
      stats.attack += weapon.stats.attack || 0;
      stats.breakChance += weapon.stats.breakChance || 0;
      stats.phaseChance += weapon.stats.phaseChance || 0;
    }
  }

  if (user.equippedArmor) {
    const armor = user.armor.find(a => a.id === user.equippedArmor);
    if (armor) {
      stats.hp += armor.stats.hp || 0;
      stats.defense += armor.stats.defense || 0;
    }
  }

  if (user.activeCompanion) {
    const companion = user.companions.find(c => c.id === user.activeCompanion);
    if (companion && companion.bond >= 50) {
      stats.attack += Math.floor(companion.stats.attack * 0.5);
      stats.defense += Math.floor(companion.stats.defense * 0.5);
    }
  }

  if (legacyData) {
    stats.hp = Math.floor(stats.hp * (1 + (legacyData.bonuses.hp || 0) / 100));
    stats.attack = Math.floor(stats.attack * (1 + (legacyData.bonuses.attack || 0) / 100));
    stats.defense = Math.floor(stats.defense * (1 + (legacyData.bonuses.defense || 0) / 100));
    stats.breakChance += (legacyData.bonuses.breakChance || 0);
    stats.breakDamage += (legacyData.bonuses.breakDamage || 0);
    stats.phaseChance += (legacyData.bonuses.phaseChance || 0);
    stats.fortuneFlux += (legacyData.bonuses.fortuneFlux || 0);
  }

  stats.breakChance = Math.min(60, stats.breakChance);
  stats.phaseChance = Math.min(30, stats.phaseChance);

  return stats;
}

export function simulateCombat(playerStats, enemyStats, playerName = 'You', enemyName = 'Enemy') {
  let playerHP = playerStats.hp;
  let enemyHP = enemyStats.hp;
  let playerBreakMeter = 0;
  let enemyBreakMeter = 0;
  let turnCount = 0;
  const maxTurns = 20;
  const log = [];

  while (playerHP > 0 && enemyHP > 0 && turnCount < maxTurns) {
    turnCount++;

    const playerPhase = Math.random() * 100 < playerStats.phaseChance;
    if (!playerPhase) {
      let damage = Math.max(1, playerStats.attack - Math.floor(enemyStats.defense * 0.5));
      
      const breakTriggered = Math.random() * 100 < playerStats.breakChance;
      if (breakTriggered) {
        enemyBreakMeter += 20;
        if (enemyBreakMeter >= 100) {
          const breakMultiplier = 1.5 + (playerStats.breakDamage / 100);
          damage = Math.floor(damage * breakMultiplier);
          enemyBreakMeter = 0;
          log.push(`💥 ${playerName} BREAK! ${damage} damage!`);
        } else {
          log.push(`⚡ ${playerName} builds Break meter!`);
        }
      }

      enemyHP -= damage;
      log.push(`⚔️ ${playerName} attacks for ${damage} damage!`);
    } else {
      log.push(`👻 ${playerName} phased through time!`);
    }

    if (enemyHP <= 0) break;

    const enemyPhase = Math.random() * 100 < (enemyStats.phaseChance || 0);
    if (!enemyPhase) {
      let damage = Math.max(1, enemyStats.attack - Math.floor(playerStats.defense * 0.5));
      
      const breakTriggered = Math.random() * 100 < (enemyStats.breakChance || 0);
      if (breakTriggered) {
        playerBreakMeter += 20;
        if (playerBreakMeter >= 100) {
          const breakMultiplier = 1.5 + ((enemyStats.breakDamage || 0) / 100);
          damage = Math.floor(damage * breakMultiplier);
          playerBreakMeter = 0;
          log.push(`💥 ${enemyName} BREAK! ${damage} damage!`);
        } else {
          log.push(`⚡ ${enemyName} builds Break meter!`);
        }
      }

      playerHP -= damage;
      log.push(`🗡️ ${enemyName} attacks for ${damage} damage!`);
    } else {
      log.push(`👻 ${enemyName} phased!`);
    }
  }

  return {
    victory: playerHP > 0,
    playerHP: Math.max(0, playerHP),
    enemyHP: Math.max(0, enemyHP),
    turns: turnCount,
    log: log.slice(-6)
  };
}

export function generateEnemy(realmId, level) {
  const realm = Object.values(REALMSHATTER_CONFIG.realms).find(r => r.id === realmId);
  if (!realm) return null;

  const enemyPool = realm.enemies || ['Corrupted Shade', 'Void Wraith', 'Eclipse Fiend'];
  const enemyName = enemyPool[Math.floor(Math.random() * enemyPool.length)];

  const levelVariance = Math.floor(Math.random() * 3) - 1;
  const enemyLevel = Math.max(1, level + levelVariance);

  return {
    name: enemyName,
    level: enemyLevel,
    stats: {
      hp: 80 + (enemyLevel * 15),
      attack: 8 + (enemyLevel * 2),
      defense: 8 + (enemyLevel * 2),
      breakChance: Math.min(30, 5 + enemyLevel),
      breakDamage: 20,
      phaseChance: Math.min(15, Math.floor(enemyLevel / 3))
    }
  };
}

export function generateBoss(bossKey) {
  const bossData = REALMSHATTER_CONFIG.bosses ? REALMSHATTER_CONFIG.bosses[bossKey] : null;
  if (!bossData) {
    return {
      name: 'Eclipsed Monarch',
      level: 100,
      stats: {
        hp: 5000,
        attack: 200,
        defense: 150,
        breakChance: 40,
        breakDamage: 50,
        phaseChance: 25
      }
    };
  }

  return {
    name: bossData.name,
    level: bossData.level,
    stats: bossData.stats
  };
}
