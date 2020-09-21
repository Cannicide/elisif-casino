//All commands relating to casino profile (such as /balance and /user:all)

var Command = require('../command');
var evg = (require('../evg'))("profiles");
var settings = require('../settings');

function Profile(message, specifiedId) {

    var id = specifiedId || message.author.id;
    var storage;

    var defaultProfile = {
        balance: settings.get(message.guild.id, "startingBalance"),
        donations: 0
    }

    function generateProfileIfNoneExists() {
        storage = evg.get();

        if (id in storage) return;

        storage[id] = defaultProfile;
    }

    this.getBal = () => {
        generateProfileIfNoneExists();
        return storage["balance"];
    };

    this.getDonations = () => {
        generateProfileIfNoneExists();
        return storage["donations"];
    };

    function set(amount) {
        generateProfileIfNoneExists();
        storage["balance"] = Number(amount);
        evg.set(storage);
    }

    this.set = set;

    function add(amount) {
        set(Number(storage.balance) + Number(amount));
    }

    this.add = add;

    this.addForMessage = () => {
        add(settings.get("dollarsPerMessage"));
    }

    this.addDonation = (amount) => {
        generateProfileIfNoneExists();
        storage["donations"] = Number(storage["donations"]) + Number(amount);
        evg.set(storage);
    }


}

module.exports = {
    Profile: Profile,
    commands: [
        new Command("user:all", (message, args) => {

            //TODO: Support a user argument to get info on other users

            message.channel.send(`**User Information**\n` + 
            `Name: ${message.author.username}\n` + 
            `Tag: ${message.author.tag}\n` + 
            `ID: ${message.author.id}`);

        }, false, false, "Get basic discord user information on yourself."), 

        new Command("profile", (message, args) => {

            var profile = new Profile(message.author.id);
            var username = message.author.username;

            if (args.length >= 1) {
                var tag = args.toString().replace(/\]/g, "").replace(/ /g, "").split(",", 2)[1].replace(/,/g, " ");
                var found = message.guild.members.find(m => m.tag == tag);

                if (found) {
                    profile = new Profile(found.id);
                    username = found.username;
                }
                else {
                    message.channel.send(`You must specify both a valid username and tag to do that.\nEx: \`Cannicide#2753\``);
                    return;
                }
            }

            var bal = profile.getBal();
            var donations = profile.getDonations();

            message.channel.send(`${username} has $${Number(bal).toLocaleString()}.\nAmount Donated: $${Number(donations).toLocaleString()}.`);
        })

        //TODO: All of the other profile commands
    ]
}