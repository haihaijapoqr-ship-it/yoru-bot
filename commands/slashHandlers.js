import { EmbedBuilder } from 'discord.js';
import { handleSocialCommand } from './social.js';
import { handleStart, handleProfile, handleLegacy, handleRealms, handleStory } from './rpg-core.js';
import { handleExpedition, handleForage } from './rpg-expedition.js';
import { handleInventory, handleEquip } from './rpg-inventory.js';
import { handleSummon, handleSummonChoice, handleCompanions, handleActivate, handleTrain } from './rpg-companion.js';
import { handleUpgrade } from './rpg-upgrade.js';
import { handleFracture } from './rpg-fracture.js';
import { handleDuel, handlePvPRank } from './rpg-pvp.js';
import { handleFlip, handleRoll, handleSlots } from './rpg-rift.js';
import { handleShop, handleBuy, handleSell } from './rpg-shop.js';
import { handleCraft } from './rpg-craft.js';
import { handleBoss } from './rpg-boss.js';
import { handleHelp } from './rpg-help.js';
import { handleStats, handleBalance, handleStamina, handleResources, handleBackpack, handlePing } from './rpg-utility.js';
import { handleDaily } from './rpg-daily.js';
import { handleRealmInfo, handleRealmTravel } from './rpg-realms.js';
import { handleGuide, handleLore, handleBestiary } from './rpg-info.js';

