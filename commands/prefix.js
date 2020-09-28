// Gets or sets the prefix of the guild. 

var Command = require('../command');

var settings = require('../settings');

module.exports = new Command('prefix', (message, args) => {

    var nPref = args[0];
    if (nPref && nPref.length > 1) {
        //Too long prefix
        message.channel.send(`Sorry ${message.author.tag}, prefixes can only be at max one character long.`);
    }
    else if (!nPref) {
        //No prefix specified, instead get and send the prefix
        var currentPrefix = "/";

        currentPrefix = settings.get(message.guild.id, "prefix");

        message.channel.send(`**Prefix of ${message.guild.name}**: ${currentPrefix}`);
    }
    else {
        //Change the prefix

        settings.set(message.guild.id, "prefix", nPref);
        message.channel.send(`Set the server's prefix to ${nPref}. Use \`/elisifprefix\` to identify this guild's current prefix.`);
    }

}, {
    perms: [
        "ADMINISTRATOR"
    ]
}, false, "Gets or sets the prefix of the guild.").attachArguments([
    {
        name: "prefix",
        optional: true
    }
]);