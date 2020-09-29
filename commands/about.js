//Sends information about the bot.

var Command = require('../command');
var Interface = require('../interface');

module.exports = new Command("about", (message, args) => {

    var res = ("Elisif (formerly Sif Casino) was created on January 24th, 2019.\nCreated by Cannicide#2753.\n\nDo `" + require('../settings').get(message.guild.id, "prefix") + "casino` to view a list of the commands.\n\n[Github Repo](https://github.com/Cannicide/elisif/)\n[Bot Invite Link](https://discord.com/oauth2/authorize?client_id=501862549739012106&permissions=1010167104&scope=bot)\n[Bot Website](https://google.com/#q=I+dont+have+a+website+yet)");

    var embed = new Interface.Embed(message, "https://images-ext-2.discordapp.net/external/4drkq2ygDPQKt-TGs7QzYXwPsRCueV8-XHF59EcEdqo", [], res);
    embed.embed.title = "About Elisif";

    message.channel.send(embed);

}, false, false, "Sends you important information about the bot.");