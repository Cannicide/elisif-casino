//Algorithm to return random numbers
//Random Edition: authenticRandAlgorithm-v1.5

function rand(min, max) {
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

function character(array){
    let index=realRand(array.length + -1,0);
    return array[index];
}
function limarandAlgorithm(array){
    let chrctr=character(array)
    let denominator=array.length/2
    return Math.ceil((array.indexOf(chrctr) + denominator)/2);
}

function realRand(min, max) {
    var rnd1 = Math.floor(Math.random() * max) + min;
    return rnd1;
}

module.exports = {
    num: rand,
    char:character,
    limaRand:limarandAlgorithm,
    int: realRand
}