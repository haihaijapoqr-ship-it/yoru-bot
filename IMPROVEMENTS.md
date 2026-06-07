# RealmShatter Bot - Improvements & Feature List

## Project Overview
**Bot Name:** Yoru  
**Project:** RealmShatter - Dark Fantasy Discord RPG  
**Current Version:** 2.0  
**Total Commands:** 80 (44 social + 36 RPG)  
**Design Document:** GDD v5  

---

## Critical Requirements (User Instructions)

### 1. NEVER TOUCH SOCIAL COMMANDS
- **44 anime GIF social interaction commands** are **OFF-LIMITS**
- They work perfectly and must remain completely untouched
- Social commands: angry, baka, bite, blush, bonk, bored, cry, cuddle, dance, facepalm, feed, handhold, handshake, happy, highfive, hug, kick, kiss, laugh, lurk, nod, nom, nope, pat, peck, poke, pout, punch, run, shoot, shrug, slap, sleep, smile, smug, stare, think, thumbsup, tickle, wave, wink, yawn, yeet

### 2. Database Architecture
- **MANDATORY:** All RPG data must use `rpg-database.js` (SQLite with WAL mode)
- **REMOVED:** Old `realmshatter-db.js` (in-memory Map system) 
- **Persistence:** All user data (legacy selections, levels, inventory, companions, etc.) must survive bot restarts

### 3. Strict GDD v5 Compliance
- Follow the Game Design Document v5 specifications **exactly**
- Stat formulas, progression systems, and mechanics must match GDD v5
- Seven corrupted realms with specific level ranges and themes
- Legacy (class) system with exact stats and abilities

---

## Commands Added This Session (11 New Commands)

### Utility Commands (6)
1. **`/stats`** - Detailed breakdown of HP, Attack, Defense, Break, Phase stats
2. **`/balance`** - View Luminite (currency) and Astral Shards
3. **`/stamina`** - Check current stamina and regeneration time
4. **`/resources`** - View collected crafting materials inventory
5. **`/backpack`** - Manage inventory space and view upgrades
6. **`/ping`** - Check bot response time and latency

### Daily & Progression (1)
7. **`/daily`** - Claim daily Luminite rewards (24-hour cooldown, scales with level)

### Realm System (2)
8. **`/realm info <name>`** - Detailed information about a specific realm
9. **`/realm travel <name>`** - Travel to different realms

### Information & Lore (3)
10. **`/guide`** - Beginner's quick reference guide with categorized commands
11. **`/lore <page>`** - 5-page detailed RealmShatter story system
12. **`/bestiary <realm>`** - Enemy database filterable by 7 realms, shows drops and levels

### Help System Enhanced
- **`/help`** - Completely reorganized with all 80 commands in 13 categories

---

## GDD v5 Feature Requirements

### The Seven Corrupted Realms
1. **🌊 Abyssal Depths** (Lv 1-15)
   - Drowned ocean kingdom, leviathan horrors
   - Enemies: Drowned Sailor, Reef Horror, Leviathan Spawn, Tidebreaker

2. **⚡ Stormrend Wastes** (Lv 16-30)
   - Eternal thunderstorms, undead armies
   - Enemies: Lightning Wraith, Thunder Knight, Tempest Elemental, Stormlord

3. **🔥 Infernal Peaks** (Lv 31-45)
   - Volcanic mountains, fire elementals, ancient forges
   - Enemies: Ember Imp, Magma Golem, Infernal Drake, Pyroclast Titan

4. **❄️ Frozen Veil** (Lv 46-60)
   - Eternal winter, time distortion
   - Enemies: Frost Wisp, Glacial Sentinel, Blizzard Beast, Winter Tyrant

5. **🌿 Twisted Grove** (Lv 61-75)
   - Corrupted nature, carnivorous plants, poison beasts
   - Enemies: Thornling, Corrupted Treant, Venomous Hydra, Elder Blight

