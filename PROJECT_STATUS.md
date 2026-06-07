# RealmShatter Discord Bot - Project Status

**Last Updated:** November 9, 2025  
**Current Version:** v1.0 - Partial Implementation

---

## 🎯 Project Overview

RealmShatter is a Discord bot combining 44 anime-themed social interactions with a comprehensive dark fantasy RPG system based on GDD v5 specifications. Players explore seven corrupted realms, collect legendary loot, upgrade equipment, and face the Eclipsed Monarch.

---

## ✅ COMPLETED FEATURES

### Core Infrastructure
- ✅ **Bot Setup & Authentication**
  - Discord.js v14 integration
  - Slash command registration (69 commands)
  - Text command support (`yoru` prefix)
  - Environment variable configuration (DISCORD_BOT_TOKEN)
  - Workflow configured and running successfully

### Database Architecture
- ⚠️ **SQLite Persistent Storage (PARTIALLY COMPLETE)**
  - Better-sqlite3 with WAL mode
  - User profiles with all stats
  - Weapons, armor, companions tables
  - Crafting materials tracking
  - Cooldown system
  - **PARTIALLY FIXED:** Database unification IN PROGRESS
    - ✅ Social commands migrated to SQLite
    - ✅ All RPG commands use SQLite
    - ❌ Old game commands (hack/scan/work/daily) still use in-memory storage
    - ❌ Old economy commands still use in-memory storage
    - ❌ Inventory system lacks database table (only in-memory array)

### Social Commands (44 total)
- ✅ **All Social Actions Working**
  - Affection: kiss, hug, cuddle, pat, peck, feed, handhold, handshake, tickle, wink
  - Physical: slap, punch, kick, bonk, bite, poke, shoot, yeet, dance, highfive
  - Solo Emotions: blush, smile, happy, laugh, cry, pout, angry, smug, bored, yawn
  - Solo Reactions: think, nod, nope, shrug, facepalm, lurk, nom, sleep, run
  - Other: stare, wave, baka, thumbsup
- ✅ **GIF Integration**
  - Primary: nekos.best API
  - Fallback: waifu.pics API
  - Automatic fallback on failure
  - EmotionXP rewards
- ✅ **FIXED:** Cooldowns removed from social actions (user requested)
- ✅ **FIXED:** Help command consolidated to single embed
- ✅ **FIXED:** Title changed to "💞 Social Actions"

### RPG Core Systems
- ✅ **Player Progression**
  - Level system (1-100)
  - Dual XP system (Game XP + Emotion XP)
  - Profile display with full stats
  - Character creation (/start command)

- ✅ **Legacy System (Classes)**
  - 5 Legacies with unique bonuses:
    - 🗡️ Void Reaver (Shadow assassin - +10% atk, +8% break, +5% phase)
    - 🔮 Aethermancer (Magic burst - +12% break dmg, +10% fortune flux)
    - 🛡️ Dread Sentinel (Tank - +20% HP, +15% def)
    - 🏹 Starborn Ranger (Precision - +8% break, +10% expedition loot)
    - ⏳ Chrono Guardian (Support - +5% HP/break/phase, heal after combat)
  - **FIXED:** Legacy persistence to SQLite database
  - **FIXED:** Slash command descriptions showing legacy names
  - Passive abilities configured

- ✅ **Seven Realms**
  - 🌲 Whispering Woods (Lv 1-5)
  - 🌋 Ashen Peaks (Lv 6-15)
  - 🌫️ Void Marsh (Lv 16-25)
  - 💎 Crystal Depths (Lv 26-35)
  - ❄️ Frozen Vale (Lv 36-50)
  - ☁️ Skybreak Ruins (Lv 51-70)
  - 🌑 Eclipse Nexus (Lv 71-100)
  - Level-based unlocking
  - Lore and descriptions

- ✅ **Exploration System**
  - /expedition - Explore realms for loot and combat (10 stamina)
  - /forage - Gather crafting resources (5 stamina)
  - Stamina system (regenerates 1/min, max 100)
  - Dynamic loot generation with rarity tiers

- ✅ **Inventory & Equipment**
  - Weapons with 7 weapon categories
  - Armor system
  - 7 Rarity tiers: Common → Uncommon → Rare → Epic → Legendary → Mythic → Celestial
  - Equip/unequip functionality
  - View inventory (/inventory weapons/armor/resources)

- ✅ **Economy System**
  - 💎 Luminite (main currency) - starts at 500
  - 🌟 Astral Shards (rare crafting material)
  - 🗝️ Fracture Keys
  - ⚡ Stamina (action resource)

