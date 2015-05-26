angular.module('angularApp.factories')
    .factory('storage', [function storageFactory() {
        "use strict";
        function UserStorage() {}

        UserStorage.prototype.get = function (key) {
            var val = localStorage.getItem(key);
            if (val === null || val === undefined) {
                return null;
            }

            try {
                return JSON.parse(val);
            }
            catch (e) {
                console.log(e);
            }
            return null;
        };

        UserStorage.prototype.set = function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        };
        return new UserStorage();
    }]);
