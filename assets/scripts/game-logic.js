'use strict';

let globalVariables = require('./global-variables');
var gameVariables = require('./game-variables');
var gameServer = require('./game-server');
var gameStatus = require('./game-status');
var pageChanges = require('./page-changes');

var boardIsFull = function boardIsFull() {
  for (let i = 0; i < gameVariables.board.length; i++) {
    if ($(gameVariables.board[i]).text() === '') {
      return false;
    }
  }

  return true;
};

var announceTie = function announceTie() {
  clearInterval(gameStatus.timer);
  gameVariables.tieCount++;
  for (let i = 0; i < gameVariables.board.length; i++) {
    $(gameVariables.board[i]).addClass('gray');
  }
  $('#end-multiplayer-game').hide();
  $('#start-multiplayer-game').show();
  gameVariables.players = 1;

  pageChanges.displayMessage('.tie-message');
};

let findAndAnnounceWinner = function findAndAnnounceWinner(event) {
  console.log('find and announce winner');
  for (let i = 0; i < gameVariables.winningCombos.length; i++) {
    var a, b, c;

    a = gameVariables.board[gameVariables.winningCombos[i][0]];
    b = gameVariables.board[gameVariables.winningCombos[i][1]];
    c = gameVariables.board[gameVariables.winningCombos[i][2]];

    if ($(a).text() !== '' && $(a).text() === $(b).text() && $(a).text() === $(c).text()) {
      $(a).addClass('blue');
      $(b).addClass('blue');
      $(c).addClass('blue');
      gameVariables.winner = $(a).text();
      $('#winner').text(gameVariables.winner);

      pageChanges.displayMessage('.winner-message');
      if (gameVariables.winner === 'X') {
        gameVariables.xWinCount++;
      } else if (gameVariables.winner === 'O') {
        gameVariables.oWinCount++;
      }

      gameServer.endGame(event);

      return true;
    }

  }

  if (boardIsFull()) {
    announceTie();
    return true;
  }
};

// vvv get single game action vvv
let getSingleGame = function getSingleGame(event) {
  event.preventDefault();
  $.ajax({
    url: globalVariables.baseUrl + '/games/' + event.target.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    type: 'GET',
    data: {},
  }).done(function (data) {
    for (let i = 0; i < data.game.cells.length; i++) {
      gameVariables.archivedBoard[i] = data.game.cells[i];
    }

    gameStatus.loadOldBoard();
    findAndAnnounceWinner();
    $('.restart').show();
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// ensures the loser of the previous game goes first in the next game
let loserGoesFirst = function loserGoesFirst() {
  if (gameVariables.winner === 'X') {
    gameVariables.count = 1;
  } else {
    gameVariables.count = 0;
  }
};

module.exports = {
  findAndAnnounceWinner,
  getSingleGame,
  loserGoesFirst
};
