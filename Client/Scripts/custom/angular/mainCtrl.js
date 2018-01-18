//Angular Controller
(function () {
    'use strict';

    angular.module('sample')
    .controller('mainCtrl', function ($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    });

}());