var rand = require("./random");
var ls = require("./ls");

function coinflip(args, ifprofile, prefix, message) {
    if (args) {
        var amount = Number(args[0]);
        var side = args[1];
      }
      else {
       return "Please specify a bet.";
      }
      if (amount && side && amount > 0 && ifprofile && amount <= Number(ifprofile) && (side.toLowerCase() == "heads" || side.toLowerCase() == "tails") && typeof amount === "number") {
          //Coinflip code: (includes coin flipping animation in gif emote)
          var coinside = ["heads", "tails"];
          var probability = Math.floor(Math.random() * 2);
          if ((probability == 0 && side.toLowerCase() == "heads") || (probability == 1 && side.toLowerCase() == "tails")) {
            //Win
            ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + amount);
            return "Congratulations, " + message.author.username + "! You guessed correctly and gained **$" + amount + "!**";
          }
          else if ((probability == 1 && side.toLowerCase() == "heads") || (probability == 0 && side.toLowerCase() == "tails")) {
            //Lose
            ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) - amount);
            return "Unlucky " + message.author.username + ", you guessed " + side + " but the coin was " + coinside[probability] + ". You lost ||$" + amount + "||.";
          }
          else {
            //Error
            return "Error - Click to reveal: ||``` Error in line 14 of coinflip.js; Local variable probability did not return any of the 2 possible values: coinside[0] (heads) and coinside[1] (tails). ```||";
          }
      }
      else if (!ifprofile) {
          return `Create a profile first with ${prefix}create`;
      }
      else {
         return `Please specify a valid bet that is less than or equal to your current balance and a valid coin side. Check with ${prefix}balance.`; 
      }
}

module.exports = {
    flip: coinflip
}