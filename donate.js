var settings = require('./settings');

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
    toUser: donateToUser
}