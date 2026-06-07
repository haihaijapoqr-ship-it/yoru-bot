const cooldowns = new Map();

export function setCooldown(userId, commandName, duration) {
  const key = `${userId}-${commandName}`;
  cooldowns.set(key, Date.now() + duration);
}

export function getCooldown(userId, commandName) {
  const key = `${userId}-${commandName}`;
  const expiry = cooldowns.get(key);
  
  if (!expiry || Date.now() >= expiry) {
    cooldowns.delete(key);
    return 0;
  }
  
  return Math.ceil((expiry - Date.now()) / 1000);
}

export function clearExpiredCooldowns() {
  const now = Date.now();
  for (const [key, expiry] of cooldowns.entries()) {
    if (now >= expiry) {
      cooldowns.delete(key);
    }
  }
}

setInterval(clearExpiredCooldowns, 60000);
