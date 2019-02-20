//A built-in youtube musice server for the discord bot
//Powered by Youtube and Muzzy Tool API Spellchecker
//Dependencies: youtube-finder, ytdl-core, opusscript
const fs = require('fs');
const ytdl = require('ytdl-core');
var youtube = require('youtube-finder');



function playMusic(args, message) {
    var ytClient = youtube.createClient({ key: args[1]});
    const streamOptions = { seek: 0, volume: 1 };
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return `You need to be in a voice channel first!`;
    if (!args) return `You need to specify a youtube video to search for!`;
    var url;
    var params = {
        part: "id",
        q: args[0],
        maxResults: 1,
        type: "video"
      }
      ytClient.search(params, function (err, data) {
        // your magic..
        var vidID = data.items[0].id.videoId;
        url = "https://www.youtube.com/watch?v=" + vidID;
      })
    voiceChannel.join().then(connection => {
        message.channel.send(`Joined music channel, ${message.author.username}.`);
        const stream = ytdl(url, { filter : 'audioonly', quality : 'highestaudio' });
        const dispatcher = connection.playStream(stream, streamOptions);
        dispatcher.on("end", end => {
            message.channel.send(`Left music channel, ${message.author.username}.`);
            voiceChannel.leave();
        });
    }).catch(err => message.channel.send(`Errors found:\n \`\`\`${err}, ${err.stack}\`\`\``));
    return "** **";
}

function stopMusic(message) {
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return `You need to be in a voice channel first!`;
    voiceChannel.leave(voiceChannel);
    return `${message.author.username} stopped the music.`;
}
 

module.exports = {
    play: playMusic,
    stop: stopMusic
}