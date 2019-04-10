class Enemies {
    constructor(level) {
        this.level = level;
    }
    getEnemies(){
        var enemies = [];
        enemies.push([{
            name : `Green Slime`,
            baseHealth : 30,
            defense : 0,
            attacks : [{name : `slime slap`, description : `forms a hand and slaps you` , damage : 10}],
        }, {
            name : `Wolf`,
            baseHealth : 35,
            defense : 0,
            attacks : [{name : `chomp`, description : `tries to eat you *furry noises*` , damage : 10}],
        }]);

        return enemies;
    }
}

module.exports =  {
    Enemies : Enemies
}