// js/services/todos.js
angular.module('demoServices', [])
    .factory('CommonData', function(){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;
            }
        }
    })
    .factory('Llamas', function($http, $window) {
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/llamas');
            }
        }
    })
    .factory('Login', function($http, $window) {
        var factory = {};
        var baseUrl = "http://localhost:4000";
            factory.post = function(email,password) {
                return $http({
                    method: 'POST',
                    url: 'http://localhost:4000/api/login',
                    data: "email=" + email + "&password="+password,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        return factory;
    })
    .factory('Users', function($http, $window) {
        var factory = {};
        var baseUrl = "http://localhost:4000";
            factory.get = function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/users');
            }
            factory.delete = function(id) {
                return $http.delete(baseUrl+'/api/users'+'/'+id);
            }
            factory.post = function(username,email,password) {
                return $http({
                    method: 'POST',
                    url: baseUrl+'/api/users',
                    data: "name=" + username+ "&email=" + email + "&password=" + password,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        return factory;
    })
    .factory('Ports', function($http, $window) {
        var factory = {};
        var baseUrl = "http://localhost:4000";
            factory.get = function() {
                //var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/ports');
            }
            factory.delete = function(id) {
                return $http.delete(baseUrl+'/api/ports'+'/'+id);
            }
            factory.post = function(name,email) {
                return $http({
                    method: 'POST',
                    url: baseUrl+'/api/ports',
                    data: "name=" + name + "&email="+email,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
            factory.ports;
            factory.list;
            factory.curStock;
        return factory;
    })
    .factory('User',function($http,$window){
        var factory = {};
        var baseUrl = $window.sessionStorage.baseurl;
            factory.user;
            factory.users;
            factory.edit = function(id,update){
                console.log(update);
            return $http.put(baseUrl+'/api/users/'+id,update);
            }
            factory.getByID = function(id){
                //console.log(update);
            return $http.get(baseUrl+'/api/users/'+id);
            }
            return factory;
    })
    .factory('Tasks', function($http, $window) {
        var factory = {};
        var baseUrl = "localhost:4000";
        //return {
            factory.get = function(begin,num,sortby,showComplete,order) {
                return $http.get(baseUrl+'/api/tasks'+'?where={'+showComplete+'}&sort={'+sortby+order+'}&skip='+begin+'&limit='+num);
            }
            factory.getByID = function(id) {
                return $http.get(baseUrl+'/api/tasks'+'/'+id);
            }
            factory.count = function() {
                return $http.get(baseUrl+'/api/tasks'+'?count');
            }
            factory.delete = function(id) {
                return $http.delete(baseUrl+'/api/tasks'+'/'+id);
            }
        //}
        return factory;
    })
    .factory('Task',function($http,$window){
        var factory = {};
        var baseUrl = $window.sessionStorage.baseurl;
            factory.task;
            factory.edit = function(id,update){
                return $http({
                    method: 'PUT',
                    url: baseUrl+'/api/tasks'+'/'+id,
                    data: update,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
            factory.post = function(info) {
                return $http({
                    method: 'POST',
                    url: baseUrl+'/api/tasks',
                    data: info,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
            factory.assignToUser = function(userID,taskAssignment) {
                return $http({
                    method: 'PUT',
                    url: baseUrl+'/api/users/'+userID,
                    data: taskAssignment,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
            factory.getByID = function(id) {
                return $http.get(baseUrl+'/api/tasks'+'/'+id);
            }
        return factory;
    })


    ;
