import { createRPGEmbed } from '../utils/realmshatter-embeds.js';
import { getUser, saveUser } from '../utils/rpg-database.js';

const EMOJIS = {
  rift: '🎰',
  coin: '💎',
  win: '✅',
  lose: '❌'
};

export async function handleFlip(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.lose} You must choose a Legacy first!`);
  }

  if (!args[0] || !args[1]) {
    return message.reply(`${EMOJIS.rift} Usage: \`/flip <heads/tails> <amount>\``);
  }

  const choice = args[0].toLowerCase();
  const bet = parseInt(args[1]);

  if (choice !== 'heads' && choice !== 'tails') {
    return message.reply(`${EMOJIS.lose} Choose 'heads' or 'tails'!`);
  }

  if (isNaN(bet) || bet < 10 || bet > 1000) {
    return message.reply(`${EMOJIS.lose} Bet must be between 10 and 1000 Luminite!`);
  }

  if (user.luminite < bet) {
    return message.reply(`${EMOJIS.lose} You don't have enough Luminite!`);
  }

  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  const won = result === choice;

  if (won) {
    user.luminite += bet;
    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.win} Rift Flip - Victory!`,
      `The coin landed on **${result}**!\n\n` +
      `You won **${bet}** 💎 Luminite!\n` +
      `Balance: ${user.luminite} 💎`,
      'success'
    );
    await message.reply({ embeds: [embed] });
  } else {
    user.luminite -= bet;
    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.lose} Rift Flip - Defeat!`,
      `The coin landed on **${result}**!\n\n` +
      `You lost **${bet}** 💎 Luminite.\n` +
      `Balance: ${user.luminite} 💎`,
      'error'
    );
    await message.reply({ embeds: [embed] });
  }
}

export async function handleRoll(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.lose} You must choose a Legacy first!`);
  }

  if (!args[0]) {
    return message.reply(`${EMOJIS.rift} Usage: \`/roll <amount>\` - Roll above 50 to win 1.8x!`);
  }

  const bet = parseInt(args[0]);

  if (isNaN(bet) || bet < 10 || bet > 1000) {
    return message.reply(`${EMOJIS.lose} Bet must be between 10 and 1000 Luminite!`);
  }

  if (user.luminite < bet) {
    return message.reply(`${EMOJIS.lose} You don't have enough Luminite!`);
  }

  const roll = Math.floor(Math.random() * 100) + 1;
  const won = roll > 50;

  if (won) {
    const winAmount = Math.floor(bet * 0.8);
    user.luminite += winAmount;
    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.win} Ether Roll - Victory!`,
      `You rolled **${roll}**!\n\n` +
      `You won **${winAmount}** 💎 Luminite!\n` +
      `Balance: ${user.luminite} 💎`,
      'success'
    );
    await message.reply({ embeds: [embed] });
  } else {
    user.luminite -= bet;
    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.lose} Ether Roll - Defeat!`,
      `You rolled **${roll}**!\n\n` +
      `You lost **${bet}** 💎 Luminite.\n` +
      `Balance: ${user.luminite} 💎`,
      'error'
    );
    await message.reply({ embeds: [embed] });
  }
}

export async function handleSlots(message, args) {
  const user = getUser(message.author.id);
  
  if (!user.legacy) {
    return message.reply(`${EMOJIS.lose} You must choose a Legacy first!`);
  }

  if (!args[0]) {
    return message.reply(`${EMOJIS.rift} Usage: \`/slots <amount>\` - Match 3 symbols to win big!`);
  }

  const bet = parseInt(args[0]);

  if (isNaN(bet) || bet < 10 || bet > 1000) {
    return message.reply(`${EMOJIS.lose} Bet must be between 10 and 1000 Luminite!`);
  }

  if (user.luminite < bet) {
    return message.reply(`${EMOJIS.lose} You don't have enough Luminite!`);
  }

  const symbols = ['🌑', '💫', '⚔️', '🔮', '👑'];
  const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

  let multiplier = 0;
  if (slot1 === slot2 && slot2 === slot3) {
    multiplier = 5;
  } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
    multiplier = 1.5;
  }

  if (multiplier > 0) {
    const winAmount = Math.floor(bet * multiplier);
    user.luminite += winAmount;
    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.win} Shadow Slots - Victory!`,
      `${slot1} | ${slot2} | ${slot3}\n\n` +
      `**${multiplier}x Multiplier!**\n\n` +
      `You won **${winAmount}** 💎 Luminite!\n` +
      `Balance: ${user.luminite} 💎`,
      'success'
    );
    await message.reply({ embeds: [embed] });
  } else {
    user.luminite -= bet;
    saveUser(user);

    const embed = createRPGEmbed(
      `${EMOJIS.lose} Shadow Slots - No Match!`,
      `${slot1} | ${slot2} | ${slot3}\n\n` +
      `You lost **${bet}** 💎 Luminite.\n` +
      `Balance: ${user.luminite} 💎`,
      'error'
    );
    await message.reply({ embeds: [embed] });
  }
}
