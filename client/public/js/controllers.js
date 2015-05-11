var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('FeedController', ['$scope', 'Ports'  , function($scope, Ports) {

}]);
demoControllers.controller('SearchController', ['$scope', '$timeout', 'Ports'  , function($scope,$timeout, Ports) {
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
  var tempFilterText = '',
      filterTextTimeout;
  $scope.$watch('query',function(val){
    if(filterTextTimeout) $timeout.cancel(filterTextTimeout);
    tempFilterText = val;
    filterTextTimeout = $timeout(function() {
            $scope.filterText = tempFilterText;
        }, 250); // delay 250 ms
    if($scope.results==undefined){
      $scope.results = [];
      $scope.results[0] = "GOOG"
    }

    //var y = "http://www.google.com/finance/historical?q="+$scope.results[0]+"&startdate=Apr+24%2C+2015&enddate=May+8%2C+2015&output=csv";
    var y = "https://www.quandl.com/api/v1/datasets/WIKI/"+$scope.results[0]+".csv?trim_start=2015-01-01&trim_end=2015-05-08?auth_token=LUBeKho3ASNgG9ZBBEJ"
    var price = [];
    $.get(y,function(data){
      $scope.$watch(function(){
      var lines = data.split(/\r\n|\n/);
      for(var i=lines.length-2;i>1;i--){
        var d = lines[i].split(',');
        price.push([Date.parse(d[0]),parseFloat(d[1])]);
        //console.log(price);
      }
      $scope.dd = price;
      //console.log(data);
    });
  });
  });
  $scope.$watch('dd',function(){
    console.log($scope.dd);
      $('#search_chart').highcharts('StockChart',{
        rangeSelector : {
            enabled : 0
        },
        chart:{
          height:150,
        },
        scrollbar:{
          enabled: 0
        },
        navigator:{
          enabled:0
        },
        title : {
            text : $scope.results[0]+' Stock Price'
        },
        series : [{
            name : $scope.results[0],
            data : $scope.dd,
            tooltip: {
            valueDecimals: 2
            }
        }]
      });
  });
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

demoControllers.controller('MainController', ['$scope', '$http','$window', 'Ports', 'Users','$rootScope'  , function($scope, $http,$window, Ports, Users,$rootScope) {
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
      $scope.currPort = $scope.ports[0];
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
                $rootScope.alert=("please sign in first");
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

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
            $rootScope.alert=(data.message);
            $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

            Users.getByID(JSON.parse(window.localStorage.getItem("user"))._id).success(function(data){
                $rootScope.alert=(data.message);
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

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
                $rootScope.alert=(data.message);
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

            });
        }).error(function(data){
            $rootScope.alert=(data.message);
            $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

        });
        $rootScope.alert=(data.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

    }).error(function(data){
        $rootScope.alert=(data.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

    });
  }

  $scope.addStock = function(code) {
            if(window.localStorage.length > 0 && window.localStorage.getItem("user")){
                if(window.localStorage.getItem("port")){
                //good
                }else{
                    //port not selected
                    $rootScope.alert=("please select a portfolio first");
                    $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

                    return;
                }
            }else{
                //not logged in yet
                $rootScope.alert=("please sign in first");
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

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
                $rootScope.alert=(data.message);
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

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
                $rootScope.alert=(data.message);
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

            });
        console.log("=====================2");
    }).error(function(data){
        $rootScope.alert=(data.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

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
  //var y = "http://www.google.com/finance/historical?q=GOOG&startdate=May+11%2C+2005&enddate=May+10%2C+2015&output=csv"
  //'https://www.quandl.com/api/v1/datasets/WIKI/BAC.csv?auth_token=f145JnDCHM7QCXLRn61V'
  var y = "https://www.quandl.com/api/v1/datasets/WIKI/BAC.csv?auth_token=f145JnDCHM7QCXLRn61V"
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
    $scope.currPort = x;
    window.localStorage.setItem("port",JSON.stringify(x));
    $scope.stocklist = x.stock_list;
    $scope.list = Ports.list = x.stock_list[0];
      if (Ports.list) {
    $scope.stocks = Ports.list.split(',');
      } else $scope.stocks = [];
    $scope.selectedIndexPort = $index;
    $("#stockbtn").click();
    $scope.feeed();
    $scope.find_funds();
  }
  $scope.find_funds = function(){
    var stock;
    $scope.all_stocks = [];
    console.log(Ports.list);
    if(Ports.list!=undefined)
      var arr = Ports.list.split(',');
    else
      var arr = ["GOOG","AAPL","MSFT","TSLA"];
    $rootScope.alert = "Loading";$("#alert").fadeIn("slow");
    for(var i=0;i<arr.length;i++){
      var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + arr[i] + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
      $.getJSON(url,function(data){
        $scope.$apply(function(){stock = data.query.results.quote;
        $scope.all_stocks.push(stock);
        });
      })
    }
    $rootScope.alert = "";$("#alert").fadeOut("slow");
  }
  $scope.change_stock = function(x,$index){
    $scope.selectedIndexStock = $index;
    Ports.list = x;
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + x + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
    //var url2 = 'http://www.google.com/finance/historical?q='+x+'&startdate=May+11%2C+2005&enddate=May+10%2C+2015&output=csv';
    var url2 = "https://www.quandl.com/api/v1/datasets/WIKI/"+x+".csv?auth_token=f145JnDCHM7QCXLRn61V"
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
  $scope.feeed = function(){
    $scope.things = Ports.list;
    var str = "http://finance.yahoo.com/rss/headline?s="+Ports.list;
    $('#test').rssfeed(str, {limit: 25, header:false, content:false, media:false, date:true});
  }
  $scope.$watch(function(){
    $scope.things = Ports.list;
    var str = "http://finance.yahoo.com/rss/headline?s="+Ports.list;
    $('#test').rssfeed(str, {limit: 25, header:false, content:false, media:false, date:true});
  })
}]);

demoControllers.controller('DataController', ['$scope', '$http', 'Ports'  , function($scope, $http, Ports) {
    /*var seriesOptions = [],
    seriesCounter = 0,
    names = ["GOOG","AAPL","MSFT","TSLA","BAC","QQQ","NOK","GE"],
    createChart = function () {
      $('#data_chart').highcharts('StockChart', {
        rangeSelector: {
          selected: 4
        },
        yAxis: {
          labels: {
            formatter: function () {
              return (this.value > 0 ? ' + ' : '') + this.value + '%';
            }
        },
        plotLines: [{
          value: 0,
          width: 2,
           color: 'silver'
        }]
      },
      plotOptions: {
        series: {
          compare: 'percent'
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2
      },
        series: seriesOptions
    });
    };
    $.each(names, function (i, name) {
       $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {
            seriesOptions[i] = {
                name: name,
                data: data
            };
            seriesCounter += 1;
            if (seriesCounter === names.length) {
               createChart();
            }
        });
    });*/
}]);


demoControllers.controller("RegisterController",['$scope', '$http', '$window', 'Users', 'Ports', 'Login', '$location', '$rootScope', function($scope, $http, $window, Users, Ports, Login, $location, $rootScope){
  $scope.modelToggle = function($event){
    console.log("this si "+ $event.target);
    if( $event.target)
        $("#content2").fadeToggle("slow");
  };

  $scope.remove_stock = function(x,$index){
    $('#stock_things').toggle('fast');
    if(window.localStorage.length > 0 && window.localStorage.getItem("user")){
        if(window.localStorage.getItem("port")){
        }else{
            $rootScope.alert=("please select a portfolio first");
            $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

            return;
        }
    }else{
        $rootScope.alert=("please sign in first");
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

        return;
    }
      var stockArray = "";
      console.log("list is this "+$scope.stocklist);
      if ($scope.stocklist!=""){
        console.log(x.length)  ;
        console.log($scope.stocklist);
        if($scope.stocklist.indexOf(x)==0)
          stockArray=$scope.stocklist[0].substring(0,$scope.stocklist[0].indexOf(x))      +$scope.stocklist[0].substring($scope.stocklist[0].indexOf(x)+x.length+1);
        else
          stockArray=$scope.stocklist[0].substring(0,$scope.stocklist[0].indexOf(x)-1)   +$scope.stocklist[0].substring($scope.stocklist[0].indexOf(x)+x.length);
      }
      console.log(stockArray);
      var assignment = 'stock_list[]='+stockArray;
      Ports.addStockByCode(assignment).success(function(data){
        //console.log("=====================1");
        //console.log(data.data);
        window.localStorage.setItem("port",JSON.stringify(data.data));
        $scope.list = Ports.list = data.data.stock_list[0];
        $scope.change_port(data.data,0);
                    Users.getByID(JSON.parse(window.localStorage.getItem("user"))._id).success(function(data){
                $rootScope.alert=(data.message);
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

                window.localStorage.setItem("user",JSON.stringify(data.data));
                      $scope.ports = [];
                      for (var i = 0; i < JSON.parse(window.localStorage.getItem("user")).portfolios.length; i++) {
                          //console.log("hello again "+JSON.parse(window.localStorage.getItem("user")).portfolios[i]);
                          Ports.getByID(JSON.parse(window.localStorage.getItem("user")).portfolios[i]).success(function(data){
                              //console.log("dt: "+JSON.stringify(data.data));
                            $scope.ports.push((data.data));
                              //console.log("sp: "+$scope.ports);
                          });
                      };
                      Ports.ports = $scope.ports;
            }).error(function(data){
                $rootScope.alert=(data.message);
                $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

            });
           //console.log("=====================2");
      }).error(function(data){
        $rootScope.alert=(data.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

      });
  }
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
        $rootScope.alert=("good"+done.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds


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
        $rootScope.alert=("bad"+done.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

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
        $rootScope.alert=("Logged Out");
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

        $location.path('/register');
  }

    $scope.add = function(username, email,password) {
        var dataObj = {
                name : username,
				email : email,
				password : password,
		};
    Users.post(username,email,password).success(function(data){
        $rootScope.alert=(data.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

        Users.get().success(function(data){
        $scope.users = data.data;
    });
    }).error(function(data){
        $rootScope.alert=(data.message);
        $("#alert").fadeIn("slow");setTimeout(function() {$("#alert").fadeOut("slow");},2000);
      // Do something after 5 seconds

    });
  }

    $scope.edit = function(username, email,password) {
        var dataObj = {
                name : username,
				email : email,
				password : password,
		};
    Users.edit(username,email,password).success(function(data){
        alert(data.message);
        Users.getByID(JSON.parse(window.localStorage.getItem("user"))._id).success(function(data){
          window.localStorage.setItem("user",JSON.stringify(data.data));
          console.log(data.data);
          Users.user = data.data.name;
          Users.email = data.data.email;
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
