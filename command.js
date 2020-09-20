var commands = [];

/**
 * Creates a new executable Command that can be called by users and run by the bot.
 * @param {String} name - The name of the command, used to call the command and identify it in the help command.
 * @param {function(Object, String[]):void} method - The method that is executed when the command is called. Has parameters (message, args).
 * @param {Object} [permissions] - Any Discord permissions required to run the command.
 * @param {String[]} [permissions.perms] - Any Discord permissions required to run the command.
 * @param {String[]} [permissions.roles] - Any Discord roles required to run the command.
 * @param {Boolean} [invisible] - Whether or not the command will not be shown in the help command menu. Intended for moderator commands or easter eggs.
 * @param {String} [desc] - Optional description of the command.
 */
function Command(name, method, permissions, invisible, desc) {
    var message = false;
    var args = false;
    var aliases = [];

    this.set = function(msg) {
        message = msg;
    }

    this.getCommands = () => {
        return commands;
    }

    this.getName = () => {
        return name;
    }

    this.getArguments = () => {
        if (!args) return false;
        else {
            return args;
        }
    }

    this.getAliases = () => {
        return aliases;
    }

    this.getOptions = () => {
        return {method:method,permissions:permissions,invisible:invisible,desc:desc};
    }

    /**
     * Attach alias Command objects to this Command.
     * @param {Object} alias - Command object
     */
    this.attachAlias = (alias) => {
        aliases.push(alias);

        return this;
    }

    /**
     * Check if this command or any of its aliases have the name given.
     * @param {String} cmd 
     * @returns {boolean}
     */
    this.matches = (cmd) => {
        var matched = false;

        if (name == cmd) matched = true;

        aliases.forEach((item) => {
            if (item.getName() == cmd) matched = true;
        });

        return matched;
    }

    /**
     * @param {Object[]} objArr - A list of the possible command arguments of a command.
     * @param {String} objArr[].name - The name of the argument.
     * @param {Boolean} [objArr[].optional] - Whether or not the argument is optional. Default is false.
     */
    this.attachArguments = (objArr) => {
        args = objArr;

        if (args.length == 0) args = false;

        return this;
    }

    function CatchPromise(err) {
        this.catch = function(errorMethod) {
            if (err) errorMethod(err);
        }
    }

    this.execute = function(args) {
        var error = false;
        if (!message) {
            error = "No message was detected.";
        }
        else {

            if (!permissions) {
                method(message, args);
            }
            else {
                var member = message.member;
                var hasPermissions = true;
                var hasRoles = false;

                if ("perms" in permissions) {
                    permissions.perms.forEach((item) => {
                        item = item.toUpperCase();
                        if (!member.hasPermission(item)) {
                            hasPermissions = false;
                        }
                    });
                }
                if ("roles" in permissions) {
                    permissions.roles.forEach((item) => {
                        if (member.roles.find(x => x.name == item)) {
                            hasRoles = true;
                        }
                    })
                }
                else {
                    hasRoles = true;
                }

                if (hasPermissions && hasRoles) {
                    method(message, args);
                }
                else {
                    error = "Sorry, you do not have the permissions to execute that command."
                }
            }

        }

        return new CatchPromise(error);
    }

    if (name && method) commands.push({name: name, cmd: this, special: invisible, desc: desc});

}

module.exports = Command;