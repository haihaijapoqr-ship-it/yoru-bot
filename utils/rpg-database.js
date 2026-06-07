import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { RARITIES } from '../data/realmshatter-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new Database(join(__dirname, '..', 'data', 'realmshatter.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    legacy TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    emotionXP INTEGER DEFAULT 0,
    luminite INTEGER DEFAULT 500,
    astralShards INTEGER DEFAULT 0,
    fractureKeys INTEGER DEFAULT 3,
    stamina INTEGER DEFAULT 100,
    lastStaminaRegen INTEGER DEFAULT 0,
    currentRealm INTEGER DEFAULT 1,
    pvpElo INTEGER DEFAULT 1000,
    pvpWins INTEGER DEFAULT 0,
    pvpLosses INTEGER DEFAULT 0,
    storyChapter INTEGER DEFAULT 1,
    credits INTEGER DEFAULT 100,
    fragments INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 10,
    lastDaily INTEGER DEFAULT 0,
    lastWork INTEGER DEFAULT 0,
    lastHack INTEGER DEFAULT 0,
    lastScan INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS weapons (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    attack INTEGER NOT NULL,
    breakBonus REAL DEFAULT 0,
    upgradeLevel INTEGER DEFAULT 0,
    equipped INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS armor (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    rarity TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    defense INTEGER NOT NULL,
    hpBonus INTEGER DEFAULT 0,
    phaseBonus REAL DEFAULT 0,
    upgradeLevel INTEGER DEFAULT 0,
    equipped INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS companions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    familyId TEXT NOT NULL,
    name TEXT NOT NULL,
    rarity TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    bond INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    hp INTEGER DEFAULT 50,
    attack INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 10,
    active INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS crafting_materials (
    userId TEXT NOT NULL,
    resourceId TEXT NOT NULL,
    amount INTEGER DEFAULT 0,
    PRIMARY KEY (userId, resourceId),
    FOREIGN KEY (userId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS cooldowns (
    userId TEXT NOT NULL,
    action TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    PRIMARY KEY (userId, action),
    FOREIGN KEY (userId) REFERENCES users(userId)
  );
`);

export function getUser(userId) {
  let user = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
  
  if (!user) {
    db.prepare(`
      INSERT INTO users (userId, lastStaminaRegen)
      VALUES (?, ?)
    `).run(userId, Date.now());
    user = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
  }
  
  regenStamina(userId);
  
  const weaponRows = db.prepare('SELECT * FROM weapons WHERE userId = ?').all(userId);
  const armorRows = db.prepare('SELECT * FROM armor WHERE userId = ?').all(userId);
  const companionRows = db.prepare('SELECT * FROM companions WHERE userId = ?').all(userId);
  const materials = db.prepare('SELECT * FROM crafting_materials WHERE userId = ?').all(userId);
  
  const weapons = weaponRows.map(w => ({
    ...w,
    rarity: {
      name: w.rarity,
      emoji: RARITIES[w.rarity]?.emoji || '⚪',
      multiplier: RARITIES[w.rarity]?.multiplier || 1.0
    },
    baseStats: {
      attack: Math.floor(w.attack / (1 + (w.upgradeLevel || 0) * 0.1)),
      breakBonus: w.breakBonus
    },
    stats: {
      attack: w.attack,
      breakBonus: w.breakBonus
    },
    equipped: w.equipped === 1
  }));
  
  const armor = armorRows.map(a => ({
    ...a,
    rarity: {
      name: a.rarity,
      emoji: RARITIES[a.rarity]?.emoji || '⚪',
      multiplier: RARITIES[a.rarity]?.multiplier || 1.0
    },
    baseStats: {
      defense: Math.floor(a.defense / (1 + (a.upgradeLevel || 0) * 0.1)),
      hpBonus: Math.floor(a.hpBonus / (1 + (a.upgradeLevel || 0) * 0.1)),
      phaseBonus: a.phaseBonus
    },
    stats: {
      defense: a.defense,
      hpBonus: a.hpBonus,
      phaseBonus: a.phaseBonus
    },
    equipped: a.equipped === 1
  }));
  
  const companions = companionRows.map(c => ({
    ...c,
    family: c.familyId,
    stats: {
      hp: c.hp,
      attack: c.attack,
      defense: c.defense
    }
  }));
  
  const equippedWeapon = weapons.find(w => w.equipped);
  const equippedArmor = armor.find(a => a.equipped);
  const activeCompanion = companions.find(c => c.active === 1);
  
  const craftingMaterials = {};
  materials.forEach(m => {
    craftingMaterials[m.resourceId] = m.amount;
  });
  
  let parsedLegacy = null;
  if (user.legacy && user.legacy !== '') {
    try {
      parsedLegacy = JSON.parse(user.legacy);
    } catch (e) {
      console.error('Failed to parse legacy:', e);
      parsedLegacy = null;
    }
  }
  
  return {
    ...user,
    weapons,
    armor,
    companions,
    equippedWeapon,
    equippedArmor,
    activeCompanion,
    craftingMaterials,
    legacy: parsedLegacy
  };
}

export function updateUser(userId, updates) {
  const allowedFields = [
    'legacy', 'level', 'xp', 'emotionXP', 'luminite', 'astralShards', 
    'fractureKeys', 'stamina', 'lastStaminaRegen', 'currentRealm',
    'pvpElo', 'pvpWins', 'pvpLosses', 'storyChapter',
    'credits', 'fragments', 'energy', 'lastDaily', 'lastWork', 'lastHack', 'lastScan'
  ];
  
  const fields = Object.keys(updates).filter(k => allowedFields.includes(k));
  if (fields.length === 0) return;
  
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => {
    if (f === 'legacy' && updates[f]) {
      return JSON.stringify(updates[f]);
    }
    return updates[f];
  });
  values.push(userId);
  
  db.prepare(`UPDATE users SET ${setClause} WHERE userId = ?`).run(...values);
}

export function saveUser(user) {
  const userId = user.userId;
  updateUser(userId, {
    legacy: user.legacy,
    level: user.level,
    xp: user.xp,
    emotionXP: user.emotionXP,
    luminite: user.luminite,
    astralShards: user.astralShards,
    fractureKeys: user.fractureKeys,
    stamina: user.stamina,
    lastStaminaRegen: user.lastStaminaRegen,
    currentRealm: user.currentRealm,
    pvpElo: user.pvpElo,
    pvpWins: user.pvpWins,
    pvpLosses: user.pvpLosses,
    storyChapter: user.storyChapter
  });
  
  if (user.weapons) {
    db.prepare('DELETE FROM weapons WHERE userId = ?').run(userId);
    const equippedWeaponId = user.equippedWeapon?.id || user.equippedWeapon;
    user.weapons.forEach(weapon => {
      const rarityName = typeof weapon.rarity === 'object' ? weapon.rarity.name : weapon.rarity;
      db.prepare(`
        INSERT INTO weapons (userId, id, name, category, rarity, level, attack, breakBonus, upgradeLevel, equipped)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, weapon.id, weapon.name, weapon.category, rarityName, weapon.level || 1, 
             weapon.stats?.attack || weapon.attack || 0, weapon.stats?.breakBonus || weapon.breakBonus || 0, 
             weapon.upgradeLevel || 0, weapon.id === equippedWeaponId ? 1 : 0);
    });
  }
  
  if (user.armor) {
    db.prepare('DELETE FROM armor WHERE userId = ?').run(userId);
    const equippedArmorId = user.equippedArmor?.id || user.equippedArmor;
    user.armor.forEach(armor => {
      const rarityName = typeof armor.rarity === 'object' ? armor.rarity.name : armor.rarity;
      db.prepare(`
        INSERT INTO armor (userId, id, name, rarity, level, defense, hpBonus, phaseBonus, upgradeLevel, equipped)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, armor.id, armor.name, rarityName, armor.level || 1,
             armor.stats?.defense || armor.defense || 0, armor.stats?.hpBonus || armor.hpBonus || 0,
             armor.stats?.phaseBonus || armor.phaseBonus || 0, armor.upgradeLevel || 0, 
             armor.id === equippedArmorId ? 1 : 0);
    });
  }
  
  if (user.companions) {
    db.prepare('DELETE FROM companions WHERE userId = ?').run(userId);
    const activeCompanionId = user.activeCompanion?.id || user.activeCompanion;
    user.companions.forEach(comp => {
      db.prepare(`
        INSERT INTO companions (userId, id, familyId, name, rarity, level, bond, xp, hp, attack, defense, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, comp.id, comp.family, comp.name, comp.rarity || 'Common', comp.level || 1,
             comp.bond || 0, comp.xp || 0, comp.stats?.hp || 50, comp.stats?.attack || 10, 
             comp.stats?.defense || 10, comp.id === activeCompanionId ? 1 : 0);
    });
  }
  
  if (user.craftingMaterials) {
    db.prepare('DELETE FROM crafting_materials WHERE userId = ?').run(userId);
    for (const [resourceId, amount] of Object.entries(user.craftingMaterials)) {
      if (amount > 0) {
        db.prepare(`
          INSERT INTO crafting_materials (userId, resourceId, amount)
          VALUES (?, ?, ?)
        `).run(userId, resourceId, amount);
      }
    }
  }
}

