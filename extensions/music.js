//A built-in youtube music server for the discord bot
//Powered by Youtube, my Evergreen API, and my CannicideAPI YT Audio API
//Dependencies: LSON (EvG-Based Storage), node-fetch
var ls = require("../ls");
var Command = require("../command");
var Interface = require("../interface");
var fetch = require("node-fetch");

function Queue(message) {

    var storage = {
        starter: message.author.id,
        songs: [],
        index: 0,
        loop: false
    }

    function reloadStorage() {
        if (ls.exist(message.guild.id + "musicQueue")) {
            storage = ls.get(message.guild.id + "musicQueue");
            return storage;
        }
        else return false;
    }

    function saveStorage() {
        ls.set(message.guild.id + "musicQueue", storage);
    }

    this.get = () => {
        reloadStorage();

        return storage;
    }

    this.save = saveStorage;

    this.getSong = () => {

        reloadStorage();

        return index >= storage.songs.length ? false : storage.songs[index];

    }

    this.addSong = (name, id, author, msg, audio, keywords) => {

        reloadStorage();

        storage.songs.push({
            name: name,
            id: id,
            audio: audio,
            artist: author,
            requester: msg.author.tag,
            keywords: keywords
        });

        saveStorage();

    }

    this.removeSong = (keywords) => {

        reloadStorage();

        var songKeywords = storage.songs.find(s => s.keywords == keywords);
        var songName = storage.songs.find(s => s.name == keywords);
        var songUrl = storage.songs.find(s => keywords.match("youtube.com/watch?v=" + s.id));

        if (songUrl) {
            storage.songs.splice(storage.songs.lastIndexOf(songUrl), 1);
        }
        else if (songKeywords) {
            storage.songs.splice(storage.songs.lastIndexOf(songKeywords), 1);
        }
        else if (songName) {
            storage.songs.splice(storage.songs.lastIndexOf(songName), 1);
        }
        else return false;

        saveStorage();

        return true;

    }

    this.removeSongs = (keywords) => {

        var moreLeft = true;
        var iterations = 0;

        while (moreLeft) {
            moreLeft = this.removeSong(keywords);
            iterations++;
        }

        return iterations;

    }

    this.endQueue = () => {

        ls.remove(message.guild.id + "musicQueue");

    }

    this.nextSong = () => {

        var isStorage = reloadStorage();

        if (!isStorage) {
            return false;
        }

        storage.index++;
        if (storage.index >= storage.songs.length) {

            storage.index = 0;

            if (storage.loop) {

                saveStorage();

                return storage.songs[storage.index];
            }

            this.endQueue();

            return false;
        }
        
        saveStorage();

        return storage.songs[storage.index];

    }

    this.prevSong = () => {

        var isStorage = reloadStorage();

        if (!isStorage) {
            return false;
        }

        storage.index--;
        if (storage.index < 0) {

            if (storage.loop) {

                storage.index = storage.songs.length - 1;

                saveStorage();

                return storage.songs[storage.index];
            }

            this.endQueue();

            return false;
        }
        
        saveStorage();

        return storage.songs[storage.index];

    }

    this.displaySong = (msg) => {

        reloadStorage();

        var song = storage.songs[storage.index];
        var embed = new Interface.Embed(message, "youtube logo here", [], 
        `**[${song.name}](https://www.youtube.com/watch?v=${song.id})**\n\n` +
        `\`Requested by:${song.requester}\``);

        msg.channel.send(embed).then((m) => {

            var loopEmotes = ["🔁", "🔃"];
            var loopEmote = loopEmotes[0];

            if (storage.loop) loopEmote = loopEmotes[1];

            m.react("⏪").then((r) => m.react(loopEmote).then((r2) => m.react("⏩")));

            let forwardsFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id, { time: 120000 });
            let loopFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === loopEmote && user.id === msg.author.id, { time: 120000 });
            let backFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id, { time: 120000 });
        
            forwardsFilter.on("collect", r => {
                m.reactions.resolve("⏩").users.remove(msg.author.id);

                var song = this.nextSong();
                var desc = "The queue has ended.";
                
                if (song) desc = `**[${song.name}](https://www.youtube.com/watch?v=${song.id})**\n\n` +
                `\`Requested by:${song.requester}\``;

                var embed = new Interface.Embed(message, "youtube logo here", [], desc);
                m.edit(embed);

                if (!song) {
                    m.reactions.resolve("⏩").users.remove("501862549739012106");
                    m.reactions.resolve("⏪").users.remove("501862549739012106");
                    m.reactions.resolve(loopEmote).users.remove("501862549739012106");
                }
            });

            loopFilter.on("collect", r => {
                m.reactions.resolve(loopEmote).users.remove(msg.author.id);
                if (loopEmote == loopEmotes[0]) loopEmote = loopEmotes[1]
                else loopEmote = loopEmotes[0];

                m.reactions.resolve("⏩").users.remove("501862549739012106");
                m.react(loopEmote).then(r3 => m.react("⏩"));

                reloadStorage();

                storage.loop = !storage.loop;

                saveStorage();

                var song = storage.songs[storage.index];
                var desc = "The queue has ended.";

                if (song) desc = `**[${song.name}](https://www.youtube.com/watch?v=${song.id})**\n\n` +
                `Loop: ${storage.loop}` +
                `\`Requested by:${song.requester}\``;

                var embed = new Interface.Embed(message, "youtube logo here", [], desc);
                m.edit(embed);

                if (!song) {
                    m.reactions.resolve("⏩").users.remove("501862549739012106");
                    m.reactions.resolve("⏪").users.remove("501862549739012106");
                    m.reactions.resolve(loopEmote).users.remove("501862549739012106");
                }
            });

            backFilter.on("collect", r => {
                m.reactions.resolve("⏪").users.remove(msg.author.id);

                var song = this.prevSong();
                var desc = "The queue has ended.";
                
                if (song) desc = `**[${song.name}](https://www.youtube.com/watch?v=${song.id})**\n\n` +
                `\`Requested by:${song.requester}\``;

                var embed = new Interface.Embed(message, "youtube logo here", [], desc);
                m.edit(embed);

                if (!song) {
                    m.reactions.resolve("⏩").users.remove("501862549739012106");
                    m.reactions.resolve("⏪").users.remove("501862549739012106");
                    m.reactions.resolve(loopEmote).users.remove("501862549739012106");
                }
            });
        
        });

    }

    reloadStorage();

}

