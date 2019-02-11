//Example for external.js

var theExample = "Hello World";
function anotherExample(argument, message, prefix) {
    var endResult = argument + "; Welcome, " + message.author.username + "! The command is " + prefix
    + "example [arg1]"; //Gets the argument, message object, and command prefix!
    return "Hello " + endResult;
}

module.exports = {
    example: theExample,
    example2: anotherExample
}