export function regenStamina(userId) {
  const user = db.prepare('SELECT stamina, lastStaminaRegen FROM users WHERE userId = ?').get(userId);
  if (!user) return 100;
  
  const now = Date.now();
  const timePassed = now - user.lastStaminaRegen;
  const minutesPassed = timePassed / 60000;
  const staminaToRegen = Math.floor(minutesPassed);
  
  if (staminaToRegen > 0) {
    const newStamina = Math.min(user.stamina + staminaToRegen, 100);
    db.prepare('UPDATE users SET stamina = ?, lastStaminaRegen = ? WHERE userId = ?')
      .run(newStamina, now, userId);
    return newStamina;
  }
  
  return user.stamina;
}

export function calculateStats(userId) {
  const user = getUser(userId);
  
  let stats = {
    hp: 100 + (user.level * 20),
    maxHp: 100 + (user.level * 20),
    attack: 10 + (user.level * 3),
    defense: 10 + (user.level * 3),
    breakChance: 0,
    breakDamage: 1.2,
    phaseChance: 0,
    fortuneFlux: 1.0
  };
  
  if (user.legacy && user.legacy.bonuses) {
    if (user.legacy.bonuses.attack) stats.attack *= user.legacy.bonuses.attack;
    if (user.legacy.bonuses.hp) stats.hp *= user.legacy.bonuses.hp;
    if (user.legacy.bonuses.defense) stats.defense *= user.legacy.bonuses.defense;
    if (user.legacy.bonuses.breakChance) stats.breakChance += user.legacy.bonuses.breakChance;
    if (user.legacy.bonuses.phaseChance) stats.phaseChance += user.legacy.bonuses.phaseChance;
    if (user.legacy.bonuses.breakDamage) stats.breakDamage *= user.legacy.bonuses.breakDamage;
    if (user.legacy.bonuses.fortuneFlux) stats.fortuneFlux *= user.legacy.bonuses.fortuneFlux;
  }
  
  if (user.equippedWeapon) {
    stats.attack += user.equippedWeapon.attack;
    stats.breakChance += user.equippedWeapon.breakBonus || 0;
  }
  
  if (user.equippedArmor) {
    stats.defense += user.equippedArmor.defense;
    stats.hp += user.equippedArmor.hpBonus || 0;
    stats.maxHp += user.equippedArmor.hpBonus || 0;
    stats.phaseChance += user.equippedArmor.phaseBonus || 0;
  }
  
  if (user.activeCompanion) {
    const comp = user.activeCompanion;
    if (comp.passive) {
      if (comp.passive.includes('Attack')) {
        const match = comp.passive.match(/(\d+)%/);
        if (match) stats.attack *= (1 + parseInt(match[1]) / 100);
      }
      if (comp.passive.includes('Defense')) {
        const match = comp.passive.match(/(\d+)%/);
        if (match) stats.defense *= (1 + parseInt(match[1]) / 100);
      }
      if (comp.passive.includes('HP')) {
        const match = comp.passive.match(/(\d+)%/);
        if (match) {
          const bonus = parseInt(match[1]) / 100;
          stats.hp *= (1 + bonus);
          stats.maxHp *= (1 + bonus);
        }
      }
    }
  }
  
  stats.breakChance = Math.min(stats.breakChance, 0.60);
  stats.phaseChance = Math.min(stats.phaseChance, 0.30);
  
  stats.hp = Math.floor(stats.hp);
  stats.maxHp = Math.floor(stats.maxHp);
  stats.attack = Math.floor(stats.attack);
  stats.defense = Math.floor(stats.defense);
  
  return stats;
}

