const fs = require('fs') 

function splash(message, profile) {
    message.channel.send(`Welcome, ${message.author.username} to Adventure Gaem()`);
}
module.exports = {
    splash : splash
}