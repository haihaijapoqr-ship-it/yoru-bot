export const config = {
  prefix: 'yoru',
  colors: {
    primary: 0x9D4EDD,
    secondary: 0x00D9FF,
    pink: 0xFF006E,
    success: 0x06FFA5,
    error: 0xFF0054
  },
  emojis: {
    moon: '🌙',
    terminal: '💻',
    energy: '⚡',
    credits: '₿',
    fragment: '💠',
    heart: '💞',
    level: '📊',
    inventory: '🎒'
  },
  cooldowns: {
    social: 5000,
    hack: 10000,
    scan: 15000,
    work: 20000,
    daily: 86400000
  }
};

export const weapons = [
  { name: 'Neon Dagger', rarity: 'Common', attack: 2, price: 100, emoji: '🗡️' },
  { name: 'Data Blade', rarity: 'Common', attack: 3, price: 150, emoji: '⚔️' },
  { name: 'Cyber Katana', rarity: 'Rare', attack: 5, price: 300, emoji: '🔪' },
  { name: 'Plasma Sword', rarity: 'Rare', attack: 6, price: 400, emoji: '⚡' },
  { name: 'Phantom Blade', rarity: 'Epic', attack: 10, price: 800, emoji: '👻' },
  { name: 'Void Slicer', rarity: 'Epic', attack: 12, price: 1000, emoji: '🌌' },
  { name: "Yoru's Edge", rarity: 'Legendary', attack: 20, price: 2500, emoji: '🌙' },
  { name: 'Infinity Breaker', rarity: 'Legendary', attack: 25, price: 3500, emoji: '♾️' }
];

export const jobs = [
  { name: 'Debug Code', reward: [50, 100], messages: ['You debugged some legacy code.', 'Fixed a critical bug in the mainframe.'] },
  { name: 'Data Mining', reward: [75, 150], messages: ['You mined valuable data streams.', 'Extracted precious information from the net.'] },
  { name: 'Firewall Patrol', reward: [40, 80], messages: ['You patrolled the firewall perimeter.', 'Kept the systems safe from intruders.'] },
  { name: 'System Maintenance', reward: [60, 120], messages: ['You performed routine maintenance.', 'Optimized server performance.'] },
  { name: 'Bounty Hunting', reward: [100, 200], messages: ['You captured a rogue AI!', 'Completed a high-stakes bounty mission.'] }
];
