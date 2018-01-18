var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

function isExtraSmallDevice() { return window.innerWidth < 768; }
function isSmallDevice() { return window.innerWidth < 992; }
function isMediumDevice() { return window.innerWidth <= 1280; }
function isLargeDevice() { return window.innerWidth > 1280; }

function getDeviceType() {
    var typeOfDevice = "";

    if (isExtraSmallDevice())
        typeOfDevice = "XS";
    else if (isSmallDevice())
        typeOfDevice = "SM";
    else if (isMediumDevice())
        typeOfDevice = "MD";
    else if (isLargeDevice())
        typeOfDevice = "LG";

    return typeOfDevice;
}

function getScreenResolution() {
    return { height: SCREEN_HEIGHT, width: SCREEN_WIDTH };
}

function getDateTime() {
    return new Date().toJSON();// returns "2017-01-30T21:07:44.570Z" for e.g.
}

function getTimeStamp() {
    var dt = new Date();
    return dt.getFullYear() + (dt.getMonth() + 1).padZero() + dt.getDate().padZero() + "-" + dt.getHours().padZero() + dt.getMinutes().padZero() + dt.getSeconds().padZero();
}

function excelConfiguration(e) {
    var columns = e.workbook.sheets[0].columns;
    for (var i = 0; i < columns.length; i++) { columns[i]["autoWidth"] = true; }
}

function getFileName(headers) {
    var fileName = null;

    var disposition = headers('Content-Disposition');
    if (disposition) {
        var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
        fileName = match[1] ? match[1] : fileName;
    }

    return fileName;
}

function DownloadFile(data, headers) {
    // Set objects for file generation.
    var blob, url, a, extension;

    var octetStreamMime = 'application/octet-stream';
    var contentType = headers('content-type') || octetStreamMime;
    var fileName = getFileName(headers);
    fileName = fileName ? fileName : "Report.xml";

    // Set data on blob.
    blob = new Blob([data], { type: contentType });

    // Set view.
    if (blob) {
        // Read blob.
        url = window.URL.createObjectURL(blob);
        a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        // Handle error.
    }
};

//Download File.
function DownloadFile2(data, headers) {
    var octetStreamMime = 'application/octet-stream';
    var success = false;

    var contentType = headers('content-type') || octetStreamMime;
    var fileName = getFileName(headers);
    fileName = fileName ? fileName : "Report.xml";

    try {
        // Try using msSaveBlob if supported
        console.log("Trying saveBlob method ...");
        var blob = new Blob([data], { type: contentType });
        if (navigator.msSaveBlob)
            navigator.msSaveBlob(blob, fileName);
        else {
            // Try using other saveBlob implementations, if available
            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
            if (saveBlob === undefined) throw "Not supported";
            saveBlob(blob, fileName);
        }
        console.log("saveBlob succeeded");
        success = true;
    } catch (ex) {
        console.log("saveBlob method failed with the following exception:");
        console.log(ex);
    }

    if (!success) {
        // Get the blob url creator
        var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
        if (urlCreator) {
            // Try to use a download link
            var link = document.createElement('a');
            if ('download' in link) {
                // Try to simulate a click
                try {
                    // Prepare a blob URL
                    console.log("Trying download link method with simulated click ...");
                    var blob = new Blob([data], { type: contentType });
                    var url = urlCreator.createObjectURL(blob);
                    link.setAttribute('href', url);

                    // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                    link.setAttribute("download", fileName);

                    // Simulate clicking the download link
                    var event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                    link.dispatchEvent(event);
                    console.log("Download link method with simulated click succeeded");
                    success = true;

                } catch (ex) {
                    console.log("Download link method with simulated click failed with the following exception:");
                    console.log(ex);
                }
            }

            if (!success) {
                // Fallback to window.location method
                try {
                    // Prepare a blob URL
                    // Use application/octet-stream when using window.location to force download
                    console.log("Trying download link method with window.location ...");
                    var blob = new Blob([data], { type: octetStreamMime });
                    var url = urlCreator.createObjectURL(blob);
                    window.location = url;
                    console.log("Download link method with window.location succeeded");
                    success = true;
                } catch (ex) {
                    console.log("Download link method with window.location failed with the following exception:");
                    console.log(ex);
                }
            }
        }
    }

    if (!success) {
        // Fallback to window.open method
        console.log("No methods worked for saving the arraybuffer, using last resort window.open");
        window.open(httpPath, '_blank', '');
    }
}

//////////////////////////////////
/////////// CONSTANTS ////////////
//////////////////////////////////

var DEVICE_TYPE = getDeviceType();
var LKP_CODE = "lkpCode";
var LKP_COL_CODE = "lkpColCode";
var LKP_COL_NAME = "lkpColName";


var PARAM_SEPRATOR = "|^$^|";
var TODAYS_DATE = new Date().toJSON().getDatePortionFromDateTime().toJSON(); // returns "2017-02-09T05:00:00.000Z" for e.g.


//////////////////////////////////
/////// GLOBAL VARIABLES /////////
//////////////////////////////////

var _glb_isOutOfService = false;


////////////////////////////////////////////////////////////////////////
//////////////////////////// INITIALIZATION ////////////////////////////
////////////////////////////////////////////////////////////////////////

$(document).ready(function () {

    //console.log(getScreenResolution());

    var sameWidthHeightSelector = $(".same-width");

    //Toastr Options
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-right';

    ////////////////////////////////////
    ///// BOOTSTRAP DROP DOWN MENU /////
    ////////////////////////////////////

    $(".dropdown-menu > li > a.trigger").on("click", function (e) {
        var current = $(this).next();
        var grandparent = $(this).parent().parent();
        if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
            $(this).toggleClass('right-caret left-caret');
        grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
        grandparent.find(".sub-menu:visible").not(current).hide();
        current.toggle();
        e.stopPropagation();
    });

    $(".dropdown-menu > li > a:not(.trigger)").on("click", function () {
        var root = $(this).closest('.dropdown');
        root.find('.left-caret').toggleClass('right-caret left-caret');
        root.find('.sub-menu:visible').hide();
    });

    ///////////////////////////////////////
    //// MAKE SAME HEIGHT OF SIBLING //////
    ///////////////////////////////////////

    var makeSameHeightWidth = function (selector) {
        var width, height, maxHeight = 0,
           maxWidth = 0,
           total = 0;

        selector.parent().find(selector).each(function () {
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

    function makeSameHeight(sibling, padding) {
        var sameheight, browser, thisHeight;
        sameheight = 0;

        $(sibling).siblings().each(function () {
            thisHeight = $(this).height();
            if (thisHeight > sameheight)
            { sameheight = thisHeight; }
        });
        sameheight = sameheight + padding;

        // Setting same height for siblings
        $(sibling).siblings().each(function () {
            $(this).css({ "min-height": sameheight + "px" });
        });

        $(sibling).css({ "min-height": sameheight + "px" });
    }

    makeSameHeightWidth(sameWidthHeightSelector);
    $("#showHideDiv").click(function () { $("#messageDiv").toggle(); });
    $("input[type=submit]").tooltip({ delay: { show: 500, hide: 0 } });

});