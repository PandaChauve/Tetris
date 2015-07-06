angular.module('angularApp.factories')
    .factory('helpers', ['TIC_PER_SEC', 'SEC_PER_MIN', function helpersFactory(TIC_PER_SEC, SEC_PER_MIN) {
        "use strict";
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i += 1) {
                var pair = vars[i].split("=");
                if (pair[0] === variable) {
                    return pair[1];
                }
            }
            return "";
        }

        function timeFromTics(totaTics) {
            if(isNaN(totaTics))
            {
                return "";
            }
            var totalSec = Math.floor(totaTics / TIC_PER_SEC);
            var minutes = Math.floor(totalSec / SEC_PER_MIN);
            var seconds = totalSec % SEC_PER_MIN;
            var tics = Math.floor((totaTics % TIC_PER_SEC ) / (TIC_PER_SEC/10));
            return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) + "." + tics;
        }

        return {
            timeFromTics : timeFromTics,
            getQueryVariable : getQueryVariable
        };
    }]);
