//Angular Controller
(function () {
    'use strict';

    angular.module('sample')
    .controller('addEditStudentCtrl', ["$scope", /*"$http",*/ "webApiResources", "commonFunctions", "commonNgFunctionsCtrl", "$routeParams", "APP_SETTINGS", addEditStudentCtrl])

    /** @ngInject */
    function addEditStudentCtrl($scope, /*$http,*/ webApiResources, commonFunctions, commonNgFunctionsCtrl, $routeParams, APP_SETTINGS) {

        var DEVICE_TYPE = getDeviceType();
        var baseURL = $("base").attr("href");
        var apiPath = APP_SETTINGS.WEB_API_PATH + "Student/"
        var resourceType = webApiResources.student;

        var vm = this;

        vm.isProcessing = false;

        vm.pageNumber = $routeParams.pageNumber;

        vm.getStudentInfo = function () {

            resourceType.get({ id: $routeParams.studentId },
            function (response) {
                vm.isProcessing = false;
                vm.student = response;

                vm.originalStudent = angular.copy(vm.student);

                if (vm.student && vm.student.id) {
                    vm.title = "Edit: " + vm.student.firstName + " " + vm.student.lastName;
                    vm.btnText = "Update";
                }
                else {
                    vm.title = "New Student";
                    vm.btnText = "Add New";
                }

            }, displayError);
        };

        // Serializing the data is IMPORTANT for webApi resource, otherwise request will return an error
        // POST without serializing : $http.post("/TempMasjid/Edit", vm.student).then(function (response) { alert(JSON.stringify(data)); }, function (error) { vm.errorMessage = error; });;
        vm.process = function () {
            vm.isProcessing = true;
            if (vm.student.id) {
                resourceType.update({ id: vm.student.id }, commonFunctions.serializeData(vm.student), function (data) {
                    vm.message = "....Update Complete for " + vm.student.firstName + " " + vm.student.lastName;
                    vm.isProcessing = false;
                    $scope.addEditStudentForm.$setPristine();
                }, displayError);
            }
            else {
                resourceType.save(commonFunctions.serializeData(vm.student), function (data) {
                    vm.message = "....New Student Added " + vm.student.firstName + " " + vm.student.lastName;
                    vm.isProcessing = false;
                    vm.newAdded = true;
                }, displayError);
            }
        };

        //vm.update = function () {
        //    var httpRequest = commonFunctions.getRequestObject("PUT", apiPath + vm.student.id, vm.student);
        //    $http(httpRequest).then(function (response) {
        //        vm.message = "....Update Complete for " + vm.student.firstName + " " + vm.student.lastName;
        //        vm.isProcessing = false;
        //    }, displayError);
        //}

        // Reset the Form
        vm.reset = function () {
            vm.student = angular.copy(vm.originalStudent);
            $scope.addEditStudentForm.$setPristine();
            vm.message = "";
            vm.errorMessage = '';
            vm.newAdded = false;
        };

        vm.closeAlert = function () {
            vm.message = "";
            vm.errorMessage = "";
        };


        function displayError(error) {
            vm.errorMessage = commonFunctions.displayError(error);
            vm.isProcessing = false;
        }

        function resetForProcessing(selector) {
            vm.errorMessage = "";
            vm.isProcessing = true;

            if (selector) selector.prepend($("#loading-icon"));
        }

        vm.getStudentInfo();

    }//END of Controller Function
}());