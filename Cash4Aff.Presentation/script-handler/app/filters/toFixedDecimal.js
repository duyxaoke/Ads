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