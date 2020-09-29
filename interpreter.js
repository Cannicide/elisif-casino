//A non-command system to interpret messages that are not commands and auto-respond/auto-react if necessary

var Profile = require("./commands/profile").Profile;

function Interpreter(message) {

    this.interpret = (args) => {

        //Always interpret adding money balance on non-command message:
        var profile = new Profile(message);
        profile.addForMessage();

        //Suggestion reactions:
        /*f (args[0].toLowerCase().match("suggestion:") && message.channel.name.toLowerCase().match("suggestions")) {
            
            message.react("713053971757006950");

            //Send nay after yea
            setTimeout(() => {
                message.react("713053971211878452");
            }, 100);
            
        }*/

    }

}

module.exports = Interpreter;