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


demoControllers.controller("RegisterController",['$scope', '$http', '$window', function($scope, $http, $window){
    if ($window.sessionStorage.user)$scope.usernameDisplay = $window.sessionStorage.user;
    else $scope.usernameDisplay = 'New Guest';
    $scope.login = function(email,password) {
        //console.log("username=" + name + "&email="+email);
     /* var dataObj = {
				username : name,
				email : email
		};	*/
    /*$http({
                    method: 'POST',
                    url: '/users',
                    data: "username=" + name + "&email="+email,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })*/
        var outPacket={
				email : email,
                password : password
        };
        $http.post('/login', outPacket).success(function(done){
        alert(done.message);
        $window.sessionStorage.user = $scope.usernameDisplay = done.data;
    }).error(function(done){
        alert(done.message);
    });
  }
    
    $scope.add = function(email,password) {
        var outPacket={
				email : email,
                password : password
        };
        $http.post('/users', outPacket).success(function(data){
        alert(data.message);
    }).error(function(data){
        alert(data.message);
    });
  }
}]);




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