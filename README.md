# RacingNation

A Discord bot for the Racing Nation community with moderation and utility commands.

## Features

- **Moderation Commands**: Kick, ban, mute, warn, purge, role management, channel controls
- **Utility Commands**: Ping, uptime, server info, user info, avatar, invite, vote, etc.
- **Role-based Access**: Moderation commands require 'Race Control' role

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file with your Discord bot token: `DISCORD_TOKEN=your_token_here`
3. Run the bot: `node bot.js`

## Commands

The bot registers 25 slash commands automatically on startup.

### Moderation (requires Race Control role)
- `/kick`, `/ban`, `/mute`, `/unmute`, `/warn`, `/warnings`
- `/purge`, `/nick`, `/roleadd`, `/roleremove`
- `/lock`, `/unlock`, `/slowmode`, `/announce`

### Utility
- `/ping`, `/uptime`, `/botinfo`, `/serverinfo`
- `/userinfo`, `/roles`, `/avatar`, `/channelinfo`
- `/invite`, `/randommember`, `/countroles`, `/vote`, `/say`, `/serverbanner`
