//Casino-styled blackjack card-game against the computer

var rand = require("../random");
var Command = require("../command");
var Interface = require("../interface");
var Profile = require("./profile").Profile;
var settings = require("../settings");

function ToInteger(card) {
    if (card == "A") {
        return 11;
    }
    else if (card == "base") {
        return 0;
    }
    else if (card == "J" || card == "Q" || card == "K") {
        return 10;
    }
    else {
        return Number(card);
    }
}

function aceCheck(value, total) {
    if (total + value > 21 && value == 11) {
        return 1;
    }
    else {
        return value;
    }
}

function Card(value) {
    this.toInteger = ToInteger(value[0]);
    this.val = value[0];
    this.suite = value[1];
    //Card object initialized
}

function randCard() {
    var randCardInt = rand.num(1, 20);
    var randSuit = rand.num(0, 3);
    var suites = [":spades:", ":hearts:", ":diamonds:", ":clubs:"];
    var fullCollection = ["A", "A", "2", "2", "3", "4", "5", "6", "7", "8", "9", "9", "9", "9", "10", "J", "J", "Q", "Q", "K", "K"];
        
    //Higher chances of getting certain cards
        
    return [fullCollection[randCardInt - 1], suites[randSuit]];
}

function arrCardCalc(arr) {
    var sum = 0;
    var iterations = 0;
    for (var x in arr) {
        sum += arr[iterations].toInteger;
        iterations += 1;
    }
    return [sum, iterations];
}

function userHit(cardsObj, message) {
    var user = message.author;

    var card = new Card(randCard());
    var total = arrCardCalc(cardsObj.userTotal);
    var newTotal = total[0] + aceCheck(card.toInteger, total[0]);

    var profile = new Profile(message);

    var bet = Number(cardsObj.bet);
    message.channel.send(`${user.username} drew ${card.val + " " + card.suite}`);

    if (newTotal > 21) {
        //User busted - end game (loss)
        profile.add(0 - bet);
        message.channel.send(`${user.username} busted; Elisif wins, **${user.username} loses**.`);
    }
    else if (newTotal == 21 && total[1] == 1) {
        //User blackjack - end game (win)
        profile.add(bet * 2);
        message.channel.send(`${user.username} has blackjack; **${user.username} wins, doubled the winning amount**!`);
    }
    else {
        //User can continue hitting
        cardsObj.userTotal.push(card);

        new Interface.Interface(message, `${user.username}, hit or stand?\nType \`hit\` or \`stand\`.`, (collected, question) => {

            if (collected.content.toLowerCase() == "hit") {
                userHit(cardsObj, message)
            }
            else if (collected.content.toLowerCase() == "stand") {
                userStand(cardsObj, message);
            }

        });
    }

}

function compHit(cardsObj, message) {
    var user = message.author;

    var card = new Card(randCard());
    var userTotal = arrCardCalc(cardsObj.userTotal);
    var compTotal = arrCardCalc(cardsObj.compTotal);
    var newTotal = compTotal[0] + aceCheck(card.toInteger, compTotal[0]);
    
    var profile = new Profile(message);

    var bet = Number(cardsObj.bet);
    message.channel.send(`Elisif drew ${card.val + " " + card.suite}`);

    if (newTotal > 21) {
        //Computer busted - end game (user win)
        profile.add(bet);
        return `Elisif busted; **${user.username} wins**!`;
    }
    else if (newTotal >= 17) {
        //Computer stands
        if (newTotal == 21 && compTotal[1] == 1) {
            //Computer has blackjack
            profile.add(0 - bet);
            return `Elisif has blackjack; Sif wins, **${user.username} loses**.`;
        }
        else if (newTotal > userTotal[0]) {
            //Computer has larger number - end game (user loss)
            profile.add(0 - bet);
            return `Elisif stands with ${newTotal}; Sif wins, **${user.username} loses**.`;
        }
        else if (newTotal == userTotal[0]) {
            //It's a tie
            return `Elisif stands with ${newTotal}; **It's a tie**.`;
        }
        else {
            //Computer has smaller number - end game (user win)
            profile.add(bet);
            return `Elisif stands with ${newTotal}; **${user.username} wins**!`;
        }
    }
    else {
        //Computer continues hitting
        cardsObj.compTotal.push(card);
        return compHit(cardsObj, message);
    }
}

function createCardCollection(bet) {
    var cardsObj = {
        userTotal: [],
        compTotal: [],
        bet: bet
    }
    var userBase = new Card(randCard());
    var compBase = new Card("base");
    cardsObj.userTotal.push(userBase);
    cardsObj.compTotal.push(compBase);
    return cardsObj;
}

function startGame(args, message) {
    var profile = new Profile(message);
    var bal = profile.getBal();

    var prefix = settings.get(message.guild.id, "prefix");

    if (args[0] && !isNaN(args[0]) && (Number(args[0]) <= Number(bal))) {

        var cardsObj = createCardCollection(args[0]);
        var starterCard = cardsObj.userTotal[0];
        message.channel.send(`${message.author.username} started a new blackjack game with $${args[0]}.\n${message.author.username} has ${starterCard.val + " " + starterCard.suite}.`);
    
        new Interface.Interface(message, "Type `hit` or `stand` to continue.", (collected, question) => {

            if (collected.content.toLowerCase() == "hit") {
                userHit(cardsObj, message)
            }
            else if (collected.content.toLowerCase() == "stand") {
                userStand(cardsObj, message);
            }

        });

    }
    else {
        message.channel.send(`Please specify a valid bet that is less than or equal to your current balance.\nEx: \`${prefix}blackjack 500\` starts a game with $500 at stake.`);
    }
}

function userStand(cardsObj, message) {
    message.channel.send(`${message.author} stands with: ${arrCardCalc(cardsObj.userTotal)[0]}.`);
    return compHit(cardsObj, message);
}


var blackjack = {
    start: startGame
}

module.exports = new Command("blackjack", (message, args) => {

    blackjack.start(args, message);

}, false, false, "Starts a blackjack card game against the bot; get a higher total to earn your bet, or a total of 21 for double your bet.").attachArguments([
    {
        name: "bet",
        optional: false
    }
])