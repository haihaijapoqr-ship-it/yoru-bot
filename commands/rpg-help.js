import { EmbedBuilder } from 'discord.js';
import { REALMSHATTER_COLORS, EMOJIS } from '../data/realmshatter-config.js';

export async function handleHelp(message) {
  const embed = new EmbedBuilder()
    .setColor(REALMSHATTER_COLORS.primary)
    .setTitle(`${EMOJIS.realm} RealmShatter - Complete Command Guide`)
    .setDescription(
      `**Welcome to RealmShatter!**\n` +
      `A dark fantasy RPG where you battle through seven corrupted realms.\n\n` +
      `All commands work with both \`/slash\` and \`yoru\` prefix!\n` +
      `Type \`/guide\` for a beginner-friendly quick reference.`
    )
    .addFields(
      {
        name: `${EMOJIS.start} Getting Started`,
        value: 
          '`/start` - Begin your RealmShatter journey\n' +
          '`/profile` - View stats, level, equipment, and progress\n' +
          '`/legacy [number]` - Choose your class bloodline\n' +
          '`/guide` - Beginner\'s quick reference guide\n' +
          '`/help` - This comprehensive command list',
        inline: false
      },
      {
        name: `${EMOJIS.expedition} Combat & Exploration`,
        value:
          '`/expedition` - Battle enemies for XP and loot (10 stamina)\n' +
          '`/forage` - Gather crafting resources (5 stamina)\n' +
          '`/stamina` - Check current stamina and regen time\n' +
          '`/daily` - Claim daily rewards (24hr cooldown)',
        inline: false
      },
      {
        name: `${EMOJIS.realm} Realms & Travel`,
        value:
          '`/realms` - View all seven corrupted realms\n' +
          '`/realm info <name>` - Detailed realm information\n' +
          '`/realm travel <name>` - Travel to different realm\n' +
          '`/story` - Brief narrative overview\n' +
          '`/lore [page]` - Read 5-page detailed story',
        inline: false
      },
      {
        name: `${EMOJIS.gear} Equipment & Inventory`,
        value:
          '`/inventory [type]` - View weapons/armor/resources\n' +
          '`/equip <type> <number>` - Equip weapon or armor\n' +
          '`/upgrade <type> <number>` - Upgrade equipment (+1 to +10)\n' +
          '`/backpack` - Manage inventory space and upgrades\n' +
          '`/stats` - Detailed stat breakdown (HP, ATK, DEF, etc.)',
        inline: false
      },
      {
        name: `${EMOJIS.companion} Companions`,
        value:
          '`/summon [number]` - View or summon companions (costs Shards)\n' +
          '`/companions` - View your companion collection\n' +
          '`/activate <number>` - Set active companion\n' +
          '`/train` - Train active companion to boost stats',
        inline: false
      },
      {
        name: `${EMOJIS.shop} Shop & Economy`,
        value:
          '`/shop` - Browse the Shattered Market\n' +
          '`/buy <number>` - Purchase equipment from shop\n' +
          '`/sell <type> <number>` - Sell equipment for Luminite\n' +
          '`/balance` - View Luminite and Astral Shards\n' +
          '`/resources` - View collected crafting materials',
        inline: false
      },
      {
        name: `${EMOJIS.craft} Crafting & Enhancement`,
        value:
          '`/craft [recipe]` - View recipes or craft items\n' +
          '`/forge` - Item fusion and enhancement (Coming Soon)\n' +
          '`/awaken` - Companion awakening system (Coming Soon)',
        inline: false
      },
      {
        name: `${EMOJIS.fracture} Dungeons & Challenges`,
        value:
          '`/fracture [tier]` - Enter dungeon challenges\n' +
          '`/boss` - Challenge the Eclipsed Monarch (Lv 100)\n' +
          '`/bestiary [realm]` - Enemy database with drops',
        inline: false
      },
      {
        name: `${EMOJIS.pvp} PvP & Competition`,
        value:
          '`/duel @user` - Challenge player to 1v1 combat\n' +
          '`/rank` - View PvP leaderboard rankings',
        inline: false
      },
      {
        name: `${EMOJIS.rift} Rift Trials (Gambling)`,
        value:
          '`/flip <heads/tails> <amount>` - Coin flip (double or nothing)\n' +
          '`/roll <amount>` - Roll above 50 to win (x1.8 payout)\n' +
          '`/slots <amount>` - Shadow Slots machine (up to x10)',
        inline: false
      },
      {
        name: `${EMOJIS.backpack} Utility`,
        value:
          '`/ping` - Check bot response time\n' +
          '`/guide` - Quick reference for beginners\n' +
          '`/lore [page]` - RealmShatter story (5 chapters)\n' +
          '`/bestiary [realm]` - Enemy database by realm',
        inline: false
      },
      {
        name: '💞 Social Commands (44 Anime GIF Interactions)',
        value: 
          '**Affection:** kiss, hug, cuddle, pat, peck, feed, handhold, handshake, tickle, wink\n' +
          '**Physical:** slap, punch, kick, bonk, bite, poke, shoot, yeet, dance, highfive\n' +
          '**Solo Emotions:** blush, smile, happy, laugh, cry, pout, angry, smug, bored, yawn\n' +
          '**Solo Reactions:** think, nod, nope, shrug, facepalm, lurk, nom, sleep, run\n' +
          '**Other:** stare, wave, baka, thumbsup',
        inline: false
      },
      {
        name: '🌑 The Seven Corrupted Realms',
        value:
          '🌊 **Abyssal Depths** (Lv 1-15) - Drowned kingdoms and leviathans\n' +
          '⚡ **Stormrend Wastes** (Lv 16-30) - Eternal storms and undead armies\n' +
          '🔥 **Infernal Peaks** (Lv 31-45) - Volcanic forges and fire elementals\n' +
          '❄️ **Frozen Veil** (Lv 46-60) - Eternal winter and time distortion\n' +
          '🌿 **Twisted Grove** (Lv 61-75) - Corrupted nature and poison beasts\n' +
          '⚔️ **Shattered Citadel** (Lv 76-90) - Broken reality and shadows\n' +
          '👁️ **Void Nexus** (Lv 91-100) - Face the Eclipsed Monarch',
        inline: false
      },
      {
        name: '📊 Key Resources',
        value:
          `${EMOJIS.coin} **Luminite** - Main currency for shops and upgrades\n` +
          `${EMOJIS.shard} **Astral Shards** - Rare material for summoning companions\n` +
          `${EMOJIS.energy} **Stamina** - Used for expeditions (regenerates 1 per 5 min, max 100)`,
        inline: false
      }
    )
    .setFooter({ text: 'RealmShatter v2.0 — 80 Commands Available | Type /guide for quick start' })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
}
