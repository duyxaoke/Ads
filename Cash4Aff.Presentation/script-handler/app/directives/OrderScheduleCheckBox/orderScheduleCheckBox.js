var orderScheduleCheckBox = function ($timeout) {
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

orderScheduleCheckBox.$inject = ["$timeout"];