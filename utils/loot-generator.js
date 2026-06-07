import { WEAPON_CATEGORIES, RARITIES, REALMSHATTER_CONFIG } from '../data/realmshatter-config.js';

const WEAPON_PREFIXES = [
  'Corrupted', 'Shadow', 'Void', 'Ether', 'Dark', 'Celestial', 'Phantom',
  'Spectral', 'Cursed', 'Ancient', 'Forgotten', 'Shattered', 'Eclipse'
];

const WEAPON_SUFFIXES = [
  'of the Void', 'of Shadows', 'of Eternity', 'of Ruin', 'of the Fallen',
  'of Chaos', 'of the Abyss', 'of Twilight', 'of the Eclipse', 'of Despair'
];

const ARMOR_TYPES = [
  'Helm', 'Chestplate', 'Gauntlets', 'Greaves', 'Cloak', 'Mantle', 'Vestments'
];

export function generateWeapon(playerLevel, realmId) {
  const rarity = determineRarity(playerLevel, realmId);
  const rarityData = RARITIES[rarity];
  const category = WEAPON_CATEGORIES[Math.floor(Math.random() * WEAPON_CATEGORIES.length)];
  
  const baseAttack = 5 + Math.floor(playerLevel * 1.5);
  const attack = Math.floor(baseAttack * rarityData.multiplier);
  
  const breakBonus = rarity === 'Epic' || rarity === 'Legendary' || rarity === 'Mythic' || rarity === 'Celestial' 
    ? Math.random() * 0.05 + 0.02 
    : 0;
  
  const prefix = WEAPON_PREFIXES[Math.floor(Math.random() * WEAPON_PREFIXES.length)];
  const suffix = rarity === 'Legendary' || rarity === 'Mythic' || rarity === 'Celestial' 
    ? ' ' + WEAPON_SUFFIXES[Math.floor(Math.random() * WEAPON_SUFFIXES.length)]
    : '';
  
  const name = `${prefix} ${category}${suffix}`;
  
  return {
    name,
    category,
    rarity,
    level: 1,
    attack,
    breakBonus: Math.round(breakBonus * 1000) / 1000,
    emoji: getWeaponEmoji(category),
    equipped: false
  };
}

export function generateArmor(playerLevel, realmId) {
  const rarity = determineRarity(playerLevel, realmId);
  const rarityData = RARITIES[rarity];
  const type = ARMOR_TYPES[Math.floor(Math.random() * ARMOR_TYPES.length)];
  
  const baseDefense = 4 + Math.floor(playerLevel * 1.2);
  const defense = Math.floor(baseDefense * rarityData.multiplier);
  
  const hpBonus = Math.floor((10 + playerLevel * 2) * rarityData.multiplier);
  
  const phaseBonus = rarity === 'Epic' || rarity === 'Legendary' || rarity === 'Mythic' || rarity === 'Celestial'
    ? Math.random() * 0.03 + 0.01
    : 0;
  
  const prefix = WEAPON_PREFIXES[Math.floor(Math.random() * WEAPON_PREFIXES.length)];
  const suffix = rarity === 'Legendary' || rarity === 'Mythic' || rarity === 'Celestial'
    ? ' ' + WEAPON_SUFFIXES[Math.floor(Math.random() * WEAPON_SUFFIXES.length)]
    : '';
  
  const name = `${prefix} ${type}${suffix}`;
  
  return {
    name,
    rarity,
    level: 1,
    defense,
    hpBonus,
    phaseBonus: Math.round(phaseBonus * 1000) / 1000,
    emoji: '🛡️',
    equipped: false
  };
}

function determineRarity(playerLevel, realmId) {
  const roll = Math.random();
  
  let celestialChance = playerLevel >= 80 ? 0.001 : 0;
  let mythicChance = playerLevel >= 60 ? 0.02 : 0;
  let legendaryChance = playerLevel >= 40 ? 0.05 : 0.01;
  let epicChance = playerLevel >= 25 ? 0.15 : 0.05;
  let rareChance = 0.25;
  let uncommonChance = 0.35;
  
  celestialChance *= (realmId / 7);
  mythicChance *= (realmId / 7);
  legendaryChance *= (realmId / 7);
  
  if (roll < celestialChance) return 'Celestial';
  if (roll < celestialChance + mythicChance) return 'Mythic';
  if (roll < celestialChance + mythicChance + legendaryChance) return 'Legendary';
  if (roll < celestialChance + mythicChance + legendaryChance + epicChance) return 'Epic';
  if (roll < celestialChance + mythicChance + legendaryChance + epicChance + rareChance) return 'Rare';
  if (roll < celestialChance + mythicChance + legendaryChance + epicChance + rareChance + uncommonChance) return 'Uncommon';
  
  return 'Common';
}

function getWeaponEmoji(category) {
  const emojis = {
    'Shadowblade': '🗡️',
    'Aether Staff': '🔮',
    'Rift Dagger': '🔪',
    'Astral Bow': '🏹',
    'Celestial Cleaver': '⚔️',
    'Dark Grimoire': '📖',
    'Sigil Spear': '🔱'
  };
  return emojis[category] || '⚔️';
}

export function generateLoot(playerLevel, realmId, minRarity = 0) {
  const isWeapon = Math.random() < 0.5;
  let item;
  let type;
  
  if (isWeapon) {
    item = generateWeapon(playerLevel, realmId);
    type = 'weapon';
  } else {
    item = generateArmor(playerLevel, realmId);
    type = 'armor';
  }
  
  const rarityLevels = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Celestial'];
  const currentRarityIndex = rarityLevels.indexOf(item.rarity);
  
  if (minRarity > 0 && currentRarityIndex < minRarity) {
    item.rarity = rarityLevels[minRarity];
    const rarityData = RARITIES[item.rarity];
    if (isWeapon) {
      const baseAttack = 5 + Math.floor(playerLevel * 1.5);
      item.attack = Math.floor(baseAttack * rarityData.multiplier);
    } else {
      const baseDefense = 4 + Math.floor(playerLevel * 1.2);
      item.defense = Math.floor(baseDefense * rarityData.multiplier);
      item.hpBonus = Math.floor((10 + playerLevel * 2) * rarityData.multiplier);
    }
  }
  
  const rarityData = RARITIES[item.rarity];
  
  return {
    name: item.name,
    category: item.category,
    rarity: {
      name: item.rarity,
      emoji: rarityData?.emoji || '⚪',
      multiplier: rarityData?.multiplier || 1.0
    },
    level: item.level,
    attack: item.attack,
    defense: item.defense,
    hpBonus: item.hpBonus,
    phaseBonus: item.phaseBonus,
    breakBonus: item.breakBonus,
    emoji: item.emoji,
    type,
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    upgradeLevel: 0,
    baseStats: isWeapon 
      ? { attack: item.attack, breakBonus: item.breakBonus }
      : { defense: item.defense, hpBonus: item.hpBonus, phaseBonus: item.phaseBonus },
    stats: isWeapon 
      ? { attack: item.attack, breakBonus: item.breakBonus }
      : { defense: item.defense, hpBonus: item.hpBonus, phaseBonus: item.phaseBonus }
  };
}
