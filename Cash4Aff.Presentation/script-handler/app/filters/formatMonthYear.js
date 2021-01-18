var formatMonthYear = function ($filter) {
    return function (input) {

        var year = input.toString().substr(0, 4);
        var month = input.toString().substr(4, 2);

        var result = month + "/" + year;

        return result;
    };
};

formatMonthYear.$inject = ["$filter"];