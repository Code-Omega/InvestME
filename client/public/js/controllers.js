var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('FeedController', ['$scope', 'CommonData'  , function($scope, CommonData) {}]);

demoControllers.controller('MainController', ['$scope', '$http', 'Ports'  , function($scope, $http, Ports) {
  Ports.get().success(function(data){
    $scope.ports = data.data;
    Ports.ports = data.data;
  });
}]);

demoControllers.controller('DataController', ['$scope', '$http', 'Ports'  , function($scope, $http, Ports) {}]);

directives.directive('feed',function(){
  return{
    link: function(scope,element){
      $('#test').rssfeed('http://finance.yahoo.com/rss/headline?s=^GSPC,^dji,^ixic', {limit: 25, header:false, content:false, media:false, date:false});
    }
  }
})
/*
directives.directive('data',function(){
  return{
    link: function(scope,element){

    }
  }
})*/
