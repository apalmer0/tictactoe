'use strict';

let globalVariables = require('./global-variables');
let pageChanges = require('./page-changes');
let gameVariables = require('./game-variables');
let gameStatus = require('./game-status');
// let gameLogic = require('./game-logic');

let createGame =  function (event) {
  event.preventDefault();
  console.log(gameVariables);
  let formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/games',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    globalVariables.game = data.game;
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

let endGame =  function () {
  console.log('ending game id: '+ globalVariables.game.id);
  console.log('game ' + globalVariables.game.id + ' is over - true or false? ' + globalVariables.game.over);
  $.ajax({
    url: globalVariables.baseUrl + '/games/' + globalVariables.game.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    type: 'PATCH',
    data: {
      game: {
        over: 'true',
      },
    },
  }).done(function (data) {
    globalVariables.game = data.game;
    console.log(data);
    console.log('game is over - true or false? '+globalVariables.game.over);
    console.log('game ended');
    clearInterval(gameStatus.timer);
    $('#end-multiplayer-game').hide();
    $('#start-multiplayer-game').show();
    gameVariables.players = 1;

  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

let getUpdatedBoard = function getUpdatedBoard() {
  console.log(gameVariables);
  $.ajax({
    url: globalVariables.baseUrl + '/games/' + globalVariables.game.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    type: 'GET',
    data: {},
  }).done(function (data) {
    console.log(data);
    globalVariables.game = data.game;
    for (let i = 0; i < gameVariables.board.length; i++){
      $(gameVariables.board[i]).text(globalVariables.game.cells[i]);
    }
    console.log('board updated FROM server');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// vv get all games actions vv
let getAllGames = function getAllGames (event) {
  event.preventDefault();
  $.ajax({
    url: globalVariables.baseUrl + '/games?over=true',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    type: 'GET',
    data: {},
  }).done(function (data) {
    for (let i = 0; i < data.games.length; i++) {
      if (data.games[i].player_o) {
        gameVariables.playerO = data.games[i].player_o.email;
      } else {
        gameVariables.playerO = 'n/a';
      }
      if (data.games[i].player_x) {
        gameVariables.playerX = data.games[i].player_x.email;
      } else {
        gameVariables.playerX = 'n/a';
      }

      $('.all-games').append('<tr><td>' + data.games[i].id + '</td><td>' + gameVariables.playerX + '</td><td>' + gameVariables.playerO + '</td><td>' + data.games[i].cells + '<td><button data-dismiss="modal" id=' + data.games[i].id + '>View</button></td></tr>');
    }
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// vvvvvvv start multiplayer game actions vvvvvvv
let startMultiplayerGame = function startMultiplayerGame(event) {
  event.preventDefault();
  $.ajax({
    url: globalVariables.baseUrl + '/games',
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'POST',
  }).done(function (data) {
    globalVariables.game = data.game;
    gameStatus.resetBoard();
    gameStatus.timer = setInterval(gameStatus.reprint,1000);
    gameVariables.players = 2;
    gameVariables.marker = 'X';
    $('#multiplayerGameID').text(data.game.id);
    $('.game-number').text(globalVariables.game.id);
    $('#start-multiplayer-game').hide();
    $('#end-multiplayer-game').show();
    console.log(globalVariables.game);
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// vvvvvvv join game actions vvvvvvv
let joinMultiplayerGame = function joinMultiplayerGame(event) {
  event.preventDefault();
  $.ajax({
    url: globalVariables.baseUrl + '/games/' + $('#inputGameID').val(),
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    type: 'PATCH',
    data: {},
  }).done(function (data) {
    globalVariables.game = data.game;
    gameVariables.marker = 'O';
    gameVariables.players = 2;
    gameStatus.resetBoard();
    gameStatus.timer = setInterval(gameStatus.reprint,1000);
    pageChanges.hideModal();
    $('.marker-type').text(gameVariables.marker);
    $('.game-number').text(globalVariables.game.id);
    pageChanges.displayMessage('.deathmatch-started');
    $('#start-multiplayer-game').hide();
    $('#end-multiplayer-game').show();
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

module.exports = {
  createGame,
  endGame,
  getUpdatedBoard,
  // getSingleGame,
  getAllGames,
  startMultiplayerGame,
  joinMultiplayerGame,
};
