var Command = require("../command");
var Profile = require("./profile").Profile;
var settings = require("../settings");

function coinflip(args, profile, prefix, message) {
    var ifprofile = profile.getBal();

    if (args && args.length >= 2) {
        var amount = Number(args[0]);
        var side = args[1];
      }
    else {
      return "Please specify a bet and a coin side.\nEx: `" + prefix + "coinflip 50 heads`";
    }

    if (amount && side && typeof amount === "number" && amount > 0 && amount <= Number(ifprofile) && (side.toLowerCase() == "heads" || side.toLowerCase() == "tails")) {
        //Coinflip code: (does not -> ~~includes~~ coin flipping animation in gif emote)
        var coinside = ["heads", "tails"];
        var probability = Math.floor(Math.random() * 2);

        if ((probability == 0 && side.toLowerCase() == "heads") || (probability == 1 && side.toLowerCase() == "tails")) {
          //Win
          profile.add(amount);
          return "Congratulations, " + message.author.username + "! You guessed correctly and gained **$" + amount + "!**";
        }
        else if ((probability == 1 && side.toLowerCase() == "heads") || (probability == 0 && side.toLowerCase() == "tails")) {
          //Lose
          profile.add(0 - amount);
          return "Unlucky " + message.author.username + ", you guessed " + side + " but the coin was " + coinside[probability] + ". You lost ||$" + amount + "||.";
        }
        else {
          //Error
          return "Error - Click to reveal: ||``` Error in line 14 of coinflip.js; Local variable probability did not return any of the 2 possible values: coinside[0] (heads) and coinside[1] (tails). ```||";
        }
    }
    else {
        return `Please specify a valid bet that is less than or equal to your current balance and a valid coin side. Check with ${prefix}balance.`; 
    }
}

var coin = {
    flip: coinflip
}

module.exports = new Command("coinflip", (message, args) => {

  var profile = new Profile(message);
  var prefix = settings.get(message.guild.id, "prefix");

  message.channel.send(coin.flip(args, profile, prefix, message));

}, false, false, "Gives you a 50-50 chance to win bet money based on a coinflip.").attachArguments([
  {
    name: "bet",
    optional: false
  }, 
  {
    name: "heads/tails",
    optional: false
  }
]);