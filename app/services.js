'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('rksv-assignment');

app.factory('socket', function(socketFactory) {
    return socketFactory();
})