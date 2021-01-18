var gridCheckBoxVerticalProCat = function ($timeout) {
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
                $.each(scope.childRows, function (index, item) {
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
                    else if (scope.columnName == "IsCanMakingPrice" && !item.IsCanMakingPrice) {
                        scope.parentModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanMakingBonusPoint" && !item.IsCanMakingBonusPoint) {
                        scope.parentModel = false;
                        return;
                    }
                });
            });
        }
    }
};

gridCheckBoxVerticalProCat.$inject = ["$timeout"];