//Example for external.js

var theExample = "Hello World";
function anotherExample(argument) {
    return "Hello " + argument;
}

module.exports = {
    example: theExample,
    example2: anotherExample
}