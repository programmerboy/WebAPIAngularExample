(function () {
    "use strict";

    angular.module("sample")
    .factory("commonNgFunctionsCtrl", ["APP_SETTINGS", "$q", "$uibModal", commonNgFunctionsCtrl]);

    function commonNgFunctionsCtrl(APP_SETTINGS, $q, $uibModal, $scope) {

        var baseURL = $("base").attr("href");

        var openAlert = function (title, heading, body, cssClass) {
            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: baseURL + 'PartialViews/_ModalTemplate.html',
                controller: 'SimpleAlertCtrl',
                resolve: {
                    title: function () { return title; },
                    heading: function () { return heading; },
                    body: function () { return body; },
                    cssClass: function () { return cssClass; }
                }
            });

            modalInstance.result.then(function (objOrString) { deferred.resolve(objOrString); }, function (cancel) { deferred.reject(cancel); });

            return deferred.promise;
        };


        var openSimpleAlert = function (title, heading, body, cssClass) {
            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: baseURL + 'PartialViews/_ModalTemplateSimple.html',
                controller: function ($scope, $uibModalInstance, title, heading, body, cssClass) {
                    $scope.modalTitle = title;
                    $scope.modalHeading = heading;
                    $scope.modalBody = body;
                    $scope.cssClass = cssClass;
                    $scope.ok = function () { $uibModalInstance.close('close'); };
                },
                resolve: {
                    title: function () { return title; },
                    heading: function () { return heading; },
                    body: function () { return body; },
                    cssClass: function () { return cssClass; }
                }
            });

            modalInstance.result.then(function (objOrString) { deferred.resolve(objOrString); });

            return deferred.promise;
        };

        var openErrorAlert = function (title, heading, body, cssClass) {
            var deferred = $q.defer();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: baseURL + 'PartialViews/_ModalTemplateSimple.html',
                controller: function ($scope, $uibModalInstance, title, heading, body, cssClass) {
                    $scope.modalTitle = title ? title : "ERROR";
                    $scope.modalHeading = heading ? heading : "An Error occured during processing of this request.";
                    $scope.modalBody = body ? body : "Please try again. If this happens again then you can contact Help Desk for further assistance.";
                    $scope.cssClass = cssClass ? cssClass : "alert alert-danger bold-text";
                    $scope.ok = function () { $uibModalInstance.close('close'); };
                },
                resolve: {
                    title: function () { return title; },
                    heading: function () { return heading; },
                    body: function () { return body; },
                    cssClass: function () { return cssClass; }
                }
            });

            modalInstance.result.then(function (objOrString) { deferred.resolve(objOrString); });

            return deferred.promise;
        };

        var openImageModal = function (src, alt) {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: baseURL + 'PartialViews/_ModalImage.html',
                controller: function ($scope, $uibModalInstance, link, alt) {
                    $scope.imageLink = link;
                    $scope.alt = alt;
                    $scope.ok = function () { $uibModalInstance.close('close'); };
                },
                resolve: {
                    link: function () { return src; },
                    alt: function () { return alt; },
                }
            });
        };

        return {
            openAlert: openAlert,
            openSimpleAlert: openSimpleAlert,
            openErrorAlert: openErrorAlert,
            openImageModal: openImageModal
        }
    }

    // Modal Controller
    angular.module('sample').controller('SimpleAlertCtrl', function ($scope, $uibModalInstance, title, heading, body, cssClass) {
        $scope.modalTitle = title;
        $scope.modalHeading = heading;
        $scope.modalBody = body;
        $scope.cssClass = cssClass;
        $scope.ok = function () { $uibModalInstance.close('close'); };
        $scope.cancel = function () { $uibModalInstance.dismiss('dismiss'); };
    });

}());