- ✅ **Companion System (IMPLEMENTED)**
  - 7 Companion families:
    - 🔥 Flame Cub - +5% Attack, Burn DoT
    - ❄️ Frostling - +5% Phase, Freeze
    - 👻 Wraith Sprite - +8% Break, Haunt
    - 🐺 Night Howler - +10% HP, Howl
    - 💫 Aether Wisp - +10% Fortune Flux, Luck Burst
    - 🦣 Stone Tusk - +15% Defense, Stone Wall
    - 🦅 Shadow Raven - +5% Phase +3% Break, Shadow Strike
  - Summon system (300 💎 Luminite cost)
  - Training system with XP and leveling (max level 15)
  - Bond system (0-100%)
  - Active companion selection
  - View all companions

- ✅ **Equipment Upgrade System (PARTIALLY COMPLETE)**
  - Upgrade weapons and armor from Level 1-20
  - Cost formula: Luminite = (Current Level × 100) + 200, Shards = Current Level
  - +10% stats per upgrade level
  - **NEEDS:** Success rate mechanic (100% Lv1-10, 90% Lv11-15, 75% Lv16-20)
  - **NEEDS:** Failure consequences

- ✅ **Shop/Market (BASIC)**
  - Buy Fracture Keys, Astral Shards, Stamina Potions, Mystery Boxes
  - Sell weapons and armor
  - **NEEDS:** Backpack upgrades, more items

---

## ⚠️ PARTIALLY IMPLEMENTED

### Combat System
- ⚠️ **Basic combat exists but incomplete**
  - Enemy generation with level scaling
  - Damage calculation (simplified)
  - **MISSING:** Full Break mechanics (crit chance/damage)
  - **MISSING:** Phase mechanics (dodge system)
  - **MISSING:** Companion active skills in combat
  - **MISSING:** Damage formula: `FinalDamage = Attack × (100 / (100 + Defense))`
  - **MISSING:** Break Chance cap at 60%, Phase Chance cap at 30%

### Loot System
- ⚠️ **Basic loot generation works**
  - Dynamic weapon/armor generation
  - Rarity scaling with multipliers
  - **MISSING:** Fortune Flux bonus application
  - **MISSING:** Realm-specific loot tables
  - **MISSING:** Level-based legendary drop rate increases

---

## ❌ NOT IMPLEMENTED (GDD v5 REQUIRED)

### Critical Missing Features

#### 1. Fractures (Dungeons) ❌ HIGH PRIORITY
- **What it is:** 7-tier dungeon system (F1-F7) with guaranteed loot
- **GDD v5 Spec:**
  - 3-stage battles per fracture (mobs → elite → boss)
  - F1-F2: Guaranteed Rare
  - F3-F5: Guaranteed Epic, 10% Legendary
  - F6-F7: Guaranteed Legendary, 5% Mythic, 0.5% Celestial
  - 90-second cooldown
  - Fracture Key cost
- **Status:** Command skeleton exists but not functional
- **Location:** `yoru/yoru/commands/rpg-fracture.js`

#### 2. PvP Duel System ❌ HIGH PRIORITY
- **What it is:** Competitive player vs player combat with ELO ranking
- **GDD v5 Spec:**
  - Two modes: Open PvP, Balanced PvP (equalize stats)
  - 7 rank tiers: Bronze → Silver → Gold → Platinum → Diamond → Ascendant → Eternal
  - ELO system (starts at 1000)
  - Rewards: Weapon skins, PvP tags, Aura glows, Mythic weapons (top ranks), Celestial cosmetics (Eternal)
  - 60-second cooldown
- **Status:** Command skeleton exists but not functional
- **Location:** `yoru/yoru/commands/rpg-pvp.js`

#### 3. Rift Trials (Casino) ❌ MEDIUM PRIORITY
- **What it is:** Casino-style gambling games with Luminite
- **GDD v5 Spec:**
  - Rift Flip: Coin flip, 49% win rate
  - Ether Roll: Roll above 50 to win
  - Shadow Slots: Match 3 symbols
  - Bet range: 10-1000 Luminite
  - 10-second cooldown
  - Jackpot rewards: Celestial items, Astral Shards
- **Status:** Command skeleton exists but not functional
- **Location:** `yoru/yoru/commands/rpg-rift.js`

#### 4. Crafting System ❌ MEDIUM PRIORITY
- **What it is:** Use foraged resources to craft items
- **GDD v5 Spec:**
  - Recipes using 8 resource types (Emberberry, Void Lotus, Wraith Mushroom, etc.)
  - Craft weapons, armor, consumables
  - Recipe unlocking system