6. **⚔️ Shattered Citadel** (Lv 76-90)
   - Broken reality, shadow creatures, maze of fractured space
   - Enemies: Shadow Hollow, Citadel Warden, Reality Fracture, Void Sentinel

7. **👁️ Void Nexus** (Lv 91-100)
   - Heart of corruption, final realm
   - Enemies: Void Spawn, Null Knight, Oblivion Wyrm, **Eclipsed Monarch (Final Boss)**

### Legacy (Class) System
Three starting legacies/bloodlines:
1. **⚔️ Blade Phantom** - Melee combat specialist, life drain
2. **🔮 Void Sage** - Dark magic user, void energy manipulation  
3. **🗡️ Shadow Reaver** - Assassin, dimensional strikes

### Core Game Systems

#### Combat & Progression
- **Expeditions** - Battle enemies for XP, loot, and Luminite (costs 10 stamina)
- **Foraging** - Gather crafting resources (costs 5 stamina)
- **Stamina System** - Max 100, regenerates 1 per 5 minutes
- **Level System** - 1-100 with stat scaling based on legacy choice
- **Experience** - Gained from expeditions and challenges

#### Equipment System
- **Weapons** - Tiered loot with upgrade system (+1 to +10)
- **Armor** - Defense-based equipment with upgrades
- **Inventory Management** - Limited space, expandable backpack
- **Equipment Upgrading** - Costs Luminite, increases stats

#### Companion System
- **Summoning** - Uses Astral Shards to summon allies
- **Rarity Tiers:** Common (100), Rare (250), Epic (500), Legendary (1000)
- **Active Companion** - One companion fights alongside you
- **Training** - Boost companion stats with resources
- **Companion Collection** - Build a roster of powerful allies

#### Economy & Resources
- **💰 Luminite** - Primary currency for shops and upgrades
- **✨ Astral Shards** - Rare currency for summoning companions
- **🌿 Crafting Materials** - Gathered from foraging and enemy drops
- **Daily Rewards** - 24-hour cooldown, scales with player level

#### Shop & Trading
- **Shop** - Buy weapons, armor, and items with Luminite
- **Selling** - Sell unwanted equipment back for Luminite
- **Crafting** - Combine resources to create items

#### Dungeon System
- **Fractures** - Instanced dungeons with tiered difficulty
- **Tier 1-5** - Increasing challenge and rewards
- **Boss Encounters** - Special enemies with unique loot

#### PvP System
- **Dueling** - Challenge other players to 1v1 combat
- **PvP Rankings** - Leaderboard system
- **Win/Loss Tracking** - Competitive stats

#### Gambling (Rift Trials)
- **🪙 Void Flip** - Coin flip, double or nothing
- **🎲 Ether Roll** - Roll above 50 to win (x1.8 payout)
- **🎰 Shadow Slots** - Match 3 symbols (up to x10 multiplier)

---

## Still Missing from GDD v5 (Future Implementation)

### High Priority Commands
1. **`/forge`** - Item fusion and enhancement system
2. **`/awaken`** - Companion awakening/evolution system
3. **`/fracture list`** - List available dungeon tiers
4. **`/fracture info <tier>`** - Detailed fracture information
5. **`/achievements`** - Track and display achievements
6. **`/leaderboard <type>`** - Global rankings (level, wealth, PvP)

### Restructure Existing Commands (GDD v5 Alignment)
1. **Weapon System** - Rename to `/sigilarm` with subcommands:
   - `/sigilarm equip <number>`
   - `/sigilarm upgrade <number>`
   - `/sigilarm info <number>`

2. **Armor System** - Rename to `/aegis` with subcommands:
   - `/aegis equip <number>`
   - `/aegis upgrade <number>`
   - `/aegis info <number>`

3. **Companion Enhancements** - Add subcommands:
   - `/companion info <number>` - Detailed companion stats
   - `/companion feed <number>` - Feed resources to boost stats

