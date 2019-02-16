//A basic one-player battleship game, adapted for casino
var ls = require('./ls');
var simp = require('./simplify');

var board = {
    create: createBoard,
    guess: guessBoard,
    randRow: randRowShip,
    randCol: randColShip
}

function createBoard() {
    var boardArr = [];
    for (row in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        boardArr.push(["O", "O", "O", "O", "O", "O", "O", "O", "O", "O"]);
    }
    return boardArr;
}

function guessBoard(row, column) {

}

function randRowShip() {

}

function randColShip() {

}

function init(user, betAmount) {
    var newBoard = board.create();
    var userObj = {
        user: user.username,
        bet: betAmount,
        board: newBoard
    }
    var userLsId = user.id + "battleshipGame";
    ls.setObj(userLsId, userObj);
}
function getBoard(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return userObj.board;
}
function getBet(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return userObj.bet;
}
function endGame(user) {
    var userLsId = user.id + "battleshipGame";
    ls.remove(userLsId);
}

function startGame(args, ifprofile, prefix, message) {

}