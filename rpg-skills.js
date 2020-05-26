var skills = {
    Mage: {
        getSkills: function(level) {
            var skills = [{name: "Whack (/attack whack)", id: "whack", damage: 15, description:"you attack with your weapon"}];
    
            if (level >= 60) {
                skills.unshift({name : "Explosion! (/attack expolsion)", id: "expolsion", damage : 15 * this.level, description: "casts a massive exploion over 900"});
            }  if (level >= 45) {
                skills.unshift({name : "Hellstorm (/attack hellstom)", id: "hellstom", damage :  7 * this.level, description: "summons hellfire from the sky"});
            }  if (level >= 30) {
                skills.unshift({name : "Ice Javalin (/attack iceJavalin)", id: "iceJavalin", damage : 4 * this.level, description: "impale an enemy with a ice spike"});
            }  if (level >= 20) {
                skills.unshift({name : "Lightning (/attack lightning)", id: "lightning", damage : 60, description: "a lightning bolt zaps your foes"});
            }  if (level >= 10) {
                skills.unshift({name : "Firebolt (/attack firebolt)", id: "firebolt", damage : 30, description: "you hurl a ball of fire at your target"});
            }
            return skills;
        },
    
        getSkillNames: function(level) {
            var skillNames;
            var knownSkills = this.getSkills(level);
            for (var x = 0; x < knownSkills.length; x++) {
                skillNames += '${x+1}. ${this.getSkills(level)[x].name}';
            }
    
            return skillNames;
        },
    
        useSkill: function(prefix, msg) {
            var skillRequested;
            if (msg.content.startingWith(prefix)) {
                skillRequested = msg.content.slice(prefix.length);
            }
                var skillExists = false;
                var skillIndex;
                for (var x = 0; x < this.getSkills(level).length; x++) {
                    if (skillRequested == this.getSkills(level)[x].id) {
                        skillExists = true;
                        skillIndex = x;
                    }
                }
                if (!skillExists) {
                    msg.channel.send('No such skill exists');
                    return null;
                }
            return this.getSkills(level)[skillIndex].damage
        }
    }, 
    
    Fighter: {
        getSkills: function(level) {
            var skills = [{name: "Jab (/attack jab)", id: "jab", damage: 15, description:"you attack with your weapon"}];
    
            if (level >= 60) {
                skills.unshift({name : "Falcon Punch! (/attack falconPunch)", id: "falconPunch", damage : 10 * this.level, description: "FAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCOOOOOOOOOOOOOOOONNNNNNNNNNNNNNNNNNNN PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPUUUUUUUUUUUUUUUUUUUUUUUUUUUUUNNNNNNNNNNNNNNNNNNNNNNNNNNNNCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCHHHHHHHHHHHHHHHHHHHH"});
            }  if (level >= 45) {
                skills.unshift({name : "Suplex (/attack suplex)", id: "suplex", damage : 3 * this.level, description: "a sick suplex"});
            }  if (level >= 30) {
                skills.unshift({name : "Charge (/attack charge)", id: "charge", damage : 150, description: "a charge, what do you expect"});
            }  if (level >= 20) {
                skills.unshift({name : "Slam (/attack slam)", id: "slam", damage : 25, description: "you strike your foe witha downward... blow? i guess"});
            }  if (level >= 10) {
                skills.unshift({name : "Punch (/attack punch)", id: "punch", damage : 10, description: "you take your hand meat and connect it to someone's face"});
            }
    
            return skills;
        },
    
        getSkillNames: function(level) {
            var skillNames;
            var knownSkills = this.getSkills(level);
            for (var x = 0; x < knownSkills.length; x++) {
                skillNames += '${x+1}. ${this.getSkills(level)[x].name}';
            }
    
            return skillNames;
        },
    
        useSkill: function(prefix, msg) {
            var skillRequested;
            if (msg.content.startingWith(prefix)) {
                skillRequested = msg.content.slice(prefix.length);
            }
                var skillExists = false;
                var skillIndex;
                for (var x = 0; x < this.getSkills(level).length; x++) {
                    if (skillRequested == this.getSkills(level)[x].id) {
                        skillExists = true;
                        skillIndex = x;
                    }
                }
                if (!skillExists) {
                    msg.channel.send('No such skill exists');
                    return null;
                }
            return this.getSkills(level)[skillIndex].damage
        }
    }, 
    
    Rouge: {
        getSkills: function(level) {
            var skills = [{name: "Poke (/attack poke)", id: "poke", damage: 15, description:"you attack with your weapon"}];
    
            if (level >= 60) {
                skills.unshift({name : "Assassinate (/attack assassinate)", id: "assassinate", damage : 9 * this.level + Math.floor(Math.random() * (9 * this.level)), description: "a sneaky assaination stab thing"});
            }  if (level >= 45) {
                skills.unshift({name : "Throw Daggers (/attack throwDaggers)", id: "throwDaggers", damage : 5 * this.level + Math.floor(Math.random() * (5 * this.level)), description: "you throw a ton of small bladed weapons called daggers at your enemy"});
            }  if (level >= 30) {
                skills.unshift({name : "Sneak Attack (/attack sneakAttack)", id: "sneakAttack", damage : this.level + Math.floor(Math.random() * this.level), description: "you preform a sneak attack"});
            }  if (level >= 20) {
                skills.unshift({name : "Back Stab (/attack backStab)", id: "backStab", damage : this.level * 2, description: "french man"});
            }  if (level >= 10) {
                skills.unshift({name : "Stab (/attack stab)", id: "stab", damage : 11, description: "you inject a foe with metal and then you take it out"});
            }
    
            return skills;
        },
    
        getSkillNames: function(level) {
            var skillNames;
            var knownSkills = this.getSkills(level);
            for (var x = 0; x < knownSkills.length; x++) {
                skillNames += '${x+1}. ${this.getSkills(level)[x].name}';
            }
    
            return skillNames;
        },
    
        useSkill: function(prefix, msg) {
            var skillRequested;
            if (msg.content.startingWith(prefix)) {
                skillRequested = msg.content.slice(prefix.length);
            }
                var skillExists = false;
                var skillIndex;
                for (var x = 0; x < this.getSkills(level).length; x++) {
                    if (skillRequested == this.getSkills(level)[x].id) {
                        skillExists = true;
                        skillIndex = x;
                    }
                }
                if (!skillExists) {
                    msg.channel.send('No such skill exists');
                    return null;
                }
            return this.getSkills(level)[skillIndex].damage
        }
    },
}

module.exports = {
    skills: skills
}
