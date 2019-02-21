# Sif Casino
A separate terrible discord.js javascript bot for the casino commands for Sif.


## Getting Started
Building a discord bot? Sif Casino can help! Start yourself off by installing node.js and NPM on your computer or server, in a specific
folder (we'll name it `bot`, but you can name it whatever you like). Import the necessary dependencies by running the command line in
your bot folder. You can start off by running the command `npm install discord-js` to obtain the necessary discord.js files and dependencies.

Next, create a javascript file to host your bot's main code. I've named mine `server.js`. Open it in your preferred code editor.
Check out the discord.js docs for examples of how to build a basic bot that checks for commands.

Inside the block of code that checks for the onMessage event, add conditional statements to check for specific commands that you want your
users to call from within discord. You can view my `server.js` file for examples. Now, to begin with how Sif Casino can assist your bot's
functions!

If you are building a casino or music bot, Sif Casino already has node modules written by me to deal with specific games and playing music
with discord.js. Simply open this repository, download, and save any of the files you require to your bot folder. For this example, we will
assume you are building a bot with only music and blackjack commands.

You want your users to use the `play` command to play music in a voice channel, if they're in one. No need to write 53 lines of code, it's as
simple as:
```
  var music = require("./music");
  message.channel.send(music.play(["search term for youtube", "youtube API key"], message));
```
This code would be called within a conditional statement checking for a `play` command being executed. It's that simple.
Same thing with blackjack:
```
  var blackjack = require("./blackjack");
  message.channel.send(blackjack.start(args, casinoBalanceOfUser, commandPrefix, message));
```
In this example, args represents an array of all arguments passed to a command (i.e. the labeled args of `/blackjack arg1 arg2`), casinoBalanceOfUser
obviously represents the amount of money the user has, the commandPrefix is the prefix used in calling the command (for error message purposes),
and message is the message object itself.

This method works for every command in Sif Casino that has a separate file module for the purpose of running it.
See the `server.js` file and the module files themselves to discern how best to run the command function.

See the upcoming full documentation for Sif Casino for more information (not yet released).


## Usage
To use Sif Casino as a user/listener/gambler, do `/casino help` or `/sifcasino` in your server. To use Sif Casino as a private developer,
see the above **Getting Started** section. To contribute to Sif Casino with your own homemade file modules and commands, see the below
**External Developers** section.

## External Developers
This section is currently being worked on. Please be patient, this section will arrive very soon.

## Credits
Created by Cannicide#2753. This section is currently being worked on. Please be patient, this section will arrive very soon.
