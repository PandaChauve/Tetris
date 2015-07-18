angular.module('angularApp.controllers')
    .controller('ScoresCtrl', ['$scope', '$http', '$timeout', 'userAccount', 'api', function ($scope, $http, $timeout, userAccount, api) {
        "use strict";
        var perPage = 15; //FIXME server side once there's more than 100 inputs !!!
        $scope.pagination = {
            current: 1,
            pages: [1],
            last: 1,
            paginate: function (page) {
                this.current = page;
                loadPage();
            }
        };

        function loadPage(){
            $scope.scoreGridData = scores.slice(($scope.pagination.current-1)*perPage, $scope.pagination.current*perPage);
        }

        function createPagination(){
            $scope.pagination.current = 1;
            if(scores.length <= perPage){
                $scope.pagination.pages = [1];
                $scope.pagination.last = 1;
            }
            else{
                var size = Math.ceil(scores.length / perPage);
                $scope.pagination.pages = [];
                for(var i = 0; i < size; i++){
                    $scope.pagination.pages.push(i+1);
                }
                $scope.pagination.last = size;
            }
            loadPage();
        }

        $scope.activate = function (type) {
            $scope.type = type;
            $scope.getScores(type);
        };
        $scope.isActive = function (viewLocation) {
            return viewLocation === $scope.type;
        };
        $scope.currentName = userAccount.username;
        $scope.isUser = function (n) {
            return n === $scope.currentName;
        };
        var scores;
        $scope.getScores = function (type) {
            api.getScores(type).success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].position = i + 1;
                }
                scores = data;
                createPagination();
            }).error(function (e) {
                console.log(e);
            });
        };
        $scope.scoreTypes = [
            {type: "classic", name: "Classic"},
            {type: "small", name: "Narrow"},
            {type: "ultralarge", name: "Wide"},
            {type: "sandbox", name: "Sandbox"}
        ];
        $scope.activate("classic");

    }]);
