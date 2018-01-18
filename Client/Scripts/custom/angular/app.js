//Angular Module
(function () {
    'use strict';

    var _origin = "";

    //A fix for window.location.origin in Internet Explorer 11 as [window.location.origin] is not working in installed version of IE 11
    if (!window.location.origin) {
        _origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
    else { _origin = window.location.origin; }


    var app = angular
        .module('sample', [
            "ui.router"
            , "ngRoute"
            //, "ngAnimate"
            , "ngSanitize"
            //, "ngCookies"
            , "ngResource"
            , "ui.bootstrap"
        ])
        .constant("APP_SETTINGS", {
            WEB_API_PATH: "http://localhost:61936/api/",
            IGNORE_MSGS: ["backdrop click", "DISMISSED", "dismiss", "cancel", "escape key press"]
        });


    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
        .when('/students/:pageNumber?', { templateUrl: '/PartialViews/Student/studentslist.html' })
        .when('/student/:studentId/:pageNumber?', { templateUrl: '/PartialViews/Student/addEditStudent.html' })
        .otherwise({ templateUrl: "/PartialViews/Student/welcome.html" });

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true).hashPrefix('!');
    });

    /*app.config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        var baseSiteUrlPath = $("base").first().attr("href");
        var baseTemplateUrl = baseSiteUrlPath + "PartialViews/";
        //If you are assigning a controller below then you MUST not define in template. For e.g. dont do <div ng-ctrl='sample1Ctrl as vm'>
        //Otherwise you would notice that initialization takes place twice
        $stateProvider
                    .state("state1", { url: "/state1", templateUrl: baseTemplateUrl + "/Sample1.html", controller: "sample1Ctrl as vm" })
                    .state("state2", { url: "/state2/:clid", templateUrl: baseTemplateUrl + "/Sample2.html", controller: "sample2Ctrl as vm" })
                    .state("state3", { url: "/state3/:clid", templateUrl: baseTemplateUrl + "/Sample3.html", controller: "sample3Ctrl as vm" })
        $urlRouterProvider.otherwise("state1");  //End of $routeProvider
    }]);//End of Function
    */


}());