export function addXP(userId, amount) {
  const user = db.prepare('SELECT level, xp FROM users WHERE userId = ?').get(userId);
  let newXp = user.xp + amount;
  let newLevel = user.level;
  
  const xpNeeded = user.level * 100;
  if (newXp >= xpNeeded) {
    newLevel += 1;
    newXp -= xpNeeded;
  }
  
  db.prepare('UPDATE users SET level = ?, xp = ? WHERE userId = ?').run(newLevel, newXp, userId);
  
  return { leveledUp: newLevel > user.level, newLevel };
}

export function addEmotionXP(userId, amount) {
  db.prepare('UPDATE users SET emotionXP = emotionXP + ? WHERE userId = ?').run(amount, userId);
}

export function addLuminite(userId, amount) {
  db.prepare('UPDATE users SET luminite = luminite + ? WHERE userId = ?').run(amount, userId);
}

export function addAstralShards(userId, amount) {
  db.prepare('UPDATE users SET astralShards = astralShards + ? WHERE userId = ?').run(amount, userId);
}

export function addCredits(userId, amount) {
  db.prepare('UPDATE users SET credits = credits + ? WHERE userId = ?').run(amount, userId);
}

export function addFragments(userId, amount) {
  db.prepare('UPDATE users SET fragments = fragments + ? WHERE userId = ?').run(amount, userId);
}

