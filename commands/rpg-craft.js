import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';
import { REALMSHATTER_CONFIG } from '../data/realmshatter-config.js';

const EMOJIS = {
  craft: '⚒️',
  error: '❌',
  success: '✅'
};

export async function handleCraft(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.error} You must choose a Legacy first!`);
  }

  if (!args[0]) {
    let description = '**Craft powerful items using resources!**\n\n';
    
    description += '**Available Recipes:**\n\n';
    description += '1. **Astral Shard** (300 💎)\n' +
      '   Resources: 10 🌿 Void Essence, 5 🔮 Ether Fragment\n\n';
    description += '2. **Fracture Key** (500 💎)\n' +
      '   Resources: 15 🌿 Void Essence, 10 🔮 Ether Fragment, 3 🌟 Astral Shards\n\n';

    description += '**Your Resources:**\n';
    for (const [key, value] of Object.entries(user.craftingMaterials)) {
      const resource = Object.values(REALMSHATTER_CONFIG.resources).find(r => r.id === key);
      if (resource) {
        description += `${resource.emoji} ${resource.name}: ${value}\n`;
      }
    }

    description += `\n💎 Luminite: ${user.luminite}\n`;
    description += `\n**Usage:** \`/craft <number>\``;

    const embed = createRPGEmbed(
      `${EMOJIS.craft} Crafting System`,
      description,
      'secondary'
    );

    return message.reply({ embeds: [embed] });
  }

  const choice = parseInt(args[0]);

  if (choice === 1) {
    const cost = 300;
    const voidCost = 10;
    const etherCost = 5;

    if (user.luminite < cost) {
      return message.reply(`${EMOJIS.error} You need ${cost} 💎 Luminite!`);
    }

    if ((user.craftingMaterials['void_essence'] || 0) < voidCost) {
      return message.reply(`${EMOJIS.error} You need ${voidCost} 🌿 Void Essence!`);
    }

    if ((user.craftingMaterials['ether_fragment'] || 0) < etherCost) {
      return message.reply(`${EMOJIS.error} You need ${etherCost} 🔮 Ether Fragment!`);
    }

    user.luminite -= cost;
    user.craftingMaterials['void_essence'] -= voidCost;
    user.craftingMaterials['ether_fragment'] -= etherCost;
    user.astralShards++;

    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.success} Crafted Successfully!`,
      `You crafted 1 🌟 **Astral Shard**!\n\n` +
      `Total Astral Shards: ${user.astralShards}`,
      'success'
    );

    await message.reply({ embeds: [embed] });
  }
  else if (choice === 2) {
    const cost = 500;
    const voidCost = 15;
    const etherCost = 10;
    const shardCost = 3;

    if (user.luminite < cost) {
      return message.reply(`${EMOJIS.error} You need ${cost} 💎 Luminite!`);
    }

    if ((user.craftingMaterials['void_essence'] || 0) < voidCost) {
      return message.reply(`${EMOJIS.error} You need ${voidCost} 🌿 Void Essence!`);
    }

    if ((user.craftingMaterials['ether_fragment'] || 0) < etherCost) {
      return message.reply(`${EMOJIS.error} You need ${etherCost} 🔮 Ether Fragment!`);
    }

    if (user.astralShards < shardCost) {
      return message.reply(`${EMOJIS.error} You need ${shardCost} 🌟 Astral Shards!`);
    }

    user.luminite -= cost;
    user.craftingMaterials['void_essence'] -= voidCost;
    user.craftingMaterials['ether_fragment'] -= etherCost;
    user.astralShards -= shardCost;
    user.fractureKeys++;

    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.success} Crafted Successfully!`,
      `You crafted 1 🗝️ **Fracture Key**!\n\n` +
      `Total Fracture Keys: ${user.fractureKeys}`,
      'success'
    );

    await message.reply({ embeds: [embed] });
  }
  else {
    return message.reply(`${EMOJIS.error} Invalid recipe number!`);
  }
}
