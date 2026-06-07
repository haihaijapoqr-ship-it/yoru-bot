import { EmbedBuilder } from 'discord.js';
import { getAnimeGif } from '../utils/getGif.js';
import { getRandomMessage } from '../utils/randomText.js';
import { addEmotionXP, addXP } from '../utils/rpg-database.js';
import { config } from '../config.js';

const socialActions = {
  angry: { emoji: '😠', description: 'Show your anger', solo: true },
  baka: { emoji: '😤', description: 'Call someone baka' },
  bite: { emoji: '😈', description: 'Bite someone playfully' },
  blush: { emoji: '🥺', description: 'Show your embarrassment', solo: true },
  bonk: { emoji: '🔨', description: 'Bonk someone to horny jail' },
  bored: { emoji: '😑', description: 'Express your boredom', solo: true },
  cry: { emoji: '😢', description: 'Cry your heart out', solo: true },
  cuddle: { emoji: '💤', description: 'Cuddle with someone' },
  dance: { emoji: '💃', description: 'Dance with someone' },
  facepalm: { emoji: '🤦', description: 'Facepalm in disappointment', solo: true },
  feed: { emoji: '🍰', description: 'Feed someone' },
  handhold: { emoji: '🤝', description: 'Hold hands with someone' },
  handshake: { emoji: '🤝', description: 'Shake hands with someone' },
  happy: { emoji: '😊', description: 'Show your happiness', solo: true },
  highfive: { emoji: '✋', description: 'Give someone a highfive' },
  hug: { emoji: '🤗', description: 'Give someone a warm hug' },
  kick: { emoji: '👢', description: 'Kick someone' },
  kiss: { emoji: '💞', description: 'Kiss someone with affection' },
  laugh: { emoji: '😂', description: 'Laugh out loud', solo: true },
  lurk: { emoji: '👀', description: 'Lurk in the shadows', solo: true },
  nod: { emoji: '👍', description: 'Nod in agreement', solo: true },
  nom: { emoji: '😋', description: 'Nom on something', solo: true },
  nope: { emoji: '🙅', description: 'Nope out of something', solo: true },
  pat: { emoji: '🩷', description: 'Pat someone on the head' },
  peck: { emoji: '😘', description: 'Give someone a peck' },
  poke: { emoji: '👉', description: 'Poke someone' },
  pout: { emoji: '😾', description: 'Pout cutely', solo: true },
  punch: { emoji: '👊', description: 'Punch someone' },
  run: { emoji: '🏃', description: 'Run away', solo: true },
  shoot: { emoji: '🔫', description: 'Shoot someone' },
  shrug: { emoji: '🤷', description: 'Shrug in confusion', solo: true },
  slap: { emoji: '💢', description: 'Slap someone back to reality' },
  sleep: { emoji: '😴', description: 'Go to sleep', solo: true },
  smile: { emoji: '😊', description: 'Smile brightly', solo: true },
  smug: { emoji: '😏', description: 'Look smug', solo: true },
  stare: { emoji: '👁️', description: 'Stare at someone' },
  think: { emoji: '🤔', description: 'Think deeply', solo: true },
  thumbsup: { emoji: '👍', description: 'Give a thumbs up', solo: true },
  tickle: { emoji: '🤗', description: 'Tickle someone' },
  wave: { emoji: '👋', description: 'Wave at someone' },
  wink: { emoji: '😉', description: 'Wink at someone' },
  yawn: { emoji: '🥱', description: 'Yawn tiredly', solo: true },
  yeet: { emoji: '🚀', description: 'Yeet someone' }
};

export async function handleSocialCommand(message, args, action) {
  const actionData = socialActions[action];
  if (!actionData) return;

  const isSolo = actionData.solo;
  const target = message.mentions.users.first();

  if (!isSolo && !target) {
    return message.reply(`${config.emojis.moon} Please mention someone to ${action}!`);
  }

  if (!isSolo && target.id === message.author.id) {
    return message.reply(`${actionData.emoji} You can't ${action} yourself!`);
  }

  const gifUrl = await getAnimeGif(action);
  const randomMessage = getRandomMessage(action);

  const embed = new EmbedBuilder()
    .setColor(config.colors.pink)
    .setTitle(`${config.emojis.moon} Yoru Action Log`)
    .setDescription(
      isSolo
        ? `${actionData.emoji} **${message.author.username}** ${action}es.\n*${randomMessage}*`
        : `${actionData.emoji} **${message.author.username}** ${action}ed **${target.username}**!\n*${randomMessage}*`
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙' })
    .setTimestamp();

  if (gifUrl) {
    embed.setImage(gifUrl);
  }

  const emotionXP = Math.floor(Math.random() * 3) + 1;
  addEmotionXP(message.author.id, emotionXP);
  
  const xpResult = addXP(message.author.id, 5);
  
  let footer = `❤️ Emotion XP +${emotionXP}`;
  if (xpResult.leveledUp) {
    footer += ` | 🎉 Level Up! Now level ${xpResult.newLevel}!`;
  }
  
  embed.addFields({ name: '✨ Rewards', value: footer, inline: false });
  
  await message.channel.send({ embeds: [embed] });
}

export const socialCommands = Object.keys(socialActions);
