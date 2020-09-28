// Sends a help command regarding Elisif commands.

var Command = require("../command");
var Interface = require("../interface");
const Alias = require("../alias");

module.exports = {
    commands: [
        new Command("help", (message, hargs) => {

            var cmds = new Command().getCommands();
            var prefix = hargs[0];
            var args = hargs[1];
            var fields = [];
            var embed;
            var thumb = message.guild.iconURL;

            var isFull = false;
            var pages = [];
            var pageIndex = 0;

            function fullList() {
                isFull = true;
                var insertions = 0;
                var page = [];

                cmds.forEach((item) => {
                    if (!item.special) {
                        var res = {
                            name: "",
                            value: ""
                        };
                        res.name = item.name.charAt(0).toUpperCase() + item.name.substring(1) + " Command";
                        res.value = (item.desc ? item.desc + "\n" : "") + "```fix\n" + prefix + item.name;// + "\n";
                        let params = item.cmd.getArguments();
                        if (!params) {
                            res.value += "```\n** **";
                        }
                        else {
                            params.forEach((arg) => {
                                if ("optional" in arg && arg.optional == true) {
                                    res.value += ` [${arg.name}]`;
                                }
                                else {
                                    res.value += ` <${arg.name}>`;
                                }
                            });
                            res.value += "```\n** **";
                        }
                        res.inline = true;
                        //fields.push(res);

                        insertions++;

                        if (insertions > 2) {
                            pages.push(page);
                            page = [];
                            insertions = 0;
                        }
                        else {
                            page.push(res);
                        }
                    }
                });

                embed = new Interface.Embed(message, thumb, pages[pageIndex]);
                embed.embed.title = "**Commands**";
                embed.embed.description = "Elisif (formerly Sif Casino) is an all-in-one entertainment, casino, and moderation bot created by Cannicide#2753."
            }

            if (args) {
                var cmd = cmds.find(c => c.name == args[0]);

                if (cmd) {
                    var item = cmd;
                    var res = {
                        name: "",
                        value: ""
                    };
                    res.name = item.name.charAt(0).toUpperCase() + item.name.substring(1) + " Command";
                    res.value = (item.desc ? item.desc + "\n" : "") + "```fix\n" + prefix + item.name;// + "\n";
                    let params = item.cmd.getArguments();
                    if (!params) {
                        res.value += "```\n** **";
                    }
                    else {
                        params.forEach((arg) => {
                            if ("optional" in arg && arg.optional == true) {
                                res.value += ` [${arg.name}]`;
                            }
                            else {
                                res.value += ` <${arg.name}>`;
                            }
                        });
                        res.value += "```\n** **";
                    }
                    res.inline = true;
                    fields.push(res);

                    embed = new Interface.Embed(message, thumb, []);
                    embed.embed.title = fields[0].name;
                    embed.embed.description = fields[0].value;
                }
                else {
                    fullList();
                }
            }
            else {
                fullList();
            }


            if (!isFull) message.channel.send(embed);
            else {
                message.channel.send(embed).then((m) => {
                    m.react("⬅️").then(r => m.react("➡️"));

                    let forwardsFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id, { time: 120000 });
                    let backFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id, { time: 120000 });
                
                    forwardsFilter.on("collect", r => {
                        r.remove(message.author);

                        pageIndex++;

                        if (pageIndex > pages.length - 1) {
                            pageIndex = pages.length - 1;
                        }
                        else {
                            embed.embed.fields = pages[pageIndex];
                            m.edit(embed);
                        }

                    });

                    backFilter.on("collect", r => {
                        r.remove(message.author);

                        pageIndex--;

                        if (pageIndex < 0) {
                            pageIndex = 0;
                        }
                        else {
                            embed.embed.fields = pages[pageIndex];
                            m.edit(embed);
                        }

                    });
                });
            }

        }, false, false, "Gets a list of all commands, parameters, and their descriptions.").attachArguments([
            {
                name: "command",
                optional: true
            }
        ]),

        new Alias("elisifhelp", "help"),
        new Alias("elisif", "help"),
        new Alias("sifcasino", "help"),
        new Alias("casino", "help")
    ]
};