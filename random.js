//Algorithm to return random numbers
//Random Edition: evolvedRandAlgorithm-v1.5

function rand(min, max) {
    max = max + 1;
    max -= min;
    var rnd = Math.floor(Math.random() * max) + min;
    return rnd;
}

module.exports = {
    num: rand
}