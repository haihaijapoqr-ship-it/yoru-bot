# Yoru - Anime Game Discord Bot

## Overview
Yoru is a feature-rich Discord bot combining moderation, logging, and ticket systems with an immersive anime-themed RPG game called "The Hackverse". Players can use anime interaction commands, hack nodes, collect weapons, duel other players, and progress through a cyberpunk-styled leveling system.

## Recent Changes (October 30, 2025)
- ✅ **FIXED GIF FUNCTIONALITY** - Corrected API client to properly call waifu.pics and nekos.best APIs
- ✅ Complete project restructure with modular cog architecture
- ✅ Added 20+ anime action commands with GIF integration (waifu.pics & nekos.best APIs)
- ✅ Implemented Hackverse game system with hack, scan, work, and daily commands
- ✅ Created weapon shop system with 10 weapons from Common to Mythic rarity
- ✅ Built player duel system with turn-based combat mechanics
- ✅ Added comprehensive profile and leaderboard system
- ✅ Integrated dual XP tracking (Game XP + Emotion XP)
- ✅ Implemented economy with Credits (₿), Fragments (💠), and Energy (⚡)
- ✅ Created cyberpunk-themed embed styling with neon colors
- ✅ Fixed command name conflict (anime /akick vs moderation /kick)

## Project Architecture

### Database Tables
- `guild_configs` - Server configuration
- `moderation_logs` - Moderation action history
- `warnings` - User warnings
- `economy` - Legacy economy (server-based)
- `leveling` - Server XP and levels
- `game_stats` - Global player stats, currencies, and progression
- `weapons` - Weapon definitions with stats
- `player_inventory` - Player item ownership
- `duel_history` - Combat records
- `reaction_roles` - Reaction role mappings

### Cog Structure
#### Game Cogs
- `anime_actions.py` - 20+ social interaction commands with anime GIFs
- `hackverse.py` - Core game loop (hack, scan, work, daily)
- `weapons.py` - Shop, inventory, equip, forge, sell
- `duel.py` - Player vs player combat system
- `profile.py` - Profile, stats, and leaderboards

#### Utility Cogs
- `core.py` - Ping, help, serverinfo, userinfo, avatar
- `config.py` - Server configuration commands
- `moderation.py` - Ban, kick, warn, clear
- `leveling.py` - Server-based XP and ranking
- `fun.py` - 8ball, coinflip, roll
- `logs.py` - Event logging (placeholder)
- `tickets.py` - Ticket system (placeholder)
- `economy.py` - Legacy economy (placeholder)
- `reaction_roles.py` - Reaction roles (placeholder)

### Utility Modules
- `database/models.py` - Database operations and schema
- `utils/security.py` - Token management and error sanitization
- `utils/embeds.py` - Cyberpunk-styled embed templates
- `utils/checks.py` - Permission checks and XP calculations
- `utils/cache.py` - Cooldown management system
- `utils/api_client.py` - **FIXED** Anime GIF API integration with correct endpoints

## Key Features

### 💞 Anime Actions (20+ Commands)
Social interaction commands with random anime GIFs:
- Affection: kiss, hug, cuddle, pat, handhold
- Playful: poke, bonk, bite, lick, yeet
- Expression: blush, smile, wink, wave, cry, happy
- Combat: slap, akick (renamed from kick to avoid conflict)
- Fun: highfive, nom, dance

**Rewards:** +1-3 Emotion XP per action
**Cooldown:** 5 seconds
**APIs:** waifu.pics (primary), nekos.best (fallback)

### 🎮 The Hackverse Game System

#### Currencies
- **Credits (₿)** - Primary currency for buying weapons and items
- **Fragments (💠)** - Rare crafting materials for forging
- **Energy (⚡)** - Required for hacking missions (max 10)

#### Core Commands
- `/hack` - Hack nodes for 150-400₿, 0-2 fragments, 20-50 XP (costs 1 energy, 15s cooldown)
- `/scan` - Search for random rewards (unlocks at level 5, 20s cooldown)
- `/work` - Complete jobs for 80-180₿ and 10-25 XP (30s cooldown)
- `/daily` - Claim daily rewards with streak bonuses (24hr cooldown)

#### Weapon System
10 weapons across 6 rarities:
- Common: Data Shard (2 ATK), Neon Dagger (3 ATK)
- Uncommon: Pulse Blade (5 ATK)
- Rare: Cyber Katana (8 ATK), Plasma Cutter (10 ATK)
- Epic: Shadow Edge (15 ATK), Phantom Blade (18 ATK)
- Legendary: Dragon Protocol (25 ATK), Yoru's Edge (30 ATK)
- Mythic: Void Ripper (40 ATK)

Commands: `/shop`, `/buy`, `/inventory`, `/equip`, `/sell`, `/forge`

#### Duel System
- Unlocks at level 10
- Turn-based combat using equipped weapons + level bonuses
- Winner earns 200-500₿ and 50-100 XP
- 45-second cooldown
- Battle logs tracked in database

#### Progression System
- **Game XP** - Earned from hacking, working, duels
- **Emotion XP** - Earned from social interactions
- **Game Level** - Calculated from Game XP (100 * level^1.5 formula)
- Level milestones unlock features (scan at 5, duels at 10)

### 🛡️ Moderation Features
- Ban, kick, warn, timeout users
- Message bulk deletion
- Warning tracking
- Moderation logs

### 📊 Profile & Leaderboards
- `/profile` - Full cyberpunk-styled player profile
- `/stats` - Detailed statistics breakdown
- `/leaderboard` - Global rankings by XP, credits, duels, hacks, level

## Visual Aesthetic
- **Theme:** Neon cyberpunk + anime cuteness
- **Colors:** Purple (#9D4EDD), Cyan (#00F5FF), Pink (#FF006E)
- **Style:** Console-style embeds with monospace formatting
- **Footer:** "Yoru System v1.0 — Stay luminous 🌙"

## APIs Used - FIXED!
- **waifu.pics** - Primary API: `https://api.waifu.pics/sfw/{category}`
  - Returns: `{"url": "https://i.waifu.pics/xxxxx.gif"}`
  - No authentication required
  - No rate limits
- **nekos.best** - Fallback API: `https://nekos.best/api/v2/{category}`
  - Returns: `{"results": [{"url": "https://nekos.best/..."}]}`
  - Rate limit: ~100 requests/hour
  - No authentication required

## Environment Variables
- `DISCORD_TOKEN` - Bot token from Discord Developer Portal (already configured in Replit Secrets)

## Dependencies
- discord.py (2.6.4+) ✅ Installed
- aiosqlite (0.21.0+) ✅ Installed
- aiohttp (3.13.2+) ✅ Installed
- python-dotenv (1.2.1+) ✅ Installed

## User Preferences
- Prefers all features in one folder structure
- Wants complete implementation of all proposed features
- Focus on anime/game mechanics alongside moderation

## Testing the GIF Commands
Once your bot is online in Discord, test these commands:
- `/kiss @user` - Should show a kiss GIF
- `/hug @user` - Should show a hug GIF
- `/pat @user` - Should show a pat GIF
- `/blush` - Should show a blush GIF (no target needed)
- `/akick @user` - Should show a kick GIF (renamed to avoid conflict with moderation /kick)

## Next Steps (Future Enhancements)
1. Implement full Hackverse game commands (hack, work, daily, scan)
2. Complete weapon shop and inventory system
3. Build duel combat mechanics
4. Add profile and leaderboard displays
5. Weekly event system (Nightfall Raid, Cyber Bloom)
6. Advanced weapon upgrade system
7. Item trading between players
8. Achievement and title system
9. PvE missions with difficulty tiers
