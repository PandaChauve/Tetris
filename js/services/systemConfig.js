
angular.module('angularApp.factories')
    .factory('systemConfig', ['storage', function systemConfigFactory(storage) {
        "use strict";

	function SystemConfig(){};
        return new SystemConfig();
    }]);
