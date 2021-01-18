var paginationStyle2 = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            pager: "=",
            totalItems: "=",
            fnCallBack: "&"
        },
        templateUrl: "/script-handler/app/directives/pagination-style2/pagination-style2.html",

        link: function (scope, element, attrs) {
            scope.pager.MaxPage = -1;

            scope.$watch('totalItems', function (value) {
                scope.pager.TotalItems = scope.totalItems;
                scope.pager.MaxPage = -1;
                scope.InitPager();
            });
            scope.$watch('pager.CurrentPage', function (value) {
                scope.InitPager();
            });
            scope.InitPager = function () {
                $timeout(function () {
                    var StartIndex = (scope.pager.CurrentPage - 1) * scope.pager.PageSize;
                    var nextIndex = StartIndex + scope.pager.PageSize;
                    scope.pager.StartIndex = StartIndex;
                    if (nextIndex >= scope.pager.TotalItems)
                        scope.pager.MaxPage = scope.pager.CurrentPage;
                });
            };
            scope.Exec = function (intPageClicked, event) {
                //$(event.currentTarget).blur();
                if ((scope.pager.MaxPage > -1) && (intPageClicked > scope.pager.MaxPage)) {
                    return;
                }
                if (intPageClicked <=0) {
                    return;
                }
                scope.fnCallBack({ PageClicked: intPageClicked });
            }
        }
    };
};

paginationStyle2.$inject = ["$timeout"];