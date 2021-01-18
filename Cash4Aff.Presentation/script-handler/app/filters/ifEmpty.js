var ifEmpty = function () {
    return function (input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '' || input === 'Invalid date') {
            return defaultValue;
        }
        return input;
    }
};