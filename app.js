'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.version',
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'angularCSS',
    'UnpretentiousCalculator'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/main', {
            templateUrl: 'partials/main.html',
            css: 'partials/main.css'
        }).otherwise({redirectTo: '/main'});
}]);
