'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');
var globalVariables = require('./global-variables');
var pageChanges = require('./page-changes');
var pageSetup = require('./page-setup');
var gameLogic = require('./game-logic');
var gameServer = require('./game-server');
var gameVariables = require('./game-variables');
var gameStatus = require('./game-status');

// use require without a reference to ensure a file is bundled
require('./example');
require('./event-handlers');

// load sass manifest
require('../styles/index.scss');

$(document).ready(() => {
  // initial page setup

  // hides all page elements that need to appear at specific points.
  pageSetup.hidePageElements();

  // make sure the appropriate page elements are displayed
  // based on whether or not you're logged in
  if (!globalVariables.user) {
    pageChanges.toggleLoggedOut();
  } else {
    pageChanges.toggleLoggedIn();
  }

  // sends the updated square back to the server via the api, then updates
  // the game board with a copy of the updated data
  let updateSquare = function updateSquare(e) {
    e.preventDefault();
    console.log('myApp cells before patch'+globalVariables.game.cells);
    $.ajax({
      url: globalVariables.baseUrl + '/games/' + globalVariables.game.id,
      headers: {
        Authorization: 'Token token=' + globalVariables.user.token,
      },
      type: 'PATCH',
      data: {
        game: {
          cell: {
            index: event.target.id,
            value: $(event.target).text(),
          },
          over: globalVariables.game.over,
        },
      },
    }).done(function (data) {
      globalVariables.game = data.game;
      console.log(globalVariables.game.id);
      console.log('myApp cells after patch'+globalVariables.game.cells);
      gameServer.getUpdatedBoard();
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };

  // square click logic - the first half acgameVariables.counts for single player games, the
  // latter half for multiplayer games.
  $('.square').on('click', function (e) {
    console.log(gameVariables);
    if (gameVariables.players === 1) {
      if (gameVariables.count % 2 === 0) {
        if ($(this).text() === '') {
          $(this).text('X');
          updateSquare(e);
          gameVariables.count++;
        }
      } else {
        if ($(this).text() === '') {
          $(this).text('O');
          updateSquare(e);
          gameVariables.count++;
        }
      }
    } else if (gameVariables.players === 2) {
      if (gameVariables.marker === 'X' && gameStatus.piecesPlayed() % 2 === 0) {
        if ($(this).text() === '') {
          $(this).text(gameVariables.marker);
          updateSquare(e);
        }
      } else if (gameVariables.marker === 'O' && gameStatus.piecesPlayed() % 2 === 1){
        if ($(this).text() === '') {
          $(this).text(gameVariables.marker);
          updateSquare(e);
        }
      } else {
        pageChanges.displayMessage('.yo-wait');
        console.log('over? ' + globalVariables.game.over);
      }
    }

    if (gameLogic.findAndAnnounceWinner(e)) {
      gameStatus.updateProgressBars();
      gameStatus.updateScoreboard();
      $('.restart').show();
    }
  });
});
