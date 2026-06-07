export const REALMS = [
  {
    id: 1,
    name: 'Whispering Woods',
    levelRange: [1, 5],
    theme: 'Corrupted forest',
    description: 'Dark trees whisper secrets of the Shattering. Shadows move where light should be.',
    emoji: '🌲',
    color: 0x2D5016,
    unlockLevel: 1
  },
  {
    id: 2,
    name: 'Ashen Peaks',
    levelRange: [6, 15],
    theme: 'Lava mountains',
    description: 'Volcanic peaks where molten corruption flows like rivers of despair.',
    emoji: '🌋',
    color: 0xFF4500,
    unlockLevel: 6
  },
  {
    id: 3,
    name: 'Void Marsh',
    levelRange: [16, 25],
    theme: 'Shadow swamp',
    description: 'A marsh consumed by void energy. Reality bends and breaks here.',
    emoji: '🌫️',
    color: 0x4A0E4E,
    unlockLevel: 16
  },
  {
    id: 4,
    name: 'Crystal Depths',
    levelRange: [26, 35],
    theme: 'Crystal caverns',
    description: 'Crystalline caves that sing with corrupted Ether. Beautiful and deadly.',
    emoji: '💎',
    color: 0x00CED1,
    unlockLevel: 26
  },
  {
    id: 5,
    name: 'Frozen Vale',
    levelRange: [36, 50],
    theme: 'Ice wasteland',
    description: 'An eternal winter grips this realm. Time itself seems frozen.',
    emoji: '❄️',
    color: 0x87CEEB,
    unlockLevel: 36
  },
  {
    id: 6,
    name: 'Skybreak Ruins',
    levelRange: [51, 70],
    theme: 'Floating islands',
    description: 'Shattered islands suspended in void. Gravity is merely a suggestion.',
    emoji: '☁️',
    color: 0x9D4EDD,
    unlockLevel: 51
  },
  {
    id: 7,
    name: 'Eclipse Nexus',
    levelRange: [71, 100],
    theme: 'Final realm',
    description: 'Where reality shattered. The Eclipsed Monarch awaits.',
    emoji: '🌑',
    color: 0x000000,
    unlockLevel: 71
  }
];

export const LEGACIES = [
  {
    id: 'void_reaver',
    name: 'Void Reaver',
    description: 'Shadow assassin wielding darkness itself',
    emoji: '🗡️',
    bonuses: {
      attack: 1.10,
      breakChance: 0.08,
      phaseChance: 0.05
    },
    passive: {
      name: 'Shadow Strike',
      description: 'Free Break Hit every 5 turns',
      trigger: 'every_5_turns'
    }
  },
  {
    id: 'aethermancer',
    name: 'Aethermancer',
    description: 'Master of magical burst damage',
    emoji: '🔮',
    bonuses: {
      breakDamage: 1.12,
      fortuneFlux: 1.10
    },
    passive: {
      name: 'Aether Shield',
      description: '10% damage absorption',
      trigger: 'on_damage_taken'
    }
  },
  {
    id: 'dread_sentinel',
    name: 'Dread Sentinel',
    description: 'Unstoppable tank and bruiser',
    emoji: '🛡️',
    bonuses: {
      hp: 1.20,
      defense: 1.15
    },
    passive: {
      name: 'Fortress',
      description: '5% damage reduction',
      trigger: 'always'
    }
  },
  {
    id: 'starborn_ranger',
    name: 'Starborn Ranger',
    description: 'Precision strikes from the shadows',
    emoji: '🏹',
    bonuses: {
      breakChance: 0.08,
      accuracy: 1.10,
      expeditionLoot: 1.10
    },
    passive: {
      name: 'Eagle Eye',
      description: '+10% expedition loot',
      trigger: 'on_expedition'
    }
  },
  {
    id: 'chrono_guardian',
    name: 'Chrono Guardian',
    description: 'Support survivability through time manipulation',
    emoji: '⏳',
    bonuses: {
      hp: 1.05,
      breakChance: 0.05,
      phaseChance: 0.05
    },
    passive: {
      name: 'Time Mend',
      description: 'Heal 5% HP after each combat',
      trigger: 'after_combat'
    }
  }
];

