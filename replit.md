# 🌙 Yoru - The Anime Game Bot

## Overview
Yoru is a cyberpunk-themed anime Discord bot inspired by OwO, featuring:
- Anime social interactions (kiss, hug, slap, pat, cuddle, blush, bonk) with GIF integration
- RPG game mechanics set in "The Hackverse"
- Economy system with Credits (₿), Fragments (💠), and Energy (⚡)
- Weapon shop with rarity tiers (Common, Rare, Epic, Legendary)
- Beautiful neon aesthetic with purple/cyan/pink color scheme

## Recent Changes
- **Nov 9, 2025**: Successfully imported and configured for Replit
  - Moved project files from nested directory structure to root
  - Installed all npm dependencies (discord.js, better-sqlite3, node-fetch)
  - Configured workflow to run the bot automatically
  - Set up DISCORD_BOT_TOKEN environment variable
  - Bot successfully connected and registered 69 slash commands
  - Added .gitignore for Node.js best practices
  
- **Oct 30, 2025**: Added slash command (/) support
  - Implemented full Discord slash command integration
  - All 54 commands now available as both `/command` and `yoru command`
  - Auto-complete for user mentions in slash commands
  - Professional parameter hints and descriptions
  - Fixed mock message adapter for proper slash command handling
  
- **Oct 30, 2025**: Expanded to 44 anime GIF social actions
  - Added 37 new social action commands (total now 44!)
  - Categories: Affection, Physical, Emotions, Reactions, Gestures
  - Fixed message fallback system to use generic cyber-themed messages
  - Updated help command with organized categorization
  - All actions support both solo and paired interactions where appropriate
  
- **Oct 30, 2025**: Initial project setup
  - Created complete bot structure with modular command system
  - Integrated nekos.best and waifu.pics APIs for anime GIFs with fallback support
  - Implemented core social action commands with working GIF functionality
  - Built complete game loop: hack, scan, daily, work commands
  - Added economy system: profile, inventory, shop, buy, equip
  - Created cooldown system to prevent spam
  - Added XP and leveling system with level-up notifications
  - Implemented SQLite database for persistent data storage

## Project Architecture

### File Structure
```
yoru-bot/
├── index.js              # Main bot entry point
├── config.js             # Bot configuration, weapons, jobs, colors
├── commands/
│   ├── social.js         # Social interaction commands (kiss, hug, etc.)
│   ├── game.js           # Game commands (hack, scan, daily, work)
│   ├── economy.js        # Economy commands (shop, buy, inventory, equip)
│   └── help.js           # Help command
├── utils/
│   ├── database.js       # In-memory user data management
│   ├── getGif.js         # GIF fetching from APIs with fallback
│   ├── cooldowns.js      # Cooldown management system
│   └── randomText.js     # Random messages for actions
└── package.json          # Dependencies
```

### Key Dependencies
- discord.js v14 - Discord bot framework
- node-fetch v3 - HTTP requests for GIF APIs

### APIs Used
- nekos.best API (primary) - Anime GIFs, no auth required
- waifu.pics API (fallback) - Anime GIFs including male characters

## User Preferences
- Wants both male and female character GIFs (supported via waifu.pics)
- Prefers neon cyberpunk aesthetic with anime cuteness
- Wants beautiful, engaging UI with embeds
- Likes OwO-style social interactions with more features

## Environment Setup
Required environment variable:
- `DISCORD_BOT_TOKEN` - Your Discord bot token from Discord Developer Portal (already configured)

## Running the Bot
The bot runs automatically via the "Discord Bot" workflow. It will:
- Connect to Discord using your bot token
- Register all slash commands globally
- Start listening for both text commands (prefix: `yoru`) and slash commands
- Use SQLite database for persistent storage (data/realmshatter.db)

## Commands

### Social Actions (5s cooldown)
- `yoru kiss @user` - Kiss someone
- `yoru hug @user` - Give a warm hug
- `yoru slap @user` - Slap someone back to reality
- `yoru pat @user` - Pat someone's head
- `yoru cuddle @user` - Cuddle together
- `yoru blush` - Show embarrassment
- `yoru bonk @user` - Bonk to horny jail

### Game Commands
- `yoru start` - Create your profile and begin journey
- `yoru hack` - Hack nodes for credits/fragments (costs 1⚡, 10s cooldown)
- `yoru scan` - Scan for artifacts (costs 2⚡, 15s cooldown)
- `yoru daily` - Claim daily rewards (24h cooldown)
- `yoru work` - Work for credits and energy (20s cooldown)

### Economy
- `yoru profile` - View your stats and level
- `yoru inventory` - Check owned items
- `yoru shop` - Browse weapons
- `yoru buy <number>` - Purchase weapon from shop
- `yoru equip <weapon>` - Equip a weapon

## Next Phase Features (Not Yet Implemented)
- PostgreSQL database for persistent storage
- Duel system for PvP battles
- Forge and upgrade commands
- Leveling rewards that unlock commands
- Special events (Nightfall Raid, Cyber Bloom)
- Leaderboard/rank system
- More weapon varieties and effects
