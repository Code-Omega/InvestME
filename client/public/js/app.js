// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices', 'directives']);

//var app = angular.module('app', ['720kb.datepicker']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/main.html',
    controller: 'FeedController',
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
    controller: 'RegisterController',
    resolve:{
        "check":function($window, $location){   
            if(window.localStorage.length > 0){ 
                if(window.localStorage.getItem("user") != undefined){
                    if(window.localStorage.getItem("user") != "undefined"){
                        $location.path('/setting');
                    }
                }
            }else{
                //not logged in yet
            }
        }
    }
  }).
  when('/search', {
    templateUrl: 'partials/search.html',
    controller: 'SearchController'
  }).
  when('/setting', {
    templateUrl: 'partials/setting.html',
    controller: 'RegisterController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
