'use strict';

/**
 * Main module of the application.
 */
angular
    .module('rksv-assignment', [
        'ui.router',
        'ui.bootstrap',
        'nvd3',
        'btford.socket-io'
    ])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'mainCtrl'
            });
    });