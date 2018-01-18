(function () {
    "use strict";

    angular.module("sample")
    .factory("commonFunctions", ["APP_SETTINGS", commonFunctions]);

    function commonFunctions(APP_SETTINGS) {

        var myList;
        var notToInclude = ["undefined", "rowCounter", "$$hashKey", "$promise", "$resolved", "$$state"];

        //Sets the Pagination for an Angular based grid
        function setPagination(list, itemsPerPage) {
            myList = list;
            var pagination = {
                currentPage: 1,
                itemsEachPage: itemsPerPage,
                totalItems: function () {
                    return (myList) ? myList.length : 0;
                },
                numPages: function () {
                    return (myList) ? Math.ceil(myList.length / itemsPerPage) : 0;
                }
            };
            return pagination;
        }

        //Adds request forgery token to the request
        function addRequestVerificationToken(data) {
            data.__RequestVerificationToken = $(":input:hidden[name=__RequestVerificationToken]").val();
            return serializeData(data);
        }

        // Serializes the data object and cleans it up for transportation.
        function serializeData(data) {

            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) { return ((data === null) ? "" : data.toString()); }

            var buffer = [], source;

            // Serialize each key in the object.
            for (var name in data) {
                if (!data.hasOwnProperty(name)) { continue; }

                buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((data[name] === null) ? "" : data[name]));
            }

            // Serialize the buffer and clean it up for transportation.
            source = buffer.join("&").replace(/%20/g, "+");
            return (source);
        }

        //Display Error Properly
        var displayError = function displayError(error) {
            if (APP_SETTINGS.IGNORE_MSGS.indexOf(error) > -1)
            { return null; }

            var strError = "";

            if (error.errors) { return error.errors; }
            if (!error.data) { return JSON.stringify(error); }
            if (error.statusText) { strError = error.statusText + "\n"; }
            if (error.data.message) { strError += error.data.message + "\n"; }
            if (error.data.exceptionMessage) { strError += error.data.exceptionMessage + "\n"; }
            if (error.data.modelState) { for (var key in error.data.modelState) { strError += error.data.modelState[key] + "\n"; } }

            return strError;
        };

        //Slices the array based on the startingIndex and howManyItems
        var sliceList = function (masterList, startingIndex, howManyItems) {
            return masterList.slice(startingIndex, howManyItems);
        };

        //Adds a rowCounter property to all the items of masterList
        var addCounter = function (masterList, startingIndex) {
            startingIndex = startingIndex || startingIndex === 0 ? startingIndex : 1
            for (var i = 0; i < masterList.length; i++) {
                masterList[i].rowCounter = startingIndex + i;
            }
            return masterList;
        };

        //Returns an array of all the Properties of an object
        var getPropNames = function (object) {
            var propNames = [];
            for (var name in object) {
                propNames.push(name);
            }
            return propNames;
        }

        //Returns items from array1 which are not present in array2 and array3,
        //based on the [prop]
        var getDistinctObjects3 = function (array1, array2, array3, prop) {
            var distinctArray = array1.filter(function (obj) {
                return array2.indexOf(obj[prop]) == -1 && array3.indexOf(obj[prop]) == -1;
            });
            return distinctArray;
        };

        //Returns the different items contaning same property which is present both in Array1 and Array2
        //If [array2] is empty or null then return [array1], otherwise filter the array for different items
        var getDistinctObjects2 = function (array1, array2, prop) {
            if (!array2 || array2.length === 0) { return array1; }
            var arrSingleProperty = getSinglePropertyArray(prop, array2);

            var distinctArray = array1.filter(function (obj) {
                return arrSingleProperty.indexOf(obj[prop]) == -1;
            });
            return distinctArray;
        };

        //Returns items from [array1] which are not present in [array2]
        var getDistinctObjects = function (array1, array2) {
            var distinctArray = array1.filter(function (n) {
                return array2.indexOf(n) == -1;
            });
            return distinctArray;
        };

        //Returns same items which are identical in both arrays
        var getSameObjects = function (array1, array2) {
            if (!array2 || array2.length === 0) { return []; }

            var sameArray = array1.filter(function (n) {
                return array2.indexOf(n) != -1;
            });
            return sameArray;
        };

        //Returns the same items contaning same property which is present both in Array1 and Array2
        //If [array2] is empty or null then return [array2], otherwise filter the array for same items
        var getSameObjects2 = function (array1, array2, prop) {
            if (!array2 || array2.length === 0) { return array2; }
            var arrSingleProperty = getSinglePropertyArray(prop, array2);

            var sameArray = array1.filter(function (obj) {
                return arrSingleProperty.indexOf(obj[prop]) != -1;
            });
            return sameArray;
        };

        //var searchByProperty = function (propName, myArray, searchTerm) {
        //    return myArray.filter(function (obj) { return obj[propName] === searchTerm; });
        //};

        //Returns an object containing a summary of what has been
        //added, removed, changed, same, newOnes etc.
        var getSummaryOfChanges = function (original, changed) {
            var removed = getDistinctObjects(original, changed);
            var same = getSameObjects(original, changed);
            var newOnes = getDistinctObjects(changed, same);

            return {
                original: original,
                changed: changed,
                removed: removed,
                same: same,
                newOnes: newOnes,
                TotalOriginal: original.length,
                TotalChanged: changed.length,
                TotalRemoved: removed.length,
                TotalSame: same.length,
                TotalNew: newOnes.length
            };
        };

        //Loop through the specified array and check if property [propName] with
        //specified value [propValue] exists. Returns true if found, otherwise false
        var doesPropWithValueExist = function (myArray, propName, propValue) {
            var found = false;
            var object = {};
            for (var i = 0; i < myArray.length; i++) {
                if (found) { break; }

                object = myArray[i];
                for (var prop in object) {
                    if (prop == propName && object[prop] == propValue) {
                        found = true; break;
                    }//End of If
                }//End of looping object properties
            }
            return found;
        };

        //This function iterates through an Array of Object and adds
        //the specified property value into single dimension array
        var getSinglePropertyArray = function (propToFind, myArray, isUnique) {
            var newArray = [];
            var object = {};
            var ctr = 0;

            if (!myArray || myArray.length == 0) { return []; }

            //If property doesn't exist then return the sameArray back
            if (getPropNames(myArray[0]).indexOf(propToFind) == -1) { return myArray; }

            for (var i = 0; i < myArray.length; i++) {
                object = myArray[i];

                for (var prop in object) {
                    if (prop == propToFind) {
                        newArray[ctr] = object[prop];
                        ctr++;
                    }
                }
            }//End of For loop

            if (isUnique) {
                newArray = newArray.filter(function (item, i, ar) { return ar.indexOf(item) === i; });
            }

            return newArray;
        };

        //This function iterates through an Array of Objects and creates
        //a new Array with the Properties specified in [propsToFind]
        var getSpecificPropertiesArray = function (propsToFind, myArray, isUnique) {
            var newArray = [];
            var object = {}, newObject = {};
            var ctr = 0;

            for (var i = 0; i < myArray.length; i++) {
                object = myArray[i];
                newObject = {};

                for (var prop in object) {
                    if (propsToFind.indexOf(prop) != -1) {
                        newObject[prop] = object[prop];
                    }
                }
                newArray[ctr] = newObject;
                ctr++;
            }

            return newArray;
        };

        //Loops through originalArray and stores each item of originalArray
        //as a property defined by 'prop' parameter in lookupObject. Since a javascript
        //object cannot have duplicate properties, duplicate items get overriden.
        //Once done then it loop through Properties (which are unique objects) of lookupObject and
        //adds them into newArray.
        var removeDuplicates = function (originalArray, prop) {
            var newArray = [];
            var lookupObject = {};

            for (var i = 0; i < originalArray.length; i++) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }

            for (i in lookupObject) { newArray.push(lookupObject[i]); }

            return newArray;
        };

        //Loops through originalArray and stores each non duplicate item in newArray.
        //For each iteration of originalArray it iterates through all items of newArray
        //and for each item of newArray it loops through the specified properties (in properties parameter).
        //if propsFound == totalProperties then it means that item is duplicate, and it skips adding that item.
        var removeDuplicates2 = function (originalArray, properties) {
            var newArray = [];
            var index = 0;
            var lookupObject = {};
            var totalProperties = properties.length;

            for (var i = 0; i < originalArray.length; i++) {
                var exists = false;

                for (var a = 0; a < newArray.length; a++) {
                    var propsFound = 0;
                    for (var b = 0; b < totalProperties; b++) {
                        if (originalArray[i][properties[b]] == newArray[a][properties[b]]) {
                            propsFound++;
                        }
                    }//End of for

                    //If there is a match then break the for loop
                    if (propsFound == totalProperties) {
                        exists = true;
                        break;
                    }
                }//End of New Array

                if (!exists) {
                    newArray[index] = originalArray[i];
                    index++;
                }
            }//End of originalArray

            return newArray;
        };

        //This function returns property value for only first occurence of the matched Item.
        var getPropertyValue = function (propName, myArray, searchTerm, propertyValueToReturn) {
            if (!myArray || myArray.length == 0) return null;
            if (!propertyValueToReturn) { propertyValueToReturn = propName; }

            var filteredArray = myArray.filter(function (obj) { return obj[propName] == searchTerm; });

            if (filteredArray && filteredArray.length > 0)
                return filteredArray[0][propertyValueToReturn];
            else
                null;
        }

        //This function returns only first occurence of the matched Item.
        //If you would like to return Objects then use [searchByProperty]
        var searchByPropertyObject = function (propName, myArray, searchTerm) {
            if (!myArray || myArray.length == 0 || !$.isArray(myArray)) return {};
            var data = {};
            var filteredArray = myArray.filter(function (obj) { return obj[propName] == searchTerm; });
            if (filteredArray && filteredArray.length > 0) data = filteredArray[0];
            return data;
        };

        //Searches the array for specified [propName] with [searchTerm]
        //and returns the filtered array with objects meeting the condition
        var searchByProperty = function (propName, myArray, searchTerm) {
            return myArray.filter(function (obj) { return obj[propName] === searchTerm; });
        };

        //Removes the first index of specified object from the array and returns the filtered array
        //Note that original array [myArray] will be changed. If you would like to have
        //original array intact then use filterArray.
        var remove = function removeObject(myArray, objectToRemove, propName) {
            var index = 0, found = false;

            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i][propName] == objectToRemove[propName]) { found = true; break; }
                index++;
            }

            if (found) { myArray.splice(index, 1); }
            return myArray;
        };

        //Filter Array to remove the specified objects which contain property [propName] with a value [propValue]
        var filterArray = function (myArray, propName, propValue) {
            if (!myArray) return [];
            return myArray.filter(function (obj) { return obj[propName] != propValue; });
        };

        var strMsg, isWritten = false;
        var stringfyObject = function stringfyObject(customObject) {
            var value;
            var data = customObject;
            strMsg = "";
            //Object.keys(customObject).forEach(function (key) { strMsg += key.toUpperCase() + ": " + customObject[key] + "\n"; });

            iterateUnSafe(data, 0, '', false);
            return strMsg;
        };

        //http://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
        //This function may cause infinite loop. Be careful where to use it.
        function iterateUnSafe(obj, level, stack, isChildProp) {
            isWritten = false;
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] == "object" && obj[property] !== null) {
                        level++;
                        iterateUnSafe(obj[property], level, stack + '.' + property, true);
                    } else {
                        if (isChildProp) {
                            strMsg += (!isWritten ? "[" + stack + "]\n" : "");
                            strMsg += getNumberOfCharacters("\t", level) + property + "=" + obj[property] + "\n";
                            level = !isWritten ? level + 1 : level;
                            isWritten = true;
                        } else {
                            strMsg += stack + '.' + property + "=" + obj[property] + "\n";
                            level = 0;
                        }
                    } //End of OuterElse
                } //End of if (obj.hasOwnProperty(property))
            } //End of For Loop
        } //End of iterateUnSafe()


        //Converts a simple array to an array of Objects. For e.g an array [1,2,3]
        //will be converted to [{keyName: 1, valueName: 1},{keyName: 1, valueName: 1},{keyName: 1, valueName: 1}]
        var convertToObjectArray = function (simpleArray, keyName, valueName) {
            var convertedArray = [];

            for (var i = 0; i < simpleArray.length; i++) {
                var object = {};
                object[keyName] = simpleArray[i];
                object[valueName] = simpleArray[i];
                convertedArray.push(object);
            }
            return convertedArray;
        };

        //Stores each property of customObject as an item (object with key and value property) in myArray
        var convertObjectToArray = function (customObject) {
            var myArray = [], counter = 0;

            for (var prop in customObject) {
                if (!customObject.hasOwnProperty(prop)) { continue; }

                myArray[counter] = { key: prop, value: customObject[prop] };
                counter++;
            }

            return myArray;
        };

        /****************************************************************/
        /* Below Autocomplete will not work well with Angular Ng-Model  *
        /* You would have to manually find a way to Update Ng-Model     *
        /* Instead use the Custom Angular Autocomplete directive        *
        /****************************************************************/

        var createAutoComplete = function () {
            var $input = $(this);
            var options = {
                source: $input.attr("data-samples-autocomplete"),
                delay: 500,
                min_length: 3
            };
            $input.autocomplete(options);
        };

        var createAutoCompleteAdvance = function () {
            var $input = $(this);

            var requestURL = APP_SETTINGS.WEB_API_PATH + $input.attr("data-samples-autocomplete");
            var dependentProperty = $input.attr("data-samples-autocomplete-dependent");
            var myData = {};


            $input.autocomplete({
                source: function (request, response) {

                    myData.term = request.term;

                    if (dependentProperty) { myData[dependentProperty] = $("#" + dependentProperty).val(); }

                    $.ajax({
                        url: requestURL,
                        dataType: "json",
                        data: myData,
                        success: function (data) {
                            response(data);
                        }
                    });
                },
                min_length: 3,
                delay: 500
                //, select: function (event, ui) { vm.searchByName(); }
            });
        };

        //Creates a request object that needs to be send with Angular request.
        //Please note if you Windows Authentication then you would have to have [withCredentials: true]
        //in order to successfully send a request. Otherwise you will get an Unauthorized error
        var getRequestObject = function getRequest(method, url, data, customHeaders) {
            if (method === null || method === "") {
                method = "GET";
            }
            var req = {
                method: method,
                url: url,
                headers: customHeaders,
                withCredentials: true
            };

            method = method.toUpperCase();

            if ((method == "GET" || method == "DELETE") && data) { req.params = data; }
            else if ((method == "POST" || method == "PUT") && data) { req.data = data; }

            return req;
        };

        //Sets the tool tip
        var setToolTip = function setToolTip() {
            $('[data-toggle="tooltip"]').tooltip({
                delay: { show: 500, hide: 0 }
            });
        };

        //Sorts the drop down <select>
        var sortDropDownAscending = function sortDropDownAscending(selector) {
            var ddlList = selector;
            $(ddlList).html($(ddlList + ' option').sort(function (x, y) {
                return $(x).text() < $(y).text() ? -1 : 1;
            }));
            //$(ddlList).get(0).selectedIndex = 0; 
        };

        //Sorts the drop down <select> Descending
        var sortDropDownDescending = function sortDropDownDescending(selector) {
            var ddlList = selector;
            $(ddlList).html($(ddlList + ' option').sort(function (x, y) {
                return $(x).text() > $(y).text() ? -1 : 1;
            }));
            //$(ddlList).get(0).selectedIndex = 0; 
        };

        //Sorts the array Numerically
        var sortArrayNumerically = function sortArrayNumerically(array, propName, desc) {
            if (desc) {
                array.sort(function (a, b) { return b[propName] - a[propName]; });
            }
            else {
                array.sort(function (a, b) { return a[propName] - b[propName]; });
            }
            return array;
        };

        //Sorts the array Alphabetically
        var sortArray = function sortArrayNumerically(array, propName, desc) {
            if (desc) {
                array.sort(function (a, b) { if (a[propName] > b[propName]) { return 1; } });
            }
            else {
                array.sort(function (a, b) { if (a[propName] < b[propName]) { return -1; } });
            }
            return array;
        };

        //This methods converts date sent from WebAPI in Date(milliseconds) format
        //and converts it to JavaScript date time string
        var getDateFromJSON = function ToJavaScriptDate(value) {
            var pattern = /Date\(([^)]+)\)/;
            var results = pattern.exec(value);
            var dt = new Date(parseFloat(results[1]));
            return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getSeconds() + ":" + dt.getMilliseconds();
        };

        //Properly quotes the string
        var cleanField = function (value) {
            var cleanValue = $.trim(value).toLowerCase();
            cleanValue = cleanValue.replace(/\'/g, '\'\'');
            return cleanValue;
        };

        //Trims all the properties of the [receivedObject]
        var cleanObject = function (receivedObject) {
            for (var key in receivedObject) {
                if (receivedObject[key] && receivedObject[key] !== null && typeof (receivedObject[key]) !== "undefined" && receivedObject[key].trim)
                { receivedObject[key] = receivedObject[key].trim(); }
            }
            return receivedObject;
        };

        //Trims all the properties of the [receivedObject]. Properties which are null are assigned a default empty string
        var cleanObject2 = function (receivedObject) {
            for (var key in receivedObject) {
                if (receivedObject[key] !== null && receivedObject[key].trim)
                { receivedObject[key] = receivedObject[key].trim(); }
                else if (receivedObject[key] === null)
                { receivedObject[key] = ""; }
            }
            return receivedObject;
        };

        //Removes properties of an object which are either function or starts with "_"
        var cleanObject3 = function (receivedObject) {
            for (var key in receivedObject) {
                if (typeof receivedObject[key] === "function" || key.startsWith("_")) {
                    delete receivedObject[key];
                }
            }
            return receivedObject;
        };

        //Initializes all properties of [receivedObject] with null or specified [value]
        var initializeObject = function (receivedObject, value) {
            for (var key in receivedObject) {
                receivedObject[key] = value ? value : null;
            }
            return receivedObject;
        };

        //Centers the element in the window
        var centerElementInWindow = function (selector) {
            var height = window.innerHeight;
            var width = window.innerWidth;

            var elementHeight = selector.outerHeight();
            var elementWidth = selector.outerWidth();

            var top = (height - elementHeight) / 2;
            var left = (width - elementWidth) / 2;
            selector.css({
                top: top < 1 ? 0 : top,
                left: left < 1 ? 0 : left
            });
        };

        //Makes sure all elements in [selector] have specified height
        var makeSameHeightWidth = function (selector) {
            var width, height, maxHeight = 0,
               maxWidth = 0,
               total = 0;

            selector.each(function () {
                width = $(this).outerWidth();
                height = $(this).outerHeight();

                if (width > maxWidth) {
                    maxWidth = width;
                }
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });

            selector.css('width', maxWidth + 'px');
            selector.css('height', maxHeight + 'px');
        };

        //Makes sure all elements in [selector] have specified height
        var makeSameHeightWidthSibling = function (selector) {
            var width, height, maxHeight = 0,
               maxWidth = 0,
               total = 0;

            selector.siblings().each(function () {
                width = $(this).width();
                height = $(this).height();

                if (width > maxWidth) {
                    maxWidth = width;
                }
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });

            if (width == 0 || height == 0) return;

            selector.css('width', maxWidth + 'px');
            selector.css('height', maxHeight + 'px');
        };

        //Makes sure all elements in [selector] have specified height
        var makeSameHeightSibling = function (selector) {
            var height, maxHeight = 0, maxWidth = 0, total = 0;

            selector.siblings().each(function () {
                height = $(this)[0].offsetHeight;
                if (height > maxHeight) { maxHeight = height; }
            });

            if (height == 0) return;
            selector.css('height', maxHeight + 'px');
        };

        //Returns specified character number of times as specified by [howMany]
        var getNumberOfCharacters = function (character, howMany) {
            for (var i = 0; i < howMany.length - 1; i++) {
                character += character;
            }
            return character;
        };

        //Scrolls to the position of the selector
        var scrollToClickPosition = function (selector) {
            selector.click(function () {
                $('html, body').animate({
                    scrollTop: selector.offset().top
                }, 100);
            });
        };

        //Get the extension of the file
        var getExtension = function (fileName) {
            return fileName.match(/\.([^\.]+)$/)[1];
        };

        //Checks to see if the file extension is allowed
        var isExtensionAllowed = function (fileName) {
            var allowed = false;
            var ext = fileName.match(/\.([^\.]+)$/)[1];
            switch (ext) {
                case 'jpg':
                case 'jpeg':
                case 'bmp':
                case 'png':
                case 'gif':
                case 'tif':
                case 'pdf':
                    allowed = true;
                    break;
                default:
                    allowed = false;
                    //this.value = '';
            }
            return allowed;
        };

        var allowedMimeTypes = function (fileName) {
            var mimeTypes = [];

            mimeTypes.push({ extension: ".png", type: "image/png" });
            mimeTypes.push({ extension: ".jpeg", type: "image/jpeg" });
            mimeTypes.push({ extension: ".jpg", type: "image/jpeg" });
            mimeTypes.push({ extension: ".gif", type: "image/gif" });
            mimeTypes.push({ extension: ".bmp", type: "image/bmp" });
            mimeTypes.push({ extension: ".tiff", type: "image/tiff" });
            mimeTypes.push({ extension: ".pdf", type: "application/pdf" });

            return mimeTypes;
        };

        var copyTextToClipboard = function (element) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(element).text()).select();
            document.execCommand("copy");
            $temp.remove();
        };

        //Toggles the icon based on the event
        //$(selector).on('shown.bs.collapse', commonFunctions.togglePanelIcon).on('hidden.bs.collapse', commonFunctions.togglePanelIcon);
        var togglePanelIcon = function (event) {
            if (!event) return;
            var element = $(event.currentTarget).parent();
            var isOpen = element.find(".glyphicon-chevron-up").length !== 0;

            if (isOpen) {
                element.find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
            }
            else {
                element.find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
            }
        };

        //A helper method to check if request was processed successfully
        var isProcessedSuccessfully = function (headers) {
            return headers(APP_SETTINGS.REQUEST_PROCESSED) == APP_SETTINGS.SUCCESS;
        }

        //Returns an Object with specified props, excluding other properties
        var getSpecificPropertiesObject = function (object, props) {
            var getExistingProperties = getPropNames(object);
            var mNewObject = {};

            for (var i = 0; i < props.length; i++) {
                // if property exists within an array of existing properties then assign its value to mNewObject
                if (getExistingProperties.indexOf(props[i]) > -1) {
                    mNewObject[props[i]] = object[props[i]];
                }
            }//End of for

            return mNewObject;
        }

        //This function iterates over properties for both objects, specified in the [props] array.
        //If both objects contains identical properties then objects are same as far as specified props are concerned
        var compareObjects = function (object1, object2, props) {
            var getExistingProperties = getPropNames(object1);
            var totalPropertiesToCompare = props.length;
            var totalMatched = 0;


            for (var i = 0; i < props.length; i++) {

                // if property exists within an array of existing properties then compare value of both objects properties
                if (getExistingProperties.indexOf(props[i]) > -1 && object1[props[i]] === object2[props[i]]) {
                    totalMatched++;
                }
            }//End of for

            return totalPropertiesToCompare == totalMatched;
        };


        return {
            addCounter: addCounter,
            addRequestVerificationToken: addRequestVerificationToken,
            autoComplete: createAutoComplete,
            autoCompleteAdvance: createAutoCompleteAdvance,
            centerElementInWindow: centerElementInWindow,
            cleanField: cleanField,
            cleanObject: cleanObject,
            cleanObject2: cleanObject2,
            cleanObject3: cleanObject3,
            compareObjects: compareObjects,
            convertObjectToArray: convertObjectToArray,
            convertToObjectArray: convertToObjectArray,
            copyTextToClipboard: copyTextToClipboard,
            displayError: displayError,
            doesPropWithValueExist: doesPropWithValueExist,
            filterArray: filterArray,
            getAllowedMimeTypes: allowedMimeTypes,
            getDateFromJSON: getDateFromJSON,
            getDistinctObjects: getDistinctObjects,
            getDistinctObjects2: getDistinctObjects2,
            getDistinctObjects3: getDistinctObjects3,
            getExtension: getExtension,
            getPropNames: getPropNames,
            getPropertyValue: getPropertyValue,
            getRequestObject: getRequestObject,
            getSameObjects: getSameObjects,
            getSameObjects2: getSameObjects2,
            getSpecificPropertiesObject: getSpecificPropertiesObject,
            getSinglePropertyArray: getSinglePropertyArray,
            getSpecificPropertiesArray: getSpecificPropertiesArray,
            getSummaryOfChanges: getSummaryOfChanges,
            initializeObject: initializeObject,
            isExtensionAllowed: isExtensionAllowed,
            isProcessedSuccessfully: isProcessedSuccessfully,
            makeSameHeightWidth: makeSameHeightWidth,
            makeSameHeightWidthSibling: makeSameHeightWidthSibling,
            makeSameHeightSibling: makeSameHeightSibling,
            pagination: setPagination,
            removeObject: remove,
            removeDuplicates: removeDuplicates,
            removeDuplicates2: removeDuplicates2,
            scrollToClickPosition: scrollToClickPosition,
            searchByProperty: searchByProperty,
            searchByPropertyObject: searchByPropertyObject,
            serializeData: serializeData,
            setToolTip: setToolTip,
            sliceList: sliceList,
            sortDropDownAscending: sortDropDownAscending,
            sortDropDownDescending: sortDropDownDescending,
            sortArray: sortArray,
            sortArrayNumerically: sortArrayNumerically,
            stringfyObject: stringfyObject,
            togglePanelIcon: togglePanelIcon
        }
    }
}());