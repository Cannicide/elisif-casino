var fs = require(`fs`)
var ls = require("./ls")

var skills = require(`./rpg-skills`);
var enemies = require(`./rpg-enemy`);

var characterData = [];
var characterIndex;

characterData = ls.getObj("characterData", characterData);


function splash(message, profile, prefix) {
    message.channel.send(`Welcome, ${message.author.username} to Adventure Gaem`);
    if (!profile) {
        return `Create a profile first with ${prefix}create if you want to play, pleeblian`;
    }
    else {
        var doesCharExist = false;
        for (var x = 0; x < characterData.length; x++) {
            if (characterData[x].id == message.author.id) {
                doesCharExist = true;
                characterIndex = x;
            }
        }
        if (!doesCharExist) {
            message.channel.send(`Would you like to be a mage (send ${prefix}class mage), fighter (send ${prefix}class fighter), or rouge (send ${prefix}class rouge)`);
        }
        else {
            characterData[characterIndex].playerGold = profile;
            message.channel.send(`Choose one:\n${prefix}town battle\n${prefix}town shop\n${prefix}town playerInfo`);
        }
    }
}

function createChar(message, profile, prefix, classCheck) {
    characterData.push({name : message.author.username, id: message.author.id, class: classCheck, level : 1,
                        playerGold: profile, maxHealth: 100, currHealth: 100, defense: 0, weaponDamage: 0,
                        potions: {minorHealthPotion: 3, mediumHealthPotion: 0, largeHealthPotion: 0},
                        enemy: null, experience: 0});

    characterIndex = characterData.length - 1;
    ls.setObj("characterData", characterData);
    message.channel.send(`Choose one:\n${prefix}town battle\n${prefix}town shop\n${prefix}town playerInfo`);
}

function town(message, choice, prefix) {
        switch (choice) {
            case `battle`:
                if (characterData[characterIndex].level < 5) {
                    characterData[characterIndex].enemy = new enemies.getEnemies()[Math.floor(Math.random() * enemies.getEnemies().length)];
                    ls.setObj("characterData", characterData);
                    message.channel.send(`A wild ${characterData[characterIndex].enemy.name} approached`)
                    message.channel.send(`Choose one:\n${prefix}fightOption attack\n${prefix}fightOption potion\n${prefix}fightOption check\n${prefix}fightOption run`);
                }
            break;
            case `shop`:
                message.channel.send(`comming soon`);
            break;
            case `playerInfo`:
                message.channel.send("```Name: " + characterData[characterIndex].name + 
                                    "\nClass: " + characterData[characterIndex].class + 
                                    "\nLevel: " + characterData[characterIndex].level + 
                                    "\nHealth: " + characterData[characterIndex].currHealth + "/" + characterData[characterIndex].maxHealth + 
                                    "\nGold: " + characterData[characterIndex].playerGold + 
                                    "\nDefense: " + characterData[characterIndex].defense + 
                                    "\nDamage from Current Weapon: " + characterData[characterIndex].weaponDamage + 
                                    "\nAmount of Minor Health Potion: " + characterData[characterIndex].potions.minorHealthPotion + 
                                    "\nAmount of Medium Health Potion: " + characterData[characterIndex].potions.mediumHealthPotion + 
                                    "\nAmount of Large Health Potion: " + characterData[characterIndex].potions.largeHealthPotion + "```");
            break;
        }
}

function chooseEnemy() {
	
}

function turn(prefix, message, fightOption) {
    if (characterData[characterIndex].enemy != null) {
        if (fightOption == "attack") {
            message.channel.send(`Choose an attack! (use the command in the parenthesis)`)
            switch (characterData[characterIndex].class) {
                case "mage":
                    message.channel.send(`Here are your skills ${skills.skills.Mage.getSkillNames(characterData[characterIndex].level)}`);
                break;
                case "fighter":
                    message.channel.send(`Here are your skills ${skills.skills.Fighter.getSkillNames(characterData[characterIndex].level)}`);
                break;
                case "rouge":
                    message.channel.send(`Here are your skills ${skills.skills.Rouge.getSkillNames(characterData[characterIndex].level)}`);
                break;
            }
        }
        else if (fightOption == "potion") {
            message.channel.send("You Have " + characterData[characterIndex].potions.minorHealthPotion + " Minor Health Potions, " + 
                                characterData[characterIndex].potions.mediumHealthPotion + " Medium Health Potions, and " + 
                                characterData[characterIndex].potions.largeHealthPotion + " Large Health Potions.");

            message.channel.send(`Type ${prefix}potion minor, ${prefix}potion medium, or ${prefix}potion large to choose`);    
        }
        else if (fightOption == "check") {
            checkEnemy(message);
        }
        else if (fightOption == "run") {
            if (run(message)) {
                characterData[characterIndex].enemy = null;
            } else {
                takeDamage(message);
            }
        } else {
            message.channel.send(`Try again`);
        }
    } else {
        message.channel.send(`wait so who are we fighting?`)
    }
}

function attack(prefix, message, damage) {
    var deltDamage = ((damage + characterData[characterIndex].weaponDamage) + Math.floor(Math.random() *  6)) - characterData[characterIndex].enemy.defense;
    characterData[characterIndex].enemy.baseHealth -= deltDamage;
    message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + characterData[characterIndex].enemy.baseHealth + " HP"); 
        
    if (characterData[characterIndex].enemy.baseHealth < 1) {
        characterData[characterIndex].playerGold += (Math.floor(Math.random() *  25) + 25);
        characterData[characterIndex].experience += characterData[characterIndex].enemy.experience
        characterData[characterIndex].enemy = null;
        ls.setObj("characterData", characterData);
        message.channel.send("Enemy DEFEATED!!!\n You now have " + characterData[characterIndex].playerGold + " gold!");
    } else {
        takeDamage(message);
    }
}

