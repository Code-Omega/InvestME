var demoControllers = angular.module('demoControllers', []);

var directives = angular.module('directives', []);

demoControllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

demoControllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


demoControllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);

demoControllers.controller('UserListController', ['$scope', '$http', 'Users', 'User', 'Task', '$window', '$location', function($scope, $http, Users, User, Task,  $window, $location) {

 /* Users.get().success(function(data){
    $scope.users = data.data;
      User.users = data.data;
  });
  $scope.delete = function(user) {
      var taskRemove = user.pendingTasks;
    Users.delete(user._id).success(function(data){
        alert(data.message);
        for(var i = 0 ; i < taskRemove.length ; i++){
            //console.log(pendingTasks[i]);
            var update = 'assignedUserName=unassigned&assignedUser='
            Task.edit(taskRemove[i],update).success(function(data){
                //console.log(data.data.name);
            }); 
        }
        Users.get().success(function(data){
        $scope.users = data.data;
    });
    });
  }
  $scope.add = function(name,email) {
      var dataObj = {
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
    });
  }
  $scope.showDetail = function(user){
    User.user = user;
    $location.path("/userdetail");
  }*/
$scope.$broadcast('dataloaded');
console.log("bd");

}]);

directives.directive('myCustomer', function() {
  return {
    link: function (scope, element) {
      // Generate a Bates distribution of 10 random variables.
var values = d3.range(1000).map(d3.random.bates(10));

// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var svg = d3.select("#histo").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function(d) { return height - y(d.y); });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    } 
  };
});

demoControllers.controller('UserDetailController', ['$scope', '$http', 'User', 'Tasks', 'Task', '$window' ,'$location', function($scope, $http, User, Tasks, Task, $window,$location) {
  if(User.user) $window.sessionStorage.user=JSON.stringify(User.user);
  else User.user = JSON.parse($window.sessionStorage.user);
  if(Task.task) $window.sessionStorage.task=JSON.stringify(Task.task);
  else Task.task = JSON.parse($window.sessionStorage.task);
  $scope.user = User.user;
  $scope.task = Task.task;
  $scope.hideCompletedTasks = true;
    
    $scope.showCompletedTaskF = function(){$scope.hideCompletedTasks = !$scope.hideCompletedTasks; console.log($scope.hideCompletedTasks);}
    
  $scope.getTaskByID = function(taskID){
    Tasks.getByID(taskID).success(function(data){
          //alert(JSON.stringify(data.data));
    $scope.task = data.data;
        return data.data;
        //alert(JSON.stringify(Task.task));
        //return JSON.stringify(data.data);
    });
  };
  $scope.getTasksByID = function(pendingTasks){
        var result = [];
      //console.log(pendingTasks.length);
        for(var i = 0 ; i < pendingTasks.length ; i++){
            //console.log(pendingTasks[i]);
            Tasks.getByID(pendingTasks[i]).success(function(data){
                result.push(data.data);
                //console.log(data.data.name);
            }); 
        }
        return result;
  };
      $scope.taskList = $scope.getTasksByID($scope.user.pendingTasks);
      $scope.$watch('user',function(){
        $scope.taskList = $scope.getTasksByID($scope.user.pendingTasks);
          //console.log($scope.taskList);
  });
    $scope.completeTask = function(theTask){
        var update = '&completed='+true;
        Task.edit(theTask._id,update).success(function(data){
            alert(data.message);
            User.getByID($scope.user._id).success(function(data){
                $scope.user = data.data;
            });
        });
    
    }
    
   /*$scope.showCompletedTasks = function(){
    for(var i=0;i<$scope.user.pendingTasks.length;i++){
      Task.getByID($scope.user.pendingTasks.[i]).success(function(data){
        if(data.data.completed) $scope.comp.push(data.data);
        else $scope.pend.push(data.data);
        //$scope.tasks.push(data2.data);
      });
    }*/
    
}]);

demoControllers.controller('TaskListController', ['$scope', '$http', 'Tasks', 'Task', '$window', '$location', function($scope, $http, Tasks, Task, $window, $location) {
  $scope.sort = '';
  $scope.num = 10;
  $scope.begin = 0;
  $scope.count = 100;
  $scope.showComplete = '';
      $scope.sortTaskStatus = 0;
    $scope.sortTaskOrder = 1;
  $scope.options =
        [ { name: 'sort by name', string: '"name":'},
          { name: 'sort by username', string: '"assignedUserName":'},
          { name: 'sort by date created', string: '"dateCreated":'},
         { name: 'sort by deadline', string: '"deadline":'}
        ];
  $scope.option = $scope.options[0];
  $scope.sort =  $scope.option.string;
    /*console.log($scope.option);
     console.log($scope.sort);*/
  $scope.$watch('option',function(){
        $scope.sort = $scope.option.string;
  });
  $scope.$watch('sortTaskStatus',function(){
        if($scope.sortTaskStatus==1) $scope.showComplete = '"completed":"true"'; 
        else if($scope.sortTaskStatus==2) $scope.showComplete = '"completed":"false"';
        else $scope.showComplete='';
  });
  $scope.$watch('[begin,sort,showComplete,sortTaskOrder]',function(){
      //$scope.sort =  $scope.option.string;
      //var update = true;
    Tasks.count().success(function(data){
        $scope.count = data.data;
        /*if($scope.count<($scope.begin+$scope.num)){
            $scope.begin = $scope.begin-$scope.num;
            update = false;
        }*/
    });
    //if (update){
    Tasks.get($scope.begin,$scope.num,$scope.sort,$scope.showComplete,$scope.sortTaskOrder).success(function(data){
        $scope.tasks = data.data;
    });
    //}
  });
  $scope.delete = function(task) {
    Tasks.delete(task._id).success(function(data){
        alert(data.message);
        Tasks.get($scope.begin,$scope.num,$scope.sort,$scope.showComplete,$scope.sortTaskOrder).success(function(data){
        $scope.tasks = data.data;
    });
    });
  }
  /*Tasks.get($scope.begin,$scope.num,$scope.sort).success(function(data){
    $scope.tasks = data.data;
  });*/
  //$scope.currid;
  $scope.showDetail = function(task){
    Task.task = task;
    $location.path("/taskdetail");
  }
  $scope.showAdd = function(task){
    Task.task = task;
    $location.path("/taskadd");
  }
  $scope.getTaskByID = function(taskID){
    Tasks.getByID(taskID).success(function(data){
          //alert(JSON.stringify(data.data));
    Task.task = data.data;
        //alert(JSON.stringify(Task.task));
        //return JSON.stringify(data.data);
    });
  }
  /*$scope.completeTask = function(taskID){
    Tasks.put(taskID, data).success(function(data){
          //alert(JSON.stringify(data.data));
    Task.task = data.data;
        //alert(JSON.stringify(Task.task));
        //return JSON.stringify(data.data);
    });
  }*/
  /*$scope.showDetail = function (task) {
      console.log('click');
      //$scope.currid = task._id;
      //console.log($scope.currTask.description);
      Tasks.getByID(task._id).success(function(data){
          alert(JSON.stringify(data.data));
            $scope.currTaskdata = data.data;
      });
        $scope.partial = $scope.partials[2];
        if (movieID == undefined) movieID = 'tt0111161';
        $scope.movieID = movieID;
        console.log('click');
        console.log($scope.partial);
    }*/
  /*$scope.$watch('currTask',function(){
      if (typeof currTask === 'undefined') return;
      else console.log($scope.currTask.description);
        Tasks.getByID;(currTask._id).success(function(data){
            $scope.currTaskdata = data.data;
        });
  });*/


}]);

demoControllers.controller('TaskDetailController', ['$scope', '$http', 'Task', 'User', '$window' ,'$location', function($scope, $http, Task, User, $window,$location) {
  if(Task.task) $window.sessionStorage.task=JSON.stringify(Task.task);
  else Task.task = JSON.parse($window.sessionStorage.task);
  $scope.task = Task.task;
  $scope.$watch('Task.task',function(){
    $scope.task = Task.task;
  });
  $scope.edit = function(){
    $location.path("/taskedit");
  }
  
}]);

demoControllers.controller('TaskEditController', ['$scope', '$http', 'Task', 'User', 'Users', '$window' ,'$location', function($scope, $http, Task, User, Users, $window,$location) {
    if (Task.task){
  $scope.task = Task.task;
  $scope.nameIn = $scope.task.name;
  $scope.deadlineIn = $scope.task.deadline;
  $scope.descriptionIn = $scope.task.description;
  $scope.assignedUserIn = $scope.task.assignedUser;
  $scope.completedIn = $scope.task.completed;}
    
    //--------
    
    $scope.userList=[];
    $scope.selectUser;
    $scope.origUser;
    
  $scope.$watch('nameNn',function(){
        Users.get().success(function(data){
        $scope.userList = data.data;
      //console.log($scope.userList);
      //console.log("get user");
      var userIndex = 0;
      $scope.option = $scope.userList[userIndex].name;
    });
  });
    
  $scope.$watch('task._id',function(){
    Users.get().success(function(data){
    $scope.userList = data.data;
      //console.log($scope.userList);
      //console.log("get user");
        $scope.origUser = null;
      var userIndex = 0;
      //console.log($scope.userList[0]._id);
      for (var i = 0; i < $scope.userList.length; i++) {
          //console.log($scope.userList[i]._id);
        if ($scope.userList[i]._id == $scope.assignedUserIn) {userIndex = i; $scope.selectUser = $scope.userList[i]; console.log("found");}
        if (Task.task) if ($scope.userList[i]._id == $scope.task.assignedUser) {$scope.origUser = $scope.userList[i]; console.log("foundorig");}
      }
      $scope.option = $scope.userList[userIndex].name;
    });
  });
      
  $scope.$watch('selectUser',function(){
      if (typeof $scope.selectUser !='undefined'){
          if(typeof $scope.selectUser !='object') {$scope.selectUser = JSON.parse($scope.selectUser);}
          //console.log($scope.selectUser);
          $scope.option = $scope.selectUser.name;
          $scope.assignedUserIn = $scope.selectUser._id;
          $scope.assignedUserNn = $scope.selectUser._id;
      }
  })
    
  //----------
    
  $scope.edit = function(task){
    var update =    'name='+$scope.nameIn+
                    '&deadline='+$scope.deadlineIn+
                    '&description='+$scope.descriptionIn+
                    '&assignedUser='+$scope.assignedUserIn+
                    '&completed='+$scope.completedIn;
      
      Task.edit(task._id,update).success(function(data){
        alert(data.message);
        Task.getByID(task._id).success(function(data){
            Task.task = data.data;
            $location.path("/taskdetail");
        });
      
      console.log("Hererid");
      if ($scope.origUser) {
        var taskArray = $scope.origUser.pendingTasks;
        taskArray.splice(taskArray.indexOf(data.data._id), 1);
        console.log(taskArray);
        var assignment = '';
        for (var i = 0; i < taskArray.length; i++) {
            assignment = assignment+'pendingTasks[]='+taskArray[i];
            if (i != taskArray.length-1) assignment = assignment+'&'
        }
        //console.log(assignment);
        Task.assignToUser($scope.assignedUserNn,assignment);
      }
      
        //console.log("Hereadd");
        var taskArray = $scope.selectUser.pendingTasks;
        taskArray.splice(0, 0, data.data._id);
        //console.log(taskArray);
        var assignment = '';
        for (var i = 0; i < taskArray.length; i++) {
            assignment = assignment+'pendingTasks[]='+taskArray[i];
            if (i != taskArray.length-1) assignment = assignment+'&'
        }
        console.log(assignment);
        Task.assignToUser($scope.assignedUserNn,assignment);
        
        //$location.path("/taskdetail");
    });
  };
    
  $scope.add = function(task){
    var info =      'name='+$scope.nameNn+
                    '&deadline='+$scope.deadlineNn+
                    '&description='+$scope.descriptionNn+
                    '&assignedUser='+$scope.assignedUserNn+
                    '&completed='+$scope.completedNn;
      
    Task.post(info).success(function(data){
        alert(data.message);
        Task.getByID(data.data._id).success(function(data){
            Task.task = data.data;
            $location.path("/taskdetail");
        });
        console.log("Here");
        var taskArray = $scope.selectUser.pendingTasks;
        taskArray.splice(0, 0, data.data._id);
        console.log(taskArray);
        var assignment = '';
        for (var i = 0; i < taskArray.length; i++) {
            assignment = assignment+'pendingTasks[]='+taskArray[i];
            if (i != taskArray.length-1) assignment = assignment+'&'
        }
        console.log(assignment);
        Task.assignToUser($scope.assignedUserNn,assignment);
        //$location.path("/taskdetail");
    });
  };
    
    
    
  /*$scope.userList = User.users;
    console.log("xx");
    console.log($scope.userList);
  $scope.$watch('task',function(){
        $scope.userList = User.users;
          console.log(User.users);
      console.log("xx");
  });*/
                            
  /*$scope.$watch('[assignedUserIn]',function(){
      console.log($scope.userList[0]._id);
      for (var i = 0; i < $scope.userList.length; i++) {
          console.log($scope.userList[i]._id);
        if ($scope.userList[i]._id == $scope.assignedUserIn) {userIndex = i; console.log("found");}
      }
      $scope.option = $scope.userList[userIndex];
  });*/
      

}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);


