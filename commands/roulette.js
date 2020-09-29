const Command = require("../command");
var settings = require("../settings");
var Profile = require("./profile").Profile;
var Interface = require("../interface");

var emotes = {
    red: "<:red:757632465610342410>",
    black: "<:black:757632465429856376>",
    green: "<:green:757632465446764670>",
    bet: {
        red: "<:betred:757632465455153284>",
        black: "<:betblack:757632465543102524>",
        green: "<:betgreen:757632465514004601>"
    }
}

var outputs = {
    wait: "Choose a color:\n\n<:red:757632465610342410> **Red** ||x2||\n<:black:757632465429856376> **Black** ||x2||\n<:green:757632465446764670> **Green** ||x12||",
    green: function(message) { return `Lucky ${message.author.username}, it landed on <:green:757632465446764670> **Green** and you won **x12** of your original bet!` },
    redBlack: function(message, guess) { return `${message.author.username}, it successfully landed on ${emotes[guess.toLowerCase()]} **${guess}** and you won **x2** of your original bet!` },
    fail: function(message, loss, landed) { return `Unlucky ${message.author.username}, it landed on ${emotes[landed.toLowerCase()]} **${landed}** and you lost **$${loss}**...` }
}

var command = new Command("roulette", (message, args) => {

    if (args) {
        var amount = Number(args[0]);
    }
    else {
        return message.reply("Please specify a bet.");
    }

    var prefix = settings.get(message.guild.id, "prefix");
    var profile = new Profile(message);

    var bal = profile.getBal();

    if (amount && typeof amount === "number" && amount > 0 && amount <= Number(bal)) {
        // asyncUser.setBetObj(message.author, amount);
        // asyncUser.setAwaitObj(message.author, true);

        new Interface.Interface(message, `**Roulette Bet: $${amount.toLocaleString()}**\n${outputs.wait}`, (collected, question) => {
            var color = collected.content;
            bal = profile.getBal();
        
            if (color && (color.toLowerCase() == "green" || color.toLowerCase() == "black" || color.toLowerCase() == "red") && bal && typeof color === "string") {
                var bet = amount;

                if (bet <= Number(bal)) {

                    var upperc = color.toLowerCase().substring(0, 1).toUpperCase() + color.toLowerCase().substring(1);

                    message.channel.send(`You are betting on ${emotes.bet[color.toLowerCase()]} **${upperc}**\nSpinning the wheel...`).then((msg) => {
                        setTimeout(() => {
                            var probability = Math.floor(Math.random() * 39);

                            if (probability == 0) {
                                //Green
                                var final = bet * 12;
                                
                                if (color.toLowerCase() == "green") {
                                    profile.add(final);
                                    msg.edit(outputs.green(message));
                                }
                                else {
                                    profile.add(0 - bet);
                                    msg.edit(outputs.fail(message, bet, "Green"));
                                }
                            }
                            else if (probability % 2 == 0) {
                                //Black
                                var final = bet;
                                
                                if (color.toLowerCase() == "black") {
                                    profile.add(final);
                                    msg.edit(outputs.redBlack(message, upperc));
                                }
                                else {
                                    profile.add(0 - bet);
                                    msg.edit(outputs.fail(message, bet, "Black"));
                                }
                            }
                            else {
                                //Red
                                var final = bet;

                                if (color.toLowerCase() == "red") {
                                    profile.add(final);
                                    msg.edit(outputs.redBlack(message, upperc));
                                }
                                else {
                                    profile.add(0 - bet);
                                    msg.edit(outputs.fail(message, bet, "Red"));
                                }
                            }
                        }, 4000);
                    });
                }
                else {
                    message.channel.send(`Nice try, ${message.author.username}, but you don't have enough money to do that!`);
                    question.edit(`**Failed to play roulette**: You did not have enough money.\nUse \`${prefix}roulette\` again to try again.`); 
                }
            }
            else {
                message.channel.send(`Please specify a valid color: green, red, or black.`);
                question.edit(`**Failed to play roulette**: You did not specify a valid color.\nUse \`${prefix}roulette\` again to try again.`); 
            }
        });
    }
    else {
        message.channel.send(`Please specify a valid bet that is less than or equal to your current balance. Check with \`${prefix}balance\`.`); 
    }

}, false, false, "Spins a roulette wheel with 38 numbered slots, returning green for 0, and red or black for the rest. Earn money for guessing the right color.").attachArguments([
    {
        name: "bet-amount",
        optional: true
    }
]);

module.exports = command;