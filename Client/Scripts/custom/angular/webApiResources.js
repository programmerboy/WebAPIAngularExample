(function () {
    "use strict";

    angular.module("sample")
    .factory("webApiResources", ["$resource", "APP_SETTINGS", webApiResources]);

    function webApiResources($resource, APP_SETTINGS) {
        var customHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
        var customHeaders2 = { 'Content-Type': 'application/x-www-form-urlencoded', 'APIKEY': $("#apikey").val() };

        var actions = {
            'save': { method: 'POST', headers: customHeaders },
            'update': { method: 'PUT', headers: customHeaders },
            'remove': { method: 'DELETE', headers: customHeaders },
            'query': { method: 'GET', isArray: true /*, withCredentials: true */ },
            'get': { method: 'GET', /*, withCredentials: true */ }
        }

        var actions2 = {
            'save': { method: 'POST', headers: customHeaders2 },
            'update': { method: 'PUT', headers: customHeaders },
            'remove': { method: 'DELETE', headers: customHeaders2 }
        }

        return {
            student: $resource(APP_SETTINGS.WEB_API_PATH + "Student/:id", null, actions)
            //,simpleMasjid: $resource(APP_SETTINGS.WEB_API_PATH + "Masjids/:id", null, actions)
        }
    }//End of resourceReg
}());