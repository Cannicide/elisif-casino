var rand = require("../random");
var Command = require("../command");
var Profile = require("./profile").Profile;
var Interface = require("../interface")
var settings = require("../settings");

function dble(amount, message, profile) {

  var probability = rand.num(0, 5);

  if (probability == 4 || probability == 3 || probability == 1) {
    //Win
    amount = Number(amount) * 2;

    var msg = ("Double successful, " + message.author.username + "! Current double value: **$" + amount + "!**\nType `hit` to keep going, or `stand` to keep the money.");

    new Interface.Interface(message, msg, (collected, question) => {

      if (collected.content.toLowerCase() == "hit") {
        dble(amount, message, profile);
      } 
      else if (collected.content.toLowerCase() == "stand") {
        profile.add(amount);
        message.channel.send(message.author.username + ", you gained **$" + amount + "!**")
      }

    });
  }
  else if (probability == 0 || probability == 2 || probability == 5) {
    //Lose

    message.channel.send("Unlucky " + message.author.username + ", you lost \`$" + amount + "\`.");
  }
  else {
    //Error
    message.channel.send("Error - Click to reveal: ``` Error in line 12 of double.js; Local variable probability did not return any of the 3 possible values: 0, 1, and 2. ```");
  }

}

module.exports = new Command("double", (message, args) => {

    //ls.set(message.author.id + "doubleBetAmount", args);
    var profile = new Profile(message);
    var prefix = settings.get(message.guild.id, "prefix");

    var bal = profile.getBal();

    if (args) {
      var amount = Number(args[0]);
    }
    else {
      return message.channel.send("Please specify a bet.");
    }

    if (amount && typeof amount === "number" && amount > 0 && (amount <= bal) && (amount <= 2500)) {
        //Double code:
        
        profile.add(0 - amount);
        dble(amount, message, profile);
          

    }
    else if (amount > 2500) {
      message.channel.send(`Due to double abuse, you cannot bet over $2500 on double.`);
    }
    else {
       message.channel.send(`Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`); 
    }

}, false, false, "Gives you a chance to double the bet money you specify and collect it.").attachArguments([
  {
    name: "bet",
    optional: false
  }
]);