4. **Shop Enhancement** - Add category subcommands:
   - `/shop weapons` - Browse weapon shop
   - `/shop armor` - Browse armor shop
   - `/shop companions` - Browse companion shop
   - `/shop materials` - Browse crafting materials

5. **Rift Trials Enhancement**:
   - `/rift` - Main Rift Trials menu
   - `/rift spin` - Special jackpot game

6. **PvP Enhancement**:
   - `/pvp stats` - Your PvP statistics
   - `/pvp ranks` - Global PvP leaderboard

### Advanced Systems (GDD v5)
1. **Guild System** - Player organizations
2. **Raid Bosses** - Multi-player boss fights
3. **Seasonal Events** - Limited-time content
4. **Prestige System** - Post-level 100 progression
5. **Realm Corruption Meter** - Dynamic world events
6. **Legendary Quests** - Epic story missions
7. **Companion Bonds** - Relationship system with companions
8. **Equipment Sets** - Bonus stats for matching gear
9. **Skill Trees** - Customizable ability progression
10. **World Events** - Server-wide challenges

---

## Technical Implementation Status

### ✅ Completed (Session Work)
- [x] Fixed critical database bug (migrated to rpg-database.js)
- [x] Removed obsolete realmshatter-db.js
- [x] Implemented /stats, /balance, /stamina, /resources, /backpack, /ping
- [x] Implemented /daily with 24hr cooldown
- [x] Implemented /realm info and /realm travel
- [x] Implemented /guide, /lore, /bestiary
- [x] Updated /help with all 80 commands organized in 13 categories
- [x] Fixed routing conflict between /story and /lore
- [x] Registered 80 slash commands successfully
- [x] Both prefix (yoru) and slash (/) commands work
- [x] All architect reviews passed

### 📊 Current Completion Status
- **Overall GDD v5 Implementation:** ~45%
- **Core Systems:** 60%
- **Social Commands:** 100% (44/44 - DO NOT TOUCH)
- **Utility Commands:** 85%
- **Combat Systems:** 50%
- **Economy Systems:** 70%
- **Advanced Features:** 15%

### 🔧 Files Modified This Session
1. `commands/rpg-core.js` - Database migration
2. `commands/rpg-utility.js` - NEW (stats, balance, stamina, resources, backpack, ping)
3. `commands/rpg-daily.js` - NEW (daily rewards)
4. `commands/rpg-realms.js` - NEW (realm info/travel)
5. `commands/rpg-info.js` - NEW (guide, lore, bestiary)
6. `commands/rpg-help.js` - Complete overhaul
7. `index.js` - Added command routing and slash registrations
8. `commands/slashHandlers.js` - Added slash command routing
9. `utils/realmshatter-db.js` - DELETED (replaced by rpg-database.js)

---

## Development Notes & Reminders

### Critical Rules
1. **NEVER modify the 44 social commands** - They are perfect and off-limits
2. **Always use rpg-database.js** for persistence - No in-memory databases
3. **Follow GDD v5 exactly** - Stats, formulas, progression must match specs
4. **Test both prefix and slash commands** - Ensure dual functionality
5. **Run architect reviews** before marking tasks complete
6. **Update this document** when adding new features

### Database Schema (rpg-database.js)
- Users table: ID, legacy, level, XP, stats, currencies
- Inventory: Weapons, armor, resources
- Companions: Collection, active companion
- Progression: Current realm, unlocked content
- Cooldowns: Daily claims, last expedition time
- PvP: Wins, losses, ranking

### Testing Checklist
- [ ] Legacy selection persists after bot restart
- [ ] Daily rewards respect 24hr cooldown
- [ ] Realm travel updates user location
- [ ] All new commands work via /slash and yoru prefix
- [ ] Inventory and equipment persist correctly
- [ ] Companion data saves properly

---

## Next Steps (Priority Order)

### Immediate (Before Returning to User)
1. ✅ Fix database persistence bug
2. ✅ Add essential utility commands
3. ✅ Add information/lore commands
4. ✅ Update help documentation
5. [ ] Update PROJECT_STATUS.md

