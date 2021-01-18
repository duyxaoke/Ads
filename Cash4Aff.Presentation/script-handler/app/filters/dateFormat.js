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