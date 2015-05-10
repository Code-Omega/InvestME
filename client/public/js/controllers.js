var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('FeedController', ['$scope', 'Ports'  , function($scope, Ports) {
  $scope.$watch(function(){
    $scope.things = Ports.list;
    var str = "http://finance.yahoo.com/rss/headline?s="+Ports.list;
    $('#test').rssfeed(str, {limit: 25, header:false, content:false, media:false, date:false});
  })
}]);
demoControllers.controller('SearchController', ['$scope', 'Ports'  , function($scope, Ports) {
  console.log("hi");
  $.get("../data/sp500.csv",function(data){
    var lines = data.split(/\r\n|\n/);
    var list = [];
    for(var i=1;i<lines.length-1;i++){
      var d = lines[i].split(',');
      //list.push([d[0],d[1],d[2],d[4],d[14]]);
      list.push(d[0]);
    }
    $scope.list = list;
  })
  $scope.filteredList;
  $scope.incc = false;;
  $scope.$watch(function(){
    if($scope.filteredList!=undefined){
      if($scope.filteredList.length <= 5){
        $scope.incc = 'inc';
      }else{
        $scope.incc = 'dec';
      }
      console.log($scope.incc);
    }
  })
}]);
demoControllers.controller('ChartController', ['$scope', 'Ports'  , function($scope, Ports) {
  $scope.$watch(function(){
    if($scope.cake != Ports.hist_price){

        console.log(Ports.hist_price);
        $('#chart').highcharts('StockChart',{
          rangeSelector : {
              selected : 1
          },
          title : {
              text : Ports.s+' Stock Price'
          },
          series : [{
              name : Ports.s,
              data : Ports.hist_price,
              tooltip: {
              valueDecimals: 2
              }
          }]
        });
        $scope.cake = Ports.hist_price;
      }
  });
  /*// $scope.$watch(function(){
    $scope.cake = Ports.hist_price;
  });
  $scope.$watch('cake',function(){
        console.log(Ports.hist_price);
        $('#chart').highcharts('StockChart',{
          rangeSelector : {
              selected : 1
          },
          title : {
              text : Ports.s+' Stock Price'
          },
          series : [{
              name : Ports.s,
              data : Ports.hist_price,
              tooltip: {
              valueDecimals: 2
              }
          }]
        });
      });*/

 /*$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        // Create the chart
        console.log(data);
        Highcharts.setOptions({
          global:{
            useUTC:false
          }
        });
        $('#chart').highcharts('StockChart', {
            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'AAPL Stock Price'
            },

            series : [{
                name : 'AAPL',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });*/
}]);

