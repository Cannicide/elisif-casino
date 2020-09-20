//All commands relating to casino profile (such as /balance and /user:all)

var Command = require('../command');

module.exports = {
    commands: [
        new Command("user:all", (message, args) => {

            //TODO: Support a user argument to get info on other users

            message.channel.send(`**User Information**\n` + 
            `Name: ${message.author.username}\n` + 
            `Tag: ${message.author.tag}\n` + 
            `ID: ${message.author.id}`);

        }, false, false, "Get basic discord user information on yourself."), 

        new Command("profile", (message, args) => {
            // TODO: figure out system to fetch profile anywhere (create Profile class in this file)

            //var profile = new Profile(user id).getBal()
            //var prefix = settings.get(message.guild.id, "prefix");

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
        })

        //TODO: All of the other profile commands
    ]
}