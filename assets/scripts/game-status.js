'use strict';

var globalVariables = require('./global-variables');
var gameVariables = require('./game-variables');
var gameServer = require('./game-server');
var gameLogic = require('./game-logic');
var pageChanges = require('./page-changes');



let updateScoreboard = function updateScoreboard() {
  $('#xWins').text(gameVariables.xWinCount);
  $('#oWins').text(gameVariables.oWinCount);
  $('#ties').text(gameVariables.tieCount);
};

let updateProgressBars = function updateProgressBars() {
  gameVariables.totalGames = (gameVariables.xWinCount + gameVariables.oWinCount + gameVariables.tieCount);
  gameVariables.xPercent = Math.floor((gameVariables.xWinCount / gameVariables.totalGames) * 100);
  gameVariables.oPercent = Math.floor((gameVariables.oWinCount / gameVariables.totalGames) * 100);
  gameVariables.tiePercent = Math.floor((gameVariables.tieCount / gameVariables.totalGames) * 100);
  $('.xProgressBar').attr('style', function () {
    return 'width: ' + gameVariables.xPercent + '%';
  });
  $('.tieProgressBar').attr('style', function () {
    return 'width: ' + gameVariables.tiePercent + '%';
  });
  $('.oProgressBar').attr('style', function () {
    return 'width: ' + gameVariables.oPercent + '%';
  });
};

// during a multiplayer game, this code gets run every 1000ms. it updates the
// board (sends state to the server, and reprints the board based on what it
// gets back). if the game is over, it determines whether the game was won or
// if someone resigned.
var reprint = function reprint(e) {
  // if the game has started and is not over
  if (globalVariables.game) {
    if (!globalVariables.game.over) {
      gameServer.getUpdatedBoard();
      gameVariables.timerSeconds++;
      console.log(gameVariables.timerSeconds);
      console.log('game '+globalVariables.game.id+' is over - true or false? '+globalVariables.game.over);
    } else {
      if (gameLogic.findAndAnnounceWinner(e)) {
        updateProgressBars();
        updateScoreboard();
        $('.restart').show();
      } else {
        pageChanges.displayMessage('.opp-quit');
        $('#end-multiplayer-game').hide();
        $('#start-multiplayer-game').show();
        $('.restart').show();
        gameServer.endGame(e);
      }
    }
  }
};


// takes the given board and removes all added text and classes,
// and hides the "restart" div
var resetBoard = function resetBoard() {
  for (let i = 0; i < gameVariables.board.length; i++) {
    $(gameVariables.board[i]).text('');
    $(gameVariables.board[i]).removeClass('blue');
    $(gameVariables.board[i]).removeClass('gray');
  }

  $('.restart').hide();
};

var loadOldBoard = function loadOldBoard() {
  for (let i = 0; i < gameVariables.board.length; i++) {
    $(gameVariables.board[i]).text(gameVariables.archivedBoard[i]);
  }
};

module.exports = {
  updateScoreboard,
  updateProgressBars,
  reprint,
  timer: gameVariables.players === 2 ? setInterval(reprint,500) : 0,
  resetBoard,
  loadOldBoard
};
