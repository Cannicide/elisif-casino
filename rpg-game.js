var fs = require('fs')
var ls = require("./ls")

var skills = require(`./rpg-skills`);
var enemies = require(`./rpg-enemy`);

var characterData = [];
var characterIndex;

ls.setObj("characterArray", characterData);


function splash(message, profile, prefix) {
    console.log("splash sturt");
    message.channel.send(`Welcome, ${message.author.username} to Adventure Gaem`);
    if (!profile) {
        return `Create a profile first with ${prefix}create if you want to play, pleeblian`;
    }
    else {
        var doesCharExist = false;
        for (var x = 0; x < characterData.length; x++) {
            if (characterData[x].hasCharacter && characterData[x].name == message.author.username) {
                doesCharExist = true;
                characterIndex = x;
            }
        }
        if (!doesCharExist) {
            message.channel.send(`Would you like to be a mage (send ${prefix}class mage), fighter (send ${prefix}class fighter), or rouge (send ${prefix}class rouge)`);
        }
        else {
            characterData[characterIndex].playerGold = profile;
            message.channel.send(`${prefix}town battle\n${prefix}town shop\n${prefix}town playerInfo.\n${prefix}town exit`);
        }
    }
}

function createChar(message, profile, prefix) {
    characterData.push({name : message.author.username, hasCharacter : true, class: classCheck, level : 1, 
                        playerGold: profile, maxHealth: 100, currHealth: 100, defense: 0, weaponDamage: 0,
                        potions: {minorHealthPotion: 0, mediumHealthPotion: 0, largeHealthPotion: 0},
                        enemy: null});

    characterIndex = characterData.length - 1;
    ls.setObj("characterArray", characterData);
    message.channel.send(`${prefix}town battle\n${prefix}town shop\n${prefix}town playerInfo.\n${prefix}town exit`);
}

function town(message, choice) {
        switch (choice) {
            case `battle`:
                if (characterData[characterIndex].level < 5) {
                    characterData[characterIndex].enemy = enemies.Enemies.getEnemies()[Math.random() * enemies.Enemies.levelOneToFive.length];
                    ls.setObj("characterArray", characterData);
                    message.channel.send(`${prefix}fightOption attack\n${prefix}fightOption inventory\n${prefix}fightOption check\n${prefix}fightOption run`);
                }
            break;
            case `shop`:
                message.channel.send(`comming soon`);
            break;
            case `playerInfo`:
                message.channel.send("```Name: " + characterData[characterIndex].name + 
                                    "\nClass: " + characterData[characterIndex].class + 
                                    "\nLevel: " + characterData[characterIndex].level.toString() + 
                                    "\nHealth: " + characterData[characterIndex].currHealth.toString() + "/" + characterData[characterIndex].maxHealth.toString() + 
                                    "\nGold: " + characterData[characterIndex].playerGold.toString() + 
                                    "\nDefense: " + characterData[characterIndex].defense.toString() + 
                                    "\nDamage from Current Weapon: " + characterData[characterIndex].weaponDamage.toString() + 
                                    "\nAmount of Minor Health Potion: " + characterData[characterIndex].potion.minorHealthPotion.toString() + 
                                    "\nAmount of Medium Health Potion: " + characterData[characterIndex].potion.mediumHealthPotion.toString() + 
                                    "\nAmount of Large Health Potion: " + characterData[characterIndex].potion.largeHealthPotion.toString() + "```");
            break;
            case `exit`:
            break;
            default:
                message.channel.send(`Try again (only numbers 1 - 4)`);
        }
}


function turn(prefix, message, fightOption) {
    if (fightOption == "attack") {
        attack(prefix, message);
        takeDamage(message);
    }
    else if (fightOption == "inventory") {
        message.channel.send("You Have " + potions.minorHealthPotion + " Minor Health Potions, " + 
                              potions.mediumHealthPotion + " Medium Health Potions, and " + 
                              potions.largeHealthPotion + " Large Health Potions.");

        message.channel.send(`Type ${prefix}potion minor, ${prefix}potion medium, or ${prefix}potion large to choose`);    
        usePotion(prefix);
        
        takeDamage(message)
    }
    else if (fightOption == "check") {
        checkEnemy();
    }
    else if (fightOption == "run") {
        if (run()) {
            characterData[characterIndex].enemy = null;
        } else {
            takeDamage(message);
        }
    } else {
        message.channel.send(`Try again`);
    }    
}

