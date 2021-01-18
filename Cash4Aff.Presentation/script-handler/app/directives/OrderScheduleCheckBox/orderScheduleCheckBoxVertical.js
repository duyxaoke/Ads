var orderScheduleCheckBoxVertical = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            chkModel: "=",
            columnName: "@",
            headerModel: "=",
            parentModel: "=",
            childRows: "=",
            fnCallBack: "&"
        },
        link: function (scope, element, attrs) {
            scope.$watch('chkModel', function (value) {
                scope.parentModel = true;
                scope.childRows.forEach(function (item) {
                    if (scope.columnName == "day_2" && !item.day_2) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_3" && !item.day_3) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_4" && !item.day_4) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_5" && !item.day_5) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_6" && !item.day_6) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "day_7" && !item.day_7) {
                        scope.parentModel = false;
                        return;
                    }
                });
            });
        }
    };
};

orderScheduleCheckBoxVertical.$inject = ["$timeout"];