'use strict';


module.exports = {
  playerO: '',
  playerX: '',
  xWinCount: $('#xWins').val() || 0,
  oWinCount: $('#oWins').val() || 0,
  tieCount: $('#ties').val() || 0,
  players: 1,
  totalGames: 0,
  xPercent: 0,
  oPercent: 0,
  tiePercent : 0,
  winner: '',
  count: 0,
  timerSeconds: 0,
  board: $('.board').children(),
  winningCombos: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
  marker: 'X',
  archivedBoard: [],
};