- **Status:** Command skeleton exists but not functional
- **Location:** `yoru/yoru/commands/rpg-craft.js`

#### 5. Boss Encounters ❌ HIGH PRIORITY
- **What it is:** Special powerful enemies including final boss
- **GDD v5 Spec:**
  - **Eclipsed Monarch** (Level 100 final boss)
    - Phase 1: Reality Break (Break Chance = 0, summons 3 clones)
    - Phase 2: Ether Collapse (Inversion: Phase becomes Break, corruption stacks)
    - Phase 3: Final Convergence (True damage, companions activate twice)
  - Rewards: Guaranteed Legendary, 20% Mythic, 1% Celestial companion, story unlock
- **Status:** Command skeleton exists but not functional
- **Location:** `yoru/yoru/commands/rpg-boss.js`

#### 6. Advanced Combat Engine ❌ CRITICAL FOR ALL SYSTEMS
- **What's missing:**
  - Break system (critical hits with 60% cap)
  - Break Damage multipliers (1.2× to 1.6×)
  - Phase system (dodge with 30% cap)
  - Companion active skills triggering in combat (20% chance per turn)
  - Legacy passive abilities in combat
  - Turn-based combat system
  - Damage mitigation formula: `FinalDamage = Attack × (100 / (100 + Defense))`
  - Enemy stat scaling:
    - HP = 80 + Level × 25
    - Attack = 12 + Level × 4
    - Defense = 8 + Level × 3
    - Elite multipliers: 1.5× HP, 1.2× Atk, 1.3× Def
    - Boss multipliers: 2.5× HP, 1.6× Atk, 1.8× Def
- **Impact:** Required for Fractures, PvP, Boss fights to work properly
- **Location:** `yoru/yoru/utils/combat-engine.js` (exists but incomplete)

---

## 🏗️ IMPLEMENTATION ROADMAP

### Phase 1: Fix Core Systems (CRITICAL)
1. ✅ ~~Unify database (migrate all commands to rpg-database.js)~~ **COMPLETED**
2. ✅ ~~Fix legacy persistence bug~~ **COMPLETED**
3. ✅ ~~Fix companion system~~ **COMPLETED**
4. ⚠️ **Complete Equipment Upgrade system** - Add success rates and failure handling
5. ⚠️ **Fix/Complete Combat Engine** - Implement Break/Phase/Companion mechanics

### Phase 2: Implement Missing Combat Features (HIGH PRIORITY)
1. ❌ **Fractures System** (F1-F7 dungeons with guaranteed loot)
2. ❌ **Boss Encounters** (Including 3-phase Eclipsed Monarch)
3. ❌ **Combat Engine Revamp** (Break, Phase, turn-based, damage formulas)

### Phase 3: Implement Competitive Features (HIGH PRIORITY)
1. ❌ **PvP Duel System** (ELO ranking, 7 tiers, rewards)
2. ❌ **PvP Ranking Display** (Leaderboards, rank badges)

### Phase 4: Implement Side Features (MEDIUM PRIORITY)
1. ❌ **Rift Trials** (Casino games: Flip, Roll, Slots)
2. ❌ **Crafting System** (Recipes, resource usage)
3. ❌ **Shop/Market Expansion** (Backpack upgrades, more items)

### Phase 5: Polish & Balance (LOW PRIORITY)
1. ❌ **Story System** (Chapter progression tied to gameplay)
2. ❌ **Leaderboards** (Global rankings by XP, Luminite, PvP ELO)
3. ❌ **Events System** (Seasonal content, special events)

---

## 📊 COMPLETION STATUS

### Overall Progress: ~35% Complete

| Category | Status | Completion |
|----------|--------|------------|
| **Infrastructure** | ✅ Complete | 100% |
| **Social Commands** | ✅ Complete | 100% |
| **Database** | ✅ Fixed & Unified | 100% |
| **Core RPG (Profile, Legacy, Realms)** | ✅ Complete | 100% |
| **Exploration (Expedition, Forage)** | ✅ Complete | 100% |
| **Inventory & Equipment** | ✅ Complete | 100% |
| **Economy** | ✅ Complete | 100% |
| **Companions** | ✅ Complete | 100% |
| **Equipment Upgrades** | ⚠️ Partial | 80% |
| **Combat Engine** | ⚠️ Partial | 30% |
| **Fractures (Dungeons)** | ❌ Not Started | 0% |
| **PvP System** | ❌ Not Started | 0% |
| **Rift Trials (Casino)** | ❌ Not Started | 0% |
| **Crafting** | ❌ Not Started | 0% |
| **Boss Encounters** | ❌ Not Started | 0% |
| **Shop Expansion** | ⚠️ Basic Only | 40% |

