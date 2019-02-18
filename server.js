//server.js
//where the node app starts

//init express
const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/', function(request, response) {
  response.send("Running botserver");
});
const listener = app.listen(process.env.PORT, function() {
  console.log('Sif Casino listening on port ' + listener.address().port);
});
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./ls');
  var ls = require("./ls");
}

//Discord.js initialized
const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = "/";

//Constants required
const constants = require("./constants");

function ifProfile(authorid) {
  if (ls.get(authorid + "profile") && Number(ls.get(authorid + "profile")) >= -10) {
      var profile = ls.get(authorid + "profile");
      }
  else if (Number(ls.get(authorid + "profile")) < -10) {
    var profile = false;         
  }
  else {
   var profile = false; 
  }
  return profile;
}

client.on('guildCreate', guild => {
    guild.channels.get(guild.channels.find("name", "general").id).send("Thanks for adding Sif Casino to your guild! Use the command /sifcasino to get started.");
  guild.createRole({
    name: "Casino",
    color: "#593695"
  }).then(role => guild.member(client.user).addRole(role)).catch(console.error);
});

client.on('ready', () => {
    console.log('Sif Casino is up and running!');
    client.user.setActivity('/sifcasino', { type: 'STREAMING', url: 'https://www.twitch.tv/ishidres/video/264026461' });
});

