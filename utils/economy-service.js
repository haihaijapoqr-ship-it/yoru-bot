import { getUser, saveUser } from './rpg-database.js';

export function deductCurrency(userId, currencyType, amount) {
  const user = getUser(userId);
  if (user[currencyType] < amount) {
    return { success: false, message: `Not enough ${currencyType}!` };
  }
  user[currencyType] -= amount;
  saveUser(user);
  return { success: true, user };
}

export function addCurrency(userId, currencyType, amount) {
  const user = getUser(userId);
  user[currencyType] += amount;
  saveUser(user);
  return { success: true, user };
}

export function deductStamina(userId, amount) {
  const user = getUser(userId);
  regenerateStamina(user);
  
  if (user.stamina < amount) {
    return { success: false, message: `Not enough stamina! You have ${user.stamina}/100.` };
  }
  
  user.stamina -= amount;
  saveUser(user);
  return { success: true, user };
}

export function regenerateStamina(user) {
  const now = Date.now();
  const timePassed = now - user.lastStaminaRegen;
  const staminaGained = Math.floor(timePassed / 60000);
  
  if (staminaGained > 0) {
    user.stamina = Math.min(100, user.stamina + staminaGained);
    user.lastStaminaRegen = now;
  }
  
  return user;
}

export function canAfford(user, costs) {
  for (const [currency, amount] of Object.entries(costs)) {
    if (user[currency] < amount) {
      return false;
    }
  }
  return true;
}

export function deductMultiple(userId, costs) {
  const user = getUser(userId);
  
  if (!canAfford(user, costs)) {
    return { success: false, message: 'Cannot afford this!' };
  }
  
  for (const [currency, amount] of Object.entries(costs)) {
    user[currency] -= amount;
  }
  
  saveUser(user);
  return { success: true, user };
}
