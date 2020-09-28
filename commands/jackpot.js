var ls = require("../ls");
var Profile = require("./profile").Profile;
var settings = require("../settings");
var Command = require("../command");

function jackpotStart(args, message) {

    var profile = new Profile(message);
    var bal = profile.getBal();

    var prefix = settings.get(message.guild.id, "prefix");

    var guildIdentifier = message.guild.id + "jackpotGame";
    var guildId = guildIdentifier;
 
    var bet = Number(args[0]);

    if (!bet || args[0] == " " || isNaN(args[0]) || bet < 1 || bet > bal) {
        return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
    }

    if (ls.exist(guildId)) {
        //Jackpot object already exists
        if (ls.get(guildId).isEnabled) {
            //Jackpot game is already running, join it
            var jackpotObj = ls.get(guildId);
            var isAlreadyIn = jackpotObj.participants.includes(message.author.id);
            if (isAlreadyIn) {
                //Add to value, not create a new one
                var index = jackpotObj.participants.indexOf(message.author.id);
                jackpotObj.bets[index] += bet;

                var total = jackpotObj.bets.reduce((a,b) => Number(a) + Number(b), 0);
                ls.set(guildId, jackpotObj);

                profile.add(0 - Number(bet));
                return `${message.author.username}, you added $${bet} more to the jackpot! Total jackpot value: **$${total}**`;
            }
            else {
                //Add new value
                var jackpotObj = ls.get(guildId);
                jackpotObj.participants.push(message.author.id);
                jackpotObj.bets.push(bet);

                var total = jackpotObj.bets.reduce((a,b) => Number(a) + Number(b), 0);
                ls.set(guildId, jackpotObj);

                profile.add(0 - Number(bet));
                return `${message.author.username}, you joined the jackpot with $${bet}! Total jackpot value: **$${total}**`;
            }
        }
        else {
            //ERROR, not possible
            return `Error 203: jackpotObj.isEnabled should be set to true, but is not defined.`;
        }
    }
    else {
        //Jackpot object must be created
        var jackpotObj = {
            isEnabled: true,
            participants: [],
            bets: []
        }

        jackpotObj.participants.push(message.author.id);
        jackpotObj.bets.push(bet);
        ls.set(guildId, jackpotObj);

        profile.add(0 - Number(bet));
        return `${message.author.username}, you created a new jackpot with **$${bet}**\nDo \`${prefix}jackpot [bet]\` to join for a chance to win over **$${Number(bet).toLocaleString()}**!\nEx: \`${prefix}jackpot 2500\` enters the jackpot with $2500, giving the winner a chance to earn over $${Number(bet) + 2500}!`;
    }
}

function jackpotEnd(message) {
    var jackpotObj = ls.get(message.guild.id + "jackpotGame");

    if (message.member.hasPermission("ADMINISTRATOR") || jackpotObj.participants[0] == message.author.id) {
        //End the jackpot game
        var total = jackpotObj.bets.reduce((a,b) => Number(a) + Number(b), 0);
        var jackpotLength = jackpotObj.participants.length;

        if (jackpotLength == 1) {
            profile.add(Number(jackpotObj.bets[jackpotObj.participants.indexOf(message.author.id)]));
            ls.remove(message.guild.id + "jackpotGame");
            return `Sorry ${message.author.username}, nobody joined your jackpot game. You get your money back, though!`;
        }
        else {
            var randWinner = Math.floor(Math.random() * jackpotLength);
            var winner = jackpotObj.participants[randWinner];

            var winnerProfile = new Profile(winner);

            winnerProfile.add(Number(total));
            var winnerUsername = "<@" + winner + ">";
            
            ls.remove(message.guild.id + "jackpotGame");
            return `Lucky ${winnerUsername}, you won the jackpot with a gain of **$${total}!**`;
        }
    }
    else {
        //Doesn't have admin perms or isn't the creator of the jackpot
        return `${message.author.username}, **you cannot end the jackpot**, as you are neither the creator of the jackpot session nor an administrator in this guild.`;
    }

}

var jackpot = {
    start: jackpotStart,
    end: jackpotEnd
}

module.exports = new Command("jackpot", (message, args) => {

    if (args.length < 1) {
        message.channel.send("Please specify a bet to start/join a jackpot, or specify `end` to end a jackpot.");
    }
    else if (args[0] == "end") {
        message.channel.send(jackpot.end(message));
    }
    else {
        message.channel.send(jackpot.start(args, message));
    }

}, false, false, "Start, join, or end a jackpot game. Multiplayer; anyone can join, winner takes all.").attachArguments([
    {
        name: "bet | end",
        optional: false
    }
]);