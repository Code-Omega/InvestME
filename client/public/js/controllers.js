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
  $scope.selectedIndex = 0;
  $scope.change_port = function(x,$index){
    $scope.list = Ports.list = x.stock_list[0];
    $scope.selectedIndex = $index;
    console.log($index);
    console.log($scope.selectedIndex);
  }
}]);

demoControllers.controller('DataController', ['$scope', '$http', 'Ports'  , function($scope, $http, Ports) {}]);


demoControllers.controller("RegisterController",['$scope', '$http', '$window', 'Users', 'Login', function($scope, $http, $window, Users, Login){
    if ($window.sessionStorage.user)$scope.usernameDisplay = $window.sessionStorage.user.email;
    else $scope.usernameDisplay = 'New Guest';
    $scope.login = function(email,password) {
        alert("attempting");
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
        Login.post(email, password).success(function(done){
        alert("good"+done.message);
        console.log(done.data);
        $window.sessionStorage.user = done.data;
        $scope.usernameDisplay = done.data.email;
    }).error(function(done){
        alert("bad"+done.message);
    });

        /*$http.post('/login', outPacket).success(function(done){
        alert("good"+done.message);
        $window.sessionStorage.user = $scope.usernameDisplay = done.data;
    }).error(function(done){
        alert("bad"+done.message);
    });*/
  /*            var dataObj = {
				name : name,
				email : email,
		};
    Users.post(name,email).success(function(data){
        alert(data.message);
        Users.get().success(function(data){
        $scope.users = data.data;
    });
    }).error(function(data){
        alert(data.message);
    });*/
  }

    $scope.add = function(email,password) {
        var dataObj = {
				email : email,
				password : password,
		};
    Users.post(email,password).success(function(data){
        alert(data.message);
        Users.get().success(function(data){
        $scope.users = data.data;
    });
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
