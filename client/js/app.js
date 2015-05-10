// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices', 'directives']);

//var app = angular.module('app', ['720kb.datepicker']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/main.html',
    controller: 'FeedController'
  }).
  when('/portfolio', {
    templateUrl: 'partials/portfolio.html',
    controller: 'DataController'
  }).
  when('/chart', {
    templateUrl: 'partials/chart.html',
    controller: 'ChartController'
  }).
  when('/register', {
    templateUrl: 'partials/login.html',
    controller: 'RegisterController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
