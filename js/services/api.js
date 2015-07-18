
angular.module('angularApp.factories')
    .factory('api', ['$http', function apiFactory($http) {
        "use strict";
        var root = "http://whenwillyoulose.com:1337/wwylApi/";
        //root = "http://localhost:1337/wwylApi/";
        function Api() {}
        Api.prototype.addScore = function(userId, score, map){
            return $http.post(root+'scores', {score: score, user: userId, map:map});
        };
        Api.prototype.getScores = function(map){
            return $http.get(root+'scores/'+map);
        };
        Api.prototype.resetPassword = function resetPassword(id){
            return $http.get(root+'user/reset/'+id);
        };

        Api.prototype.updateUser = function(id, hash, data, name, password, email){
            if(!password){
                password = null;
            }
            if(id < 0){
                throw "not registered";
            }
            return $http.put(root+'users/'+id+'/'+hash,{data: data, name: name, password: password, email:email});
        };
        Api.prototype.createUser = function(name, password){
            return $http.post(root+'users', {userName: name, password: password});
        };
        Api.prototype.loadUser = function(name, password){
            return $http.post(root+'users/validate', {name: name, password: password});
        };
        Api.prototype.loadUserId = function(userId, hash){
            return $http.get(root+'users/'+userId+'/'+hash);
        };
        Api.prototype.loadExternalUser = function(userId){
            return $http.get(root+'users/'+userId);
        };
        return new Api();
    }]);
