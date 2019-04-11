const fs = require('fs')
const ls = require("./ls")

const skills = require(`./rpg-skills`);
const enemies = require(`./rpg-enemy`);

var characterData = [];
var characterIndex;

ls.setObj("characterArray", characterData);

var msg = {};

function splash(message, profile, prefix) {
    msg = message;
    msg.channel.send(`Welcome, ${msg.author.username} to Adventure Gaem()`);
    if (!profile) {
        return `Create a profile first with ${prefix}create if you want to play, pleeblian`;
    }
    else {
        var doesCharExist = false;
        for (var x = 0; x < characterData.length; x++) {
            if (characterData[x].hasCharacter && characterData[x].profile == msg.author.id) {
                doesCharExist = true;
                characterIndex = x;
            }
        }
        if (!doesCharExist) {
            createChar(profile, prefix);
        }
        else {
            characterData[characterIndex].playerGold = profile;
            town(process, prefix);
        }
    }
}

function createChar(profile, prefix) {
    var classChosen = false;
    while (!classChosen) {
        msg.channel.send(`Would you like to be a mage (send ${prefix}mage), fighter (send ${prefix}fighter), or rouge (send ${prefix}rouge)`);
        if  (msg.content.startWith(prefix)) {
            var classCheck = msg.content.slice(prefix.length)
        }
        if (classCheck == `mage` || classCheck == `fighter` || classCheck == `rouge` ) {

        }
    }
    characterData.push({name : msg.author.username, hasCharacter : true, class: classCheck, level : 1, 
                        playerGold: profile, maxHealth: 100, currHealth: 100, defense: 0, weaponDamage: 0,
                        potions: {minorHealthPotion: 0, mediumHealthPotion: 0, largeHealthPotion: 0}});

    characterIndex = characterData.length - 1;
    town(profile, prefix);
}

