//Casino-based hangman game based on Project Sif's hangman game...
//(changed to allow entire guilds to participate)
var ls = require("./ls");

function hangmanStart(ifprofile, prefix, message) {
    if (ls.get(message.guild.id + "hangmanGame")) {
        return "You have already started a game of hangman! Type `" + prefix + "hm end` to end the game early.";
    }
    else if (ifprofile) {
        var hObj = {
            started: false,
            progress: "",
            word: "",
            guesses: 0,
            participants: []
        }
        hObj.started = true;
        var words = ["Weather", "Incredibility", "Ponderous", "Fastidious", "Ominous", "Capricious", "Pervasive", "Aloof", "Disseminate", "Pugnacious", "Whimsical", "Unfathomable", "Predilection", "Insurgency", "Inadequate", "Immeasurable", "Terracotta", "Significance", "Immobility", "Versatility", "Carcinogen", "Death", "Hanged", "Eejit", "Magnanimous", "Pneumonoultramicroscopicsilicovolcanoconiosis", "Pneumonoultramicroscopicsilicovolcanoconiosis", "Pneumonoultramicroscopicsilicovolcanoconiosis", "Floccinaucinihilipilification", "Spectrophotofluorometrically", "Euouae", "Honorificabilitudinitatibus", "Ragamuffin", "Discombobulate", "Cat", "Ban", "Cabotage", "Bibble", "Erinaceous", "Firman", "Gabelle", "Kakorrhaphiophobia", "Nudiustertian", "Xertz", "Yarborough", "AlJumahiriyahAlArabiyahAlLibiyahAshShabiyahAlIshtirakiyahAlUzma", "Texas", "Michigan", "NewYork", "Botanical", "Garden", "Dollars", "Cash", "Encephalosis"];
        var wordnum = Math.floor(Math.random() * words.length);
        var word = words[wordnum];
        var underscores = "";
        for (var i = 0; i < word.length; i++) {
          underscores = underscores + "⬜ ";
        }
        hObj.progress = underscores;
        hObj.word = word;
        hObj.guesses = 12;
        hObj.participants.push(message.author.id);
        ls.set(message.guild.id + "hangmanGame", hObj);
        return "You have begun a game of hangman! Use `" + prefix + "hm guess` to begin guessing!\n\n" + underscores;
    }
    else {
        return "Create a profile first with `" + prefix + "create`"
    }
}

function hangmanEnd(message) {
    if (ls.exist(message.guild.id + "hangmanGame")) {
        if (ls.get(message.guild.id + "hangmanGame").participants[0] == message.author.id || message.member.hasPermission("ADMINISTRATOR")) {
            ls.remove(message.guild.id + "hangmanGame");
            return `Ended hangman game, ${message.author.username}!`;
        }
        else {
            return `${message.author.username}, you do not have sufficient permission to end the current hangman game. Only the guild member who started the game and/or the admins of the guild can end a hangman game.`;
        }
    }
    else {
        return `${message.author.username}, you do not have any running games to end.`;
    }
}

function hangmanGuess(args, ifprofile, prefix, message) {
    if (ls.exist(message.guild.id + "hangmanGame") && ifprofile) {
        var guess = args[1];
        var hObj = ls.get(message.guild.id + "hangmanGame");
        var limit = hObj.guesses;
        var word = hObj.word;
        var underscores = [];
        var gotLetter = false;
        if (Number(limit) <= 1) {
            ls.remove(message.guild.id + "hangmanGame");
            return `Sorry ${message.author.username}, you are out of guesses. **Game over!**\n` + "The word was: **" + word.split("").join(" ") + "**";
        }
        else {
        hObj.participants.forEach(function(member, index) {
            if (member == message.author.id) {
                //Already in list, do nothing
            }
            else {
                hObj.participants.push(message.author.id);
            }
        });
        for (var i = 0; i < word.length; i++) {
          underscores.push("⬜");
        }
        for (var i = 0; i < word.length; i++) {
            if (guess.toUpperCase() == word[i].toUpperCase()) {
                gotLetter = true;
                underscores[i] = word[i];
                hObj.progress = hObj.progress + word[i];
            }
            else {
             hObj.progress.split("").forEach(function(item, index) {
                  if (item == word[i]) {
                      underscores[i] = item;
                  }
                });
            }
        }
        message.channel.send("**Hangman Progress**\n\n" + underscores.join(" "));
        ls.set(message.guild.id + "hangmanGame", hObj)
        if (gotLetter) {
            if (underscores.indexOf("⬜") < 0) {
                hObj.participants.forEach(function(member, index) {
                    ls.set(member + "profile", Number(ls.get(member + "profile")) + 5000);
                });
                ls.remove(message.guild.id + "hangmanGame");
                return "You won hangman! **+5000 dollars to all participants!**";
            }
        }
        else {
            limit = Number(limit) - 1
            hObj.guesses = limit;
            ls.set(message.guild.id + "hangmanGame", hObj)
            return `Incorrect guess, ${message.author.username}... ` + limit + " guesses left.";
        }
        }
    }
    else if (!ifprofile) {
        return `Create a profile first with ${prefix}create`;
    }
    else {
        return "you must start a game before guessing the word! Use `" + prefix + "hm start` to get started!";
    }
}

var hm = {
    start: hangmanStart,
    guess: hangmanGuess,
    end: hangmanEnd
}

function hangmanDo(args, ifprofile, prefix, message) {
    var action = args[0];
    var subinput = [false, args[1]];
    if (!action) {
        return `${message.author.username}, please specify whether to start a hangman game, end it, or guess in it.`;
    }
    if (action.toLowerCase() == "start") {
        return hm.start(ifprofile, prefix, message);
    }
    else if (action.toLowerCase() == "guess") {
        if (subinput) {
            return hm.guess(subinput, ifprofile, prefix, message);
        }
        else {
            return `${message.author.username}, please specify a valid letter to guess.`;
        }
    }
    else if (action.toLowerCase() == "end") {
        return hm.end(message);
    }
    else {
        return `Please specify a valid statement (start|guess|end) to the command. See the Hangman section of \`${prefix}casino\` for more information.`;
    }
}

module.exports = {
    do: hangmanDo
}