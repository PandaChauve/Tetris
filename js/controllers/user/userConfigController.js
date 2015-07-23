angular.module('angularApp.controllers')
.controller('UserConfigCtrl', ['$scope', '$http', '$timeout', 'userAccount', 'storage','achievements',
        function ($scope, $http, $timeout, userAccount, storage, achievements) {
            "use strict";

            $scope.cubeType = storage.get(storage.Keys.CubeTheme) || 0;
            $scope.selectedCss = storage.get(storage.Keys.WebTheme) || "Slate";

            $scope.themes = [
                {
                    Picture: "./resources/imgs/themes/plain.png",
                    Name: "Plain cubes",
                    Require : -1
                }, {
                    Picture: "./resources/imgs/themes/fancy.png",
                    Name: "Fancy cubes",
                    Require : achievements.List.Beginner
                }, {
                    Picture: "resources/imgs/themes/mines.png",
                    Name: "Mines",
                    Require : achievements.List.Nostalgic
                }, {
                    Picture: "resources/imgs/themes/candy.png",
                    Name: "Candy",
                    Require : achievements.List.RetroGamer
                }
                , {
                    Picture: "resources/imgs/themes/candyhd.png",
                    Name: "Candy HD",
                    Require : achievements.List.Sherlock
                }
                , {
                    Picture: "resources/imgs/themes/smash.png",
                    Name: "Smash bros",
                    Require : achievements.List.Flash
                }
                , {
                    Picture: "resources/imgs/themes/light.png",
                    Name: "Lights",
                    Require : achievements.List.Pacman
                }
                , {
                    Picture: "resources/imgs/themes/thirsty.png",
                    Name: "Thirsty",
                    Require : achievements.List.BiggerIsBetter
                }
                , {
                    Picture: "resources/imgs/themes/cup.png",
                    Name: "Cup",
                    Require : achievements.List.God
                }
            ];
            

            $scope.requireStatus = function(key){
                if(key === -1)
                    return true;
                return achievements.isWon(key);
            };

            $scope.updateStyle = function (integer) {
                if($scope.requireStatus($scope.themes[integer].Require)){
                    $scope.cubeType = integer;
                    storage.set(storage.Keys.CubeTheme, $scope.cubeType);
                }
            };

            var themes = [
                "Cerulean",
                "Cosmo",
                "Cyborg",
                "Darkly",
                "Flatly",
                "Journal",
                "Lumen",
                "Paper",
                "Readable",
                "Sandstone",
                "Simplex",
                "Slate",
                "Spacelab",
                "Superhero",
                "United",
                "Yeti"
            ];
            $scope.cssThemes = [$scope.selectedCss];
            for(var i =0; i < themes.length; i+= 1){
                if(themes[i] != $scope.cssThemes[0]){
                    $scope.cssThemes.push(themes[i]);
                }
            }

            $scope.requireText = function(key){
                if(!$scope.requireStatus(key)){
                    return "Unlocked by success : "+ achievements.List.getName(key);
                }
                return "";
            };
            

            $scope.loadStyle = function (style) {
                userAccount.setTheme(style);
            };
            $timeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 0);

            var defaultColor = [0x000080,0x005000, 0x404040, 0x601010, 0x9c3e03, 0x281a42];
            $scope.resetColors = function(data){
                var array = data || storage.get(storage.Keys.HexKeyColors) || defaultColor;
                for(var i = 0; i < 6; ++i){
                    $("#picker_"+i).spectrum({
                        color: '#'+('000000'+ array[i].toString(16)).slice(-6),
                        flat: false,
                        showInput: false,
                        showAlpha: false,
                        showButtons: false
                    });
                }

            };
		
            $scope.saveColors = function(){
                var colors = [];
                for(var i = 0; i < 6; ++i){
                    colors.push(parseInt($("#picker_"+i).spectrum("get").toHex(), 16));
                }
                storage.set(storage.Keys.HexKeyColors, colors);
                $scope.resetColors();
            };
            $scope.defaultColors = function(){
                $scope.resetColors(defaultColor );
                $scope.saveColors();
            };
            $scope.resetColors(null);

        }]);
