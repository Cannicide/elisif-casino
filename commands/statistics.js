var Command = require('../command');
var Alias = require('../alias');
var Interface = require('../interface');

function Bot(client) {
    this.readyAt = "Ready at: " + client.readyAt;
    this.status = "Status: " + client.status + " (active)";
    this.guildList = function() {
        var guilds = client.guilds.array();
        return "Guilds: " + guilds.length;
    }
    this.ping = "Ping: " + client.ping + "ms";
    this.uptime = "Uptime: " + client.uptime + "ms";
    this.isBotObject = true;
}

function viewStats(Obj) {
    if (Obj.isBotObject) {
        return `${Obj.readyAt}\n${Obj.status}\n${Obj.guildList()}\n${Obj.ping}\n${Obj.uptime}\n\nMore statistics at:\nhttps://discordbots.org/bot/501862549739012106`;
    }
    else {
        return null;
    }
}

module.exports = {
    commands: [
        new Command("statistics", (message, args) => {

            var bot = new Bot(message.client);
            var embed = new Interface.Embed(message, "", [], viewStats(bot));
            embed.embed.title = "Statistics";

            message.channel.send(embed);

        }, false, false, "Views bot statistics, including ping, uptime, and number of guilds."),

        new Alias("stats", "statistics")
    ]
};