export function addToInventory(userId, item) {
  const user = getUser(userId);
  user.inventory = user.inventory || [];
  user.inventory.push(item);
  saveUser(user);
}

export function removeFromInventory(userId, itemName) {
  const user = getUser(userId);
  if (!user.inventory) return false;
  const index = user.inventory.indexOf(itemName);
  if (index > -1) {
    user.inventory.splice(index, 1);
    saveUser(user);
    return true;
  }
  return false;
}

export function getAllUsers() {
  const rows = db.prepare('SELECT * FROM users').all();
  return rows.map(row => ({
    ...row,
    legacy: row.legacy ? JSON.parse(row.legacy) : null
  }));
}

export function addResource(userId, resourceId, amount) {
  const existing = db.prepare('SELECT amount FROM crafting_materials WHERE userId = ? AND resourceId = ?')
    .get(userId, resourceId);
  
  if (existing) {
    db.prepare('UPDATE crafting_materials SET amount = amount + ? WHERE userId = ? AND resourceId = ?')
      .run(amount, userId, resourceId);
  } else {
    db.prepare('INSERT INTO crafting_materials (userId, resourceId, amount) VALUES (?, ?, ?)')
      .run(userId, resourceId, amount);
  }
}

export function addWeapon(userId, weapon) {
  db.prepare(`
    INSERT INTO weapons (userId, name, category, rarity, level, attack, breakBonus, equipped)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, weapon.name, weapon.category, weapon.rarity, weapon.level || 1, 
         weapon.attack, weapon.breakBonus || 0, weapon.equipped ? 1 : 0);
}

export function addArmor(userId, armor) {
  db.prepare(`
    INSERT INTO armor (userId, name, rarity, level, defense, hpBonus, phaseBonus, equipped)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, armor.name, armor.rarity, armor.level || 1, armor.defense,
         armor.hpBonus || 0, armor.phaseBonus || 0, armor.equipped ? 1 : 0);
}

export function addCompanion(userId, companion) {
  db.prepare(`
    INSERT INTO companions (userId, familyId, name, rarity, level, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, companion.familyId, companion.name, companion.rarity, companion.level || 1, companion.active ? 1 : 0);
}

export function setCooldown(userId, action, milliseconds) {
  const expiresAt = Date.now() + milliseconds;
  db.prepare(`
    INSERT OR REPLACE INTO cooldowns (userId, action, expiresAt)
    VALUES (?, ?, ?)
  `).run(userId, action, expiresAt);
}

export function getCooldown(userId, action) {
  const now = Date.now();
  const cooldown = db.prepare('SELECT expiresAt FROM cooldowns WHERE userId = ? AND action = ?')
    .get(userId, action);
  
  if (!cooldown) return 0;
  
  const remaining = cooldown.expiresAt - now;
  if (remaining <= 0) {
    db.prepare('DELETE FROM cooldowns WHERE userId = ? AND action = ?').run(userId, action);
    return 0;
  }
  
  return Math.ceil(remaining / 1000);
}

export function equipWeapon(userId, weaponId) {
  db.prepare('UPDATE weapons SET equipped = 0 WHERE userId = ?').run(userId);
  db.prepare('UPDATE weapons SET equipped = 1 WHERE id = ?').run(weaponId);
}

export function equipArmor(userId, armorId) {
  db.prepare('UPDATE armor SET equipped = 0 WHERE userId = ?').run(userId);
  db.prepare('UPDATE armor SET equipped = 1 WHERE id = ?').run(armorId);
}

export function setActiveCompanion(userId, companionId) {
  db.prepare('UPDATE companions SET active = 0 WHERE userId = ?').run(userId);
  if (companionId) {
    db.prepare('UPDATE companions SET active = 1 WHERE id = ?').run(companionId);
  }
}

export { db };
