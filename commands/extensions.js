var Command = require('../command');
var Alias = require('../alias');
const fs = require('fs');

var requisites = [];

function getExtensions() {
    var files = fs.readdirSync(__dirname.split("commands", 2)[0] + "extensions");

    files.forEach((item) => {
        var file = require(`../extensions/${item.substring(0, item.length - 3)}`);
        if (file instanceof Command) {
            requisites.push(file);
        }
        else if ("commands" in file) {
            file.commands.forEach((alias) => {
                if (alias instanceof Command) requisites.push(alias);
                else if (alias instanceof Alias) requisites.push(alias.getAsCommand());
            })
        }
    });
}

getExtensions();

module.exports = {
    commands: requisites
}