
angular.module('angularApp.factories')
    .factory('api', ['$http', function apiFactory($http) {
        "use strict";
        var root = "http://whenwillyoulose.com:1337/wwylApi/";
        //root = "http://localhost:1337/wwylApi/";
        function Api() {}
        Api.prototype.addScore = function(userId, score, map, tics){
            var zfaCryptedScore = (score*17)+"_";//this crypt is stupid but since the code is public... just want the kiddies to lose 5 min
            var sum = 0;
            for(var i = 0; i < zfaCryptedScore.length -1; i++)
            {
                sum += +zfaCryptedScore.charAt(i);
            }
            zfaCryptedScore += sum;
            return $http.post(root+'scores', {score: zfaCryptedScore, user: userId, map:map, duration:tics});
        };
        Api.prototype.getScores = function(map){
            return $http.get(root+'scores/'+map);
        };
        Api.prototype.resetPassword = function resetPassword(id){
            return $http.get(root+'user/reset/'+id);
        };
        Api.prototype.getTheme = function(name){
            return $http.get("resources/bootswatch/"+name+".min.css",{
                cache: true
            });
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
        Api.prototype.loadExternalUser = function(userName){
            return $http.get(root+'users/'+userName);
        };
        return new Api();
    }]);
