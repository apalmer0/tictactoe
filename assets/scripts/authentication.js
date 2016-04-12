'use strict';

var gameVariables = require('./game-variables');
var globalVariables = require('./global-variables');
var pageChanges = require('./page-changes');
var gameServer = require('./game-server');

// vv signin actions vv
let signIn = function signIn(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/sign-in',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log(gameVariables);
    globalVariables.user = data.user;
    console.log(data.user.token);
    pageChanges.toggleLoggedIn();
    pageChanges.hideModal();
    gameServer.createGame(event);
    pageChanges.displayMessage('.welcome');
  }).fail(function (jqxhr) {
    $('.wrong-password').show();
    console.error(jqxhr);
  });
};

// vv signup actions vv
let signUp = function signUp(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  console.log('starting signup');
  $.ajax({
    url: globalVariables.baseUrl + '/sign-up',
    method: 'POST',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function () {
    console.log('signup success');
    console.log('starting signin');
    signIn(event);
  }).fail(function (jqxhr) {
    console.error(jqxhr);
    pageChanges.hideModal();
    pageChanges.displayMessage('.message-account-exists');
  });
};

// vv change password actions vv
let changePassword = function changePassword(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/change-password/' + globalVariables.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'PATCH',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log(data);
    $('.password-field').val('');
    pageChanges.hideModal();
    pageChanges.displayMessage('.password');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// vv sign out actions vv
let signOut = function signOut(event) {
  event.preventDefault();
  if (!globalVariables.user) {
    console.error('Wrong!');
  }

  var formData = new FormData(event.target);
  $.ajax({
    url: globalVariables.baseUrl + '/sign-out/' + globalVariables.user.id,
    headers: {
      Authorization: 'Token token=' + globalVariables.user.token,
    },
    method: 'DELETE',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function (data) {
    console.log(data);
    pageChanges.toggleLoggedOut();
    pageChanges.hideModal();
    pageChanges.displayMessage('.message-signout');
  }).fail(function (jqxhr) {
    console.error(jqxhr);
  });
};

// ^^ sign out actions ^^

module.exports = {
  signIn,
  signUp,
  changePassword,
  signOut
};
