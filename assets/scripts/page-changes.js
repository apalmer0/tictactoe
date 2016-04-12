'use strict';

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

var hideModal = function hideModal() {
  $('.modal').hide();
  $('.modal').removeClass('in');
  $('.modal').attr('style','display: none;');
  $('.modal-backdrop').hide();
};

var displayMessage = function displayMessage(type) {
  $(function () {
    $(type).delay(50).fadeIn('normal', function () {
      $(this).delay(2000).fadeOut();
    });
  });
};

module.exports = {
  toggleLoggedIn,
  toggleLoggedOut,
  hideModal,
  displayMessage
};
