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
            createChar(message, profile, prefix);
        }
        else {
            characterData[characterIndex].playerGold = profile;
            town(prefix);
        }
    }
}

function createChar(message, profile, prefix) {
    console.log("creating character");
    var classChosen = false;
    while (!classChosen) {
        message.channel.send(`Would you like to be a mage (send ${prefix}mage), fighter (send ${prefix}fighter), or rouge (send ${prefix}rouge)`);
        if  (message.content.startsWith(prefix)) {
            var classCheck = message.content.slice(prefix.length);
        }
        if (classCheck == `mage` || classCheck == `fighter` || classCheck == `rouge` ) {
            classChosen = true;
        }
    }
    characterData.push({name : message.author.username, hasCharacter : true, class: classCheck, level : 1, 
                        playerGold: profile, maxHealth: 100, currHealth: 100, defense: 0, weaponDamage: 0,
                        potions: {minorHealthPotion: 0, mediumHealthPotion: 0, largeHealthPotion: 0}});

    characterIndex = characterData.length - 1;
    ls.setObj("characterArray", characterData);
    town(profile, prefix);
}

function town(prefix) {
    console.log("in town");
    var playingGame = true;
    while (playingGame) {
        message.channel.send(`${prefix}1. Battle\n${prefix}2. Shop\n${prefix}3. Player Info.\n${prefix}4. Exit`);
        if  (message.content.startsWith(prefix)) {
            var choice = message.content.slice(prefix.length)
            
        }
        switch (choice) {
            case `1`:
                encounter();
            break;
            case `2`:
                message.channel.send(`comming soon`);
            break;
            case `3`:
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
            case `4`:
                playingGame = false;
            break;
            default:
                message.channel.send(`Try again (only numbers 1 - 4)`);
        }
    }
}

function encounter() {
    if (characterData[characterIndex].level < 5) {
        var enemy = enemies.Enemies.getEnemies()[Math.random() * enemies.Enemies.levelOneToFive.length];
        turn(enemy, prefix)
    } else {
        
    }
}

function turn(enemy, prefix) {
    var battleEnd = false;
    while (!battleEnd) {
        message.channel.send(`${prefix}1. Attack\n${prefix}2. Inventory\n${prefix}3. Check\n${prefix}4. Run`);
        if  (message.content.startsWith(prefix)) {
            var fightOption = message.content.slice(prefix.length);
            
        }
        var choiceMade = false;
        while (!choiceMade) {
            if (fightOption == 1) {
                choiceMade = true;
                attack(enemy, prefix);
                takeDamage(enemy);
            }
            else if (fightOption == 2) {
                choiceMade = true;
                usePotion(prefix);
                takeDamage(enemy)
            }
            else if (fightOption == 3) {
                choiceMade = true;
                checkEnemy(enemy);
            }
            else if (fightOption == 4) {
                choiceMade = true;
                if (run()) {
                    battleEnd = true;
                } else {
                    takeDamage(enemy);
                }
            } else {
                message.channel.send(`Try again`);
                message.channel.send(`${prefix}1. Attack\n${prefix}2. Inventory\n${prefix}3. Check\n${prefix}4. Run`);
            }
        }
        if (enemy.baseHealth < 1) {
            battleEnd = false;
            characterData[characterIndex].playerGold = characterData[characterIndex].playerGold + ((Math.Random() *  25) + 25);
            message.channel.send("Enemy DEFEATED!!!" + characterData[characterIndex].playerGold);
        }
    }
    if (characterData[characterIndex].currHealth < 1){
        message.channel.send(`as punishment for your death your character get deleted`);
        characterData.splice(characterIndex, 1);
        message.channel.send(`you will now be exited from the game`);
    }
}

