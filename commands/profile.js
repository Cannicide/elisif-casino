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

        }, false, false, "Get basic discord user information on yourself.")

        //TODO: All of the other profile commands
    ]
}