function useSkill(prefix, msg, skillSearchingFor) {
    if (characterData[characterIndex].enemy != null) {
        var skillRequested = skillSearchingFor;
        var classSkills;
        switch (characterData[characterIndex].class) {
            case "mage":
                classSkills = skills.skills.Mage;
            break;
            case "fighter":
                classSkills = skills.skills.Fighter;
            break;
            case "rouge":
                classSkills = skills.skills.Rouge;
            break;
        }
        var skillExists = false;
        var skillIndex;
        for (var x = 0; x < classSkills.getSkills(characterData[characterIndex].level).length; x++) {
            if (skillRequested == classSkills.getSkills(characterData[characterIndex].level)[x].id) {
                skillExists = true;
                skillIndex = x;
            }
        }
        if (!skillExists) {
            msg.channel.send(`No such skill exists`);
        } else {
            attack(prefix, msg, classSkills.getSkills(characterData[characterIndex].level)[skillIndex].damage);
        }
    } else {
        msg.channel.send(`wait what enemy`)
    }
}

function takeDamage(message) {
    if (characterData[characterIndex].enemy.baseHealth > 0) {
        var enemyAttack = characterData[characterIndex].enemy.attacks[Math.floor(characterData[characterIndex].enemy.attacks.length * Math.random())]
        message.channel.send(`${characterData[characterIndex].enemy.name} used ${enemyAttack.name}`)
        var DamageTaken = enemyAttack.damage - characterData[characterIndex].defense;
        characterData[characterIndex].currHealth -= DamageTaken;
        ls.setObj("characterData", characterData);
        message.channel.send("You have taken " + DamageTaken + " damage.");
        message.channel.send("You have " + characterData[characterIndex].currHealth + "/100 HP.");
        if (characterData[characterIndex].currHealth < 0) {
            message.channel.send("You have died.");
            message.channel.send(`as punishment for your death your character gets deleted`);
            characterData.splice(characterIndex, 1);
            ls.setObj("characterData", characterData);
            message.channel.send(`you will now be exited from the game`);
        }
    }
}

function minorHealthPotionCheck(message) {
    if (characterData[characterIndex].potions.minorHealthPotion > 0) {
        message.channel.send("Gained 25 HP");
        characterData[characterIndex].currHealth += 25;
        characterData[characterIndex].potions.minorHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > characterData[characterIndex].maxHealth) {
            message.channel.send("Overdose inflicted. Lost 30 HP");
            characterData[characterIndex].currHealth -= 30;
        }
    } else {
        message.channel.send(`You have no minor HP potions`);
    }
}

function mediumHealthPotionCheck(message) {
    if (characterData[characterIndex].potions.mediumHealthPotion > 0) {
        message.channel.send("Gained 50 HP");
        characterData[characterIndex].currHealth += 50;
        characterData[characterIndex].potions.mediumHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > 100) {
            message.channel.send("Overdose inflicted. Lost 70 HP");
            characterData[characterIndex].currHealth -= 70;
        }
    } else {
        message.channel.send(`You have no medium HP potions`);
    }
}

function largeHealthPotionCheck(message) {
    if (characterData[characterIndex].potions.largeHealthPotion > 0) {
        message.channel.send("Restored All Health");
        characterData[characterIndex].currHealth = characterData[characterIndex].maxHealth;
        characterData[characterIndex].potions.largeHealthPotion -= 1;
    } else {
        message.channel.send(`You have no large HP potions`);
    }
}

function usePotion(message, potionType) {
    if (characterData[characterIndex].enemy != null) {
        switch (potionType) {
            case "minor":
                minorHealthPotionCheck(message);
                break;
            case "medium":
                mediumHealthPotionCheck(message)
                break;
            case "large":
                largeHealthPotionCheck(message);
                break;
            default:
                message.channel.send("you failure");
        }
        ls.setObj("characterData", characterData);
        takeDamage(message);
    } else {
        message.channel.send(`wait what enemy`);
    }
}

function checkEnemy(message) {
    message.channel.send("```The Enemy has:\n\n\t" + characterData[characterIndex].enemy.baseHealth + "/" 
                        + characterData[characterIndex].enemy.maxHealth +" HP,\n\t"
                        + characterData[characterIndex].enemy.defense + " Defense,\n\n" +
                         "And the attacks are:\n\n " + enemies.checkEnemyAttacks(characterData[characterIndex].enemy) + "```");
}

function run(message) {
    var runawayChance = Math.floor(Math.random() *  4);
    if (runawayChance == 1) {
        message.channel.send("You Ran away. Lost 25 gold.");
        characterData[characterIndex].playerGold -= 25;
        ls.setObj("characterData", characterData);
        return true;
    }
    else {
        message.channel.send("Failed");
        return false;
    }
}

function level() {
	var levelCap = 15;
	if (characterData[characterIndex].level <= levelCap) {
		if (characterData[characterIndex].experience >= (3 * (Math.pow(2, characterData[characterIndex].level) + (100 * characterData[characterIndex].level) - 2))) {
			message.channel.send("You Leveled Up!");
			characterData[characterIndex].level++;
			characterData[characterIndex].maxHealth = Math.round(Math.pow(1.5, characterData[characterIndex].level) + (8 * characterData[characterIndex].level) + 100);
			characterData[characterIndex].currHealth = characterData[characterIndex].maxHealth;
		}
	} else {
		message.channel.send("You have reached the level cap (currently " + levelCap + ")");
	}
}

module.exports = {
    splash: splash,
    createChar: createChar,
    town: town,
    turn: turn,
    usePotion: usePotion,
    player: characterData[characterIndex],
    useSkill: useSkill,
}
