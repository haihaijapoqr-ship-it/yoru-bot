import { Client, GatewayIntentBits } from 'discord.js';
import { handleSocialCommand, socialCommands } from './commands/social.js';
import { handleStart, handleProfile, handleLegacy, handleRealms, handleStory } from './commands/rpg-core.js';
import { handleExpedition, handleForage } from './commands/rpg-expedition.js';
import { handleInventory, handleEquip } from './commands/rpg-inventory.js';
import { handleSummon, handleSummonChoice, handleCompanions, handleActivate, handleTrain } from './commands/rpg-companion.js';
import { handleUpgrade } from './commands/rpg-upgrade.js';
import { handleFracture } from './commands/rpg-fracture.js';
import { handleDuel, handlePvPRank } from './commands/rpg-pvp.js';
import { handleFlip, handleRoll, handleSlots } from './commands/rpg-rift.js';
import { handleShop, handleBuy, handleSell } from './commands/rpg-shop.js';
import { handleCraft } from './commands/rpg-craft.js';
import { handleBoss } from './commands/rpg-boss.js';
import { handleHelp } from './commands/rpg-help.js';
import { handleSlashCommand } from './commands/slashHandlers.js';
import { handleStats, handleBalance, handleStamina, handleResources, handleBackpack, handlePing } from './commands/rpg-utility.js';
import { handleDaily } from './commands/rpg-daily.js';
import { handleRealmInfo, handleRealmTravel } from './commands/rpg-realms.js';
import { handleGuide, handleLore, handleBestiary } from './commands/rpg-info.js';
import { config } from './config.js';
import { EMOJIS } from './data/realmshatter-config.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  console.log(`${config.emojis.moon} Yoru bot is online!`);
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Client ID: ${client.user.id}`);
  console.log(`Serving ${client.guilds.cache.size} servers`);
  client.user.setActivity('/help | yoru help | RealmShatter RPG', { type: 'PLAYING' });
  
  console.log('\n🔄 Registering slash commands...');
  await registerSlashCommands(client);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await handleSlashCommand(interaction);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    if (socialCommands.includes(command)) {
      await handleSocialCommand(message, args, command);
    }
    else if (command === 'start') {
      await handleStart(message);
    }
    else if (command === 'profile' || command === 'p') {
      await handleProfile(message);
    }
    else if (command === 'legacy') {
      await handleLegacy(message, args);
    }
    else if (command === 'realms') {
      await handleRealms(message);
    }
    else if (command === 'story') {
      await handleStory(message);
    }
    else if (command === 'expedition' || command === 'exp') {
      await handleExpedition(message);
    }
    else if (command === 'forage' || command === 'gather') {
      await handleForage(message);
    }
    else if (command === 'inventory' || command === 'inv') {
      await handleInventory(message, args);
    }
    else if (command === 'equip') {
      await handleEquip(message, args);
    }
    else if (command === 'summon') {
      if (args.length === 0) {
        await handleSummon(message);
      } else {
        await handleSummonChoice(message, args);
      }
    }
    else if (command === 'companions' || command === 'comp') {
      await handleCompanions(message);
    }
    else if (command === 'activate') {
      await handleActivate(message, args);
    }
    else if (command === 'train') {
      await handleTrain(message);
    }
    else if (command === 'upgrade') {
      await handleUpgrade(message, args);
    }
    else if (command === 'fracture' || command === 'frac') {
      await handleFracture(message, args);
    }
    else if (command === 'duel') {
      await handleDuel(message, args);
    }
    else if (command === 'rank' || command === 'pvp') {
      await handlePvPRank(message);
    }
    else if (command === 'flip') {
      await handleFlip(message, args);
    }
    else if (command === 'roll') {
      await handleRoll(message, args);
    }
    else if (command === 'slots') {
      await handleSlots(message, args);
    }
    else if (command === 'shop') {
      await handleShop(message);
    }
    else if (command === 'buy') {
      await handleBuy(message, args);
    }
    else if (command === 'sell') {
      await handleSell(message, args);
    }
    else if (command === 'craft') {
      await handleCraft(message, args);
    }
    else if (command === 'boss') {
      await handleBoss(message);
    }
    else if (command === 'help' || command === 'h') {
      await handleHelp(message);
    }
    else if (command === 'stats') {
      await handleStats(message);
    }
    else if (command === 'balance' || command === 'wallet') {
      await handleBalance(message);
    }
    else if (command === 'stamina') {
      await handleStamina(message);
    }
    else if (command === 'resources') {
      await handleResources(message);
    }
    else if (command === 'backpack') {
      await handleBackpack(message);
    }
    else if (command === 'ping') {
      await handlePing(message);
    }
    else if (command === 'daily') {
      await handleDaily(message);
    }
    else if (command === 'realm') {
      if (args.length > 0 && args[0] === 'info') {
        await handleRealmInfo(message, args.slice(1));
      } else if (args.length > 0 && args[0] === 'travel') {
        await handleRealmTravel(message, args.slice(1));
      } else {
        message.reply(`${EMOJIS.error} Usage: \`yoru realm info <name>\` or \`yoru realm travel <name>\``);
      }
    }
    else if (command === 'guide') {
      await handleGuide(message);
    }
    else if (command === 'lore') {
      await handleLore(message, args);
    }
    else if (command === 'bestiary') {
      await handleBestiary(message, args);
    }
    else {
      message.reply(`${EMOJIS.realm} Unknown command! Use \`yoru help\` to see available commands.`);
    }
  } catch (error) {
    console.error(`Error executing command ${command}:`, error);
    message.reply('❌ An error occurred while executing that command. Please try again later.');
  }
});

