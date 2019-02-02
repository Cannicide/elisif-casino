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
   var splitter = message.content.replace(" ", ";:splitter185151813367::");
    var splitted = splitter.split(";:splitter185151813367::");
  var prefix;
    if (ls.get(message.guild.id + "prefix")) {
        prefix = ls.get(message.guild.id + "prefix");
        }
      else {
         ls.set(message.guild.id + "prefix", "/");
          prefix = "/";
      }
  var re = new RegExp(prefix);
  var command = splitted[0].replace(re, "");
  if (splitted[1]) {
    var args = splitted[1].split(" ");
  }
  else {
   var args = false; 
  }
  
  if (message.content == "/sifcasino") {
      message.channel.send(constants.helpCommand);
  }
  if (message.author.bot) {
     return false; 
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
        message.channel.send(constants.helpCommand);
      break;
    case "roulette":
      
      break;
    case "double":
        var double = require("./double");
        message.channel.send(double.dble(args, ifProfile(message.author.id), prefix));
      break;
    case "coin":
        var coin = require("./coinflip");
        message.channel.send(coin.flip(args, ifProfile(message.author.id), prefix));
      break;
    case "dice":
        var dice = require("./dice");
        message.channel.send(dice.roll(args, ifProfile(message.author.id), prefix));
      break;
    case "user:all":
        message.channel.send(simpjs.simplify.users.getUser(message.author));
        message.channel.send(simpjs.simplify.users.getRaw.getUserID(message.author));
        message.channel.send(simpjs.simplify.users.getTag(message.author));
        //^ simplify.js first instance
      break;
    case "user:name":
      message.channel.send(simpjs.simplify.users.getUser(message.content.mentions.first()));
    break;
    case "user:tag":
      message.channel.send(simpjs.simplify.users.getTag(message.content.mentions.first()));
    break;
    case "user:id":
      message.channel.send(simpjs.simplify.users.getRaw.getUserID(message.content.mentions.first()));
    break;
    case "about":
      message.channel.send(simpjs.simplify.users.getRaw.getDateCreated("Sif Casino", "Created by " + simpjs.simplify.users.getRaw.getCreator() + "#2753. Built on simplifyJS (for discord), discord.js, and NodeJS."));
    break;
    case "guess":

    break;
    case "donate":
      
      break;
    case "profile":
      if (ls.get(message.author.id + "profile") && profile) {
        message.channel.send(`${message.author.username} has $${profile.toLocaleString()}.`);
      }
      else {
         message.channel.send(`Use ${prefix}create to create a casino profile.`); 
      }
      break;
    case "balance":
      if (ls.get(message.author.id + "profile") && profile) {
        message.channel.send(`${message.author.username} has $${profile.toLocaleString()}.`);
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
          message.channel.send(external.commands[key].get(args));
        }
      });
  }
});

client.login(process.env.TOKEN);