demoControllers.controller('MainController', ['$scope', '$http','$window', 'Ports', 'Users'  , function($scope, $http,$window, Ports, Users) {
if (window.localStorage.length>0){
    if(window.localStorage.getItem("user")){
      console.log("hello "+window.localStorage.getItem("user"));
      $scope.ports = [];
      for (var i = 0; i < JSON.parse(window.localStorage.getItem("user")).portfolios.length; i++) {
          console.log("hello again "+JSON.parse(window.localStorage.getItem("user")).portfolios[i]);
          Ports.getByID(JSON.parse(window.localStorage.getItem("user")).portfolios[i]).success(function(data){
              //console.log("dt: "+JSON.stringify(data.data));
            $scope.ports.push((data.data));
              //console.log("sp: "+$scope.ports);
          });
      }if ($scope.ports.length > 0){
      $scope.list = Ports.list = $scope.ports[0].stock_list[0];
      }
      Ports.ports = $scope.ports;
      window.localStorage.setItem("port",JSON.stringify($scope.ports[0]));
    }
  } else {
      Ports.get().success(function(data){
        $scope.ports = data.data;
        $scope.list = Ports.list = data.data[0].stock_list[0];
        Ports.ports = data.data;
      });
  }

  $scope.addPort = function(name) {
            if(window.localStorage.length > 0){ 
                if(window.localStorage.getItem("user") != undefined){
                    if(window.localStorage.getItem("user") != "undefined"){
                        //good 
                    }
                }
            }else{
                //not logged in yet
                alert("please sign in first");
                return;
            }
      
        var dataObj = {
                name : name,
		};
    Ports.post(name).success(function(data){
        console.log(data.data);
        var portArray = JSON.parse(window.localStorage.getItem("user")).portfolios;
        portArray.splice(0, 0, data.data._id);
        var assignment = '';
        for (var i = 0; i < portArray.length; i++) {
            assignment = assignment+'portfolios[]='+portArray[i];
            if (i != portArray.length-1) assignment = assignment+'&'
        }
        Users.updatePort(assignment).success(function(data){
            alert(data.message);
            Users.getByID(JSON.parse(window.localStorage.getItem("user"))._id).success(function(data){
                alert(data.message);
                window.localStorage.setItem("user",JSON.stringify(data.data));
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
            }).error(function(data){
                alert(data.message);
            });
        }).error(function(data){
            alert(data.message);
        });
        alert(data.message);
    }).error(function(data){
        alert(data.message);
    });
  }

  $scope.addStock = function(code) {
            if(window.localStorage.length > 0 && window.localStorage.getItem("user")){ 
                if(window.localStorage.getItem("port")){
                //good
                }else{
                    //port not selected
                    alert("please select a portfolio first");
                    return;
                }
            }else{
                //not logged in yet
                alert("please sign in first");
                return;
            }
        var dataObj = {
                code : code,
		};
    var stockArray = "";
    console.log("list is this "+$scope.stocklist);
    if ($scope.stocklist!="")stockArray=$scope.stocklist+","+code;
    else stockArray = code;
    var assignment = 'stock_list[]='+stockArray;
    Ports.addStockByCode(assignment).success(function(data){
         console.log("=====================1");
        console.log(data.data);
        window.localStorage.setItem("port",JSON.stringify(data.data));
        $scope.list = Ports.list = data.data.stock_list[0];
        $scope.change_port(data.data,0);
                    Users.getByID(JSON.parse(window.localStorage.getItem("user"))._id).success(function(data){
                alert(data.message);
                window.localStorage.setItem("user",JSON.stringify(data.data));
                      $scope.ports = [];
                      for (var i = 0; i < JSON.parse(window.localStorage.getItem("user")).portfolios.length; i++) {
                          console.log("hello again "+JSON.parse(window.localStorage.getItem("user")).portfolios[i]);
                          Ports.getByID(JSON.parse(window.localStorage.getItem("user")).portfolios[i]).success(function(data){
                              console.log("dt: "+JSON.stringify(data.data));
                            $scope.ports.push((data.data));
                              console.log("sp: "+$scope.ports);
                          });
                      };
                      Ports.ports = $scope.ports;
            }).error(function(data){
                alert(data.message);
            });
        console.log("=====================2");
    }).error(function(data){
        alert(data.message);
    });
  }

  $scope.$watch(function(){
    $scope.ports = Ports.ports;
    $scope.list = Ports.list;
  })
  var z = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + 'GOOG' + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
  $.getJSON(z,function(data){
    $scope.$apply(function(){$scope.stock = Ports.curStock = data.query.results.quote;});
    //console.log($scope.stock);
  });
  var y = "http://www.google.com/finance/historical?q=GOOG&startdate=May+11%2C+2005&enddate=May+10%2C+2015&output=csv"
  $.get(y,function(data){
    var lines = data.split(/\r\n|\n/);
    var dates = [];
    var price = [];
    for(var i=lines.length-2;i>1;i--){
      var d = lines[i].split(',');
      var stamp = Date.parse(d[0]);
      var arr = [stamp,parseFloat(d[1])];
      //console.log(d[0]);
      dates.push(stamp);
      price.push(arr);
    }
    Ports.hist_dates = dates;
    Ports.hist_price = price;
    Ports.s = "GOOG"
    //Ports.hist_vol = vol;
    //console.log(data);
    //console.log(dates);
    //console.log(price);
  })

  $scope.selectedIndexPort = 0;
  $scope.selectedIndexStock = 0;
  $scope.change_port = function(x,$index){
    window.localStorage.setItem("port",JSON.stringify(x));
    $scope.stocklist = x.stock_list;
    $scope.list = Ports.list = x.stock_list[0];
      if (Ports.list) {
    $scope.stocks = Ports.list.split(',');
      } else $scope.stocks = [];
    $scope.selectedIndexPort = $index;
    $("#stockbtn").click();
  }
  $scope.change_stock = function(x,$index){
    $scope.selectedIndexStock = $index;
    Ports.list = x;
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + x + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
    var url2 = 'http://www.google.com/finance/historical?q='+x+'&startdate=May+11%2C+2005&enddate=May+10%2C+2015&output=csv';
    $.getJSON(url,function(data){
      $scope.$apply(function(){$scope.stock = Ports.curStock = data.query.results.quote;});
      //console.log($scope.stock);
    });
    $.get(url2,function(data){
      $scope.$apply(function(){
      var lines = data.split(/\r\n|\n/);
      var dates = [];
      var price = [];
      for(var i=lines.length-2;i>1;i--){
        var d = lines[i].split(',');
        var stamp = Date.parse(d[0]);
        var arr = [stamp,parseFloat(d[1])];
        //console.log(d[0]);
        dates.push(stamp);
        price.push(arr);
      }
      Ports.hist_dates = dates;
      Ports.hist_price = price;
      Ports.s = x;
    });
    })
  }
  //console.log(typeof(window.localStorage.length));
  if (window.localStorage.length>0 && window.localStorage.getItem("user")){
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


demoControllers.controller("RegisterController",['$scope', '$http', '$window', 'Users', 'Ports', 'Login', '$location', function($scope, $http, $window, Users, Ports, Login, $location){
    console.log(window.localStorage);
    if (window.localStorage.length>0 && window.localStorage.getItem("user")){
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
          $("#feedbtn").click();
          $location.path('/');
        }
    }).error(function(done){
        alert("bad"+done.message);
    });
  }
    
    $scope.logout = function() {
          localStorage.removeItem("user");
          localStorage.removeItem("port");
          Users.user = "";
          Users.email = "";
          //console.log(window.localStorage);
          $scope.usernameDisplay = "Log In";
          $scope.ports = [];
          $scope.list = Ports.list = "";
          Ports.ports = $scope.ports;
        alert("Logged Out");
        $location.path('/register');
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
