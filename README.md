# eidoclock-discord

Hello and welcome!

This Discord bot is designed to provide a relatively accurate Day/Night cycle for
Warframe - Plains of Eidolon expansion.


## Usage

The bot uses the raise symbol of `~` (tilde)

The only current commands supported are `~time` to get the current Cetus cycle and whether it's night or day. The other command is `~ver` to check the version of the bot that's running.

If you want to run this yourself you'll need to follow standard boilerplate for 
[Discord.io](https://github.com/izy521/discord.io)


## Adding this bot to your server

You can use [This link](https://discordapp.com/oauth2/authorize?client_id=370340578858237952&scope=bot&permissions=347200)


## History

- **v1.1.0**
    - The bot will now dynamically get the timestamp for calculating Cetus time (This is a major enhancement)


- **v1.0.3**
    - Adjusted the timestamp for the bot one more time (Accurate as of April 4th 2018)


- **v1.0.2**
    - Fixed start_time var after most recent patch [Merge from parent project here](https://github.com/lyneca/eidoclock/pull/5) - @lyneca 
    - Added version delcaration to startup messages


- **v1.0.1**
    - Added emojis to the main Discord message (because why not?)
    - Added a basic bot disconnect handler


- **v1.0.0**
    - Created a while new system for getting the correct time cycles
    - Removed unused and/or redundant code
    - Revised the help doc
    - Increased accuracy from several minutes to actual cycle time down to less than 5 seconds difference

- **v0.0.201**
    - Small changes to how the bot responds to user input


- **v0.0.187**
    - First Stable release


- **Alpha 0.0.173**
    - Borrowed code from: [warframe](https://github.com/EricSihaoLin/warframe) (now abandoned project) 


- **Alpha 0.0.10**
    - Initial test release


## Contributing

If you'd like to help contribute to this project or create a bot for another chat platform, feel free to
contact me! I've also done work on telegram/skype bots.