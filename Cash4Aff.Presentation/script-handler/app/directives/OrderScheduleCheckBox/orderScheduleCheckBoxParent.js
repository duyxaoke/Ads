var orderScheduleCheckBoxParent = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            chkModel: "=",
            columnName: "@",
            headerModel: "=",
            listParent: "=",
            fnCallBack: "&"
        },
        link: function (scope, element, attrs) {
            scope.$watch('chkModel', function (value) {
                scope.headerModel = true;
                scope.listParent.forEach(function (item) {
                    if (scope.columnName == "day_2" && !item.day_2) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_3" && !item.day_3) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_4" && !item.day_4) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_5" && !item.day_5) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_6" && !item.day_6) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_7" && !item.day_7) {
                        scope.headerModel = false;
                        return;
                    }
                });
            });
        }
    };
};

orderScheduleCheckBoxParent.$inject = ["$timeout"];