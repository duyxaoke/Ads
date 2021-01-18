var gridCheckBoxParent = function ($timeout) {
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
                    if (scope.columnName == "IsCanInput" && !item.IsCanInput) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanOutput" && !item.IsCanOutput) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanViewReport" && !item.IsCanViewReport) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanStoreChangeOrder" && !item.IsCanStoreChangeOrder) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanOutOrder" && !item.IsCanOutOrder) {
                        scope.headerModel = false;
                        return;
                    }
                });
            });
        }
    };
};

gridCheckBoxParent.$inject = ["$timeout"];