export const WEAPON_CATEGORIES = [
  'Shadowblade',
  'Aether Staff',
  'Rift Dagger',
  'Astral Bow',
  'Celestial Cleaver',
  'Dark Grimoire',
  'Sigil Spear'
];

export const RARITIES = {
  Common: { multiplier: 1.0, color: 0x9E9E9E, emoji: '⚪' },
  Uncommon: { multiplier: 1.15, color: 0x4CAF50, emoji: '🟢' },
  Rare: { multiplier: 1.30, color: 0x2196F3, emoji: '🔵' },
  Epic: { multiplier: 1.50, color: 0x9C27B0, emoji: '🟣' },
  Legendary: { multiplier: 1.80, color: 0xFFD700, emoji: '🟡' },
  Mythic: { multiplier: 2.10, color: 0xFF6B6B, emoji: '🔴' },
  Celestial: { multiplier: 2.40, color: 0x00D9FF, emoji: '✨' }
};

export const COMPANION_FAMILIES = [
  {
    id: 'flame_cub',
    name: 'Flame Cub',
    emoji: '🔥',
    passive: '+5% Attack',
    active: 'Burn (deals DoT over 3 turns)',
    activePower: 0.15
  },
  {
    id: 'frostling',
    name: 'Frostling',
    emoji: '❄️',
    passive: '+5% Phase Chance',
    active: 'Freeze (skip next enemy turn)',
    activePower: 0.20
  },
  {
    id: 'wraith_sprite',
    name: 'Wraith Sprite',
    emoji: '👻',
    passive: '+8% Break Chance',
    active: 'Haunt (reduce enemy defense 20%)',
    activePower: 0.20
  },
  {
    id: 'night_howler',
    name: 'Night Howler',
    emoji: '🐺',
    passive: '+10% HP',
    active: 'Howl (boost attack 25% for 2 turns)',
    activePower: 0.25
  },
  {
    id: 'aether_wisp',
    name: 'Aether Wisp',
    emoji: '💫',
    passive: '+10% Fortune Flux',
    active: 'Luck Burst (guarantee next loot is higher rarity)',
    activePower: 1.0
  },
  {
    id: 'stone_tusk',
    name: 'Stone Tusk',
    emoji: '🦣',
    passive: '+15% Defense',
    active: 'Stone Wall (block 50% damage next hit)',
    activePower: 0.50
  },
  {
    id: 'shadow_raven',
    name: 'Shadow Raven',
    emoji: '🦅',
    passive: '+5% Phase Chance, +3% Break Chance',
    active: 'Shadow Strike (guaranteed critical)',
    activePower: 1.5
  }
];

export const RESOURCES = [
  { id: 'emberbery', name: 'Emberberry', emoji: '🔴', rarity: 'Common' },
  { id: 'void_lotus', name: 'Void Lotus', emoji: '🌸', rarity: 'Rare' },
  { id: 'wraith_mushroom', name: 'Wraith Mushroom', emoji: '🍄', rarity: 'Uncommon' },
  { id: 'starroot', name: 'Starroot', emoji: '⭐', rarity: 'Epic' },
  { id: 'crystal_vine', name: 'Crystal Vine', emoji: '💠', rarity: 'Rare' },
  { id: 'nightbloom_herb', name: 'Nightbloom Herb', emoji: '🌿', rarity: 'Common' },
  { id: 'rune_fossil', name: 'Rune Fossil', emoji: '🗿', rarity: 'Epic' },
  { id: 'astral_seed', name: 'Astral Seed', emoji: '✨', rarity: 'Legendary' }
];

