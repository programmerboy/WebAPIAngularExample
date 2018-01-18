//Angular Controller
(function () {
    'use strict';

    angular.module('sample')
        .filter('startFrom', function () {
            return function (input, start) {
                if (input) {
                    start = +start;
                    return input.slice(start);
                }
                return [];
            };
        })
    .controller('studentsListCtrl', ["$scope", "filterFilter", "$http", "webApiResources", "commonFunctions", "commonNgFunctionsCtrl", "$routeParams", "APP_SETTINGS", studentsListCtrl])

    /** @ngInject */
    function studentsListCtrl($scope, filterFilter, $http, webApiResources, commonFunctions, commonNgFunctionsCtrl, $routeParams, APP_SETTINGS) {

        var DEVICE_TYPE = getDeviceType();
        var apiURL = APP_SETTINGS.WEB_API_PATH;
        var baseURL = $("base").attr("href");
        var resourceType = webApiResources.student;

        var vm = this;

        vm.filteredList = [];
        vm.masterList = [];
        vm.isProcessing = false;

        vm.pageOptions = [3, 5, 10, 15, 20, 25];
        vm.itemsPerPage = vm.pageOptions[0];
        vm.pagination = {};

        vm.openSimpleModal = function () {
            commonNgFunctionsCtrl.openSimpleAlert("Created", "New Feature is successfully created", "You may continue to update additional properties", "alert alert-info");
        };

        vm.refreshData = function (e) {
            vm.isProcessing = true;

            //var httpRequest = commonFunctions.getRequestObject("GET", apiURL + "Student");
            //$http(httpRequest).then(
            var filter = { $filter: "endswith(tolower(trim(City)), 'brampton')" };
            filter = {};
            resourceType.query(filter,
                function successCallback(response) {
                    vm.filterBy = "";
                    vm.masterList = response;
                    reloadPaging();
                }, displayError);
        }

        vm.removeStudent = function (e, id) {
            var student = commonFunctions.searchByPropertyObject("id", vm.filteredList, id);

            commonNgFunctionsCtrl.openAlert("ALERT", "Delete Student", "Are you sure you want to delete Student? " + student.firstName + " " + student.lastName, "alert alert-danger bold-text").then(function () {

                //If confirmation is received then call the Delete method using Angular Resource
                resourceType.remove({ id: id }, function (data) {
                    commonFunctions.removeObject(vm.masterList, student, "id");
                    reloadPaging();
                }, displayError);

            });
        }

        $scope.$watchGroup(['vm.itemsPerPage'], reloadPaging);


        // $watch search to update pagination
        $scope.$watch('vm.filterBy', function (newVal, oldVal) {
            if (angular.isDefined(vm.filterBy))
                reloadPaging(newVal);
        }, true);

        function reloadPaging() {
            vm.pagination.entryLimit = vm.itemsPerPage; // items per page
            vm.filteredList = vm.filterBy ? filterFilter(vm.masterList, vm.filterBy) : vm.masterList.slice(0, vm.pagination.entryLimit);
            vm.pagination.totalItems = vm.filterBy ? vm.filteredList.length : vm.masterList.length;
            vm.pagination.noOfPages = Math.ceil(vm.pagination.totalItems / vm.pagination.entryLimit);

            if (!vm.pagination.noOfPages)
                vm.pagination.currentPage = 0;
            else if (vm.pagination.noOfPages && !vm.pagination.currentPage)
                vm.pagination.currentPage = 1;

            if ($routeParams.pageNumber && !vm.alreadyAssigned) {
                vm.pagination.currentPage = $routeParams.pageNumber;
                vm.alreadyAssigned = true;
            }

            vm.isProcessing = false;
        }

        vm.closeAlert = function () {
            vm.message = "";
            vm.errorMessage = "";
        };

        function initialize() {
            vm.refreshData();
        }

        function displayError(error) {
            vm.errorMessage = commonFunctions.displayError(error);
            vm.isProcessing = false;
        }

        function resetForProcessing(selector) {
            vm.errorMessage = "";
            vm.isProcessing = true;

            if (selector) selector.prepend($("#loading-icon"));
        }

        initialize();

    }//END of Controller Function
}());