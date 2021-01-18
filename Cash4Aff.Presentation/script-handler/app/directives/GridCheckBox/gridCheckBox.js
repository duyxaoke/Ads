var gridCheckBox = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            chkModel: "=",
            parentRow: "=",
            childRows: "=",
            fnCallBack: "&"
        },
        link: function (scope, element, attrs) {
            scope.$watch('chkModel', function (value) {
                //scope.fnCallBack({ ParentRow: scope.parentRow, ChildRows: scope.childRows });
                scope.parentRow.IsAll = true;
                scope.childRows.forEach(function (item) {
                    if (!item.IsAll) {
                        scope.parentRow.IsAll = false;
                        return false;
                    }
                });
            });
        }
    };
};

gridCheckBox.$inject = ["$timeout"];