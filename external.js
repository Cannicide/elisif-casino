//Used to initialize commands' code files if from an external source
/* 
    If you want to help develop command(s) for this bot, this is where your command(s) will be
    initialized. Each command should have its own JS file unless the entirety of the command can
    be written neatly in 3 lines or less.

    Create a separate JS file to hold your command in the format style shown in ext-example.js...
    Then, add your command to the externalCommands object as an embedded object itself, as shown below.
    Give your embedded object a name property, this will be used to call your command (i.e. if the name
    is set to "example", it will be called with "/example" by the user.) Finally, create a get property
    with type Function that will return the stuff that will be sent to the user in a discord message. 
    You can get the command's arguments (that the user specifies, as shown in the templateExample) 
    using the variable "args". Specify an args argument
    in your get function itself, even if you do not require usage of the arguments.
    Make sure your command objects have a set name, desc (description), and usage (for the help command).
    See the example below or contact Cannicide#2753 for more information.
*/

const externalCommands = {
    extExample: {
        name: "example",
        desc: "An example command to be used as a template for external developers who want to contribute to this project.",
        usage: function(prefix) {
           return prefix + "example [argument 1] [argument 2] <optional argument 3>";
        },
        get: function(args) {
            var example = require("./ext-example"); //Your command's JS file
            return example.example2("World"); //Content to be sent in the message
        }
    },
    templateExample: {
        name: "command",
        desc: "A functionless template command for external developers.",
        usage: function(prefix) {
            return prefix + "command <entirely optional argument>"
        },
        get: function(args) {
            //var command = require("./your-js-file-without-the-.js-at-the-end");
            //return command.thingToSendInMessage(args); 
            //args is sent your function, it is the command's arguments in an array
            //(i.e. in "/casino profile @user", "profile" and "@user" are pushed into args)
        }
    }
}

module.exports = {
    commands: externalCommands
}

//This isn't too complicated when you get the hang of it. The purpose of this is to make importing external
//authors' codes into this project much easier. Doing this simplifies the depth of my tasks on github
//and provides support for endless commands from external authors without modifying server.js at all.