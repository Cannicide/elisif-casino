var ls = require("./ls");

function getUserObject(author) {
    var asyncUser = author.id + "asyncUserObj";
    if (ls.exist(asyncUser)) {
        var userObj = ls.get(asyncUser);
    }
    else {
        var userObj = {
            awaitRoulette: false,
            currentRouletteBet: false
        }
        ls.set(asyncUser, userObj);
    }
    return userObj;
}

function setAwaitObject(author, value) {
    var asyncUser = author.id + "asyncUserObj";
    var newObj = ls.get(asyncUser);
    newObj.awaitRoulette = value;
    ls.set(asyncUser, newObj);
}
function setBetObject(author, value) {
    var asyncUser = author.id + "asyncUserObj";
    var newObj = ls.get(asyncUser);
    newObj.currentRouletteBet = value;
    ls.set(asyncUser, newObj);
}

module.exports = {
    getUserObj: getUserObject,
    setAwaitObj: setAwaitObject,
    setBetObj: setBetObject
}