function attack(enemy, prefix) {
    message.channel.send(`Choose an attack!`)
    switch (characterData[characterIndex].class) {
        case "mage":
            message.channel.send(`Here are your skills ${skills.Mage.getSkillNames(level)}`);
            var deltDamage = ((skills.Mage.useSkill(prefix, enemy) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
            enemy.baseHealth -= deltDamage;
            message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemy.baseHealth + "100 HP"); 
        break;
        case "fighter":
            message.channel.send(`Here are your skills ${skills.Fighter.getSkillNames(level)}`);
            var deltDamage = ((skills.Fighter.useSkill(prefix, enemy) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
            enemy.baseHealth -= deltDamage;
            message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemy.baseHealth + "100 HP");
        break;
        case "rouge":
            message.channel.send(`Here are your skills ${skills.Rouge.getSkillNames(level)}`);
            var deltDamage = ((skills.Rouge.useSkill(prefix, enemy) + characterData[characterIndex].weaponDamage) + (Math.Random() *  6)) - enemy.defense;
            enemy.baseHealth -= deltDamage;
            message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemy.baseHealth + "100 HP");
        break;
    }
}

function takeDamage(enemy) {
    if (characterData[characterIndex].currHealth > 0) {
        if (enemy.baseHealth > 0) {
            var enemyAttack = enemy.attacks[enemy.attacks.length * Math.Random()]
            message.channel.send(`${enemy.name} used ${enemyAttack.name}`)
            var DamageTaken = enemy.damage - characterData[characterIndex].defense;
            characterData[characterIndex].currHealth -= DamageTaken;
            message.channel.send("You have taken " + DamageTaken + " damage.");
            message.channel.send("You have " + characterData[characterIndex].currHealth + "/100 HP.");
        }
    } else {
        battleEnd = true;
        message.channel.send("You have died.");
    }
}

function minorHealthPotionCheck() {
    if (potions.minorHealthPotion > 0) {
        message.channel.send("Gained 10 HP");
        characterData[characterIndex].currHealth += 10;
        potions.minorHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > characterData[characterIndex].maxHealth) {
            message.channel.send("Overdose inflicted. Lost 20 HP");
            characterData[characterIndex].currHealth -= 20;
        }
    } else {
        message.channel.send(`You have no minor HP potions`);
    }
}

function mediumHealthPotionCheck() {
    if (potions.mediumHealthPotion > 0) {
        message.channel.send("Gained 25 HP");
        characterData[characterIndex].currHealth += 25;
        potions.mediumHealthPotion -= 1;
        if (characterData[characterIndex].currHealth > 100) {
            message.channel.send("Overdose inflicted. Lost 35 HP");
            characterData[characterIndex].currHealth -= 50;
        }
    } else {
        message.channel.send(`You have no medium HP potions`);
    }
}

function largeHealthPotionCheck() {
    if (potions.largeHealthPotion > 0) {
        message.channel.send("Restored All Health");
        characterData[characterIndex].currHealth = characterData[characterIndex].maxHealth;
        potions.largeHealthPotion -= 1;
    } else {
        message.channel.send(`You have no large HP potions`);
    }
}

function usePotion(prefix) {
    message.channel.send("You Have " + potions.minorHealthPotion + " Minor Health Potions, " + potions.mediumHealthPotion + " Medium Health Potions, and " + potions.largeHealthPotion + " Large Health Potions.");
    message.channel.send(`Type ${prefix}minor, ${prefix}medium, or ${prefix}large to choose`);
    if (message.content.startsWith(prefix)) {
        var potionType = message.content.slice(prefix.length)
        
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
            message.channel.send("you failure");
    }
}

function checkEnemy(enemy) {
    message.channel.send("The Enemy has:" + enemy.baseHealth + " /"+ enemy.maxHealth +" HP\n"
                         + enemy.defense + " Defense\n" +
                         "And the attacks are: " + Enemies.checkEnemyAttacks(enemy));
}

function run() {
    var runawayChance = (Math.Random() *  4);
    if (runawayChance == 1) {
        message.channel.send("You Ran away. Lost 25 gold.");
        characterData[characterIndex].playerGold -= 25;
        return true;
    }
    else {
        message.channel.send("Failed");
        return false;
    }
}

module.exports = {
    splash: splash
}
