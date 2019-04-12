class Enemies {
    constructor(level) {
        this.level = level;
    }
    getEnemies(){
        var enemies = [];
        enemies.push([{
            name : `Green Slime`,
            maxHealth : 30,
            baseHealth : 30,
            defense : 0,
            attacks : [{name : `slime slap`, description : `forms a hand and slaps you` , damage : 10}],
        }, {
            name : `Wolf`,
            baseHealth : 35,
            maxHealth : 35,
            defense : 0,
            attacks : [{name : `chomp`, description : `tries to eat you *furry noises*` , damage : 10}],
        }]);

        return enemies;
    }
    checkEnemyAttacks(enemy) {
        var result;
        for (var x = 0; x < enemy.attacks.length; x++) {
            result += (enemy.attacks[x].name + " and does" + enemy.attacks[x].damage.toString()+ " damage, ");
        }
        return result;
    }
}

module.exports =  {
    Enemies : Enemies
}