export async function handleSlashCommand(interaction) {
  const commandName = interaction.commandName;

  try {
    await interaction.deferReply();

    const mockMessage = createMockMessage(interaction);

    const socialActions = [
      'angry', 'baka', 'bite', 'blush', 'bonk', 'bored', 'cry', 'cuddle', 'dance',
      'facepalm', 'feed', 'handhold', 'handshake', 'happy', 'highfive', 'hug',
      'kick', 'kiss', 'laugh', 'lurk', 'nod', 'nom', 'nope', 'pat', 'peck',
      'poke', 'pout', 'punch', 'run', 'shoot', 'shrug', 'slap', 'sleep',
      'smile', 'smug', 'stare', 'think', 'thumbsup', 'tickle', 'wave', 'wink',
      'yawn', 'yeet'
    ];

    if (socialActions.includes(commandName)) {
      const targetUser = interaction.options.getUser('user');
      const args = targetUser ? [targetUser] : [];
      await handleSocialCommand(mockMessage, args, commandName);
    }
    else if (commandName === 'start') {
      await handleStart(mockMessage);
    }
    else if (commandName === 'profile') {
      await handleProfile(mockMessage);
    }
    else if (commandName === 'legacy') {
      const legacyNumber = interaction.options.getInteger('number');
      await handleLegacy(mockMessage, legacyNumber ? [legacyNumber.toString()] : []);
    }
    else if (commandName === 'realms') {
      await handleRealms(mockMessage);
    }
    else if (commandName === 'story') {
      await handleStory(mockMessage);
    }
    else if (commandName === 'expedition') {
      await handleExpedition(mockMessage);
    }
    else if (commandName === 'forage') {
      await handleForage(mockMessage);
    }
    else if (commandName === 'inventory') {
      await handleInventory(mockMessage, []);
    }
    else if (commandName === 'equip') {
      const type = interaction.options.getString('type');
      const number = interaction.options.getInteger('number');
      await handleEquip(mockMessage, [type, number.toString()]);
    }
    else if (commandName === 'summon') {
      const number = interaction.options.getInteger('number');
      if (number) {
        await handleSummonChoice(mockMessage, [number.toString()]);
      } else {
        await handleSummon(mockMessage);
      }
    }
    else if (commandName === 'companions') {
      await handleCompanions(mockMessage);
    }
    else if (commandName === 'activate') {
      const number = interaction.options.getInteger('number');
      await handleActivate(mockMessage, [number.toString()]);
    }
    else if (commandName === 'train') {
      await handleTrain(mockMessage);
    }
    else if (commandName === 'upgrade') {
      const type = interaction.options.getString('type');
      const number = interaction.options.getInteger('number');
      await handleUpgrade(mockMessage, [type, number.toString()]);
    }
    else if (commandName === 'fracture') {
      const tier = interaction.options.getString('tier');
      await handleFracture(mockMessage, tier ? [tier] : []);
    }
    else if (commandName === 'duel') {
      const user = interaction.options.getUser('user');
      mockMessage.mentions.users.first = () => user;
      await handleDuel(mockMessage, []);
    }
    else if (commandName === 'rank') {
      await handlePvPRank(mockMessage);
    }
    else if (commandName === 'flip') {
      const choice = interaction.options.getString('choice');
      const amount = interaction.options.getInteger('amount');
      await handleFlip(mockMessage, [choice, amount.toString()]);
    }
    else if (commandName === 'roll') {
      const amount = interaction.options.getInteger('amount');
      await handleRoll(mockMessage, [amount.toString()]);
    }
    else if (commandName === 'slots') {
      const amount = interaction.options.getInteger('amount');
      await handleSlots(mockMessage, [amount.toString()]);
    }
    else if (commandName === 'shop') {
      await handleShop(mockMessage);
    }
    else if (commandName === 'buy') {
      const number = interaction.options.getInteger('number');
      await handleBuy(mockMessage, [number.toString()]);
    }
    else if (commandName === 'sell') {
      const type = interaction.options.getString('type');
      const number = interaction.options.getInteger('number');
      await handleSell(mockMessage, [type, number.toString()]);
    }
    else if (commandName === 'craft') {
      const recipe = interaction.options.getInteger('recipe');
      await handleCraft(mockMessage, recipe ? [recipe.toString()] : []);
    }
    else if (commandName === 'boss') {
      await handleBoss(mockMessage);
    }
    else if (commandName === 'help') {
      await handleHelp(mockMessage);
    }
    else if (commandName === 'stats') {
      await handleStats(mockMessage);
    }
    else if (commandName === 'balance') {
      await handleBalance(mockMessage);
    }
    else if (commandName === 'stamina') {
      await handleStamina(mockMessage);
    }
    else if (commandName === 'resources') {
      await handleResources(mockMessage);
    }
    else if (commandName === 'backpack') {
      await handleBackpack(mockMessage);
    }
    else if (commandName === 'ping') {
      await handlePing(mockMessage);
    }
    else if (commandName === 'daily') {
      await handleDaily(mockMessage);
    }
    else if (commandName === 'realm') {
      const action = interaction.options.getString('action');
      const realm = interaction.options.getString('realm');
      if (action === 'info') {
        await handleRealmInfo(mockMessage, [realm]);
      } else if (action === 'travel') {
        await handleRealmTravel(mockMessage, [realm]);
      }
    }
    else if (commandName === 'guide') {
      await handleGuide(mockMessage);
    }
    else if (commandName === 'lore') {
      const page = interaction.options.getInteger('page');
      await handleLore(mockMessage, page ? [page.toString()] : []);
    }
    else if (commandName === 'bestiary') {
      const realm = interaction.options.getString('realm');
      await handleBestiary(mockMessage, realm ? [realm] : []);
    }

    if (!mockMessage.replied) {
      await interaction.editReply({ content: '❌ Command failed to execute properly.' });
    }

  } catch (error) {
    console.error(`Error handling slash command ${commandName}:`, error);
    if (interaction.deferred) {
      await interaction.editReply({ content: '❌ An error occurred while executing this command.' });
    } else {
      await interaction.reply({ content: '❌ An error occurred while executing this command.', ephemeral: true });
    }
  }
}

function createMockMessage(interaction) {
  const targetUser = interaction.options.getUser('user');
  
  const mockMessage = {
    author: interaction.user,
    guild: interaction.guild,
    mentions: {
      users: {
        first: () => targetUser || null
      }
    },
    replied: false,
    reply: async function(content) {
      if (typeof content === 'string') {
        await interaction.editReply({ content });
      } else {
        await interaction.editReply(content);
      }
      mockMessage.replied = true;
    },
    channel: {
      send: async function(content) {
        await interaction.editReply(content);
        mockMessage.replied = true;
        return true;
      }
    }
  };
  
  return mockMessage;
}
