const fs = require('fs')

var characterData = [];

function splash(message, profile, prefix) {
    message.channel.send(`Welcome, ${message.author.username} to Adventure Gaem()`);
    if (!profile) {
        return `Create a profile first with ${prefix}create if you want to play, pleeblian`;
    }
    else {
        var doesCharExist = false;
        for (const x of characterData) {
            if (characterData[x] == profile) {
                doesCharExist = true;
            }
        }
        if (!doesCharExist) {
            createChar(profile, prefix);
        }
        else {
            town(profile, prefix);
        }
    }
}

function createChar(profile, prefix) {
    message.channel.send(`Would you like to be a mage (send ${prefix}mage), fighter (send ${prefix}fighter), or rouge (send ${prefix}rouge)`);
    if  (message.content.startWith(prefix)) {
        var classCheck = message.content.slice(prefix.length)
    }
    characterData[characterData.length] = {"Profile": profile, "Class": classCheck}
    town(profile, prefix);
}

function town(profile, prefix) {

}

function BattleFunc(playerGold, playerHealth, enemydefense, defense, weaponDamage, enemyDamage, minorHealthPotion, mediumHealthPotion, largeHealthPotion, enemyHealth, prefix) {
    enemyHealth = 100;
    while (enemyHealth > 0) {
        turn(playerHealth, enemydefense, defense, weaponDamage, enemyDamage, minorHealthPotion, mediumHealthPotion, largeHealthPotion, enemyHealth, prefix);
    }
    if (enemyHealth < 1) {
        playerGold = playerGold + ((rand() % 25) + 25);
        message.channel.send("Enemy DEFEATED!!!" + playerGold);
    }
}

function turn(playerHealth, enemydefense, defense, weaponDamage, enemyDamage, minorHealthPotion, mediumHealthPotion, largeHealthPotion, enemyHealth, prefix) {
    message.channel.send("```1. Attack\n2. Inventory\n3. Check\n4. Run\n```");
    var fightOption;
    cin >> fightOption;
    if (fightOption == 1) {
        attack(weaponDamage, enemyHealth, enemydefense);
        takeDamage(playerHealth, enemyDamage, defense);
    }
    else if (fightOption == 2) {
        usePotion(minorHealthPotion, mediumHealthPotion, largeHealthPotion, playerHealth, enemyDamage, prefix);
    }
    else if (fightOption == 3) {
        checkEnemy(enemyHealth, enemydefense, enemyDamage);
    }
    else if (fightOption == 4) {
        run(weaponDamage, enemyHealth, enemydefense, playerGold);
    }
    message.channel.send("You have " + playerHealth + "/100 HP.");
}

function attack(weaponDamage, enemyHealth, enemydefense) {
    var baseDamage = 14;
    var deltDamage = ((baseDamage + weaponDamage) + (rand() % 6)) - enemydefense;
    enemyHealth = enemyHealth - deltDamage;
    message.channel.send("You did " + deltDamage + " damage.\nEnemy has " + enemyHealth + "100 HP");
}

function takeDamage(playerHealth, enemyDamage, defense) {
    if (playerHealth > 0) {
        if (enemyHealth > 0) {
            var DamageTaken = enemyDamage - defense;
            playerHealth = playerHealth - DamageTaken;
            message.channel.send("You have taken " + DamageTaken + " damage.");
            message.channel.send("You have " + playerHealth + "/100 HP.");
        }
    } else {
        message.channel.send("You have died.");
    }
}

function minorHealthPotionCheck(minorHealthPotion, playerHealth) {
    if (minorHealthPotion > 0) {
        message.channel.send("Gained 10 HP");
        playerHealth = playerHealth + 10;
        minorHealthPotion = minorHealthPotion - 1;
        if (playerHealth > 100) {
            message.channel.send("Overdose inflicted. Lost 20 HP");
            playerHealth = playerHealth - 20;
        }
        takeDamage(playerHealth, enemyDamage, defense);
    } else {
        message.channel.send(`You have no minor HP potions`);
    }
}

function mediumHealthPotionCheck(mediumHealthPotion, playerHealth) {
    if (mediumHealthPotion > 0) {
        message.channel.send("Gained 25 HP");
        playerHealth = playerHealth + 25;
        mediumHealthPotion = mediumHealthPotion - 1;
        if (playerHealth > 100) {
            message.channel.send("Overdose inflicted. Lost 35 HP");
            playerHealth = playerHealth - 50;
        }
        takeDamage(playerHealth, enemyDamage, defense);
    } else {
        message.channel.send(`You have no medium HP potions`);
    }
}

function largeHealthPotionCheck(largeHealthPotion, playerHealth) {
    if (largeHealthPotion > 0) {
        message.channel.send("Restored All Health");
        playerHealth = 100;
        largeHealthPotion = largeHealthPotion - 1;
        takeDamage(playerHealth, enemyDamage, defense);
    } else {
        message.channel.send(`You have no large HP potions`);
    }
}

function usePotion(minorHealthPotion, mediumHealthPotion, largeHealthPotion, playerHealth, prefix) {
    message.channel.send("You Have " + minorHealthPotion + " Minor Health Potions, " + mediumHealthPotion + " Medium Health Potions, and " + largeHealthPotion + " Large Health Potions.");
    message.channel.send(`Type ${prefix}minor, ${prefix}medium, or ${prefix}large to choose`);
    if (message.content.startWith(prefix)) {
        var potionType = message.content.slice(prefix.length)
    }
    switch (potionType) {
        case minor:
            minorHealthPotionCheck(minorHealthPotion, playerHealth);
            break;
        case medium:
            mediumHealthPotionCheck(mediumHealthPotion, playerHealth)
            break;
        case large:
            largeHealthPotionCheck(largeHealthPotion, playerHealth);
            break;
        default:
            message.channel.send("you failure");
    }
}

function checkEnemy(enemyHealth, enemydefense, enemyDamage) {
    message.channel.send("The Enemy has:" + enemyHealth + " /100 HP" + enemydefense + " Defense" + "And " + enemyDamage + " Attack");
}

function run(playerHealth, enemyDamage, playerGold) {
    var runawayChance = (rand() % 4);
    if (runawayChance == 1) {
        message.channel.send("You Ran away. Lost 25 gold.");
        playerGold = playerGold - 25;

    }
    else {
        message.channel.send("Failed");
        takeDamage(playerHealth, enemyDamage, defense);
    }
}

module.exports = {
    splash: splash
}