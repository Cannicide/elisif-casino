var rand = require("./random");
var ls = require("./ls");

function dice(args, ifprofile, prefix, message) {
    if (args) {
        var amount = Number(args[0]);
      }
      else {
       return "Please specify a bet.";
      }
      if (amount && amount > 0 && ifprofile && amount <= Number(ifprofile) && typeof amount === "number") {
          //Dice code:
          var roll1 = rand.num(1, 6);
          var roll2 = rand.num(1, 6);
          if (roll1 == 1 && roll2 == 1) {
              amount = amount * 3;
              ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + amount);
              return "You rolled snake eyes (1 and 1) and gained **3 times your original bet!**";  
          }
          else if (roll1 == roll2) {
            amount = amount * 7;
            ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + amount);
            return "It's a match, " + message.author.username + "! You rolled double " + roll1 + "s and gained **7 times your original bet!**";
          }
          else {
            ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) - amount);
            return "Unlucky " + message.author.username + ", you lost ||$" + amount + "||.";
          }
      }
      else if (!ifprofile) {
          return `Create a profile first with ${prefix}create`;
      }
      else {
         return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
      }
}

module.exports = {
    roll: dice
}