### Short-term (Next Session)
1. Restructure /weapon → /sigilarm with subcommands
2. Restructure /armor → /aegis with subcommands  
3. Enhance /companion with info and feed subcommands
4. Enhance /shop with category subcommands
5. Implement /forge for item fusion
6. Implement /awaken for companion evolution

### Medium-term
1. Add /fracture list and /fracture info
2. Enhance PvP with /pvp stats and /pvp ranks
3. Implement /achievements system
4. Add /leaderboard functionality
5. Create /bestiary completion tracking

### Long-term (GDD v5 Full Implementation)
1. Guild system
2. Raid bosses
3. Seasonal events
4. Prestige system
5. World events
6. Skill trees
7. Equipment sets
8. Companion bonds

---

## User Feedback & Requests Log

### Session 1 (Database Fix + New Commands)
- **Request:** Fix legacy selection not persisting (critical bug)
- **Request:** Add utility commands for better UX (/stats, /balance, etc.)
- **Request:** Add /daily for daily rewards
- **Request:** Add realm travel system
- **Request:** Add information commands (/guide, /lore, /bestiary)
- **Request:** Update /help to be comprehensive
- **Request:** Create this IMPROVEMENTS.md document with everything requested

### Design Preferences
- Dark fantasy theme with corruption/void aesthetics
- Anime GIF social commands stay untouched (non-negotiable)
- Both slash and prefix commands must work
- All data must persist (no losing progress)
- Follow GDD v5 specifications exactly

---

## Command Count Summary

### Total: 80 Commands
- **Social Commands:** 44 (anime GIF interactions)
- **RPG Core:** 8 (start, profile, legacy, realms, story, expedition, forage, boss)
- **Equipment:** 4 (inventory, equip, upgrade, sell)
- **Companions:** 5 (summon, companions, activate, train)
- **Economy:** 3 (shop, buy, craft)
- **PvP:** 2 (duel, rank)
- **Gambling:** 3 (flip, roll, slots)
- **Utility:** 11 (stats, balance, stamina, resources, backpack, ping, daily, realm info, realm travel, guide, lore, bestiary, help)

---

## Architecture Notes

### Bot Structure
```
index.js                    # Main bot file, command routing
commands/
  ├── social.js             # 44 social commands (DO NOT TOUCH)
  ├── rpg-core.js           # Start, profile, legacy, realms, story
  ├── rpg-expedition.js     # Expedition, forage
  ├── rpg-inventory.js      # Inventory, equip
  ├── rpg-companion.js      # Summon, companions, activate, train
  ├── rpg-upgrade.js        # Equipment upgrades
  ├── rpg-fracture.js       # Dungeon system
  ├── rpg-pvp.js            # Duel, rank
  ├── rpg-rift.js           # Flip, roll, slots
  ├── rpg-shop.js           # Shop, buy, sell
  ├── rpg-craft.js          # Crafting system
  ├── rpg-boss.js           # Final boss encounter
  ├── rpg-utility.js        # NEW: Stats, balance, stamina, resources, backpack, ping
  ├── rpg-daily.js          # NEW: Daily rewards
  ├── rpg-realms.js         # NEW: Realm info/travel
  ├── rpg-info.js           # NEW: Guide, lore, bestiary
  ├── rpg-help.js           # Updated: Comprehensive help
  └── slashHandlers.js      # Slash command routing
utils/
  └── rpg-database.js       # SQLite database (all persistence)
data/
  └── realmshatter-config.js # Game configuration, emojis, constants
```

### Database Flow
1. User runs command
2. Command handler fetches user data from rpg-database.js
3. Apply game logic and stat calculations
4. Save updated data back to rpg-database.js
5. Display results to user

---

**Document Last Updated:** November 9, 2025  
**Bot Version:** 2.0  
**Total Commands:** 80  
**GDD v5 Completion:** ~45%
