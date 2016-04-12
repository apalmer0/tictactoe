'use strict';

var authentication = require('./authentication');
var pageChanges = require('./page-changes');
var gameVariables = require('./game-variables');
var gameStatus = require('./game-status');
var gameLogic = require('./game-logic');
var gameServer = require('./game-server');

// miscellaneous; causes the navbar to collapse
// when you click a button in an overlaying modal
$('.modal-button').on('click', function () {
  $('.navbar-collapse').removeClass('in');
});

// allows a click on the blank restart div to reset the board, change
// gameVariables.players, and start a new game
$('.restart').on('click', function (event) {
  gameStatus.resetBoard();
  gameLogic.loserGoesFirst();
  gameServer.createGame(event);
});

$('.sign-up').on('submit', function (event) {
  authentication.signUp(event);
});

$('.sign-in').on('submit', function (event) {
  authentication.signIn(event);
});

$('#change-pw').on('submit', function (event) {
  authentication.changePassword(event);
});

$('#sign-out').on('submit', function (event) {
  authentication.signOut(event);
});

$('.all-games').on('click', 'button', function (event) {
  gameLogic.getSingleGame(event);
});

$('#get-games').on('click', function (event) {
  gameServer.getAllGames(event);
});

$('.start-deathmatch-button').on('click', function () {
  $('.marker-type').text(gameVariables.marker);
  pageChanges.displayMessage('.deathmatch-started');
});

$('#start-multiplayer-game').on('click', function (event) {
  gameServer.startMultiplayerGame(event);
});

$('#join-game').on('submit', function (event) {
  gameServer.joinMultiplayerGame(event);
});

$('#end-multiplayer-game').on('click', function () {
  gameServer.endGame();
  $('.restart').show();
  $('#start-multiplayer-game').show();
  $('#end-multiplayer-game').hide();
  pageChanges.displayMessage('.player-quit');
});

module.exports = true;
