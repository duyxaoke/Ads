var gridSort = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            sort: "=",
            columnName: "=",
            fnCallBack: "&"
        },

        templateUrl: "/script-handler/app/directives/GridSort/GridSort.html",  

        link: function (scope, element, attrs) {

        }
    };
};

gridSort.$inject = ["$timeout"];