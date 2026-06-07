import { EmbedBuilder } from 'discord.js';
import { EMOJIS } from '../data/realmshatter-config.js';

export async function handleGuide(message) {
  const embed = new EmbedBuilder()
    .setColor('#7289DA')
    .setTitle(`${EMOJIS.legend} RealmShatter Quick Guide`)
    .setDescription('**Essential commands and tips for new Shatterers**')
    .addFields(
      {
        name: `${EMOJIS.start} Getting Started`,
        value: '`/start` - Begin your journey\n`/legacy` - Choose your starting class (Warrior, Mage, Rogue)\n`/profile` - View your character stats and progress',
        inline: false
      },
      {
        name: `${EMOJIS.expedition} Combat & Exploration`,
        value: '`/expedition` - Battle enemies and gain XP (costs 10 stamina)\n`/forage` - Gather crafting resources (costs 5 stamina)\n`/stamina` - Check stamina (regenerates 1 per 5 minutes)',
        inline: false
      },
      {
        name: `${EMOJIS.gear} Equipment & Progression`,
        value: '`/inventory` - View your weapons and armor\n`/shop` - Buy equipment with Luminite\n`/equip` - Equip your best gear\n`/upgrade` - Enhance your equipment',
        inline: false
      },
      {
        name: `${EMOJIS.companion} Companions`,
        value: '`/summon` - Summon new companions (costs Astral Shards)\n`/companions` - View your companion collection\n`/activate` - Set your active companion\n`/train` - Train companions to increase stats',
        inline: false
      },
      {
        name: `${EMOJIS.realm} Realms & Challenges`,
        value: '`/realms` - View all 7 corrupted realms\n`/realm travel` - Travel to different realms\n`/fracture` - Enter dungeon challenges\n`/duel @user` - Challenge other players to PvP',
        inline: false
      },
      {
        name: `${EMOJIS.coin} Economy`,
        value: '`/balance` - Check Luminite and Astral Shards\n`/daily` - Claim daily rewards (24hr cooldown)\n`/flip` - Coin flip gambling (Rift Trials)\n`/roll` - Dice roll gambling\n`/slots` - Slot machine gambling',
        inline: false
      },
      {
        name: `${EMOJIS.backpack} Utility`,
        value: '`/stats` - Detailed stat breakdown\n`/resources` - View crafting materials\n`/backpack` - Manage inventory space\n`/lore` - Read RealmShatter story\n`/bestiary` - Enemy database',
        inline: false
      }
    )
    .setFooter({ text: 'Tip: Use /help for a complete command list!' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function handleLore(message, args) {
  const lorePages = {
    '1': {
      title: 'The Shattering',
      content: `Long ago, the world was whole. Seven great kingdoms flourished under the light of the Eternal Dawn. But when the Eclipsed Monarch rose from the Void Between Realms, everything changed.

In a single night, reality itself **shattered**. The kingdoms were torn apart, corrupted into twisted reflections of their former glory. Each realm now exists in its own fractured dimension, connected only by unstable Rifts.

The Monarch sits atop their throne in the **Eclipsed Citadel**, feeding on the despair of the corrupted realms. Only those marked as **Shatterers**—warriors chosen by fate—can traverse the Rifts and challenge the darkness.`
    },
    '2': {
      title: 'The Seven Corrupted Realms',
      content: `🌊 **Abyssal Depths** - Once a prosperous ocean kingdom, now a nightmare of drowning cities and leviathan horrors.

⚡ **Stormrend Wastes** - Eternal thunderstorms rage across shattered battlefields where armies still fight as undead.

🔥 **Infernal Peaks** - Volcanic mountains where fire elementals guard ancient forges and forgotten weapons.

❄️ **Frozen Veil** - A frozen wasteland where time itself moves slower, trapping souls in eternal winter.

🌿 **Twisted Grove** - Nature gone mad—carnivorous plants and corrupted beasts hunt in endless twilight.

⚔️ **Shattered Citadel** - The ruined capital, now a maze of broken reality and shadow creatures.

👁️ **Void Nexus** - The heart of corruption, where the Eclipsed Monarch awaits challengers at level 100.`
    },
    '3': {
      title: 'Legacies of Power',
      content: `Every Shatterer inherits a **Legacy**—an ancient bloodline that grants unique abilities:

⚔️ **Blade Phantom** - Masters of melee combat, wielding cursed blades that drain life.

🔮 **Void Sage** - Manipulators of dark magic, channeling the Void's corrupting energy.

🗡️ **Shadow Reaver** - Assassins who walk between dimensions, striking from darkness.

Each Legacy shapes your combat style, stat growth, and ultimate abilities. Choose wisely—your Legacy cannot be changed once selected.`
    },
    '4': {
      title: 'The Rift Trials',
      content: `Scattered throughout the realms are **Rift Trials**—gambling halls that exist outside normal reality. Here, desperate Shatterers wager their Luminite on games of chance:

🎲 **Ether Roll** - Roll the cosmic dice. Above 50 wins.
🪙 **Void Flip** - Heads or tails. Double or nothing.
🎰 **Shadow Slots** - Match three symbols for legendary payouts.

The Trials are run by enigmatic beings called **Rift Keepers**, who neither help nor hinder—they simply collect their share of every bet.`
    },
    '5': {
      title: 'Companions & The Summon System',
      content: `In your darkest hours, you'll need allies. **Companions** are spirits, beasts, and warriors bound to your service through Astral Shards:

Common Companions (100 Shards):
- Loyal but limited power
- Good for early exploration

Rare Companions (250 Shards):
- Unique abilities and higher stats
- Essential for Fractures

Epic Companions (500 Shards):
- Game-changing powers
- Can turn the tide of impossible battles

Legendary Companions (1000 Shards):
- Realm-shaking strength
- Only the most dedicated Shatterers wield these

Train your companions, upgrade their equipment, and they'll fight alongside you through every Fracture and Duel.`
    }
  };

  let page = args.length > 0 ? args[0] : '1';
  
  if (!lorePages[page]) {
    const embed = new EmbedBuilder()
      .setColor('#9B59B6')
      .setTitle(`${EMOJIS.story} RealmShatter Lore Index`)
      .setDescription('**Choose a chapter to read:**')
      .addFields(
        { name: '📖 Page 1', value: 'The Shattering', inline: true },
        { name: '📖 Page 2', value: 'The Seven Corrupted Realms', inline: true },
        { name: '📖 Page 3', value: 'Legacies of Power', inline: true },
        { name: '📖 Page 4', value: 'The Rift Trials', inline: true },
        { name: '📖 Page 5', value: 'Companions & The Summon System', inline: true }
      )
      .setFooter({ text: 'Usage: /lore <page number>' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
    return;
  }

  const selectedPage = lorePages[page];
  const embed = new EmbedBuilder()
    .setColor('#9B59B6')
    .setTitle(`${EMOJIS.story} ${selectedPage.title}`)
    .setDescription(selectedPage.content)
    .setFooter({ text: `Page ${page} of 5 | Use /lore <1-5> to read other chapters` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

export async function handleBestiary(message, args) {
  const enemies = {
    'abyssal': [
      { name: 'Drowned Sailor', level: '1-10', drops: 'Soggy Pearls, Rusted Cutlass' },
      { name: 'Reef Horror', level: '11-20', drops: 'Coral Fragments, Abyssal Scales' },
      { name: 'Leviathan Spawn', level: '21-35', drops: 'Leviathan Fang, Deep Essence' },
      { name: 'Tidebreaker', level: '36-50', drops: 'Oceanic Core, Tsunami Blade' }
    ],
    'storm': [
      { name: 'Lightning Wraith', level: '15-25', drops: 'Storm Essence, Charged Crystal' },
      { name: 'Thunder Knight', level: '26-40', drops: 'Electrified Plate, Stormforged Sword' },
      { name: 'Tempest Elemental', level: '41-55', drops: 'Thunderheart, Bolt Sigil' },
      { name: 'Stormlord', level: '56-70', drops: 'Stormcrown, Ragnarok Hammer' }
    ],
    'infernal': [
      { name: 'Ember Imp', level: '20-30', drops: 'Charcoal Dust, Flame Shard' },
      { name: 'Magma Golem', level: '31-45', drops: 'Molten Core, Obsidian Armor' },
      { name: 'Infernal Drake', level: '46-60', drops: 'Dragon Scale, Hellfire Blade' },
      { name: 'Pyroclast Titan', level: '61-75', drops: 'Titan Heart, Volcanic Relic' }
    ],
    'frozen': [
      { name: 'Frost Wisp', level: '25-35', drops: 'Frozen Tear, Ice Shard' },
      { name: 'Glacial Sentinel', level: '36-50', drops: 'Permafrost Plate, Icicle Spear' },
      { name: 'Blizzard Beast', level: '51-65', drops: 'Eternal Ice, Frostbite Claw' },
      { name: 'Winter Tyrant', level: '66-80', drops: 'Frozen Crown, Absolute Zero' }
    ],
    'twisted': [
      { name: 'Thornling', level: '10-20', drops: 'Twisted Vine, Thorn Dagger' },
      { name: 'Corrupted Treant', level: '21-35', drops: 'Darkwood, Nature\'s Curse' },
      { name: 'Venomous Hydra', level: '36-50', drops: 'Hydra Fang, Poison Essence' },
      { name: 'Elder Blight', level: '51-70', drops: 'Blight Core, Ancient Seed' }
    ],
    'citadel': [
      { name: 'Shadow Hollow', level: '30-45', drops: 'Shadow Essence, Void Fragment' },
      { name: 'Citadel Warden', level: '46-60', drops: 'Warden Blade, Fortress Key' },
      { name: 'Reality Fracture', level: '61-75', drops: 'Spacetime Shard, Rift Crystal' },
      { name: 'Void Sentinel', level: '76-90', drops: 'Void Armor, Sentinel Core' }
    ],
    'void': [
      { name: 'Void Spawn', level: '80-90', drops: 'Void Essence, Corruption Gem' },
      { name: 'Null Knight', level: '91-95', drops: 'Nullblade, Erasure Armor' },
      { name: 'Oblivion Wyrm', level: '96-99', drops: 'Oblivion Scale, Wyrm Heart' },
      { name: '👑 Eclipsed Monarch', level: '100+', drops: 'Monarch\'s Crown, Realm Shard, Ultimate Power' }
    ]
  };

  let realmFilter = args.length > 0 ? args[0].toLowerCase() : null;

  if (!realmFilter || !enemies[realmFilter]) {
    const embed = new EmbedBuilder()
      .setColor('#E74C3C')
      .setTitle(`${EMOJIS.expedition} Bestiary - Enemy Database`)
      .setDescription('**Choose a realm to view its enemies:**\n\nUse `/bestiary <realm>` to filter')
      .addFields(
        { name: '🌊 Abyssal Depths', value: '`/bestiary abyssal`', inline: true },
        { name: '⚡ Stormrend Wastes', value: '`/bestiary storm`', inline: true },
        { name: '🔥 Infernal Peaks', value: '`/bestiary infernal`', inline: true },
        { name: '❄️ Frozen Veil', value: '`/bestiary frozen`', inline: true },
        { name: '🌿 Twisted Grove', value: '`/bestiary twisted`', inline: true },
        { name: '⚔️ Shattered Citadel', value: '`/bestiary citadel`', inline: true },
        { name: '👁️ Void Nexus', value: '`/bestiary void`', inline: true }
      )
      .setFooter({ text: 'Defeat enemies to collect rare loot and crafting materials!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
    return;
  }

  const realmEnemies = enemies[realmFilter];
  const realmNames = {
    'abyssal': '🌊 Abyssal Depths',
    'storm': '⚡ Stormrend Wastes',
    'infernal': '🔥 Infernal Peaks',
    'frozen': '❄️ Frozen Veil',
    'twisted': '🌿 Twisted Grove',
    'citadel': '⚔️ Shattered Citadel',
    'void': '👁️ Void Nexus'
  };

  const embed = new EmbedBuilder()
    .setColor('#E74C3C')
    .setTitle(`${EMOJIS.expedition} Bestiary - ${realmNames[realmFilter]}`)
    .setDescription(`**Enemies found in ${realmNames[realmFilter]}:**\n`)
    .setTimestamp();

  realmEnemies.forEach(enemy => {
    embed.addFields({
      name: `${enemy.name} (Lv ${enemy.level})`,
      value: `**Drops:** ${enemy.drops}`,
      inline: false
    });
  });

  embed.setFooter({ text: 'Use /expedition to battle these enemies!' });

  await message.reply({ embeds: [embed] });
}
