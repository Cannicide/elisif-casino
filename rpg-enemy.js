var enemies = [{
        name : 'Green Slime',
        maxHealth : 20,
        baseHealth : 20,
        defense : 0,
        attacks : [{show: false, name: "wait", description: "idly waits", damage: 0, effect: null},
				   {show: true, name : 'slime slap', description : 'forms a hand and slaps you' , damage : 10, effect: null}],
        experience: 45,
		level: 1
    }, {
        name : 'Wolf',
        baseHealth : 25,
        maxHealth : 25,
        defense : 0,
        attacks : [{show: false, name: "wait", description: "idly waits", damage: 0, effect: null},
				   {show: true, name : 'chomp', description : 'tries to eat you *furry noises*' , damage : 10, effect: null}],
        experience: 50,
		level: 1
    }, {
        name : 'Gi-ant',
        baseHealth : 15,
        maxHealth : 15,
        defense : 0,
        attacks : [{show: false, name: "wait", description: "idly waits", damage: 0, effect: null},
				   {show: true, name : 'bite', description : 'tries to eat you *ant noises*' , damage : 15, effect: null}],
        experience: 40,
		level: 1
    }, {
        name : 'Possessed Chair',
        baseHealth : 30,
        maxHealth : 30,
        defense : 1,
        attacks : [{show: false, name: "wait", description: "idly waits", damage: 0, effect: null},
				   {show: true, name : 'sit', description : 'the chair sits on you' , damage : 15, effect: null}],
        experience: 60,
		level: 2
    }, {
        name : 'Animated Wood',
        baseHealth : 35,
        maxHealth : 35,
        defense : 2,
        attacks : [{show: false, name: "wait", description: "idly waits", damage: 0, effect: null},
				   {show: true, name : 'Bash and Stab', description : 'bashes with a plankthen stabs' , damage : 20, effect: null}],
        experience: 65,
		level: 2
    }, {
        name : 'Axe-er',
        baseHealth : 45,
        maxHealth : 45,
        defense : 1,
        attacks : [{show: false, name: "wait", description: "idly waits", damage: 0, effect: null},
				   {show: true, name : 'Chopper', description : 'Axe moves toward you' , damage : 35, effect: null}],
        experience: 70,
		level: 3
    }];

function getEnemies() {
        return enemies;  
}

function checkEnemyAttacks(enemy) {
    var result = "";
    for (var x = 0; x < enemy.attacks.length; x++) {
		if (enemy.attacks[x].show) {
        	result += "__**Move " + (x + 1) + ": **__/n" + enemy.attacks[x].name
			if (enemy.attacks[x].damage != 0) {
				 result += "/nDoes " + enemy.attacks[x].damage.toString()+ " damage, ";
			}
			result += "\nDescription: " + enemy.attacks[x].description;
			result += "\n\n\n"
		}
    }
    return result;
}

module.exports =  {
    getEnemies : getEnemies,
    checkEnemyAttacks: checkEnemyAttacks,
}