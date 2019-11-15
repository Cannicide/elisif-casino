var enemies = [{
        name : `Green Slime`,
        maxHealth : 30,
        baseHealth : 30,
        defense : 0,
        attacks : [{name : `slime slap`, description : `forms a hand and slaps you` , damage : 10}],
        experience: 50,
		level: 1
    }, {
        name : `Wolf`,
        baseHealth : 35,
        maxHealth : 35,
        defense : 0,
        attacks : [{name : `chomp`, description : `tries to eat you *furry noises*` , damage : 10}],
        experience: 50,
		level: 2
    }, {
        name : `Possesed Chair`,
        baseHealth : 50,
        maxHealth : 50,
        defense : 0,
        attacks : [{name : `sit`, description : `the chair sits on you` , damage : 20}],
        experience: 50,
		level: 3
    }];

function getEnemies() {
        return enemies;  
}

function checkEnemyAttacks(enemy) {
    var result = "";
    for (var x = 0; x < enemy.attacks.length; x++) {
        result += ("\t" + enemy.attacks[x].name + " and does " + enemy.attacks[x].damage.toString()+ " damage, ");
    }
    return result;
}

module.exports =  {
    getEnemies : getEnemies,
    checkEnemyAttacks: checkEnemyAttacks,
}