function Player(message, pargs) {

    var queue = new Queue(message);
    var options = {
        name: "",
        id: "",
        author: "",
        msg: message,
        audio: "",
        keywords: ""
    }

    var methods = {
        play: (addingSong) => {
            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send(`You need to be in a voice channel first!`);
            if (!args) return message.channel.send(`You need to specify music to search for!`);

            if (addingSong) queue.addSong(options.name, options.id, options.author, options.msg, options.audio, options.keywords);

            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (conn) {
                var song = queue.getSong();
                queue.displaySong(message);
                
                const dispatcher = conn.playArbitraryInput(song.url);
                dispatcher.on("end", end => {

                    var nextSong = queue.nextSong();

                    if (!nextSong) {
                        message.channel.send(`Queue has ended. Left music channel, ${message.author.username}.`);
                        voiceChannel.leave();
                    }
                    else methods.play(false);

                });
            }
            else {
                voiceChannel.join().then(connection => {
                    message.channel.send(`Joined music channel, ${message.author.username}.`);
                    var song = queue.getSong();

                    queue.displaySong(message);
                    
                    const dispatcher = connection.playArbitraryInput(song.url);
                    dispatcher.on("end", end => {

                        var nextSong = queue.nextSong();

                        if (!nextSong) {
                            message.channel.send(`Queue has ended. Left music channel, ${message.author.username}.`);
                            voiceChannel.leave();
                        }
                        else methods.play();

                    });
                
                }).catch(err => message.channel.send(`Errors found:\n \`\`\`${err}, ${err.stack}\`\`\``));
            }

        },
        stop: () => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);

            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send(`You need to be in a voice channel first!`);

            if (message.author.id != queue.get().starter || !message.author.hasPermission("ADMINISTRATOR")) return message.channel.send(`You must be the starter of the current queue or an administrator to do that.`);
           
            queue.endQueue();
            conn.player.dispatcher.end();
            message.channel.send(`Stopped music, ${message.author.tag}.`);
        },
        resume: () => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);

            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send(`You need to be in a voice channel first!`);

            if (message.author.id != queue.get().starter || !message.author.hasPermission("ADMINISTRATOR")) return message.channel.send(`You must be the starter of the current queue or an administrator to do that.`);
            if (!dispatcher.paused) return message.channel.send(`Music in this guild is already resumed.`);
            
            conn.player.dispatcher.resume();
            message.channel.send(`Resumed music, ${message.author.tag}.`);
        },
        pause: () => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);

            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send(`You need to be in a voice channel first!`);

            if (message.author.id != queue.get().starter || !message.author.hasPermission("ADMINISTRATOR")) return message.channel.send(`You must be the starter of the current queue or an administrator to do that.`);
            if (dispatcher.paused) return message.channel.send(`Music in this guild is already paused.`);
            
            conn.player.dispatcher.pause();
            message.channel.send(`Paused music, ${message.author.tag}.`);
        },
        display: () => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);
            
            queue.displaySong(message);
        },
        skip: () => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);

            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send(`You need to be in a voice channel first!`);

            if (message.author.id != queue.get().starter || !message.author.hasPermission("ADMINISTRATOR")) return message.channel.send(`You must be the starter of the current queue or an administrator to do that.`);
            
            conn.player.dispatcher.end();
            message.channel.send(`Skipped to next song, ${message.author.tag}.`);
        },
        removeSong: (args, removeAll) => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);

            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send(`You need to be in a voice channel first!`);

            if (message.author.id != queue.get().starter || !message.author.hasPermission("ADMINISTRATOR")) return message.channel.send(`You must be the starter of the current queue or an administrator to do that.`);
            
            if (removeAll) {
                var removed = queue.removeSongs(args.join(" "));
                message.channel.send(`Removed ${removed - 1} song(s) from the queue, ${message.author.tag}.`);
            }
            else {
                var removed = queue.removeSong(args.join(" "));
                if (removed) message.channel.send(`Removed song from the queue, ${message.author.tag}.`);
                else message.channel.send(`Failed to remove song from the queue: could not find the song in the queue.`);
            }
        },
        queue: () => {
            var conn = message.client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);

            if (!conn) return message.channel.send(`No music is currently being played in this guild.`);

            var songs = queue.get().songs;

            var response = ``;

            songs.forEach((song) => {

                response += `**[${song.name}](https://youtube.com/watch?v=${song.id})** by ${song.artist}\n`;

            });

            var embed = new Interface.Embed(message, "youtube logo here", [], response);
            embed.embed.title = "Music Queue";

            message.channel.send(embed);
        }
    }

    return new Promise((resolve, reject) => {
        if (pargs) {
            fetch("https://cannicideapi.glitch.me/yt/details/" + pargs.join("+"))
            .then(resp => resp.json())
            .then(res => {
                options.name = res.name;
                options.id = res.id;
                options.author = res.author;
                options.keywords = pargs.join("+");
                options.audio = "https://cannicideapi.glitch.me/yt/name/" + options.keywords;

                resolve(methods);
            })
            .catch(() => {
                reject(new Error("Could not fetch music details from CannicideAPI."));
            })
        }
        else {
            resolve(methods);
        }
    });

}

module.exports = {
    commands: [
        new Command("play", (message, args) => {



        }, false, false, "")
    ]
}