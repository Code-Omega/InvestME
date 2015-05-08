var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('MainController', ['$scope', 'CommonData'  , function($scope, CommonData) {}]);

demoControllers.controller('PortfolioController', ['$scope', 'CommonData' , function($scope, CommonData) {}]);
