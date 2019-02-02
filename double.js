var rand = require("./random");
var ls = require("./ls");

function dble(args, ifprofile, prefix, message) {
    if (args) {
        var amount = Number(args[0]);
      }
      else {
       return "Please specify a bet.";
      }
      if (amount && amount > 0 && ifprofile && amount <= Number(ifprofile) && typeof amount === "number" && amount <= 2500) {
          //Double code:
          var probability = rand.num(0, 5);
          if (probability == 2 || probability == 3) {
            //Win
            amount = Number(amount) * 2;
            ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + amount);
            return "Double successful, " + message.author.username + "! You gained **$" + amount + "!**";
          }
          else if (probability == 0 || probability == 1 || probability == 4 || probability == 5) {
            //Lose
            ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) - amount);
            return "Unlucky " + message.author.username + ", you lost ||$" + amount + "||.";
          }
          else {
            //Error
            return "Error - Click to reveal: ||``` Error in line 12 of double.js; Local variable probability did not return any of the 3 possible values: 0, 1, and 2. ```||";
          }
      }
      else if (!ifprofile) {
          return `Create a profile first with ${prefix}create`;
      }
      else if (amount > 2500) {
        return `Due to double abuse, you cannot bet over $2500 on double.`;
      }
      else {
         return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
      }
}

module.exports = {
    dble: dble
}