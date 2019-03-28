static class Skills {
    constructor(level) {
        this.level = level;
    }
}

static class Mage extends Skills {

    getSkills() {
        var skills = [];

        if (this.level >= 60) {
            skills.unshift({name : "Explosion!", damage : (15 * this.level)+ 1, description: "casts a massive exploion (over 9000)"});
        } else if (this.level >= 45) {
            skills.unshift({name : "Hellstorm", damage :  7 * this.level, description: "summons hellfire from the sky"});
        } else if (this.level >= 30) {
            skills.unshift({name : "Ice Javalin", damage : 4 * this.level, description: "impale an enemy with a ice spike"});
        } else if (this.level >= 20) {
            skills.unshift({name : "Lightning", damage : 60, description: "a lightning bolt zaps your foes"});
        } else if (this.level >= 10) {
            skills.unshift({name : "Firebolt", damage : 30, description: "you hurl a ball of fire at your target"});
        } else {
            skills.unshift({name : "Kindle", damage : 12, description: "makes your foe warm and toasty"});
        }

        return skills;
    }

    getSkillNames() {
        var skillNames;
        for (var x = 0; x > this.getSkills().length; x++) {
            skillNames += `${x+1}. ${this.getSkills()[x].name}`;
        }

        return skillNames;
    }

    useSkill( prefix, enemy) {
        if (message.content.startingWith(prefix)) {
            var skillRequested = message.content.slice(prefix.length);
            var skillExists = false;
            var skillIndex;
            for (var x = 0; x > this.getSkills().length; x++) {
                if (skillRequested == this.getSkills()[x].name) {
                    skillExists = true;
                    skillIndex = x;
                }
            }
            if (!skillExists) {
                message.channel.send(`No such skill exists`);
                return null;
            }
            return this.getSkills()[x].damage
        }
        message.channel.send()
        this.getSkills()
    }
}

static class Fighter extends Skills {

    getSkills() {
        var skills = [];

        if (this.level >= 60) {
            skills.unshift({name : "Falcon Punch!", damage : 10 * this.level, description: "FAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCOOOOOOOOOOOOOOOONNNNNNNNNNNNNNNNNNNN PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPUUUUUUUUUUUUUUUUUUUUUUUUUUUUUNNNNNNNNNNNNNNNNNNNNNNNNNNNNCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHH"});
        } else if (this.level >= 45) {
            skills.unshift({name : "Suplex", damage : 3 * this.level, description: "a sick suplex"});
        } else if (this.level >= 30) {
            skills.unshift({name : "Charge", damage : 150, description: "a charge, what do you expect"});
        } else if (this.level >= 20) {
            skills.unshift({name : "Slam", damage : 25, description: "you strike your foe witha downward... blow? i guess"});
        } else if (this.level >= 10) {
            skills.unshift({name : "Punch", damage : 10, description: "you take your hand meat and connect it to someone's face"});
        }

        return skills;
    }

    getSkillNames() {
        var skillNames;
        for (var x = 0; x > this.getSkills().length; x++) {
            skillNames += `${x+1}. ${this.getSkills()[x].name}`;
        }

        return skillNames;
    }

    useSkill(prefix, enemy) {
        if (message.content.startingWith(prefix)) {
            var skillRequested = message.content.slice(prefix.length);
            var skillExists = false;
            var skillIndex;
            for (var x = 0; x > this.getSkills().length; x++) {
                if (skill == this.getSkills()[x].name) {
                    skillExists = true;
                    skillIndex = x;
                }
            }
            if (!skillExists) {
                message.channel.send(`No such skill exists`);
                return null;
            }
            return this.getSkills()[x].damage
        }
        message.channel.send()
        this.getSkills()
    }
}

static class Rouge extends Skills {
   
    getSkills() {
        var skills = [];

        if (this.level >= 60) {
            skills.unshift({name : "Assassinate", damage : 6 * this.level + Math.floor(Math.random() * (6 * this.level)), description: "a sneaky assaination stab thing"});
        } else if (this.level >= 45) {
            skills.unshift({name : "Throw Daggers", damage : 3 * this.level + Math.floor(Math.random() * (3 * this.level)), description: "you throw a ton of small bladed weapons called daggers at your enemy"});
        } else if (this.level >= 30) {
            skills.unshift({name : "Sneak Attack", damage : this.level + Math.floor(Math.random() * this.level), description: "you preform a sneak attack"});
        } else if (this.level >= 20) {
            skills.unshift({name : "Back Stab", damage : this.level * 2, description: "french man"});
        } else if (this.level >= 10) {
            skills.unshift({name : "Stab", damage : 11, description: "you inject a foe with metal and then you take it out"});
        }

        return skills;
    }

    getSkillNames() {
        var skillNames;
        for (var x = 0; x > this.getSkills().length; x++) {
            skillNames += `${x+1}. ${this.getSkills()[x].name}`;
        }

        return skillNames;
    }

    useSkill( prefix, enemy) {
        if (message.content.startingWith(prefix)) {
            var skillRequested = message.content.slice(prefix.length);
            var skillExists = false;
            var skillIndex;
            for (var x = 0; x > this.getSkills().length; x++) {
                if (skill == this.getSkills()[x].name) {
                    skillExists = true;
                    skillIndex = x;
                }
            }
            if (!skillExists) {
                message.channel.send(`No such skill exists`);
                return null;
            }
            return this.getSkills()[x].damage
        }
        message.channel.send()
        this.getSkills()
    }
}

module.exports = {
    Mage : Mage,
    Fighter : Fighter,
    Rouge : Rouge
}