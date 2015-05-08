// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices', 'directives']);

//var app = angular.module('app', ['720kb.datepicker']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/main.html',
    controller: 'MainController'
  }).
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'UserListController'
  }).
  when('/userdetail', {
    templateUrl: 'partials/userdetail.html',
    controller: 'UserDetailController'
  }).
  when('/useredit', {
    templateUrl: 'partials/useredit.html',
    controller: 'UserListController'
  }).
  when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'TaskListController'
  }).
  when('/taskdetail', {
    templateUrl: 'partials/taskdetail.html',
    controller: 'TaskDetailController'
  }).
  when('/taskedit', {
    templateUrl: 'partials/taskedit.html',
    controller: 'TaskEditController'
  }).
  when('/taskadd', {
    templateUrl: 'partials/taskadd.html',
    controller: 'TaskEditController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
