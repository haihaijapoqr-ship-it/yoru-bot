import { EmbedBuilder } from 'discord.js';
import { config } from '../config.js';

export async function handleHelp(message) {
  const embed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(`${config.emojis.moon} Yoru Command Guide`)
    .setDescription('**Welcome to Yoru - The Anime Game Bot!**\n\nA cyberpunk anime bot with RPG mechanics and 44+ social anime GIF interactions!\n\n**Two ways to use commands:**\n• Slash commands: `/kiss @user`\n• Text commands: `yoru kiss @user`')
    .addFields(
      {
        name: '💞 Affection Actions',
        value: 
          '`kiss` `hug` `cuddle` `pat` `peck` `feed`\n' +
          '`handhold` `handshake` `tickle` `wink`',
        inline: true
      },
      {
        name: '😊 Emotions (Solo)',
        value:
          '`blush` `smile` `happy` `laugh` `cry`\n' +
          '`pout` `angry` `smug` `bored` `yawn`',
        inline: true
      },
      {
        name: '👊 Actions',
        value:
          '`slap` `punch` `kick` `bonk` `bite`\n' +
          '`poke` `shoot` `yeet` `dance` `highfive`',
        inline: true
      },
      {
        name: '🤔 Reactions (Solo)',
        value:
          '`think` `stare` `nod` `nope` `shrug`\n' +
          '`facepalm` `lurk` `nom` `sleep` `run`',
        inline: true
      },
      {
        name: '😤 Anime Specials',
        value:
          '`baka` `wave` `thumbsup`',
        inline: true
      },
      {
        name: '💡 Usage',
        value:
          'With @user: `yoru kiss @user`\n' +
          'Solo actions: `yoru blush`\n' +
          'All give Emotion XP + regular XP!',
        inline: true
      },
      {
        name: '🎮 Game Commands',
        value:
          '`start` - Begin your journey\n' +
          '`hack` - Hack nodes (1⚡)\n' +
          '`scan` - Find artifacts (2⚡)\n' +
          '`daily` - Daily rewards (24h)\n' +
          '`work` - Work for credits',
        inline: false
      },
      {
        name: '💰 Economy',
        value:
          '`profile` / `p` - Your stats\n' +
          '`inventory` / `inv` - Your items\n' +
          '`shop` - Browse weapons\n' +
          '`buy <number>` - Purchase item\n' +
          '`equip <weapon>` - Equip weapon',
        inline: false
      },
      {
        name: '📊 Resources',
        value:
          `${config.emojis.credits} Credits (₿) | ${config.emojis.fragment} Fragments | ${config.emojis.energy} Energy (⚡)`,
        inline: false
      }
    )
    .setFooter({ text: 'Yoru System v1.0 — Stay luminous 🌙 | 44 Anime GIF Actions Available!' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}
