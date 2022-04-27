var rand = require("../random");
var Command = require("../command");
var Profile = require("./profile").Profile;
var settings = require("../settings");

function diceRoll(args, message) {
    var prefix = settings.get(message.guild.id, "prefix");
    var profile = new Profile(message);

    var bal = profile.getBal();

    if (args) {
      var amount = Number(args[0]);
    }
    else {
      return "Please specify a bet.";
    }

    if (amount && typeof amount === "number" && amount > 0 && amount <= bal) {
        //Dice code:
        var roll1 = rand.num(1, 6);
        var roll2 = rand.num(1, 6);
        if (roll1 == 1 && roll2 == 1) {
            amount = amount * 3;
            profile.add(amount);
            return "You rolled snake eyes (1 and 1) and gained **3 times your original bet!**";  
        }
        else if (roll1 == roll2) {
          amount = amount * 2;
          profile.add(amount);
          return "It's a match, " + message.author.username + "! You rolled double " + roll1 + "s and gained **2 times your original bet!**";
        }
        else {
          profile.add(0 - amount);
          return `You rolled ${roll1} and ${roll2}.\nUnlucky ${message.author.username}, you lost \`$${amount}\`.`;
        }
    }
    else {
        return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
    }
}

var dice = {
    roll: diceRoll
}

module.exports = new Command("dice", (message, args) => {

  message.channel.send(dice.roll(args, message));

}, false, false, "Rolls two dice. If you roll dual 1s, you gain 3 times your bet. If you roll any other matching numbers, you gain 2 times your bet.").attachArguments([
  {
    name: "bet",
    optional: false
  }
]);