function attack(prefix, message) {
    message.channel.send(`Choose an attack! (use the command in the parenthesis)`)
    switch (characterData[characterIndex].class) {
        case "mage":
            message.channel.send(`Here are your skills ${skills.Mage.getSkillNames(level)}`);
            var deltDamage = ((useSkill(prefix, message) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
            characterData[characterIndex].enemy.baseHealth -= deltDamage;
            message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + characterData[characterIndex].enemy.baseHealth + "100 HP"); 
        break;
        case "fighter":
            message.channel.send(`Here are your skills ${skills.Fighter.getSkillNames(level)}`);
            var deltDamage = ((useSkill(prefix, message) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
            characterData[characterIndex].enemy.baseHealth -= deltDamage;
            message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + characterData[characterIndex].enemy.baseHealth + "100 HP");
        break;
        case "rouge":
            message.channel.send(`Here are your skills ${skills.Rouge.getSkillNames(level)}`);
            var deltDamage = ((useSkill(prefix, message) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
            characterData[characterIndex].enemy.baseHealth -= deltDamage;
            message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + characterData[characterIndex].enemy.baseHealth + "100 HP");
        break;
    }
    if (characterData[characterIndex].enemy.baseHealth < 1) {
        characterData[characterIndex].playerGold = characterData[characterIndex].playerGold + ((Math.Random() *  25) + 25);
        ls.setObj("characterArray", characterData);
        message.channel.send("Enemy DEFEATED!!!" + characterData[characterIndex].playerGold);
    }
}

function useSkill(prefix, msg, skillSearchingFor) {
    var skillRequested = skillSearchingFor;
    if (msg.content.startingWith(prefix)) {
        skillRequested = msg.content.slice(prefix.length);
    }
    var classSkills;
    switch (characterData[characterIndex].class) {
        case "mage":
            classSkills = skills.Mage;
        break;
        case "fighter":
            classSkills = skills.Fighter;
        break;
        case "rouge":
            classSkills = skills.Rouge;
        break;
    }
    var skillExists = false;
    var skillIndex;
    for (var x = 0; x < classSkills.getSkills().length; x++) {
        if (skillRequested == classSkills.getSkills()[x].id) {
            skillExists = true;
            skillIndex = x;
        }
    }
    if (!skillExists) {
        msg.channel.send(`No such skill exists`);
        return null;
    }
        return this.getSkills()[skillIndex].damage
}

function takeDamage(message) {
    if (characterData[characterIndex].currHealth > 0) {
        if (characterData[characterIndex].enemy.baseHealth > 0) {
            var enemyAttack = characterData[characterIndex].enemy.attacks[characterData[characterIndex].enemy.attacks.length * Math.Random()]
            message.channel.send(`${characterData[characterIndex].enemy.name} used ${enemyAttack.name}`)
            var DamageTaken = characterData[characterIndex].enemy.damage - characterData[characterIndex].defense;
            characterData[characterIndex].currHealth -= DamageTaken;
            ls.setObj("characterArray", characterData);
            message.channel.send("You have taken " + DamageTaken + " damage.");
            message.channel.send("You have " + characterData[characterIndex].currHealth + "/100 HP.");
        }
    } else {
        message.channel.send("You have died.");
        message.channel.send(`as punishment for your death your character get deleted`);
        characterData.splice(characterIndex, 1);
        ls.setObj("characterArray", characterData);
        message.channel.send(`you will now be exited from the game`);
    }
}

function minorHealthPotionCheck(message) {
    if (potions.minorHealthPotion > 0) {
        message.channel.send("Gained 10 HP");
        characterData[characterIndex].currHealth += 10;
        characterData[characterIndex].potions.minorHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > characterData[characterIndex].maxHealth) {
            message.channel.send("Overdose inflicted. Lost 20 HP");
            characterData[characterIndex].currHealth -= 20;
        }
    } else {
        message.channel.send(`You have no minor HP potions`);
    }
}

function mediumHealthPotionCheck(message) {
    if (potions.mediumHealthPotion > 0) {
        message.channel.send("Gained 25 HP");
        characterData[characterIndex].currHealth += 25;
        characterData[characterIndex].potions.mediumHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > 100) {
            message.channel.send("Overdose inflicted. Lost 35 HP");
            characterData[characterIndex].currHealth -= 50;
        }
    } else {
        message.channel.send(`You have no medium HP potions`);
    }
}

function largeHealthPotionCheck(message) {
    if (potions.largeHealthPotion > 0) {
        message.channel.send("Restored All Health");
        characterData[characterIndex].currHealth = characterData[characterIndex].maxHealth;
        characterData[characterIndex].potions.largeHealthPotion -= 1;
    } else {
        message.channel.send(`You have no large HP potions`);
    }
}

function usePotion(message, potionType) {
    switch (potionType) {
        case minor:
            minorHealthPotionCheck(message);
            break;
        case medium:
            mediumHealthPotionCheck(message)
            break;
        case large:
            largeHealthPotionCheck(message);
            break;
        default:
            message.channel.send("you failure");
    }
    ls.setObj("characterArray", characterData);
}

function checkEnemy() {
    message.channel.send("The Enemy has:" + characterData[characterIndex].enemy.baseHealth + " /" 
                        + characterData[characterIndex].enemy.maxHealth +" HP\n"
                        + characterData[characterIndex].enemy.defense + " Defense\n" +
                         "And the attacks are: " + Enemies.checkEnemyAttacks(characterData[characterIndex].enemy));
}

function run() {
    var runawayChance = (Math.Random() *  4);
    if (runawayChance == 1) {
        message.channel.send("You Ran away. Lost 25 gold.");
        characterData[characterIndex].playerGold -= 25;
        ls.setObj("characterArray", characterData);
        return true;
    }
    else {
        message.channel.send("Failed");
        return false;
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
