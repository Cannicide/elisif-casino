//Sends information about the bot.

var Command = require('../command');

module.exports = new Command("about", (message, args) => {

    message.channel.send("Elisif (formerly Sif Casino) was created on January 24th, 2019. Created by Cannicide#2753. Built on discord.js and Node/Express.\nDo `" + require('../settings').get(message.guild.id, "prefix") + "casino` to view a list of the commands.\nGithub: https://github.com/Cannicide/sif-casino/ \nInvite link: ||https://discordapp.com/api/oauth2/authorize?client_id=501862549739012106&permissions=470076480&scope=bot|| \nBot Support Server: Currently deleted (DM Cannicide directly if you need help).");

}, false, false, "Sends you important information about the bot.");