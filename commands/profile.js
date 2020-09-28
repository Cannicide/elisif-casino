//All commands relating to casino profile (such as /balance and /user:all)

var Command = require('../command');
var Alias = require('../alias');
var Interface = require('../interface');
var evg = new (require('../evg'))("profiles");
var settings = require('../settings');

function Profile(message) {

    var storage;
    var user;

    var id = message.author.id;

    var defaultProfile = {
        balance: settings.get(message.guild.id, "startingBalance"),
        donations: 0
    }

    function generateProfileIfNoneExists() {
        storage = evg.get();

        if (id in storage) {
            user = storage[id];
            return;
        }

        storage[id] = defaultProfile;
        user = storage[id];
    }

    this.exists = () => {
        storage = evg.get();

        if (id in storage) return this;
        return false;
    }

    this.getBal = () => {
        generateProfileIfNoneExists();
        return user["balance"];
    };

    this.getDonations = () => {
        generateProfileIfNoneExists();
        return user["donations"];
    };

    function set(amount) {
        generateProfileIfNoneExists();
        user["balance"] = Number(amount);
        storage[id] = user;
        evg.set(storage);
    }

    this.set = set;

    function add(amount) {
        generateProfileIfNoneExists();
        set(Number(user.balance) + Number(amount));
    }

    this.add = add;

    this.addForMessage = () => {
        add(settings.get(message.guild.id, "dollarsPerMessage"));
    }

    this.addDonation = (amount) => {
        generateProfileIfNoneExists();
        user["donations"] = Number(storage["donations"]) + Number(amount);
        storage[id] = user;
        evg.set(storage);
    }

    this.removeProfile = () => {
        generateProfileIfNoneExists();

        if (this.exists()) {
            delete storage[id];
            evg.set(storage);
        }
    }


}

function donateToUser(args, donor, target, message) {
    var prefix = settings.get(message.guild.id, "prefix");

    if (args && args[0] && args[1] && !isNan(args[1])) {
        var user = args[0];
        var donations = Number(args[1]);
    }
    else {
        return "Please specify a valid user and amount to donate to them.\nUse `" + prefix + "donate [user] [donation]` to continue.\nExample: `" + prefix + "donate @Cannicide#2753 5000`";
    }

    if (donor && target && donations <= Number(donor.getBal()) && donations >= 1) {
        var donorBal = Number(ifprofile.getBal()) - donations;
        var targetBal = Number(targetProfile.getBal()) + donations;

        donor.set(donorBal);
        target.set(targetBal);
        donor.addDonation(donations);

        return `Generous ${message.author.username}, you donated **$${Number(donations).toLocaleString()}** to ${user.username}!`;
    }
    else {
        return `Sorry ${message.author.username}, either you or the person you are donating to does not have a casino profile. Casino profiles are automatically generated when you send your first message in a guild with Elisif in it.`;
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

            var profile = new Profile(message);
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
        }, false, false, "Sends you your casino profile: your balance and donation totals.").attachArguments([
            {
                name: 'usertag#1234',
                optional: true
            }
        ]),

        new Command("donate", (message, args) => {

            var receiver = message.mentions.users.first();

            var profileRec = new Profile(receiver.id);
            var profileDon = new Profile(message);

            if (!receiver || args.length < 2) {
                message.channel.send("Please specify a valid user and amount to donate to them.\nUse `" + settings.get(message.guild.id, "prefix") + "donate [user] [donation]` to continue.\nExample: `" + settings.get(message.guild.id, "prefix") + "donate @Cannicide#2753 5000`");
            }
            else if (receiver.id == message.author.id) {
                message.channel.send("You cannot donate to yourself.");
            }
            else {
                message.channel.send(donateToUser([receiver, args[1]], profileDon.exists(), profileRec.exists(), message));
            }

        }, false, false, "Donate money to another user!"),

        new Command("balance", (message, args) => {

            var profile = new Profile(message);
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

            message.channel.send(`${username} has $${Number(bal).toLocaleString()}.`);

        }, false, false, "Sends you your casino balance.").attachArguments([
            {
                name: "usertag#1234",
                optional: true
            }
        ]),

        new Alias("bal", "balance"),

        new Command("delete", (message, args) => {

            var profile = new Profile(message);

            if (profile.exists()) {
                new Interface.Interface(message, "Are you sure you want to delete your casino account? Type `delete` to delete your account, or type `cancel` to cancel the deletion. This action is irreversible.", (collected, question) => {

                    if (collected.content.toLowerCase() == "delete") {
                        profile.removeProfile();
                        message.channel.send("Account deleted.");
                    }
                    else if (collected.content.toLowerCase() == "cancel") {
                        message.channel.send("Cancelled account deletion.");
                    }

                });
            }

        }, false, false, "Deletes your casino profile entirely, removing both your balance and donations."),

        new Alias("deleteprofile", "delete"),

        new Alias("delprofile", "delete"),

        new Command("reset", (message, args) => {

            var profile = new Profile(message);

            if (profile.exists()) {
                new Interface.Interface(message, "Are you sure you want to reset your casino balance? Type `reset` to reset your balance, or type `cancel` to cancel the reset. Your donation statistics will not be affected.", (collected, question) => {

                    if (collected.content.toLowerCase() == "reset") {
                        profile.set(0);
                        message.channel.send("Account balance reset to $0.");
                    }
                    else if (collected.content.toLowerCase() == "cancel") {
                        message.channel.send("Cancelled casino balance reset.");
                    }

                });
            }

        }, false, false, "Resets your casino balance to $0."),

        new Alias("resetprofile", "reset")

        //TODO: All of the other profile commands
    ]
}