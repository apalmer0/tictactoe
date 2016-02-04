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
  if (!myApp.user) {
    $('.login').show();
    $('.game').hide();
    $('.logged-out').show();
    $('.logged-in').hide();
  } else {
    $('.login').hide();
    $('.game').show();
    $('.logged-in').show();
    $('.logged-out').hide();
  }

  $('.newgame').hide();
  $('.message').hide();
  $('.message-signout').hide();
  $('.winner-message').hide();
  $('.tie-message').hide();
  $('.password').hide();
  $('.message-account-exists').hide();

  $('.modal-button').on('click', function () {
    $('.navbar-collapse').removeClass('in');
  });

  let createGame =  function(event) {
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
      console.log(data);
      console.log('game created');
      myApp.game = data.game;
      console.log(myApp.game);
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  };

  let endGame =  function(event) {
    console.log('endGame');
    event.preventDefault();
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
      console.log('end game done');
      myApp.game = data.game;
      console.log(myApp.game);
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
      console.log(data);
      myApp.user = data.user;
      $('.login').hide();
      $('.game').show();
      $('.modal').hide();
      $('.modal-backdrop').hide();
      $('.logged-in').show();
      $('.logged-out').hide();
      createGame(e);
      $(function () {
        $('.message').delay(50).fadeIn('normal', function () {
          $(this).delay(1500).fadeOut();
        });
      });
    }).fail(function (jqxhr) {
      console.error(jqxhr);
      $('.modal').hide();
      $('.modal-backdrop').hide();
      $(function () {
        $('.message-account-exists').delay(50).fadeIn('normal', function () {
          $(this).delay(1500).fadeOut();
        });
      });
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
      $('.login').hide();
      $('.game').show();
      $('.logged-in').show();
      $('.logged-out').hide();
      $('.modal').hide();
      $('.modal-backdrop').hide();
      createGame(e);
      $(function () {
        $('.message').delay(50).fadeIn('normal', function () {
          $(this).delay(1500).fadeOut();
        });
      });
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ signin actions ^^


  // vv create new game actions vv
  $('#get-games').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      url: myApp.baseUrl + '/games',
      headers: {
        Authorization: 'Token token=' + myApp.user.token,
      },
      type: 'GET',
      data: {},
    }).done(function (data) {
      for (let i = 0; i < data.games.length; i++) {
        $('.all-games').append("<tr><td>"+data.games[i].id+"</td><td>"+data.games[i].over+"</td><td>"+data.games[i].player_o+"</td><td>"+data.games[i].player_x.email+"</td></tr>");
      }
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ create new game actions ^^

  // vv update game actions vv
  // $('#test').on('submit', function (e) {
  //   e.preventDefault();
  //   $.ajax({
  //     url: myApp.baseUrl + '/games/' + myApp.game.id,
  //     headers: {
  //       Authorization: 'Token token=' + myApp.user.token,
  //     },
  //     type: 'PATCH',
  //     data: {
  //       'game': {
  //         'cell': {
  //           'index': 0,
  //           'value': 'X'
  //         },
  //         'over': false
  //       }
  //     }
  //   }).done(function (data) {
  //     console.log(data);
  //     myApp.game = data.game;
  //     console.log(myApp.game);
  //   }).fail(function (jqxhr) {
  //     console.error(jqxhr);
  //   });
  // });

  // ^^ update game actions ^^

  // vv change password actions vv
  $('#change-pw').on('submit', function (e) {
    e.preventDefault();
    if (!myApp.user) {
      console.error('Wrong!');
    }

    var formData = new FormData(e.target);
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
      console.log('success');
      $('.password-field').val('');
      $('.modal').hide();
      $('.modal-backdrop').hide();
      $(function () {
        $('.password').delay(50).fadeIn('normal', function () {
          $(this).delay(1500).fadeOut();
        });
      });
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ change password actions ^^

  // vv sign out actions vv
  $('#sign-out').on('submit', function (e) {
    e.preventDefault();
    if (!myApp.user) {
      console.error('Wrong!');
    }

    var formData = new FormData(e.target);
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
      $('.login').show();
      $('.game').hide();
      $('.logged-out').show();
      $('.logged-in').hide();
      $('.modal').hide();
      $('.modal-backdrop').hide();
      $(function () {
        $('.message-signout').delay(50).fadeIn('normal', function () {
          $(this).delay(1500).fadeOut();
        });
      });
    }).fail(function (jqxhr) {
      console.error(jqxhr);
    });
  });

  // ^^ sign out actions ^^

  var count = 0;
  var xWinCount = $('#xWins').val() || 0;
  var oWinCount = $('#oWins').val() || 0;
  var tieCount = $('#ties').val() || 0;
  var totalGames = 0;
  var xPercent = 0;
  var oPercent = 0;
  var tiePercent =  0;
  var winner = '';
  var board = $('.board').children();
  var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

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

  var tieBoard = function tieBoard() {
    tieCount++;
    updateProgressBars();
    for (let i = 0; i < board.length; i++) {
      $(board[i]).addClass('gray');
    }

    $(function () {
      $('.tie-message').delay(50).fadeIn('normal', function () {
        $(this).delay(1500).fadeOut();
      });
    });
  };

  var boardIsFull = function boardIsFull() {
    for (let i = 0; i < board.length; i++) {
      if ($(board[i]).text() === '') {
        return false;
      }
    }

    return true;
  };

  var announceWinner = function announceWinner() {
    $('.winner-message').delay(50).fadeIn('normal', function () {
      $(this).delay(1500).fadeOut();
    });
  };

  var gameOver = function gameOver(event) {
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

        announceWinner();
        if (winner === 'X') {
          xWinCount++;
        } else if (winner === 'O') {
          oWinCount++;
        }

        updateProgressBars();
        console.log('gameover - end game');
        endGame(event);

        return true;
      }

    }

    if (boardIsFull()) {
      tieBoard();
      return true;
    }
  };

  var clearBoard = function clearBoard() {
    for (let i = 0; i < board.length; i++) {
      $(board[i]).text('');
      $(board[i]).removeClass('blue');
      $(board[i]).removeClass('gray');
    }

    if (winner === 'X') {
      count = 1;
    } else {
      count = 0;
    }

    $('.newgame').hide();
  };

  $('.newgame').on('click', function (event) {
    clearBoard();
    createGame(event);
  });

  $('.square').on('click', function (e) {
    if (count % 2 === 0) {
      if ($(this).text() !== 'O') {
        $(this).text('X');
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
                value: 'X',
              },
              over: false,
            },
          },
        }).done(function (data) {
          myApp.game = data.game;
          console.log(myApp.game);
        }).fail(function (jqxhr) {
          console.error(jqxhr);
        });
        count++;
      }
    } else {
      if ($(this).text() !== 'X') {
        $(this).text('O');
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
                value: 'O',
              },
              over: false,
            },
          },
        }).done(function (data) {
          myApp.game = data.game;
          console.log(myApp.game);
        }).fail(function (jqxhr) {
          console.error(jqxhr);
        });
        count++;
      }
    }

    if (gameOver(e)) {
      $('#xWins').text(xWinCount);
      $('#oWins').text(oWinCount);
      $('#ties').text(tieCount);
      $('.newgame').show();
    }
  });
});
