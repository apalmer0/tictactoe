'use strict';

var hidePageElements = function hidePageElements() {
  $('.restart').hide();
  $('.welcome').hide();
  $('.message-signout').hide();
  $('.winner-message').hide();
  $('.tie-message').hide();
  $('.password').hide();
  $('.wrong-password').hide();
  $('.message-account-exists').hide();
  $('.deathmatch-started').hide();
  $('.yo-wait').hide();
  $('.player-quit').hide();
  $('#end-multiplayer-game').hide();
  $('.opp-quit').hide();
};

module.exports = {
  hidePageElements
};
