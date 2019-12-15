//A built-in youtube musice server for the discord bot
//Powered by Youtube and Muzzy Tool API Spellchecker
//Dependencies: youtube-finder, ytdl-core*, opusscript*, YT Evergreen
//*these dependencies may no longer be required due to YT Evergreen abstraction
const fs = require('fs');
const ytdl = require('ytdl-core');
var youtube = require('youtube-finder');
var ls = require("./ls");



function getQueue(author) {
    var queueID = author + "musicQueue";
    if (ls.exist(queueID)) {
        return ls.getObj(queueID);
        //Will be an array
    }
    else {
        return false;
    }
}

function addToQueue(author, searchTerm) {
    if (getQueue(author)) {
        var queue = getQueue(author);
        queue.push(searchTerm);
        ls.setObj(author + "musicQueue", queue);
    }
    else {
        ls.setObj(author + "musicQueue", [searchTerm]);
    }
}

function loopQueue(author, message) {
    if (getQueue(author)) {
        var queue = getQueue(author);
        queue.forEach(function(song, index) {
            queue.push(song);
        });
        ls.setObj(author + "musicQueue", queue);
        message.channel.send(`Added the current queue to itself to loop it once, ${message.author.username}.`);
    }
    else {
        message.channel.send("You need to create a queue first. Do so by playing a song."); 
    }
}

function playMusic(args, message, qPlay) {
    if (getQueue(message.author.id) && !qPlay) {
        if (!args) return `You need to specify a youtube video to search for and add to your queue!`;
        addToQueue(message.author.id, args[0]);
        message.channel.send(`Successfully added song to queue!\nCurrent queue:\n**(${getQueue(message.author.id).join(", ")})**`);
    }
    else {    
        var ytClient = youtube.createClient({ key: args[1] });
        const streamOptions = { seek: 0, volume: 1 };
        var voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return `You need to be in a voice channel first!`;
        if (!args) return `You need to specify a youtube video to search for!`;
        var url;
        if (!qPlay) {
            ls.setObj(message.author.id + "musicQueue", [args[0]]);
        }
        var params = {
            part: "id",
            q: args[0],
            maxResults: 1,
            type: "video"
        }
        ytClient.search(params, function (err, data) {
            // your magic..
            var vidID = data.items[0].id.videoId;
            url = /*"https://www.youtube.com/watch?v=" + */vidID;
        })
        setTimeout(function () {
            voiceChannel.join().then(connection => {
                if (!qPlay) message.channel.send(`Joined music channel, ${message.author.username}.`);
                if (qPlay) message.channel.send(`Now playing the next song on your queue: **${args[0]}**.`);
                /*const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                    if (getQueue(message.author.id)) {
                        var queue = getQueue(message.author.id);
                        queue.shift();
                        if (queue.length == 0) {
                            ls.remove(message.author.id + "musicQueue");
                            message.channel.send(`Left music channel, ${message.author.username}.`);
                            voiceChannel.leave();
                        }
                        else {
                            ls.setObj(message.author.id + "musicQueue", queue);
                            return playMusic([queue[0], args[1]], message, true);
                        }
                    }
                    else {
                        message.channel.send(`Queue has ended. Left music channel, ${message.author.username}.`);
                        voiceChannel.leave();
                    }
                });*/
              console.log(url);
              const dispatcher = connection.playArbitraryInput("https://yt-evergreen.glitch.me/audio/" + url);
              dispatcher.on("end", end => {
                    if (getQueue(message.author.id)) {
                        var queue = getQueue(message.author.id);
                        queue.shift();
                        if (queue.length == 0) {
                            ls.remove(message.author.id + "musicQueue");
                            message.channel.send(`Left music channel, ${message.author.username}.`);
                            voiceChannel.leave();
                        }
                        else {
                            ls.setObj(message.author.id + "musicQueue", queue);
                            return playMusic([queue[0], args[1]], message, true);
                        }
                    }
                    else {
                        message.channel.send(`Queue has ended. Left music channel, ${message.author.username}.`);
                        voiceChannel.leave();
                    }
                });
              
            }).catch(err => message.channel.send(`Errors found:\n \`\`\`${err}, ${err.stack}\`\`\``));
            return "** **";
        }, 6000);
    }
  return "Beginning your Sif Casino Audio experience... Please wait for optimal quality...";
}

function stopMusic(message) {
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return `You need to be in a voice channel first!`;
    ls.remove(message.author.id + "musicQueue");
    voiceChannel.leave(voiceChannel);
    return `${message.author.username} stopped the music.`;
}

function returnQueue(message) {
    if (getQueue(message.author.id)) {
        return `Currently playing:\n**${getQueue(message.author.id)[0]}**\n\nCurrent queue:\n**(${getQueue(message.author.id).join(", ")})**`;
    }
    else {
        return `No queue detected for ${message.author.username}.`;
    }
}
 

module.exports = {
    play: playMusic,
    stop: stopMusic,
    loop: loopQueue,
    getQueue: returnQueue
}