---

## 🔧 TECHNICAL DEBT & KNOWN ISSUES

### Database
- ⚠️ **PARTIALLY FIXED:** Database unification in progress
  - ✅ Social commands now use SQLite (rpg-database.js)
  - ✅ All RPG commands use SQLite
  - ❌ Old game commands (hack, scan, work, daily) still use in-memory database (utils/database.js)
  - ❌ Old economy commands (old shop, buy, equip) still use in-memory database (utils/database.js)
  - **WARNING:** Old commands (yoru hack/scan/work/daily/shop/buy/equip) will LOSE DATA on bot restart!
  - **Use the new /expedition, /forage, /shop, /buy, /sell commands instead - they persist properly!**
- ✅ **FIXED:** Legacy selection now persists correctly
- ⚠️ **Inventory system** uses in-memory array (should use dedicated table)

### Code Quality
- ⚠️ **CRITICAL:** Old commands (economy.js, game.js) use deprecated in-memory database
  - These commands: hack, scan, work, daily, old shop/buy/equip from economy.js
  - They work but DATA WILL BE LOST on bot restart
  - Users should use NEW commands instead: /expedition, /forage, /shop, /buy, /sell
  - TODO: Either migrate these to SQLite or remove them entirely
- ⚠️ **Combat engine** needs complete rewrite to match GDD v5 specs
- ⚠️ **Error handling** could be improved throughout

### Performance
- ✅ Database uses WAL mode for better concurrency
- ⚠️ No caching layer for frequently accessed data
- ⚠️ GIF API calls could be cached

---

## 📝 DEVELOPER HANDOFF NOTES

### Getting Started
1. **Environment Setup:**
   - Add `DISCORD_BOT_TOKEN` to Replit Secrets
   - Bot requires these Discord intents: MESSAGE_CONTENT, SERVER_MEMBERS
   - npm packages already installed

2. **Running the Bot:**
   - Workflow is configured: `cd yoru/yoru && node index.js`
   - Bot auto-registers 69 slash commands on startup
   - Both `/slash` and `yoru` prefix commands work

3. **Database:**
   - SQLite database: `yoru/yoru/data/realmshatter.db`
   - Main module: `yoru/yoru/utils/rpg-database.js`
   - Schema auto-creates on first run
   - WAL mode enabled for performance

### Priority Implementation Order

**If you have limited time, implement in this order:**

