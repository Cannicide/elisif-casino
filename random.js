//Algorithm to return random numbers

function rand(min, max) {
    var numbers = [];
    for (var i = min; i < max; i++) {
        numbers.push(i);
    }
    var result;
    var rnd1, rnd2, rnd3;
    function internalRand(maxx, minn) {
        rnd1 = Math.floor(Math.random() * (maxx + 1)) + minn;
        rnd2 = Math.floor(Math.random() * (maxx + 1)) + minn;
        rnd3 = Math.floor(Math.random() * (maxx + 1)) + minn;
        var res = (rnd1 + rnd2 + rnd3) / 3;
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

module.exports = {
    num: rand
}