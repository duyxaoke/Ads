var dateFormat = function ($filter) {
    return function (input, optional) {

        if (!input) {
            return "";
        }
        if (optional == undefined || optional == '') optional = "dd/MM/yyyy";
        var resultDate;

        if (input instanceof Date) {
            resultDate = input;
        } else {
            var temp = input.replace(/\//g, "").replace("(", "").replace(")", "").replace("Date", "").replace("+0700", "").replace("-0000", "");

            if (input.indexOf("Date") > -1) {
                resultDate = new Date(+temp);
            } else {
                resultDate = new Date(temp);
            }

            var utc = resultDate.getTime() + (resultDate.getTimezoneOffset() * 60000);

            // create new Date object for different city
            // using supplied offset
            var resultDate = new Date(utc + (3600000 * 7));
        }

        return $filter("date")(resultDate, optional);
    };
};
dateFormat.$inject = ["$filter"];
var formatMonthYear = function ($filter) {
    return function (input) {

        var year = input.toString().substr(0, 4);
        var month = input.toString().substr(4, 2);

        var result = month + "/" + year;

        return result;
    };
};

formatMonthYear.$inject = ["$filter"];
var trustHtml = function ($sce) {
    return function (input) {
        if (!input) {
            return "";
        }
        return $sce.trustAsHtml(input);
    };
};
trustHtml.$inject = ["$sce"];
var ifEmpty = function () {
    return function (input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '' || input === 'Invalid date') {
            return defaultValue;
        }
        return input;
    }
};
var toFixedDecimal = function ($filter) {
    try {
        return function (value, optional) {
            if (!value)
                return 0;
            var decimal = value.toString().split('.')[1]; // 0 | 0123456
            if (decimal) {
                if (optional == undefined || optional === '') {
                    optional = decimal.length;
                }
                else {
                    decimal = decimal.toString().slice(0, optional);

                    for (var i = decimal.length; i > 0; i--) {
                        if (decimal.charAt(i - 1) != 0) {
                            break;
                        }
                        else {
                            decimal = decimal.substring(0, decimal.length - 1);
                        }
                    }
                    optional = decimal.length;
                }
                value = $filter('number')(parseFloat(value), optional);
            } else {
                value = $filter('number')(value);
            }
            return value;
        }
    } catch (e) {
        return 0;
    }
};
toFixedDecimal.$inject = ["$filter"];