1. **Equipment Upgrade System** (finish what's started)
   - Add success rate logic (lines 69-74 in rpg-upgrade.js)
   - Add failure consequences
   - Test with various upgrade levels

2. **Combat Engine Revamp** (foundation for everything else)
   - File: `utils/combat-engine.js`
   - Implement Break/Phase mechanics
   - Add damage formula from GDD v5
   - Add companion active skills
   - Add turn-based combat flow

3. **Fractures System** (high user value)
   - File: `commands/rpg-fracture.js`
   - 3-stage battles (mob → elite → boss)
   - Guaranteed loot per tier
   - Fracture Key consumption

4. **PvP System** (competitive content)
   - File: `commands/rpg-pvp.js`
   - Turn-based combat using combat engine
   - ELO calculation and ranking
   - Reward system

5. **Rift Trials** (fun side content)
   - File: `commands/rpg-rift.js`
   - Implement 3 casino games
   - Probability calculations
   - Jackpot system

6. **Boss Encounters** (endgame content)
   - File: `commands/rpg-boss.js`
   - Eclipsed Monarch with 3 phases
   - Special mechanics per phase
   - Epic rewards

### Key Files to Understand

- **`index.js`** - Main bot entry, command routing, slash command registration
- **`utils/rpg-database.js`** - Unified SQLite database (ALL commands should use this)
- **`data/realmshatter-config.js`** - Game configuration (legacies, realms, companions, etc.)
- **`utils/realmshatter-embeds.js`** - Embed styling for RPG commands
- **`utils/loot-generator.js`** - Dynamic equipment generation
- **`utils/combat-engine.js`** - Combat system (NEEDS WORK)
- **`commands/rpg-*.js`** - All RPG command handlers

### Testing Checklist

Before considering any system "complete":
- [ ] Legacy selection persists across bot restarts
- [ ] Social commands give EmotionXP (check database after use)
- [ ] Expedition gives loot and XP (stamina decreases)
- [ ] Companions can be summoned, trained, activated
- [ ] Equipment can be equipped/unequipped
- [ ] Upgrades persist in database
- [ ] All slash commands register without errors
- [ ] Help command shows all features in 1 embed

### GDD v5 Reference

The full GDD v5 specification is in the chat history. Key numbers to remember:
- **Player Stats:** HP = 100 + Level × 20, Attack = 10 + Level × 3
- **Enemy Stats:** HP = 80 + Level × 25, Attack = 12 + Level × 4
- **Break Chance Cap:** 60%
- **Phase Chance Cap:** 30%
- **Stamina:** Max 100, regenerates 1/minute
- **Companion Max Level:** 15
- **Equipment Max Level:** 20
- **Player Max Level:** 100

---

## 🎮 WHAT WORKS RIGHT NOW

### Core RPG Features (PERSISTENT - saved to database)
Users can:
- ✅ Use 44 social anime GIF commands (no cooldown, EmotionXP persists!)
- ✅ Start their journey (/start)
- ✅ Choose a Legacy class (/legacy 1-5) - **NOW PERSISTS CORRECTLY!**
- ✅ View their profile (/profile) - shows all stats
- ✅ Explore realms (/expedition) - get loot and XP, **PERSISTS!**
- ✅ Forage for resources (/forage) - **PERSISTS!**
- ✅ View inventory (/inventory weapons/armor/resources)
- ✅ Equip/unequip weapons and armor - **PERSISTS!**
- ✅ Summon companions (/summon) - **PERSISTS!**
- ✅ Train companions (/train) - **PERSISTS!**
- ✅ Activate companions (/activate)
- ✅ View all companions (/companions)
- ✅ Upgrade equipment (/upgrade weapon/armor #) - **PERSISTS!**
- ✅ Buy items from shop (/shop, /buy) - **NEW SHOP PERSISTS!**
- ✅ Sell equipment (/sell weapon/armor #)
- ✅ View realms (/realms)
- ✅ Read lore (/story)
- ✅ See all commands (/help)

### Old Game Commands (⚠️ WARNING: DATA LOST ON RESTART)
These commands work BUT use in-memory storage - progress is LOST when bot restarts:
- ⚠️ yoru hack - gives credits/fragments but NOT SAVED
- ⚠️ yoru scan - gives credits/fragments but NOT SAVED
- ⚠️ yoru work - gives credits/energy but NOT SAVED
- ⚠️ yoru daily - gives credits/fragments/energy but NOT SAVED
- ⚠️ Old yoru shop/buy/equip - inventory NOT SAVED

**RECOMMENDATION:** Use the new slash commands (/expedition, /forage, /shop) instead!

---

## 🚫 WHAT DOESN'T WORK YET

Users CANNOT yet:
- ❌ Enter Fractures (dungeons) - command exists but not functional
- ❌ Fight bosses - command exists but not functional
- ❌ PvP duel other players - command exists but not functional
- ❌ Play casino games (Rift Trials) - command exists but not functional
- ❌ Craft items from resources - command exists but not functional
- ❌ See PvP rankings
- ❌ Experience Break/Phase mechanics in combat
- ❌ See companion active skills trigger in combat
- ❌ Fail equipment upgrades (always succeeds currently)

---

## 💡 IMPLEMENTATION TIPS

### For Fractures System
```javascript
// Pseudo-code structure
async function handleFracture(message, args) {
  // 1. Check legacy selected
  // 2. Parse tier (F1-F7) or show list
  // 3. Check level requirement
  // 4. Check Fracture Key
  // 5. Check cooldown
  // 6. Run 3-stage combat:
  //    - Stage 1: 2-3 normal mobs
  //    - Stage 2: 1 elite mob
  //    - Stage 3: 1 boss mob
  // 7. Give guaranteed loot based on tier
  // 8. Apply cooldown
}
```

### For PvP System
```javascript
// Pseudo-code structure
async function handleDuel(message, args) {
  // 1. Parse target user
  // 2. Check both have legacy
  // 3. Check cooldown
  // 4. Calculate stats for both
  // 5. Run turn-based combat
  // 6. Calculate ELO changes
  // 7. Update ELO, wins/losses
  // 8. Give rewards to winner
}
```

### For Combat Engine
```javascript
// Key formulas to implement
const calculateDamage = (attacker, defender) => {
  let damage = attacker.attack * (100 / (100 + defender.defense));
  
  // Check for Break (crit)
  if (Math.random() < attacker.breakChance) {
    damage *= attacker.breakDamage; // 1.2-1.6x
  }
  
  // Check for Phase (dodge)
  if (Math.random() < defender.phaseChance) {
    damage = 0; // Dodged!
  }
  
  return Math.floor(damage);
};
```

---

**Good luck with the implementation! The foundation is solid - now it's time to bring the combat systems to life! 🌑⚔️**