function town(prefix) {
    var playingGame = true;
    while (playingGame) {
        msg.channel.send(`1. Battle\n2. Shop\n3. Player Info.\n4. Exit`);
        if  (message.content.startWith(prefix)) {
            var choice = message.content.slice(prefix.length)
            msg = message;
        }
        switch (choice) {
            case `1`:
                encounter();
            break;
            case `2`:
                msg.channel.send(`comming soon`);
            break;
            case `3`:
                msg.channel.send("```Name: " + characterData[characterIndex].name + 
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
            case `4`:
                playingGame = false;
            break;
            default:
                msg.channel.send(`Try again (only numbers 1 - 4)`);
        }
    }
}

function encounter() {
    if (characterData[characterIndex].level < 5) {
        var enemy = enemies.Enemies.getEnemies()[Math.random() * enemies.Enemies.levelOneToFive.length];
        battleFunc(enemy, prefix)
    } else {
        
    }
}

function battleFunc(enemy, prefix) {
    var enemyHealthMax = enemy.baseHealth;
    turn(enemy, prefix);
    characterData[characterIndex].playerGold = characterData[characterIndex].playerGold + ((Math.Random() *  25) + 25);
    msg.channel.send("Enemy DEFEATED!!!" + characterData[characterIndex].playerGold);

}

function turn(enemy, prefix) {
    var battleEnd = false;
    while (!battleEnd) {
        msg.channel.send("```1. Attack\n2. Inventory\n3. Check\n4. Run (anything after defaults to check)\n```");
        if  (message.content.startWith(prefix)) {
            var fightOption = message.content.slice(prefix.length);
            msg = message;
        }
        var choiceMade = false;
        while (!choiceMade) {
            if (fightOption == 1) {
                attack(enemy, prefix);
                takeDamage(enemy, prefix);
            }
            else if (fightOption == 2) {
                choiceMade = true;
                usePotion(prefix, prefix);
            }
            else if (fightOption == 3) {
                choiceMade = true;
                checkEnemy(enemy, prefix);
            }
            else if (fightOption == 4) {
                choiceMade = true;
                run(enemy, prefix);
            } else {
                msg.channel.send(`Try again`);
                msg.channel.send("```1. Attack\n2. Inventory\n3. Check\n4. Run (anything after defaults to check)\n```");
            }
        }
        msg.channel.send("You have " + characterData[characterIndex].currHealth + "/100 HP.");
        if (enemy.baseHealth < 1) {
            battleEnd = true;
        }
    }
}

function attack(enemy, prefix) {
    msg.channel.send(`Choose an attack!`)
    switch (characterData[characterIndex].class) {
        case "mage":
            msg.channel.send(`Here are your skills ${skills.Mage.getSkillNames(level)}`);
            try {
                var deltDamage = ((skills.Mage.useSkills(prefix, enemy) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
                enemy.baseHealth -= deltDamage;
                msg.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemy.baseHealth + "100 HP");                
            } catch (err) {
                msg.channel.send(`There is no skill with that name`);
            }

        break;
        case "fighter":
            msg.channel.send(`Here are your skills ${skills.Fighter.getSkillNames(level)}`);
            try {
                var deltDamage = ((skills.Fighter.useSkills(prefix, enemy) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
                enemy.baseHealth -= deltDamage;
                msg.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemy.baseHealth + "100 HP");                
            } catch (err) {
                msg.channel.send(`There is no skill with that name`);
            }

        break;
        case "rouge":
            msg.channel.send(`Here are your skills ${skills.Rouge.getSkillNames(level)}`);
            try {
                var deltDamage = ((skills.Rouge.useSkills(prefix, enemy) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
                enemy.baseHealth -= deltDamage;
                msg.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemy.baseHealth + "100 HP");                
            } catch (err) {
                msg.channel.send(`There is no skill with that name`);
            }
        break;
    }
}

function takeDamage(enemy) {
    if (characterData[characterIndex].currHealth > 0) {
        if (enemy.baseHealth > 0) {
            var enemyAttack = enemy.attacks[enemy.attacks.length * Math.Random()]
            msg.channel.send(`${enemy.name} used ${enemyAttack.name}`)
            var DamageTaken = enemy.damage - characterData[characterIndex].defense;
            characterData[characterIndex].currHealth -= DamageTaken;
            msg.channel.send("You have taken " + DamageTaken + " damage.");
            msg.channel.send("You have " + characterData[characterIndex].currHealth + "/100 HP.");
        }
    } else {
        msg.channel.send("You have died.");
    }
}

function minorHealthPotionCheck() {
    if (potions.minorHealthPotion > 0) {
        msg.channel.send("Gained 10 HP");
        characterData[characterIndex].currHealth += 10;
        potions.minorHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > characterData[characterIndex].maxHealth) {
            msg.channel.send("Overdose inflicted. Lost 20 HP");
            characterData[characterIndex].currHealth -= 20;
        }
        takeDamage(enemy);
    } else {
        msg.channel.send(`You have no minor HP potions`);
    }
}

function mediumHealthPotionCheck() {
    if (potions.mediumHealthPotion > 0) {
        msg.channel.send("Gained 25 HP");
        characterData[characterIndex].currHealth += 25;
        potions.mediumHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > 100) {
            msg.channel.send("Overdose inflicted. Lost 35 HP");
            characterData[characterIndex].currHealth -= 50;
        }
        takeDamage(enemy);
    } else {
        msg.channel.send(`You have no medium HP potions`);
    }
}

function largeHealthPotionCheck() {
    if (potions.largeHealthPotion > 0) {
        msg.channel.send("Restored All Health");
        characterData[characterIndex].currHealth = characterData[characterIndex].maxHealth;
        potions.largeHealthPotion -= 1;
        takeDamage(enemy);
    } else {
        msg.channel.send(`You have no large HP potions`);
    }
}

function usePotion(prefix) {
    msg.channel.send("You Have " + potions.minorHealthPotion + " Minor Health Potions, " + potions.mediumHealthPotion + " Medium Health Potions, and " + potions.largeHealthPotion + " Large Health Potions.");
    msg.channel.send(`Type ${prefix}minor, ${prefix}medium, or ${prefix}large to choose`);
    if (message.content.startWith(prefix)) {
        var potionType = message.content.slice(prefix.length)
        msg = message;
    }
    switch (potionType) {
        case minor:
            minorHealthPotionCheck();
            break;
        case medium:
            mediumHealthPotionCheck()
            break;
        case large:
            largeHealthPotionCheck();
            break;
        default:
            msg.channel.send("you failure");
    }
}

function checkEnemy(enemy, enemyDamage) {
    msg.channel.send("The Enemy has:" + enemy.baseHealth + " /100 HP" + enemy.defense + " Defense" + "And " + enemyDamage + " Attack");
}

function run(enemy) {
    var runawayChance = (Math.Random() *  4);
    if (runawayChance == 1) {
        msg.channel.send("You Ran away. Lost 25 gold.");
        characterData[characterIndex].playerGold -= 25;

    }
    else {
        msg.channel.send("Failed");
        takeDamage(enemy);
    }
}

module.exports = {
    splash: splash
}
