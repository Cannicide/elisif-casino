//Algorithm to return random numbers
//Random Edition: evolvedRandAlgorithm-v1.5

function oldRand(min, max) {
    var numbers = [];
    for (var i = min; i < max; i++) {
        numbers.push(i);
    }
    var result;
    var rnd1, rnd2, rnd3;
    function internalRand(maxx, minn) {
        rnd1 = Math.floor(Math.random() * (Math.round(maxx / 3) + 1)) + minn;
        rnd2 = Math.floor(Math.random() * (Math.round(maxx / 3) + 1)) + minn;
        rnd3 = Math.floor(Math.random() * (Math.round(maxx / 3) + 1)) + minn;
        var res = (rnd1 + rnd2 + rnd3);
        return Math.round(res);
    }
    var isBad = true;
    var finalResult;
    while (isBad) {
        var result = internalRand(max, min);
        if (result > min && result < max) {
            isBad = false;
            finalResult = result;
            break;
        }
    }
    return finalResult;
}

function rand(min, max) {
    max = max + 1;
    if (min != 0) {
        max -= min;
    }
    var rnd = Math.round(Math.random() * max) + min;
    return rnd;
}

module.exports = {
    num: rand,
    oldRand: oldRand
}