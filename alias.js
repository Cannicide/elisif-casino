var Command = require("./command");

/**
 * Creates an alias of an existent command.
 * @param {String} alias - Name of the alias
 * @param {String} original - Name of the original
 */
function Alias(alias, original) {
    var list = new Command().getCommands();
    var origcmd = list.find(c => c.name == original).cmd;
    var options = origcmd.getOptions();
    var args = origcmd.getArguments();

    var aliascmd = new Command(alias, options.method, options.permissions, options.invisible, `Alias of the \`/${origcmd.getName()}\` command.`);

    if (args) aliascmd.attachArguments(args);

    this.getAsCommand = () => {
        return aliascmd;
    }

    origcmd.attachAlias(this.getAsCommand());
    aliascmd.attachAlias(origcmd);
}

module.exports = Alias;