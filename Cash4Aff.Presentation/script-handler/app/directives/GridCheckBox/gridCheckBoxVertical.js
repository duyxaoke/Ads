var gridCheckBoxVertical = function ($timeout) {
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
                //scope.fnCallBack({ chkModel: scope.chkModel, ParentModel: scope.parentModel, HeaderModel: scope.headerModel, ChildRows: scope.childRows, ListParent: scope.listParent });
                scope.parentModel = true;
                scope.childRows.forEach(function (item) {
                    if (scope.columnName == "IsCanInput" && !item.IsCanInput) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanOutput" && !item.IsCanOutput) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanViewReport" && !item.IsCanViewReport) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanStoreChangeOrder" && !item.IsCanStoreChangeOrder) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanOutOrder" && !item.IsCanOutOrder) {
                        scope.parentModel = false;
                        return;
                    }
                });
            });
        }
    };
};

gridCheckBoxVertical.$inject = ["$timeout"];