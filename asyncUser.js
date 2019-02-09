var ls = require("./ls");

function getUserObject(author) {
    var asyncUser = author.id + "asyncUserObj";
    if (ls.exist(asyncUser)) {
        var userObj = ls.getObj(asyncUser);
    }
    else {
        var userObj = {
            awaitRoulette: false,
            currentRouletteBet: false
        }
        ls.setObj(asyncUser, userObj);
    }
    return userObj;
}

function setAwaitObject(author, value) {
    var asyncUser = author.id + "asyncUserObj";
    var newObj = ls.getObj(asyncUser);
    newObj.awaitRoulette = value;
    ls.setObj(asyncUser, newObj);
}
function setBetObject(author, value) {
    var asyncUser = author.id + "asyncUserObj";
    var newObj = ls.getObj(asyncUser);
    newObj.currentRouletteBet = value;
    ls.setObj(asyncUser, newObj);
}

module.exports = {
    getUserObj: getUserObject,
    setAwaitObj: setAwaitObject,
    setBetObj: setBetObject
}