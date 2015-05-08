// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices', 'directives']);

//var app = angular.module('app', ['720kb.datepicker']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/main.html',
    controller: 'MainController'
  }).
  when('/portfolio', {
    templateUrl: 'partials/portfolio.html',
    controller: 'PortfolioController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