client.on('message', message => {
  try {
   var splitter = message.content.replace(" ", ";:splitter185151813367::");
    var splitted = splitter.split(";:splitter185151813367::");
  var prefix;
    if (message.guild === null) {
      if (message.author.id != "501862549739012106") {
        message.reply("Sorry " + message.author.username + ", DM messages are not supported by this bot.");
      }
      return false;
    }
    if (ls.get(message.guild.id + "prefix")) {
        prefix = ls.get(message.guild.id + "prefix");
        }
      else {
         ls.set(message.guild.id + "prefix", "/");
          prefix = "/";
      }
  var fixRegExp = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  constants.setPrefix(prefix);
  var re = new RegExp(fixRegExp);
  var command = splitted[0].replace(re, "");
  if (splitted[1]) {
    var args = splitted[1].split(" ");
  }
  else {
   var args = false; 
  }
  
  if (message.content == "/sifcasino") {
      message.author.send(constants.help("main"));
      message.author.send(constants.help("main2"));
      message.author.send(constants.help("ext"));
  }
  else if (message.content == "/fetch prefix") {
    message.channel.send(`The prefix for this guild is ${prefix}`);
  }
  if (message.author.bot) {
     return false; 
  }
  var pColor = message.content.toLowerCase();
  var asyncUser = require("./asyncUser");
  if ((pColor == "green" || pColor == "red" || pColor == "black") && asyncUser.getUserObj(message.author).awaitRoulette) {
    command = "rouletteSpin";
  }
  else if (command == "rouletteSpin") {
    command = "casino";
  }
  if (ls.get(message.author.id + "profile") && Number(ls.get(message.author.id + "profile")) >= -10) {
      ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + 1);
      var profile = ls.get(message.author.id + "profile");
      }
  else if (Number(ls.get(message.author.id + "profile")) < -10) {
    var profile = false;         
  }
  else {
     var profile = constants.profileStarterAmount; 
  }
  //Init simplify.js
  var simpjs = require("./simplify");
  //Check for command:
  switch (command) {
    case "casino":
        message.author.send(constants.help("main"));
        message.author.send(constants.help("main2"));
        message.author.send(constants.help("ext"));
      break;
    case "reset":
        ls.set(message.author.id + "profile", 0);
        profile = 0;
        message.channel.send("Balance reset to 0");
      break;
    case "roulette":
        var roulette = require("./roulette");
        message.channel.send(roulette.specifyBet(args, ifProfile(message.author.id), prefix, message));
      break;
    case "rouletteSpin":
        var roulette = require("./roulette");
        message.channel.send(roulette.spin(message.content, ifProfile(message.author.id), prefix, message));
      break;
    case "jackpot":
        var jackpot = require("./jackpot");
        if (args[0] == "end") {
          message.channel.send(jackpot.end(message));
        }
        else {
          message.channel.send(jackpot.start(args, ifProfile(message.author.id), prefix, message));
        }
      break;
    case "bs":
        var battleship = require("./battleship");
        message.channel.send(battleship.start(args, ifProfile(message.author.id), prefix, message));
      break;
    case "bsguess":
        var battleship = require("./battleship");
        message.channel.send(battleship.guess(args, message));
      break;
    case "double":
        var double = require("./double");
        if (ls.exist(message.author.id + "doubleGame")) {
          throw "GameExistenceError: User already has a game running!\nAt server.js:154:5\nAt discord.js\nAt client.bot.Sif_Casino";
        }
        else {
          message.channel.send(double.dble(args, ifProfile(message.author.id), prefix, message));
        }
      break;
    case "coin":
        var coin = require("./coinflip");
        message.channel.send(coin.flip(args, ifProfile(message.author.id), prefix, message));
      break;
    case "dice":
        var dice = require("./dice");
        message.channel.send(dice.roll(args, ifProfile(message.author.id), prefix, message));
      break;
    case "user:all":
        message.channel.send(simpjs.simplify.users.getUser(message.author));
        message.channel.send(simpjs.simplify.users.getRaw.getUserID(message.author));
        message.channel.send(simpjs.simplify.users.getTag(message.author));
        //^ simplify.js first instance
      break;
    case "about":
      message.channel.send(simpjs.simplify.users.getRaw.getDateCreated("Sif Casino", "Created by " + simpjs.simplify.users.getRaw.getCreator() + "#2753. Built on simplifyJS (for discord), discord.js, and NodeJS.\nDo `" + prefix + "casino` to view a list of the commands.\nGithub: https://github.com/Cannicide/sif-casino/ \nInvite link: ||https://discordapp.com/api/oauth2/authorize?client_id=501862549739012106&permissions=470076480&scope=bot|| \nBot Support Server: https://discord.gg/wYKRB9n"));
    break;
    case "prefix":
      if (simpjs.discrim(message.member)) {
        var nPref = args[0];
        if (nPref.length > 1) {
          //Too long prefix
          message.channel.send("Error LengthException: Prefixes can only be at max one character long.");
        }
        else if (!nPref) {
          //No prefix specified, send how to do command
          message.channel.send(`**Usage of ${prefix}prefix**\n\n \`n${prefix}prefix [new prefix character]\`\n__Ex:__\`\`\`${prefix}prefix ?\`\`\`\nThe shown example will set the prefix to ?`);
        }
        else {
          //Change the prefix
          ls.set(message.guild.id + "prefix", nPref);
          prefix = nPref;
          message.channel.send(`Set the server's prefix to ${nPref}. Use \`/fetch prefix\` to identify this guild's current prefix.`);
        }
      }
      else {
        //Doesn't have admin perms
        message.channel.send("Error PermissionError: You do not have the `ADMINISTRATOR` permission required to do this.");
      }
    break;
    case "guess":
        throw "CommandUtilizationError: This command does not exist yet!";
      break;
    case "hm":
        //Hangman game commands
        var hm = require("./hangman");
        message.channel.send(hm.do(args, ifProfile(message.author.id), prefix, message));
      break;
    case "blackjack":
        var blackjack = require("./blackjack");
        if (ls.exist(message.author.id + "blackjackGame")) {
          throw "GameExistenceError: User already has a game running!\nAt server.js:201:5\nAt discord.js\nAt client.bot.Sif_Casino";
        }
        else {
          message.channel.send(blackjack.start(args, ifProfile(message.author.id), prefix, message));
        }
      break;
    case "hit":
        //blackjack hit-subcommand AND double subcommand
        var blackjack = require("./blackjack");
        var double = require("./double");
        if (ls.exist(message.author.id + "blackjackGame")) {
          message.channel.send(blackjack.hit(message.author, message, prefix));
        }
        else if (ls.exist(message.author.id + "doubleGame")) {
          message.channel.send(double.hit(prefix, message, ifProfile(message.author.id)));
        }
        else {
          throw "GameExistenceError: User does not have a blackjack or double game running.\nAt server.js:224:15\nAt discord.js\nAt client.bot.Sif_Casino";
        }
      break;
    case "stand":
        //blackjack stand-subcommand AND double subcommand
        var blackjack = require("./blackjack");
        var double = require("./double");
        if (ls.exist(message.author.id + "blackjackGame")) {
          message.channel.send(blackjack.stand(message));
        }
        else if (ls.exist(message.author.id + "doubleGame")) {
          message.channel.send(double.stand(message));
        }
        else {
          throw "GameExistenceError: User does not have a blackjack or double game running.\nAt server.js:235:15\nAt discord.js\nAt client.bot.Sif_Casino";
        }
      break;
    case "donate":
        var donate = require("./donate");
        var receiver = message.mentions.users.first();
        if (!receiver) {
          message.channel.send("Please specify a valid user and amount to donate to them.\nUse `" + prefix + "donate [user] [donation]` to continue.\nExample: `" + prefix + "donate @Cannicide#2753 5000`");
        }
        else if (receiver.id == message.author.id) {
          message.channel.send("You cannot donate to yourself.");
        }
        else {
          message.channel.send(donate.toUser([receiver, args[1]], ifProfile(message.author.id), ifProfile(receiver.id), prefix, message));
        }
      break;
    case "profile":
      if (ls.get(message.author.id + "profile") && profile) {
        var donations = 0;
        if (ls.get(message.author.id + "donations")) {
          donations = ls.get(message.author.id + "donations");
        }
        message.channel.send(`${message.author.username} has $${Number(profile).toLocaleString()}.\nAmount Donated: $${Number(donations).toLocaleString()}.`);
      }
      else {
         message.channel.send(`Use ${prefix}create to create a casino profile.`); 
      }
      break;
    case "balance":
      if (ls.get(message.author.id + "profile") && profile) {
        message.channel.send(`${message.author.username} has $${Number(profile).toLocaleString()}.`);
      }
      else {
         message.channel.send(`Use ${prefix}create to create a casino profile.`); 
      }
      break;
    case "create":
      if (ls.get(message.author.id + "profile") && profile) {
        message.channel.send("You already have a casino profile.");
      }
      else {
       profile = constants.profileStarterAmount;
       ls.set(message.author.id + "profile", profile);
        message.channel.send(`Created a profile for ${message.author.username} with a beginning amount of $50.`);
      }
      break;
    case "delete":
      if (ls.get(message.author.id + "profile") <= -1) {
         message.channel.send("Account deleted.");
          ls.set(message.author.id + "profile", -100);
      }
      else {
         message.channel.send("Are you sure you want to delete your casino account? Type `" + prefix + "delete` again to delete your account. This action is irreversible."); 
        ls.set(message.author.id + "profile", -5);
      }
      break;
    default:
      //External commands go here
      var external = require("./external");
      Object.keys(external.commands).forEach(function(key) {
        if (external.commands[key].name.toLowerCase() == command) {
          var secondaryCache = [prefix, ifProfile(message.author.id)];
          message.channel.send(external.commands[key].get(args, message, secondaryCache));
        }
      });
  }
  }
  catch(err) {
    message.channel.send(`Errors found:\n\`\`\`${err}\nAt ${err.stack}\`\`\``);
  }
});

client.login("your token here");