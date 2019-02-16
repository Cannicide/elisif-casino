//A basic one-player battleship game, adapted for casino
var ls = require('./ls');
const constants = require('./constants');

function createBoard() {
    var boardArr = [];
    for (var row in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        boardArr.push(["O", "O", "O", "O", "O", "O", "O", "O", "O", "O"]);
    }
    return boardArr;
}


function randRowShip() {
    var randRow = Math.floor(Math.random() * 11);
    return Number(randRow);
}

function randColShip() {
    var randCol = Math.floor(Math.random() * 11);
    return Number(randCol);
}

function getBoard(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return userObj.board;
}
function hasBoard(user) {
    var userObj = ls.exist(user.id + "battleshipGame");
    return userObj;
}
function setBoard(user, obj) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    userObj.board = obj;
    ls.setObj(user.id + "battleshipGame", userObj);
}
function setTurn(user, int) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    userObj["turn"] = int;
    ls.setObj(user.id + "battleshipGame", userObj);
}
function getTurn(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return userObj.turn; 
}
function displayBoard(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    var board = userObj.board;
    var strBoard = "```  1  2  3  4  5  6  7  8  9  10 (<- Columns)\n";
    var num = 0;
    for (var row in board) {
        var newRow1 = board[row].join(", ");
        num += 1;
        var prtNum = num;
        if (num < 10) {
            prtNum = "0" + num;
        }
        var newRow2 = "[ " + newRow1 + " ] " + prtNum + "\n";
        strBoard += newRow2;
    }
    strBoard += "                                (^ Rows)```";
    return strBoard;
}
function getBet(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return Number(userObj.bet);
}
function getRow(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return Number(userObj.shipRow);
}
function getCol(user) {
    var userObj = ls.getObj(user.id + "battleshipGame");
    return Number(userObj.shipCol);
}
function endGame(user) {
    var userLsId = user.id + "battleshipGame";
    ls.remove(userLsId);
}

function guessBoard(row, column, user) {
    var board = getBoard(user);
    var bet = getBet(user);
    var shipRow = getRow(user);
    var shipCol = getCol(user);
    var turn = getTurn(user);
    var userLS = user.id + "profile";
    if (turn == constants.battleshipTurnMax) {
        //Max turns reached, end game and lose bet
        var loss = Number(ls.get(userLS)) - bet;
        ls.set(userLS, loss);
        board[shipRow - 1][shipCol - 1] = "$";
        setBoard(user, board);
        var ret = `Sorry ${user.username}, you ran out of turns and lost $${bet.toLocaleString()}. Correct location:\n\n${displayBoard(user)}\n(Row: ${shipRow}, Column: ${shipCol})`;
        endGame(user);
        return ret;
    }
    turn += 1;
    setTurn(user, turn);
    if (row == shipRow && column == shipCol) {
        //Victory, win bet
        var gain = Number(ls.get(userLS)) + (bet * 20);
        ls.set(userLS, gain);
        endGame(user);
        var turnAdditive = "turn";
        var trueTurn = turn - 1;
        if (trueTurn != 1) {
            turnAdditive += "s";
        }
        return `Congratulations ${user.username}, you hit the battleship and gained **$${(bet * 20).toLocaleString()}** in ${trueTurn} ${turnAdditive}!`;
    }
    else if (row > 10 || column > 10 || row <= 0 || column <= 0) {
        //Value is outside the battleship board array's bounds
        return `||Turn: ${turn - 1}/${constants.battleshipTurnMax}|| Those coordinates aren't even in the ocean, ${user.username}! Keep row and column guesses between 1 and 10.`;
    }
    else if (board[row - 1][column - 1] == "X") {
        //This value was already guessed...
        return `||Turn: ${turn - 1}/${constants.battleshipTurnMax}|| Those coordinates have already been guessed. Try different ones! Current board:\n\n${displayBoard(user)}`;
    }
    else {
        //Incorrect guess
        board[row - 1][column - 1] = "X";
        setBoard(user, board);
        return `||Turn: ${turn - 1}/${constants.battleshipTurnMax}|| Missed the battleship. Keep trying! Current board:\n\n${displayBoard(user)}`;
    }
}

var board = {
    create: createBoard,
    guess: guessBoard,
    randRow: randRowShip,
    randCol: randColShip
}

function init(user, betAmount) {
    var newBoard = board.create();
    var newRow = board.randRow();
    var newCol = board.randCol();
    var userObj = {
        user: user.username,
        bet: betAmount,
        board: newBoard,
        shipRow: newRow,
        shipCol: newCol,
        turn: 1
    }
    var userLsId = user.id + "battleshipGame";
    ls.setObj(userLsId, userObj);
}



function startGame(args, ifprofile, prefix, message) {
    if (args) {
        var bet = Number(args[0]);
    }
    else {
        return "Please specify a bet.";
    }
    if (bet && bet > 0 && ifprofile && bet <= Number(ifprofile) && typeof bet === "number" && !hasBoard(message.author)) {
        //Create new battleship game
        init(message.author, bet);
        return `Started new battleship game with **$${bet.toLocaleString()}** at stake. Current Board:\n\n${displayBoard(message.author)}\n\nStart guessing the location of the battleship with \`/bsguess [row] [column]\`.`;
    }
    else if (!ifprofile) {
        return `Create a profile first with ${prefix}create`;
    }
    else if (hasBoard(message.author)) {
        return "You already have an active battleship game running. Use `/bsguess [row] [column]` to continue.\nExample: `/bsguess 1 7` will attempt to find a battleship at row 1, column 7.";
    }
    else {
        return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance. Use \`/bs [bet]\` to continue.\nExample: \`/bs 17\` will create a battleship game with $17 at stake.`; 
    }
}
function guessGame(args, message) {
    if (hasBoard(message.author)) {
        //Game exists, continue guessing
        var row = args[0];
        var col = args[1];
        if (row && col) {
            return guessBoard(row, col, message.author);
        }
        else {
            return `Please specify *both* a row and a column. Use \`/bsguess [row] [column]\` to continue.\nExample: \`/bsguess 1 7\` will attempt to find a battleship at row 1, column 7.`;
        }
    }
    else {
        //Game hasn't been made yet
        return `Start a game of battleship first with \`/bs [bet]\`.`;
    }
}

module.exports = {
    start: startGame,
    guess: guessGame
}

/*  Battleship game idea inspired by a 4x4 battleship idea suggested by Timothy Daniels,
    which I created exactly as he requested (with exception to making the board size larger).
*/