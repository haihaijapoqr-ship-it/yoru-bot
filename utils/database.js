const users = new Map();

export function getUser(userId) {
  if (!users.has(userId)) {
    users.set(userId, createNewUser(userId));
  }
  return users.get(userId);
}

export function createNewUser(userId) {
  return {
    userId,
    credits: 100,
    fragments: 0,
    energy: 10,
    level: 1,
    xp: 0,
    emotionXP: 0,
    inventory: [],
    equipped: null,
    lastDaily: 0,
    lastWork: 0,
    lastHack: 0,
    lastScan: 0
  };
}

export function updateUser(userId, updates) {
  const user = getUser(userId);
  Object.assign(user, updates);
  users.set(userId, user);
  return user;
}

export function addXP(userId, amount) {
  const user = getUser(userId);
  user.xp += amount;
  
  const xpNeeded = user.level * 100;
  if (user.xp >= xpNeeded) {
    user.level += 1;
    user.xp -= xpNeeded;
    return { leveledUp: true, newLevel: user.level };
  }
  
  updateUser(userId, user);
  return { leveledUp: false };
}

export function addEmotionXP(userId, amount) {
  const user = getUser(userId);
  user.emotionXP += amount;
  updateUser(userId, user);
}

export function addCredits(userId, amount) {
  const user = getUser(userId);
  user.credits += amount;
  updateUser(userId, user);
}

export function addFragments(userId, amount) {
  const user = getUser(userId);
  user.fragments += amount;
  updateUser(userId, user);
}

export function addToInventory(userId, item) {
  const user = getUser(userId);
  user.inventory.push(item);
  updateUser(userId, user);
}

export function removeFromInventory(userId, itemName) {
  const user = getUser(userId);
  const index = user.inventory.indexOf(itemName);
  if (index > -1) {
    user.inventory.splice(index, 1);
    updateUser(userId, user);
    return true;
  }
  return false;
}

export function getAllUsers() {
  return Array.from(users.values());
}
