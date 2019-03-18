static class Skills {
    constructor() {

    }
}

static class Mage extends Skills {
    constructor() {

    }

    getSkills(level) {
        var skills = [];

        if (level >= 60) {
            skills.unshift({name : "Explosion!", damage : (15 * level)+ 1, description: "casts a massive exploion (over 9000)"});
        } else if (level >= 45) {
            skills.unshift({name : "Hellstorm", damage :  7 * level, description: "summons hellfire from the sky"});
        } else if (level >= 30) {
            skills.unshift({name : "Ice Javalin", damage : 4 * level, description: "impale an enemy with a ice spike"});
        } else if (level >= 20) {
            skills.unshift({name : "Lightning", damage : 60, description: "a lightning bolt zaps your foes"});
        } else if (level >= 10) {
            skills.unshift({name : "Firebolt", damage : 30, description: "you hurl a ball of fire at your target"});
        } else {
            skills.unshift({name : "Kindle", damage : 12, description: "makes your foe warm and toasty"});
        }
    }
}

static class Fighter extends Skills {
    constructor() {

    }

    getSkills(level) {
        if (level >= 60) {
            skills.unshift({name : "Falcon Punch!", damage : 10 * level, description: "FAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCOOOOOOOOOOOOOOOONNNNNNNNNNNNNNNNNNNN PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPUUUUUUUUUUUUUUUUUUUUUUUUUUUUUNNNNNNNNNNNNNNNNNNNNNNNNNNNNCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHH"});
        } else if (level >= 45) {
            skills.unshift({name : "Suplex", damage : 3 * level, description: "a sick suplex"});
        } else if (level >= 30) {
            skills.unshift({name : "Charge", damage : 150, description: "a charge, what do you expect"});
        } else if (level >= 20) {
            skills.unshift({name : "Slam", damage : 25, description: "you strike your foe witha downward... blow? i guess"});
        } else if (level >= 10) {
            skills.unshift({name : "Punch", damage : 10, description: "you take your hand meat and connect it to someone's face"});
        }
    }
}

static class Rouge extends Skills {
   constructor() {

    }

    getSkills(level) {
        if (level >= 60) {
            skills.unshift({name : "Assassinate", damage : 6 * level + Math.floor(Math.random() * (6 * level)), description: "a sneaky assaination"});
        } else if (level >= 45) {
            skills.unshift({name : "Throw Daggers", damage : 3 * level + Math.floor(Math.random() * (3 * level)), description: "you throw a ton of small bladed weapons called daggers at your enemy"});
        } else if (level >= 30) {
            skills.unshift({name : "Sneak Attack", damage : level + Math.floor(Math.random() * level), description: "you preform a sneak attack"});
        } else if (level >= 20) {
            skills.unshift({name : "Back Stab", damage : level * 2, description: "frenchman"});
        } else if (level >= 10) {
            skills.unshift({name : "Stab", damage : 11, description: "you inject a foe with metal and then you take it out"});
        }
    }
}