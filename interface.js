var Discord;

/**
 * Creates a new FancyMessage, helping to make the Interface more interactive and aesthetically appealing.
 * @constructor
 * @param {String} title - Title of the FancyMessage
 * @param {String} question - Question asked to the user
 * @param {Array} bullets - List of answers that the user can respond with
 * @param {Object} [options] - Options to customize title type, and bullet type
 * @param {"="|"#"} [options.title] - Customize title type
 * @param {"*"|"-"} [options.bullet] - Customize the bullet type
 */
function FancyMessage(title, question, bullets, options) {
    options = options || {title: "=", bullet: "*"};

    if (options.title == "=") {
        var stylizedTitle = title + "\n===============================";
    }
    else {
        var stylizedTitle = "# " + title + " #";
    }

    var msg = `\`\`\`md\n${stylizedTitle}\`\`\`\n\`\`\`md\n< ${question} >\n\n`;
    var stylizedBullets = "";

    bullets.forEach((bullet) => {
        stylizedBullets += options.bullet + " " + bullet + "\n";
    });

    msg += stylizedBullets + "\n<!-- Menu will close in 5 minutes.\nDo not include punctuation or the command prefix in your response. -->\`\`\`";

    this.get = () => {return msg};

}

/**
 * Creates a new Embed, which can be used with or without the interface.
 * @constructor
 * @param {Object} message - The message containing the call to the currently processing command.
 * @param {String} thumbnail - The URL to the preferred thumbnail of the Embed.
 * @param {Object[]} fields - An array of the contents of the Embed, separated by field.
 * @param {String} fields[].name - The title of the field.
 * @param {String} fields[].value - The content of the field.
 * @param {Boolean} [fields[].inline] - Whether or not the field is inline.
 */
function EmbedMessage(message, thumbnail, fields, desc) {
    let userID = message.author.id;
    let client = message.client;
    var tuser = client.users.find(m => m.id == userID);
    return {embed: {
        "color": tuser.toString().substring(2, 8),
        "timestamp": new Date(),
        "footer": {
          "icon_url": client.user.avatarURL,
          "text": client.user.username
        },
        "thumbnail": {
          "url": thumbnail
        },
        "author": {
          "name": tuser.username,
          "icon_url": tuser.avatarURL
        },
        "fields": fields,
        "image": {},
        "video": {},
        "description": desc ? desc : ""
      }
    };
}

/**
 * Creates a new Interface, an interactive means of receiving input from the user.
 * Works fine with FancyMessage.
 * @param {Object} message - Message containing the command that led to calling on the interface
 * @param {String} question - Question to ask user for a response
 */
function Interface(message, question, callback) {

    var collected = false;
    var closed = false;
    var qMessage;
    message.channel.send(question).then((msg) => {
        qMessage = msg;
    });
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1});
    collector.on("collect", msg => {
        collected = true;
        callback(msg, qMessage);
    });

    collector.on("end", () => {
        closed = true;
    });

    setTimeout(() => {
        if (closed) return;
        else if (!collected) {
            collector.stop("User did not give a response within 5 minutes.");
            qMessage.edit(`<a:no_animated:670060124399730699> <@!${message.author.id}>, the menu closed because you did not respond within 5 minutes.`);
            closed = true;
            callback(false);
        }
    }, 5 * 60 * 1000);

}

module.exports = {
    Interface: Interface,
    /**
     * Sets the Discord variable to the actual Discord object from the server, in order to use MessageCollector.
     * @param {Object} client - The inputted Discord object to set the Discord variable to
     */
    setClient: (client) => {
        Discord = client;
    },
    FancyMessage: FancyMessage,
    Embed: EmbedMessage
};