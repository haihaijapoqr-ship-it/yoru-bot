import { getUser, updateUser } from '../utils/rpg-database.js';
import { createDarkFantasyEmbed } from '../utils/realmshatter-embeds.js';
import { REALMS, EMOJIS, REALMSHATTER_COLORS } from '../data/realmshatter-config.js';

export async function handleRealmInfo(message, args) {
  if (!args || args.length === 0) {
    return message.reply(`${EMOJIS.error} Please specify a realm! Usage: \`/realm info <number or name>\``);
  }
  
  const query = args.join(' ').toLowerCase();
  let realm = null;
  
  const realmNumber = parseInt(query);
  if (realmNumber && realmNumber >= 1 && realmNumber <= REALMS.length) {
    realm = REALMS[realmNumber - 1];
  } else {
    realm = REALMS.find(r => r.name.toLowerCase().includes(query));
  }
  
  if (!realm) {
    return message.reply(`${EMOJIS.error} Realm not found! Use \`/realms\` to see all realms.`);
  }
  
  const user = getUser(message.author.id);
  const unlocked = user.level >= realm.unlockLevel;
  const isCurrent = user.currentRealm === realm.id;
  
  let description = `${realm.emoji} **${realm.name}**\n\n`;
  description += `*${realm.description}*\n\n`;
  
  description += `**Details:**\n`;
  description += `• Level Range: **${realm.levelRange[0]}-${realm.levelRange[1]}**\n`;
  description += `• Unlock Level: **${realm.unlockLevel}**\n`;
  description += `• Status: ${unlocked ? '🔓 Unlocked' : `🔒 Locked (Requires Lv${realm.unlockLevel})`}\n`;
  if (isCurrent) {
    description += `• **[CURRENT REALM]**\n`;
  }
  description += `\n`;
  
  description += `**Features:**\n`;
  description += `• Unique enemies and loot drops\n`;
  description += `• Realm-specific crafting resources\n`;
  description += `• Special companions\n`;
  description += `• Progressive difficulty\n\n`;
  
  if (unlocked && !isCurrent) {
    description += `Use \`/realm travel ${realm.id}\` to travel here!\n`;
  } else if (!unlocked) {
    description += `*Level up to unlock this realm!*\n`;
  }
  
  const embed = createDarkFantasyEmbed(
    `${realm.emoji} ${realm.name}`,
    description,
    REALMSHATTER_COLORS.realm
  );
  
  await message.reply({ embeds: [embed] });
}

export async function handleRealmTravel(message, args) {
  const user = getUser(message.author.id);
  
  if (!args || args.length === 0) {
    return message.reply(`${EMOJIS.error} Please specify a realm! Usage: \`/realm travel <number or name>\``);
  }
  
  const query = args.join(' ').toLowerCase();
  let realm = null;
  
  const realmNumber = parseInt(query);
  if (realmNumber && realmNumber >= 1 && realmNumber <= REALMS.length) {
    realm = REALMS[realmNumber - 1];
  } else {
    realm = REALMS.find(r => r.name.toLowerCase().includes(query));
  }
  
  if (!realm) {
    return message.reply(`${EMOJIS.error} Realm not found! Use \`/realms\` to see all realms.`);
  }
  
  if (user.level < realm.unlockLevel) {
    return message.reply(
      `${EMOJIS.error} You need to be **Level ${realm.unlockLevel}** to travel to ${realm.name}! ` +
      `(You are Level ${user.level})`
    );
  }
  
  if (user.currentRealm === realm.id) {
    return message.reply(`${EMOJIS.error} You are already in ${realm.emoji} **${realm.name}**!`);
  }
  
  updateUser(message.author.id, { currentRealm: realm.id });
  
  let description = `${realm.emoji} You have traveled to **${realm.name}**!\n\n`;
  description += `*${realm.description}*\n\n`;
  description += `**Realm Info:**\n`;
  description += `• Level Range: ${realm.levelRange[0]}-${realm.levelRange[1]}\n`;
  description += `• Your Level: ${user.level}\n\n`;
  description += `Use \`/expedition\` to explore this realm!\n`;
  
  const embed = createDarkFantasyEmbed(
    `${EMOJIS.realm} Realm Travel Complete`,
    description,
    REALMSHATTER_COLORS.success
  );
  
  await message.reply({ embeds: [embed] });
}
