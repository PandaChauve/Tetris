//load css before angular things first
var css = localStorage.getItem("dynamic_css_content");
if (css) {
    document.getElementById("switchableTheme").innerHTML = css;
    var element = document.getElementById("switchableThemeCss");
    element.parentNode.removeChild(element);
}

angular.module('angularApp.base', ['cgNotify']);
angular.module('angularApp.factories', ['angularApp.base']);
angular.module('angularApp.controllers', ['ui.bootstrap', 'angularApp.factories']);
angular.module('angularApp.directives', ['ngTouch', 'angularApp.base', 'angularApp.factories']);
var fack = "FACK";
var angularApp = angular.module('angularApp', [
    'ngRoute',
    'angularApp.base',
    'angularApp.factories',
    'angularApp.controllers',
    'angularApp.directives'
]);
angularApp.config(['$compileProvider', function ($compileProvider) {
    "use strict";
    $compileProvider.debugInfoEnabled(false);
}]);


angularApp.filter('ticToTime', ['helpers', function (helpers) {
    "use strict";
    return helpers.timeFromTics;
}]);

angularApp.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/scores/', {
                    templateUrl: 'resources/templates/scores.html',
                    controller: 'ScoresCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/achievements/', {
                    templateUrl: 'resources/templates/user/achievements.html',
                    controller: 'AchievementsCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/achievements/:userName', {
                    templateUrl: 'resources/templates/user/achievements.html',
                    controller: 'AchievementsCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/rules/', {
                    templateUrl: 'resources/templates/rules.html',
                    controller: 'RulesCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/game/:hash/', {
                    templateUrl: 'resources/templates/game.html',
                    controller: 'GameCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/', {
                    templateUrl: 'resources/templates/campaign.html',
                    controller: 'GenericCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/:campaignName/', {
                    templateUrl: 'resources/templates/campaign.html',
                    controller: 'GenericCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/:campaignName/:subCampaignId/', {
                    templateUrl: 'resources/templates/campaign.html',
                    controller: 'GenericCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/tetrisCampaign/', {
                    templateUrl: 'resources/templates/tetrisCampaign.html',
                    controller: 'tetrisCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/stats/', {
                    templateUrl: 'resources/templates/user/stats.html',
                    controller: 'StatCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/stats/:userName/', {
                    templateUrl: 'resources/templates/user/stats.html',
                    controller: 'StatCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/user/account/', {
                    templateUrl: 'resources/templates/user/account.html',
                    controller: 'UserAccountCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/user/style/', {
                    templateUrl: 'resources/templates/user/style.html',
                    controller: 'UserConfigCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/machine/config/', {
                    templateUrl: 'resources/templates/user/config.html',
                    controller: 'ComputerConfigCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/about/', {
                    templateUrl: 'resources/templates/about.html',
                    controller: 'AboutCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/user/recovery/', {
                    templateUrl: 'resources/templates/user/passwordRecovery.html',
                    controller: 'PasswordRecoveryCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/newpassword/', {
                    templateUrl: 'resources/templates/user/newpassword.html',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/devices/', {
                    templateUrl: 'resources/templates/devices.html',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/', {
                    templateUrl: 'resources/templates/index.html',
                    controller: 'IndexCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                });

            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        }]
);

angularApp.run(['notify', function (notify) {
    "use strict";
    notify.config({
        templateUrl: "resources/templates/notification.html",
        duration: 5000
    });
}]);
