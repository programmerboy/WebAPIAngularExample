//Angular Module
(function () {
    'use strict';

    var app = angular.module("sample");

    //This directive was specially written for File Upload change event
    app.directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
            }
        };
    });

    //https://stackoverflow.com/questions/33680239/angularjs-pdf-viewer-not-working-in-ie/33725436#33725436
    app.directive('objectReloadable', function () {
        var link = function (scope, element, attrs) {
            var currentElement = element;
            var currentAttributes = attrs;

            scope.$watch('documentSrc', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    scope.documentSrc = newValue;
                    var height = currentAttributes.height;
                    var width = currentAttributes.width;
                    var html = '<object type="application/pdf" data="' + newValue + '" width="' + width + '" height="' + height + '"></object>';
                    //var replacementElement = angular.element(html);
                    //currentElement.replaceWith(replacementElement);
                    //currentElement = replacementElement;
                    currentElement.html(html);
                }
            });
        };

        return {
            restrict: 'E',
            scope: false,
            link: link
        };
    });

    //Checking integer values
    var INTEGER_REGEXP = /^\-?\d+$/;
    app.directive('integer', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.integer = function (modelValue, viewValue) {
                    // consider empty models to be valid
                    if (ctrl.$isEmpty(modelValue)) { return true; }
                    if (INTEGER_REGEXP.test(viewValue)) { return true; }
                    else { return false; }
                };
            }
        };
    });

    //Checking decimal values
    var DECIMAL_REGEXP = /^\-?\d{1,3}\.\d+$/;
    app.directive('decimal', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.decimal = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) { return true; }
                    else if (DECIMAL_REGEXP.test(viewValue)) { return true; }
                    else { return false; }
                };
            }
        };
    });

    //Checking decimal values
    var DECIMAL_REGEXP = /^\-?\d{1,3}\.\d+$/;
    app.directive('decimal', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.decimal = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) { return true; }
                    else if (DECIMAL_REGEXP.test(viewValue)) { return true; }
                    else { return false; }
                };
            }
        };
    });

    //Checking decimal values
    var PHONE_REGEXP = /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/;
    app.directive('phoneNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.phoneNumber = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) { return true; }
                    else if (PHONE_REGEXP.test(viewValue)) { return true; }
                    else { return false; }
                };
            }
        };
    });

    // If you want to make sure specific domain is entered in URL field
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@example\.com$/i;
    app.directive('overwriteEmail', function () {
        return {
            require: 'ngModel',
            restrict: '',
            link: function (scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });

    // Overwrite the URL validator.
    var URL_REGEXP = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$/i;
    app.directive('overwriteUrl', function () {
        return {
            require: 'ngModel',
            restrict: '',
            link: function (scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the url validator
                if (ctrl && ctrl.$validators.url) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.url = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || URL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });

    //This directive will allow to enter numbers only. Only allows numbers
    //without decimal point. Allows negative numbers. Works with and without ng-model
    app.directive('numbersOnly', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                //If ng-model is present
                if (modelCtrl) {
                    modelCtrl.$parsers.push(function (inputValue) {
                        var transformedInput = inputValue ? inputValue.replace(/[^\d-]/g, '') : "";

                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        return transformedInput;
                    });
                }
                else {
                    element.bind('keypress', function (event) {

                        var keychar = String.fromCharCode(event.keyCode)
                        var numcheck = /[\d-]/;
                        if (!numcheck.test(keychar)) { event.preventDefault(); }

                    });
                }//End of else
            }
        };
    });


    //This directive will allow to enter numbers only including decimal point.
    //Allows negative numbers. Works with and without ng-model
    app.directive('decimalOnly', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                //If ng-model is present
                if (modelCtrl) {
                    modelCtrl.$parsers.push(function (inputValue) {
                        var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g, '') : "";

                        if (transformedInput != inputValue) {
                            modelCtrl.$setViewValue(transformedInput);
                            modelCtrl.$render();
                        }

                        return transformedInput;
                    });
                }
                else {
                    element.bind('keypress', function (event) {

                        var keychar = String.fromCharCode(event.keyCode)
                        var numcheck = /[\d-.]/;
                        if (!numcheck.test(keychar)) { event.preventDefault(); }

                    });
                }//End of else
            }
        };
    });

    //Custom Auto Complete Directive
    app.directive("myAutoComplete", ['APP_SETTINGS', function (APP_SETTINGS) {
        return {
            restrict: "A",
            require: 'ngModel', // require ngModel controller
            scope: { /*AutoCompleteOptions: "=autoCompleteOptions"*/ },
            link: function (scope, element, attrs, ngModelCtrl) {

                // prevent html5/browser auto completion
                attrs.$set('autocomplete', 'off');
                var myData = {};

                element.autocomplete({
                    minLength: 1,
                    delay: 500,
                    source: function (request, response) {

                        // Ignore if input only contains spaces
                        if ($.trim(request.term) === "") {
                            return;
                        }

                        myData.term = request.term;

                        if (attrs.autocompleteDependent) {
                            var dependentProperty = attrs.autocompleteDependent;
                            myData[dependentProperty] = $("#" + dependentProperty).val();
                        }

                        $.ajax({
                            url: APP_SETTINGS.WEB_API_PATH + attrs.autocompleteUrl,
                            dataType: "json",
                            data: myData,
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (data) {
                                response(data);
                            }
                        });
                    },
                    select: function (event, ui) {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(ui.item.value); /*var value = ui.item.value; //var label = ui.item.label;*/
                        });
                    }

                });
            }
        };
    }]);

    //http://stackoverflow.com/questions/13471129/ng-repeat-finish-event
    var width, height, maxHeight = 0, maxWidth = 0, total = 0;
    app.directive('myRepeatDirective', function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs, ngModelCtrl) {
                if (scope.$first) { width = 0; maxWidth = 0; maxHeight = 0; total = 0; }

                width = element.width();
                height = element.height();
                total++;

                if (width > maxWidth) { maxWidth = width; }
                if (height > maxHeight) { maxHeight = height; }
                if (scope.$last) { scope.$emit('LastElem'); }
            }
        };
    });

    //This directives bind an event type when ng-repeat has finished looping
    app.directive('myMainDirective', function () {
        return function (scope, element, attrs) {
            scope.$on('LastElem', function (event) {
                //$(element).children().css('width', maxWidth + 'px');

                var eventHandler = scope.$eval(attrs.eventHandler);
                var eventType = attrs.eventType;
                var selector = attrs.selector;

                $(selector).bind(eventType, eventHandler);
            });
        };
    });

    ///////////////////////////////////////////////////////////
    ///////////////////////END OF IIFE/////////////////////////
    ///////////////////////////////////////////////////////////

}());