async function registerSlashCommands(client) {
  const { REST, Routes, ApplicationCommandOptionType } = await import('discord.js');
  
  const commands = [
    { name: 'start', description: '🌑 Begin your journey in RealmShatter' },
    { name: 'help', description: '📖 Show all available commands' },
    { name: 'profile', description: '📊 View your stats, level, and equipment' },
    {
      name: 'legacy',
      description: '🎭 Choose your Legacy (class): Void Reaver, Aethermancer, Dread Sentinel, Ranger, Guardian',
      options: [{
        name: 'number',
        description: 'Legacy: 1=Void Reaver 2=Aethermancer 3=Dread Sentinel 4=Ranger 5=Guardian',
        type: ApplicationCommandOptionType.Integer,
        required: false,
        min_value: 1,
        max_value: 5
      }]
    },
    { name: 'realms', description: '🌑 View the seven shattered realms' },
    { name: 'story', description: '📖 Learn the lore of the Shattering' },
    { name: 'expedition', description: '🗺️ Explore realms for loot (10 stamina)' },
    { name: 'forage', description: '🌿 Gather crafting resources (5 stamina)' },
    { name: 'inventory', description: '🎒 View your weapons, armor, and resources' },
    {
      name: 'equip',
      description: '⚔️ Equip gear from your inventory',
      options: [{
        name: 'type',
        description: 'weapon or armor',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Weapon', value: 'weapon' },
          { name: 'Armor', value: 'armor' }
        ]
      },
      {
        name: 'number',
        description: 'Item number from your inventory',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }]
    },
    {
      name: 'summon',
      description: '✨ Summon a companion',
      options: [{
        name: 'number',
        description: 'Companion family number',
        type: ApplicationCommandOptionType.Integer,
        required: false
      }]
    },
    { name: 'companions', description: '🐾 View your companions' },
    {
      name: 'activate',
      description: '💫 Activate a companion',
      options: [{
        name: 'number',
        description: 'Companion number',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }]
    },
    { name: 'train', description: '⚔️ Train your active companion' },
    {
      name: 'upgrade',
      description: '⬆️ Upgrade equipment',
      options: [{
        name: 'type',
        description: 'weapon or armor',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Weapon', value: 'weapon' },
          { name: 'Armor', value: 'armor' }
        ]
      },
      {
        name: 'number',
        description: 'Item number from inventory',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }]
    },
    {
      name: 'fracture',
      description: '🌀 Enter a Fracture dungeon',
      options: [{
        name: 'tier',
        description: 'Fracture tier (F1-F7)',
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
          { name: 'F1 - Ember Fracture', value: 'F1' },
          { name: 'F2 - Void Fracture', value: 'F2' },
          { name: 'F3 - Astral Fracture', value: 'F3' },
          { name: 'F4 - Chaos Fracture', value: 'F4' },
          { name: 'F5 - Eternal Fracture', value: 'F5' },
          { name: 'F6 - Abyss Fracture', value: 'F6' },
          { name: 'F7 - Eclipse Fracture', value: 'F7' }
        ]
      }]
    },
    {
      name: 'duel',
      description: '⚔️ Challenge a player to PvP',
      options: [{
        name: 'user',
        description: 'Player to duel',
        type: ApplicationCommandOptionType.User,
        required: true
      }]
    },
    { name: 'rank', description: '🏆 View your PvP ranking' },
    {
      name: 'flip',
      description: '🎰 Rift Flip - Bet on coin flip',
      options: [{
        name: 'choice',
        description: 'heads or tails',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        ]
      },
      {
        name: 'amount',
        description: 'Luminite to bet (10-1000)',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 10,
        max_value: 1000
      }]
    },
    {
      name: 'roll',
      description: '🎲 Ether Roll - Roll above 50 to win',
      options: [{
        name: 'amount',
        description: 'Luminite to bet (10-1000)',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 10,
        max_value: 1000
      }]
    },
    {
      name: 'slots',
      description: '🎰 Shadow Slots - Match 3 symbols',
      options: [{
        name: 'amount',
        description: 'Luminite to bet (10-1000)',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 10,
        max_value: 1000
      }]
    },
    { name: 'shop', description: '🏪 Browse the Shattered Market' },
    {
      name: 'buy',
      description: '💰 Buy from shop',
      options: [{
        name: 'number',
        description: 'Item number',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
        max_value: 4
      }]
    },
    {
      name: 'sell',
      description: '💵 Sell equipment',
      options: [{
        name: 'type',
        description: 'weapon or armor',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Weapon', value: 'weapon' },
          { name: 'Armor', value: 'armor' }
        ]
      },
      {
        name: 'number',
        description: 'Item number from inventory',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }]
    },
    {
      name: 'craft',
      description: '⚒️ Craft items from resources',
      options: [{
        name: 'recipe',
        description: 'Recipe number',
        type: ApplicationCommandOptionType.Integer,
        required: false
      }]
    },
    { name: 'boss', description: '👑 Challenge the Eclipsed Monarch (Lv 100)' },
    { name: 'stats', description: '📊 Detailed breakdown of HP, Attack, Defense, Break, Phase stats' },
    { name: 'balance', description: '💰 View Luminite and Astral Shards' },
    { name: 'stamina', description: '⚡ Check current stamina and regeneration' },
    { name: 'resources', description: '🌿 View your collected crafting materials' },
    { name: 'backpack', description: '🎒 Manage inventory space and upgrades' },
    { name: 'ping', description: '🏓 Check bot response time' },
    { name: 'daily', description: '🎁 Claim daily Luminite and rewards (24hr cooldown)' },
    {
      name: 'realm',
      description: '🌍 Realm management and travel',
      options: [{
        name: 'action',
        description: 'info or travel',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Info', value: 'info' },
          { name: 'Travel', value: 'travel' }
        ]
      },
      {
        name: 'realm',
        description: 'Realm name or number',
        type: ApplicationCommandOptionType.String,
        required: true
      }]
    },
    { name: 'guide', description: '📚 Beginner\'s quick reference guide' },
    {
      name: 'lore',
      description: '📖 Read RealmShatter story chapters',
      options: [{
        name: 'page',
        description: 'Page number (1-5)',
        type: ApplicationCommandOptionType.Integer,
        required: false,
        min_value: 1,
        max_value: 5
      }]
    },
    {
      name: 'bestiary',
      description: '👹 Enemy database by realm',
      options: [{
        name: 'realm',
        description: 'Realm to filter enemies',
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
          { name: 'Abyssal Depths', value: 'abyssal' },
          { name: 'Stormrend Wastes', value: 'storm' },
          { name: 'Infernal Peaks', value: 'infernal' },
          { name: 'Frozen Veil', value: 'frozen' },
          { name: 'Twisted Grove', value: 'twisted' },
          { name: 'Shattered Citadel', value: 'citadel' },
          { name: 'Void Nexus', value: 'void' }
        ]
      }]
    }
  ];

  const socialCommands = [
    'angry', 'baka', 'bite', 'blush', 'bonk', 'bored', 'cry', 'cuddle', 'dance',
    'facepalm', 'feed', 'handhold', 'handshake', 'happy', 'highfive', 'hug',
    'kick', 'kiss', 'laugh', 'lurk', 'nod', 'nom', 'nope', 'pat', 'peck',
    'poke', 'pout', 'punch', 'run', 'shoot', 'shrug', 'slap', 'sleep',
    'smile', 'smug', 'stare', 'think', 'thumbsup', 'tickle', 'wave', 'wink',
    'yawn', 'yeet'
  ];

  const soloActions = ['angry', 'blush', 'bored', 'cry', 'facepalm', 'happy', 'laugh', 'lurk', 'nod', 'nom', 'nope', 'pout', 'run', 'shrug', 'sleep', 'smile', 'smug', 'think', 'thumbsup', 'yawn'];

  socialCommands.forEach(action => {
    const isSolo = soloActions.includes(action);
    const cmd = {
      name: action,
      description: `💞 ${action.charAt(0).toUpperCase() + action.slice(1)} ${isSolo ? '(solo action)' : 'with someone'}`
    };
    
    if (!isSolo) {
      cmd.options = [{
        name: 'user',
        description: 'User to interact with',
        type: ApplicationCommandOptionType.User,
        required: true
      }];
    }
    
    commands.push(cmd);
  });

  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log(`✅ Successfully registered ${data.length} slash (/) commands!`);
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
}

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error('❌ Error: DISCORD_BOT_TOKEN is not set in environment variables!');
  console.log('Please add your Discord bot token as a secret.');
  process.exit(1);
}

client.login(token).catch(error => {
  console.error('❌ Failed to login:', error.message);
  process.exit(1);
});
