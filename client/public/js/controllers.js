var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('FeedController', ['$scope', 'Ports'  , function($scope, Ports) {
  $scope.$watch(function(){
    $scope.things = Ports.list;
    var str = "http://finance.yahoo.com/rss/headline?s="+Ports.list;
    $('#test').rssfeed(str, {limit: 25, header:false, content:false, media:false, date:false});
  })
}]);

demoControllers.controller('MainController', ['$scope', '$http','$window', 'Ports', 'Users'  , function($scope, $http,$window, Ports, Users) {
if (window.localStorage.length>0){
      console.log("hello "+window.localStorage.getItem("user"));
      $scope.ports = [];
      for (var i = 0; i < JSON.parse(window.localStorage.getItem("user")).portfolios.length; i++) {
          console.log("hello again "+JSON.parse(window.localStorage.getItem("user")).portfolios[i]);
          Ports.getByID(JSON.parse(window.localStorage.getItem("user")).portfolios[i]).success(function(data){
              console.log("dt: "+JSON.stringify(data.data));
            $scope.ports.push((data.data));
              console.log("sp: "+$scope.ports);
          });
      }if ($scope.ports.length > 0){
      $scope.list = Ports.list = $scope.ports[0].stock_list[0];
      }
      Ports.ports = $scope.ports;
  } else {
      Ports.get().success(function(data){
        $scope.ports = data.data;
        $scope.list = Ports.list = data.data[0].stock_list[0];
        Ports.ports = data.data;
      });
  }
  $scope.$watch(function(){
    $scope.ports = Ports.ports;
    $scope.list = Ports.list;
  })
  var z = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + 'GOOG' + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
  $.getJSON(z,function(data){
    $scope.$apply(function(){$scope.stock = Ports.curStock = data.query.results.quote;});
    console.log($scope.stock);
  });

  $scope.selectedIndexPort = 0;
  $scope.selectedIndexStock = 0;
  $scope.change_port = function(x,$index){
    $scope.list = Ports.list = x.stock_list[0];
    $scope.stocks = Ports.list.split(',');
    $scope.selectedIndexPort = $index;
    $("#stockbtn").click();
  }
  $scope.change_stock = function(x,$index){
    $scope.selectedIndexStock = $index;
    Ports.list = x;
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + x + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
    $.getJSON(url,function(data){
      $scope.$apply(function(){$scope.stock = Ports.curStock = data.query.results.quote;});
      //console.log($scope.stock);
    });
  }
  //console.log(typeof(window.localStorage.length));
  if (window.localStorage.length>0){
    $scope.usernameDisplay = JSON.parse(window.localStorage.getItem("user")).name;
    Users.user = $scope.usernameDisplay;
    Users.email = JSON.parse(window.localStorage.getItem("user")).email;
  }
  else{
    $scope.usernameDisplay = 'Login';
    Users.user = 'Login';
    Users.email = 'a@b';
  }
  $scope.$watch(function(){
    $scope.usernameDisplay = Users.user;
  })
}]);

demoControllers.controller('DataController', ['$scope', '$http', 'Ports'  , function($scope, $http, Ports) {

}]);


demoControllers.controller("RegisterController",['$scope', '$http', '$window', 'Users', 'Ports', 'Login', function($scope, $http, $window, Users, Ports, Login){
    console.log(window.localStorage);
    if (window.localStorage.length>0){
      $scope.usernameDisplay = JSON.parse(window.localStorage.getItem("user")).name;
      Users.user = $scope.usernameDisplay;
      Users.email = JSON.parse(window.localStorage.getItem("user")).email;
    }
    else{
      $scope.usernameDisplay = 'Login';
      Users.user = 'Login';
      Users.email = 'a@b';
    }
    $scope.login = function(email,password) {
        var outPacket={
				      email : email,
              password : password
        };
        Login.post(email, password).success(function(done){
        alert("good"+done.message);
        if (done.message == "Logged in") {
          //console.log(done.data);
          //$window.localStorage.user = done.data;
          window.localStorage.setItem("user",JSON.stringify(done.data));
          console.log(done.data);
          Users.user = done.data.name;
          Users.email = done.data.email;
          //console.log(window.localStorage);
          $scope.usernameDisplay = done.data.email;

          $scope.ports = [];
          for (var i = 0; i < JSON.parse(window.localStorage.getItem("user")).portfolios.length; i++) {
              console.log("hello again "+JSON.parse(window.localStorage.getItem("user")).portfolios[i]);
              Ports.getByID(JSON.parse(window.localStorage.getItem("user")).portfolios[i]).success(function(data){
                  console.log("dt: "+JSON.stringify(data.data));
                $scope.ports.push((data.data));
                  console.log("sp: "+$scope.ports);
              });
          }if ($scope.ports.length > 0){
          $scope.list = Ports.list = $scope.ports[0].stock_list[0];
          }
          Ports.ports = $scope.ports;
        }
    }).error(function(done){
        alert("bad"+done.message);
    });
  }

    $scope.add = function(username, email,password) {
        var dataObj = {
                name : username,
				email : email,
				password : password,
		};
    Users.post(username,email,password).success(function(data){
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
