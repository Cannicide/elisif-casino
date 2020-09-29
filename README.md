# Elisif
Formerly known as Sif Casino, Elisif is an all-in-one casino, music, and moderation discord bot built with javascript.
Primarily a casino discord bot, with evolving customizability, tons of casino games, and modernized features rewritten from the old Sif Casino code.

## Backstory
I first wrote Sif Casino about 2 years ago (January 2019). It had deeply flawed, disorganized, inefficient code. About half a year after first writing Sif Casino, I made updates
to another of my bots, Project Sif, and rewrote a bit of Sif Casino to match Sif's efficiency.

And now, it's 2020. My ZH-bot and Scav-bot discord bots are over twenty times more efficient and neat than even Project Sif's code. So I began the weeks-long quest
of rewriting the entirety of Sif Casino, every single one of the 21 files, to better match the abilities of my latest bots. And the rewrite was a success!

Elisif is now incredibly modern and efficient. Commands like `/hit` and `/stand` were replaced with message collectors. The help command is no longer a long, ugly list, and instead
utilizes an interactive reaction pagination menu. All commands are loaded in via a highly automated, efficient command handler. Certain features that go far beyond
the bot's regular featureset, such as music, moderation, and logging, will be addable via toggleable extension packs that are included with the bot and are toggleable 
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

More customizability, especially for settings, will be coming soon in upcoming updates.

## Credits
**Created by Cannicide#2753**\
NPM Dependencies: express, discord.js, node-fetch, @discordjs/opus (far less dependencies than pre-2.0)\
API Dependencies: CannicideAPI (abstracts away fetching youtube audio and youtube video details)
