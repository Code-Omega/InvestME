var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('FeedController', ['$scope', 'Ports'  , function($scope, Ports) {
  Ports.list = "^GSPC,^DJI,^IXIC"
  $scope.$watch(function(){
    var str = "http://finance.yahoo.com/rss/headline?s="+Ports.list;
    console.log(str);
    $('#test').rssfeed(str, {limit: 25, header:false, content:false, media:false, date:false});
  })
}]);

demoControllers.controller('MainController', ['$scope', '$http', 'Ports'  , function($scope, $http, Ports) {
  Ports.get().success(function(data){
    $scope.ports = data.data;
    $scope.list = data.data[0].stock_list[0];
    Ports.ports = data.data;
  });
  $scope.change_port = function(x){
    $scope.list = Ports.list = x.stock_list[0];
    console.log(Ports.list);
  }
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



/*
directives.directive('feed',['Ports',function(Ports) {
  return{
    link: function(Ports){
      var str = "http://finance.yahoo.com/rss/headline?s="+Ports.list;
      console.log(str);
      $('#test').rssfeed(str, {limit: 25, header:false, content:false, media:false, date:false});
    }
  }
}]);*/
/*
directives.directive('data',function(){
  return{
    link: function(scope,element){

    }
  }
})*/