export const FRACTURE_TIERS = [
  { tier: 1, name: 'F1: Fractured Echo', level: 5, guaranteedRarity: 'Rare', legendaryChance: 0 },
  { tier: 2, name: 'F2: Void Rift', level: 15, guaranteedRarity: 'Rare', legendaryChance: 0 },
  { tier: 3, name: 'F3: Shadow Gate', level: 25, guaranteedRarity: 'Epic', legendaryChance: 0 },
  { tier: 4, name: 'F4: Ether Breach', level: 40, guaranteedRarity: 'Epic', legendaryChance: 0.10 },
  { tier: 5, name: 'F5: Chaos Nexus', level: 55, guaranteedRarity: 'Epic', legendaryChance: 0.10 },
  { tier: 6, name: 'F6: Abyss Maw', level: 70, guaranteedRarity: 'Legendary', legendaryChance: 1.0 },
  { tier: 7, name: 'F7: Oblivion Core', level: 85, guaranteedRarity: 'Legendary', legendaryChance: 1.0 }
];

export const PVP_RANKS = [
  { id: 'bronze', name: 'Bronze', minElo: 0, maxElo: 999, emoji: '🥉', color: 0xCD7F32 },
  { id: 'silver', name: 'Silver', minElo: 1000, maxElo: 1499, emoji: '🥈', color: 0xC0C0C0 },
  { id: 'gold', name: 'Gold', minElo: 1500, maxElo: 1999, emoji: '🥇', color: 0xFFD700 },
  { id: 'platinum', name: 'Platinum', minElo: 2000, maxElo: 2499, emoji: '💎', color: 0xE5E4E2 },
  { id: 'diamond', name: 'Diamond', minElo: 2500, maxElo: 2999, emoji: '💠', color: 0x00CED1 },
  { id: 'ascendant', name: 'Ascendant', minElo: 3000, maxElo: 3499, emoji: '⭐', color: 0x9D4EDD },
  { id: 'eternal', name: 'Eternal', minElo: 3500, maxElo: 999999, emoji: '🌑', color: 0x000000 }
];

export const COOLDOWNS = {
  expedition: 0,
  forage: 0,
  fracture: 90000,
  pvp: 60000,
  riftFlip: 10000,
  riftRoll: 10000,
  riftSpin: 10000,
  social: 5000
};

export const STAMINA_CONFIG = {
  max: 100,
  regenPerMinute: 1,
  costs: {
    expedition: 10,
    forage: 5
  }
};

export const REALMSHATTER_COLORS = {
  primary: 0x9D4EDD,
  secondary: 0x00D9FF,
  crimson: 0xFF006E,
  success: 0x06FFA5,
  error: 0xFF0054,
  dark: 0x1a1a2e,
  void: 0x16213e,
  ether: 0x0f3460
};

export const EMOJIS = {
  realm: '🌑',
  sigil: '⚔️',
  aegis: '🛡️',
  companion: '🐾',
  luminite: '💰',
  shard: '💠',
  energy: '⚡',
  hp: '❤️',
  attack: '⚔️',
  defense: '🛡️',
  break: '💥',
  phase: '👻',
  fortune: '🍀',
  level: '📊',
  fracture: '🕳️',
  pvp: '⚔️',
  rift: '🎰'
};

export const REALMSHATTER_CONFIG = {
  realms: Object.fromEntries(REALMS.map(r => [r.id, r])),
  legacies: Object.fromEntries(LEGACIES.map(l => [l.id, l])),
  weaponCategories: WEAPON_CATEGORIES,
  rarities: RARITIES,
  companionFamilies: Object.fromEntries(COMPANION_FAMILIES.map(c => [c.id, c])),
  resources: Object.fromEntries(RESOURCES.map(r => [r.id, r])),
  fractureTiers: FRACTURE_TIERS,
  pvpRanks: PVP_RANKS,
  cooldowns: COOLDOWNS,
  staminaConfig: STAMINA_CONFIG,
  colors: REALMSHATTER_COLORS,
  emojis: EMOJIS
};
