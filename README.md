# Elisif
Formerly known as Sif Casino, Elisif is an all-in-one casino, music, and moderation discord bot built with javascript.
Primarily a casino discord bot, with evolving customizability, tons of casino games, and modernized features rewritten from the old Sif Casino code.

## Usage

To run this bot, first clone the source code to your machine. Then, install all dependencies like so:
```
npm i
```

After dependencies are installed, get your bot credentials. If you have not yet created a bot user, create one [here](https://discord.com/developers/applications). Once you have created a bot user, copy its token. Replace `your token here` with your bot's token in the [.env file](https://github.com/Cannicide/elisif-casino/blob/master/.env). If you require a specific port to run your bot's webserver, you can also modify the port option in the env file; otherwise, the default port value will work.

After those steps have been finished, start the bot by running the following console command:
```
npm start
```

Note that this discord bot runs on discord.js v12, and does not use the latest versions of the Discord API. As such, intents are not required to use the bot. However, since the API version being used is currently deprecated, the bot may stop working in the future. It was last tested successfully in September 2020.

## Backstory
I first wrote Sif Casino about 2 years ago (January 2019). It had deeply flawed, disorganized, inefficient code. About half a year after first writing Sif Casino, I made updates
to another of my bots, Project Sif, and rewrote a bit of Sif Casino to match Sif's efficiency.

And now, it's 2020. My ZH-bot and Scav-bot discord bots are over twenty times more efficient and neat than even Project Sif's code. So I began the weeks-long quest
of rewriting the entirety of Sif Casino, every single one of the 21 files, to better match the abilities of my latest bots. And the rewrite was a success!

Elisif is now incredibly modern and efficient. Commands like `/hit` and `/stand` were replaced with message collectors. The help command is no longer a long, ugly list, and instead
utilizes an interactive reaction pagination menu. All commands are loaded in via a highly automated, efficient command handler. Certain features that go far beyond
the bot's regular featureset, such as music, moderation, and logging, will be addable via extension packs that are included with the bot and are toggleable 
(like modules). And Elisif has never been more customizable. When the Settings Update releases, the bot will go far beyond its current ability to change the command prefix
in your guild: extensions will be able to be enabled/disabled, command and music channels will be able to be set, guild starting balance will be customizable, battleship
turn limits will be modifiable, dollars per message will be customizable with limits, custom commands will be addable, and the bot will have an option to be disabled 
in your guild if you want to disable it.

## Features
Current features of Elisif as of 9/29/2020:
- Casino games (battleship, blackjack, coinflip, dice, double, hangman, jackpot, roulette)
- Paginated help command
- Bot statistics
- Prefix customization
- Profile management (profile and balance commands, donation command, profile deletion and reset commands)
- Automatic profile creation (`/profile create` is no longer necessary; profiles are auto-created!)
- Message collectors (makes blackjack, double, and roulette interactive)
- Guild co-op (hangman and jackpot can be played along with guild members)
- Settings manager (no settings command yet, though)
- EvG-based storage system (along with LSON), replacing the old LS system
- Message interpreter, which interprets non-command messages (currently used to add money on message send)
- Modernized music (play, stop, pause, resume, skip, queue, and songcontrols commands)
- Songcontrols command, which uses reaction collectors to produce one-click command-less queue manipulation (looping, previous song, next song)
- And best of all, Elisif is open-source. All of my code for these features is available to you under the MIT license.

Additions and fixes as of 4/27/2022:
- Package.json is now provided in the code
- Example .env file is now provided in the code
- Dependencies have been updated to remove severe vulnerabilities in outdated versions
- The code now automatically loads environment variables from the .env file
- README updated with usage and other useful information, as well as notices of current issues

More customizability, especially for settings, was being worked on in upcoming updates, but will no longer be released for Elisif Casino. Instead, those features were implemented in my custom discord.js extension libraries, [node-elisif](https://www.npmjs.com/package/elisif) and [elisif-simple](https://www.npmjs.com/package/elisif-simple), which are both immensely updated and evolved versions of this bot's systems. The node-elisif library is currently being upgraded to discord.js v13, but as of April 2022, the stable version is still running on discord.js v12. I am no longer going to be updating Elisif Casino apart from minor bugfixes, and will instead be working on entirely new Discord bots (powered by the in-progress discord.js v13 version of node-elisif) making use of newer and cooler features.

## Credits
**Created by Cannicide#2753**\
NPM Dependencies: express, discord.js, node-fetch, @discordjs/opus, dotenv (far less dependencies than pre-2.0)\
API Dependencies: CannicideAPI (abstracts away fetching youtube audio and youtube video details)

Note: My CannicideAPI service is currently down. I cannot afford to keep it up 24/7 in the same manner it used to be for the past two or so years. Thus, playing audio with the music extension will no longer be functional unless you roll your own HTTP server or code to serve the audio, fetch the song details, etc. I will not be bringing the CannicideAPI service back up.