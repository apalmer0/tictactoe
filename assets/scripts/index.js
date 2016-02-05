'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

// load sass manifest
require('../styles/index.scss');

const myApp = {
  baseUrl: 'http://tic-tac-toe.wdibos.com',
};

$(document).ready(() => {
  // initial page setup

  var count = 0;
  var marker = 'X';
  var players = 1;
  var playerO;
  var playerX;
  var xWinCount = $('#xWins').val() || 0;
  var oWinCount = $('#oWins').val() || 0;
  var tieCount = $('#ties').val() || 0;
  var totalGames = 0;
  var xPercent = 0;
  var oPercent = 0;
  var tiePercent =  0;
  var winner = '';
  var board = $('.board').children();
  var archivedBoard = [];
  var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var toggleLoggedIn = function toggleLoggedIn() {
    $('.login').hide();
    $('.game').show();
    $('.logged-in').show();
    $('.logged-out').hide();
  };

  var toggleLoggedOut = function toggleLoggedOut() {
    $('.login').show();
    $('.game').hide();
    $('.logged-out').show();
    $('.logged-in').hide();
  };

  var hidePageElements = function hidePageElements() {
    $('.restart').hide();
    $('.message').hide();
    $('.message-signout').hide();
    $('.winner-message').hide();
    $('.tie-message').hide();
    $('.password').hide();
    $('.wrong-password').hide();
    $('.message-account-exists').hide();
    $('.deathmatch-started').hide();
    $('.yo-wait').hide();
  };

  var hideModal = function hideModal() {
    $('.modal').hide();
    $('.modal').removeClass('in');
    $('.modal').attr('style','display: none;');
    $('.modal-backdrop').hide();
  };

  var displayMessage = function displayMessage(type) {
    $(function () {
      $(type).delay(50).fadeIn('normal', function () {
        $(this).delay(1500).fadeOut();
      });
    });
  };

  // make sure the appropriate page elements are displayed
  // whether or not you're logged in
  hidePageElements();

  if (!myApp.user) {
    toggleLoggedOut();
  } else {
    toggleLoggedIn();
  }

  // miscellaneous; causes the navbar to collapse
  // when you click a button in an overlaying modal
  $('.modal-button').on('click', function () {
    $('.navbar-collapse').removeClass('in');
  });

  $('.donezo-button').on('click', function () {
    $('.marker-type').text(marker);
    displayMessage('.deathmatch-started');
  });

  var piecesPlayed = function piecesPlayed() {
    count = 0;
    for (let i = 0; i < board.length; i++) {
      if ($(board[i]).text() !== '') {
        count++;
      }
    }

    return count;
  };


  let createGame =  function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/games',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      myApp.game = data.game;
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };

  let endGame =  function () {//(event) {
    console.log('endGame');
    clearInterval(timer);
    //event.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/games/' + myApp.game.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'PATCH',
      data: {
        game: {
          over: true,
        },
      },
    }).done(function (data) {
      console.log(data);

      //myApp.game = data.game;
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };

  // vv signup actions vv
  $('.sign-up').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    $.ajax({
      url: myApp.baseUrl + '/sign-up',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      myApp.user = data.user;
      toggleLoggedIn();
      hideModal();
      createGame(e);
      displayMessage('.message');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
      hideModal();
      displayMessage('.message-account-exists');
    });
  });

  // ^^ signup actions ^^

  // vv signin actions vv
  $('.sign-in').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    $.ajax({
      url: myApp.baseUrl + '/sign-in',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      myApp.user = data.user;
      console.log(data);
      toggleLoggedIn();
      hideModal();
      createGame(e);
      displayMessage('.message');
    }).fail(function (jqxhr) {
      $('.wrong-password').show();
      console.error(jqxhr);
    });
  });

  // ^^ signin actions ^^

  // vv get all games actions vv
  $('#get-games').on('click', function (e) {
    e.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/games?over=true',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'GET',
      data: {},
    }).done(function (data) {
      for (let i = 0; i < data.games.length; i++) {
        if (data.games[i].player_o) {
          playerO = data.games[i].player_o.email;
        } else {
          playerO = 'n/a';
        }
        if (data.games[i].player_x) {
          playerX = data.games[i].player_x.email;
        } else {
          playerX = 'n/a';
        }

        $('.all-games').append('<tr><td>' + data.games[i].id + '</td><td>' + playerX + '</td><td>' + playerO + '</td><td>' + data.games[i].cells + '<td><button data-dismiss="modal" id=' + data.games[i].id + '>View</button></td></tr>');
      }
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^^ get all games actions ^^^

  // vv change password actions vv
  $('#change-pw').on('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/change-password/' + myApp.user.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'PATCH',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      $('.password-field').val('');
      hideModal();
      displayMessage('.password');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ change password actions ^^

  // vv sign out actions vv
  $('#sign-out').on('submit', function (event) {
    event.preventDefault();
    if (!myApp.user) {
      console.error('Wrong!');
    }

    var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/sign-out/' + myApp.user.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'DELETE',
      contentType: false,
      processData: false,
      data: formData,
    }).done(function (data) {
      console.log(data);
      toggleLoggedOut();
      hideModal();
      displayMessage('.message-signout');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ sign out actions ^^

    // takes the given board and removes all added text and classes,
    // and hides the "restart" div
    var resetBoard = function resetBoard() {
      for (let i = 0; i < board.length; i++) {
        $(board[i]).text('');
        $(board[i]).removeClass('blue');
        $(board[i]).removeClass('gray');
      }

      $('.restart').hide();
    };

  var timer = setInterval(reprint,1000);

  // vvvvvvv start multiplayer game actions vvvvvvv
  $('#start-multiplayer-game').on('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/games',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      method: 'POST',
    }).done(function (data) {
      resetBoard();
      timer = setInterval(reprint,1000);
      players = 2;
      $('#multiplayerGameID').text(data.game.id);
      myApp.game = data.game;
      console.log(myApp.game);
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^^^^^ start multiplayer game actions ^^^^^

  // vvvvvvv join game actions vvvvvvv
  $('#join-game').on('submit', function (event) {
    event.preventDefault();

    //var formData = new FormData(event.target);
    $.ajax({
      url: myApp.baseUrl + '/games/' + $('#inputGameID').val(),
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'PATCH',
      data: {},
    }).done(function (data) {
      myApp.game = data.game;
      console.log('just joined deathmatch '+myApp.game.id);
      marker = 'O';
      players = 2;
      resetBoard();
      timer = setInterval(reprint,1000);
      hideModal();
      $('.marker-type').text(marker);
      displayMessage('.deathmatch-started');
    }).fail(function (jqxhr) {
      console.error(jqxhr);
      console.log('you fucked up');
    });
  });

  // ^^^^^^ join game actions ^^^^^

  var updateProgressBars = function updateProgressBars() {
    totalGames = (xWinCount + oWinCount + tieCount);
    xPercent = Math.floor((xWinCount / totalGames) * 100);
    oPercent = Math.floor((oWinCount / totalGames) * 100);
    tiePercent = Math.floor((tieCount / totalGames) * 100);
    $('.xProgressBar').attr('style', function () {
      return 'width: ' + xPercent + '%';
    });
    $('.tieProgressBar').attr('style', function () {
      return 'width: ' + tiePercent + '%';
    });
    $('.oProgressBar').attr('style', function () {
      return 'width: ' + oPercent + '%';
    });
  };

  var announceTie = function announceTie() {
    tieCount++;
    for (let i = 0; i < board.length; i++) {
      $(board[i]).addClass('gray');
    }

    displayMessage('.tie-message');
  };

  var boardIsFull = function boardIsFull() {
    for (let i = 0; i < board.length; i++) {
      if ($(board[i]).text() === '') {
        return false;
      }
    }

    return true;
  };

  var loadOldBoard = function loadOldBoard() {
    for (let i = 0; i < board.length; i++) {
      $(board[i]).text(archivedBoard[i]);
    }
  };

  var findAndAnnounceWinner = function findAndAnnounceWinner(event) {
    for (let i = 0; i < winningCombos.length; i++) {
      var a, b, c;

      a = board[winningCombos[i][0]];
      b = board[winningCombos[i][1]];
      c = board[winningCombos[i][2]];

      if ($(a).text() !== '' && $(a).text() === $(b).text() && $(a).text() === $(c).text()) {
        $(a).addClass('blue');
        $(b).addClass('blue');
        $(c).addClass('blue');
        winner = $(a).text();
        $('#winner').text(winner);

        displayMessage('.winner-message');
        if (winner === 'X') {
          xWinCount++;
        } else if (winner === 'O') {
          oWinCount++;
        }

        endGame(event);

        return true;
      }

    }

    if (boardIsFull()) {
      announceTie();
      return true;
    }
  };

  // vvv get single game action vvv
  $('.all-games').on('click', 'button', function (event) {
    event.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/games/' + event.target.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'GET',
      data: {},
    }).done(function (data) {
      for (let i = 0; i < data.game.cells.length; i++) {
        archivedBoard[i] = data.game.cells[i];
      }

      loadOldBoard();
      findAndAnnounceWinner(event);
      $('.restart').show();
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ get single game actions ^^

  // ensures the loser of the previous game goes first in the next game
  var loserGoesFirst = function loserGoesFirst() {
    if (winner === 'X') {
      count = 1;
    } else {
      count = 0;
    }
  };

  // allows a click on the blank restart div to reset the board, change
  // players, and start a new game
  $('.restart').on('click', function (event) {
    resetBoard();
    loserGoesFirst();
    createGame(event);
  });

  // sends the updated square back to the server via the api, then updates
  // the game board with a copy of the updated data
  let updateSquare = function updateSquare(e) {
    e.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/games/' + myApp.game.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'PATCH',
      data: {
        game: {
          cell: {
            index: event.target.id,
            value: $(event.target).text(),
          },
          over: false,
        },
      },
    }).done(function (data) {
      myApp.game = data.game;
      for (let i = 0; i < board.length; i++){
        $(board[i]).text(myApp.game.cells[i]);
      }
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };


  var newArray = [];
  var currentBoardState = function currentBoardState() {
    for (let i = 0; i < board.length; i++){
      newArray[i] = $(board[i]).text();
    }
    return newArray;
  };

  let updateCurrentBoard = function updateCurrentBoard() {
    $.ajax({
      url: myApp.baseUrl + '/games/' + myApp.game.id,
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'PATCH',
      data: {
        game: {
          cells: currentBoardState(),
          over: false,
        },
      },
    }).done(function (data) {
      myApp.game = data.game;
      for (let i = 0; i < board.length; i++){
        $(board[i]).text(myApp.game.cells[i]);
      }
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };

  var i = 0;
  var reprint = function reprint(e) {
    if (myApp.game) {
      updateCurrentBoard();
      i++;
      console.log(i);
      if (findAndAnnounceWinner(e)) {
        updateProgressBars();
        $('#xWins').text(xWinCount);
        $('#oWins').text(oWinCount);
        $('#ties').text(tieCount);
        $('.restart').show();
      }
    }
  };

  $('.square').on('click', function (e) {
    if (players === 1) {
      if (count % 2 === 0) {
        if ($(this).text() === '') {
          $(this).text('X');
          updateSquare(e);
          count++;
        }
      } else {
        if ($(this).text() === '') {
          $(this).text('O');
          updateSquare(e);
          count++;
        }
      }
    } else if (players === 2) {
      if (marker === 'X' && piecesPlayed() % 2 === 0) {
        if ($(this).text() === '') {
          $(this).text(marker);
          updateSquare(e);
        }
      } else if (marker === 'O' && piecesPlayed() % 2 === 1){
        if ($(this).text() === '') {
          $(this).text(marker);
          updateSquare(e);
        }
      } else {
        displayMessage('.yo-wait');
      }
    }

    if (findAndAnnounceWinner(e)) {
      updateProgressBars();
      $('#xWins').text(xWinCount);
      $('#oWins').text(oWinCount);
      $('#ties').text(tieCount);
      $('.restart').show();
    }
  });
});
