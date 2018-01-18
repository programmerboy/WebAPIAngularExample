//////////////////////////////////////////////////
/////////////// STRING FUNCTIONS   ///////////////
//////////////////////////////////////////////////

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

String.prototype.toCamelCase = function () {
    return this.replace(/([A-Z])/g, "$1", function (result) {
        return result.charAt(0).toLowerCase() + result.slice(1);
    });
};
String.prototype.toPascallCase = function () {
    return this.replace(/([A-Z])/g, "$1", function (result) {
        return result.charAt(0).toUpperCase() + result.slice(1);
    });
};

String.prototype.splitCamelCase = function () {
    return this.split(/(?=[A-Z])/).join(' ');
};

String.prototype.exactMatch = function (txt) {
    return this.trim().toUpperCase() === txt.trim().toUpperCase();
};

String.prototype.getLastPart = function (separator) {
    if (!this) { return ""; }
    if (!separator) separator = "\\";
    if (this.indexOf(separator) < 0) { return this; }
    return this.substring(this.lastIndexOf(separator) + 1);
};

String.prototype.getDatePortionFromDateTime = function () {
    var pattern = /(0*)(.+)T.*/;
    var results = pattern.exec(this);

    if (!results) return new Date();

    results = results[1].replace(/00/g, '20') + results[2];
    results = results.replace(/-/g, '/');
    var dt = new Date(results);
    return dt;
};

String.prototype.getTRIPSDate = function () {
    if (!this) return;
    var dt = this.getDatePortionFromDateTime();
    return dt.getFullYear() + "-" + (dt.getMonth() + 1).padZero() + "-" + dt.getDate().padZero();
}

String.prototype.convertToDate = function () {
    var pattern = /(\d+)-(\d+)-(\d+)/;
    var results = pattern.exec(this);
    return new Date(results[1], parseInt(results[2]) - 1, results[3]);
}

String.prototype.isEmpty = function () {
    return this.trim() === "";
}

String.prototype.cleanDate = function () {
    var pattern = /([^\s]*)\s*.*/;
    var results = pattern.exec(this);
    results = results[1];
    return results;
};

String.prototype.padZero = function () {
    return ("0" + this).slice(-2);
}

String.prototype.padZeroForTimes = function () {
    return ("0000" + this).slice(-4);
}

String.prototype.formatTime = function () {
    var time = ("0000" + this).slice(-4);
    return time.substring(0, 2) + ":" + time.substring(2);
}

//////////////////////////////////////////////////
/////////////// NUMBER FUNCTIONS   ///////////////
//////////////////////////////////////////////////

Number.prototype.formatTime = function () {
    var time = ("0000" + this).slice(-4);
    return time.substring(0, 2) + ":" + time.substring(2);
}

Number.prototype.padZero = function () {
    return ("0" + this).slice(-2);
}

Number.prototype.padZeroForTimes = function () {
    return ("0000" + this).slice(-4);
}

//////////////////////////////////////////////////
/////////////// DATE FUNCTIONS   ///////////////
//////////////////////////////////////////////////

//Removes the Time Portion from the supplied dates
Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

Date.prototype.getTRIPSDate = function () {
    if (!this) return;
    var dt = this;
    return dt.getFullYear() + "-" + (dt.getMonth() + 1).padZero() + "-" + dt.getDate().padZero();
}

//////////////////////////////////////////////////
/////////////// ARRAY FUNCTIONS   ///////////////
//////////////////////////////////////////////////

//Returns a unique Array back
Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};

/**
 * @description determine if an array contains one or more items from another array.
 * @param {array} arr the array providing items to check for in the arrayToSearch.
 * @return {boolean} true|false if arrayToSearch contains at least one item from arr.
 */
Array.prototype.exists = function (arr, caseSensitive) {
    var arrayToSearch = this;

    if (!arrayToSearch || arrayToSearch.length == 0) { return false; }

    if (typeof (arrayToSearch[0]) == "string" && !caseSensitive) {

        for (var i = 0; i < arrayToSearch.length; i++) {
            for (var a = 0; a < arr.length; a++) {
                if (arr[a].exactMatch(arrayToSearch[i])) {
                    return true;
                }
            }//End of Inner For
        }//End of Outer For
    }
    else {
        return arr.some(function (element) {
            return arrayToSearch.indexOf(element) >= 0;
        });
    }

    return false;
};