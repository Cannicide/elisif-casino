var asyncUser = require("./asyncUser");
var ls = require("./ls");

var outputs = {
    wait: "Choose a color:\n\n:red_circle: **Red** ||x2||\n:black_circle: **Black** ||x2||\n:green_apple: **Green** ||x12||",
    green: function(message) { return `Lucky ${message.author.username}, it landed on :green_apple: **Green** and you won **x12** of your original bet!` },
    redBlack: function(message, guess) { return `${message.author.username}, it successfully landed on :${guess.toLowerCase()}: **${guess}** and you won **x2** of your original bet!` },
    fail: function(message, loss, landed) { return `Unlucky ${message.author.username}, it landed on ${landed} and you lost **$${loss}**...` }
}

function wheel(args, ifprofile, prefix, message) {
    if (args) {
        var color = args;
    }
    else {
        return "Please specify a color.";
    }
    if (color && (color.toLowerCase() == "green" || color.toLowerCase() == "black" || color.toLowerCase() == "red") && ifprofile && typeof color === "string" && asyncUser.getUserObj(message.author).awaitRoulette) {
        var bet = Number(asyncUser.getUserObj(message.author).currentRouletteBet);
        asyncUser.setAwaitObj(message.author, false);
        if (bet <= Number(ifprofile)) {
            var probability = Math.floor(Math.random() * 39);
            if (probability == 0) {
                //Green
                var final = bet * 12;
                asyncUser.setBetObj(message.author, false);
                ls.remove(message.author.id + "asyncUserObj");
                if (color.toLowerCase() == "green") {
                    ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + final);
                    return outputs.green(message);
                }
                else {
                    ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) - bet);
                    return outputs.fail(message, bet, ":green_apple: Green");
                }
            }
            else if (probability % 2 == 0) {
                //Black
                var final = bet;
                asyncUser.setBetObj(message.author, false);
                ls.remove(message.author.id + "asyncUserObj");
                if (color.toLowerCase() == "black") {
                    ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + final);
                    return outputs.redBlack(message, "Black");
                }
                else {
                    ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) - bet);
                    return outputs.fail(message, bet, ":black_circle: Black");
                }
            }
            else {
                //Red
                var final = bet;
                asyncUser.setBetObj(message.author, false);
                ls.remove(message.author.id + "asyncUserObj");
                if (color.toLowerCase() == "red") {
                    ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) + final);
                    return outputs.redBlack(message, "Red");
                }
                else {
                    ls.set(message.author.id + "profile", Number(ls.get(message.author.id + "profile")) - bet);
                    return outputs.fail(message, bet, ":red_circle: Red");
                }
            }
        }
        else {
            return `Nice try, ${message.author.username}, but you don't have enough money to do that!`;
        }
    }
    else if (!ifprofile) {
        return `Create a profile first with ${prefix}create`;
    }
    else if (!asyncUser.getUserObj(message.author).awaitRoulette) {
        return `Specify a bet first with ${prefix}roulette [bet]`;
    }
    else {
        return `Please specify a valid color: green, red, or black (no prefix required, just say \`Green\` or \`bLaCk\`... it's not case sensitive either)!`; 
    }
}

function synchronous(args, ifprofile, prefix, message) {
    if (args) {
        var amount = Number(args[0]);
    }
    else {
        return "Please specify a bet.";
    }
    if (amount && amount > 0 && ifprofile && amount <= Number(ifprofile) && typeof amount === "number" && !asyncUser.getUserObj(message.author).awaitRoulette) {
        asyncUser.setBetObj(message.author, amount);
        asyncUser.setAwaitObj(message.author, true);
        return `**Roulette Bet: $${amount.toLocaleString()}**\n${outputs.wait}`;
    }
    else if (!ifprofile) {
        return `Create a profile first with ${prefix}create`;
    }
    else if (asyncUser.getUserObj(message.author).awaitRoulette) {
        return "You already have an active roulette game running. Say `Green`, `Red`, or `Black` to continue.";
    }
    else {
        return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
    }
}

module.exports = {
    spin: wheel,
    specifyBet: synchronous
}