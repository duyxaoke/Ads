var gridCheckBoxParentProCat = function ($timeout) {
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
                //$timeout(function () {
                $.each(scope.listParent, function (index, item) {
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
                    else if (scope.columnName == "IsCanOutOrder" && !item.IsCanOutOrder) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanMakingPrice" && !item.IsCanMakingPrice) {
                        scope.headerModel = false;
                        return;
                    }
                    else if (scope.columnName == "IsCanMakingBonusPoint" && !item.IsCanMakingBonusPoint) {
                        scope.headerModel = false;
                        return;
                    }
                    //});
                });
            });
        }
    };
};

gridCheckBoxParentProCat.$inject = ["$timeout"];