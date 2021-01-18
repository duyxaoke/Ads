var paginationStyle1 = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            pager: "=",//{ TotalItems: 0, PageSize: 10, CurrentPage: 1 }
            totalItems: "=",
            fnCallBack: "&"
        },
        templateUrl: "/script-handler/app/directives/pagination-style/pagination-style.html",

        link: function (scope, element, attrs) {
            scope.pager.TotalItems = 0;
            scope.pager.TotalPages = 0;

            function setPage() {
                if (!scope.pager.CurrentPage || scope.pager.CurrentPage < 1 || scope.pager.CurrentPage > scope.pager.TotalPages) {
                    scope.pager.Pages = [];
                    return;
                }

                if (!scope.pager.TotalPages) {
                    scope.pager.Pages = [];
                    return;
                }

                // get pager object from service
                GetPager(scope.pager.TotalItems, scope.pager.CurrentPage, scope.pager.PageSize);
            }

            function GetPager(TotalItems, CurrentPage, PageSize) {
                // default to first page
                CurrentPage = CurrentPage || 1;
                // default page size is 10
                PageSize = PageSize || 10;

                var StartPage, EndPage;
                StartPage = scope.pager.StartPage || 1;
                EndPage = scope.pager.EndPage || 10;
                //số page trên 1 trang
                var NumberPageSize = 10;
                var Lst = [];
                var NumberPager = Math.floor(scope.pager.TotalPages / NumberPageSize);
                var decimalPager = scope.pager.TotalPages % NumberPageSize;

                for (var i = 1; i <= NumberPager; i++) {
                    var Start = (i - 1) * PageSize;
                    var End = Start + NumberPageSize;
                    Lst.push({ Start: Start + 1, End: End });
                }
                if (decimalPager > 0) {
                    Lst.push({ Start: NumberPager * NumberPageSize + 1, End: NumberPager * NumberPageSize + decimalPager });
                }
                var IsHasCurrentPage = false;
                for (var i = 0; i < Lst.length; i++) {
                    if (CurrentPage >= Lst[i].Start && CurrentPage <= Lst[i].End) {
                        StartPage = Lst[i].Start;
                        EndPage = Lst[i].End;
                        if (EndPage > 10 && EndPage - StartPage < 9) {
                            StartPage = EndPage - 9;
                        }
                        IsHasCurrentPage = true;
                        break;
                    }
                }
                if (!IsHasCurrentPage) {
                    CurrentPage = Lst[0].Start;
                    StartPage = Lst[0].Start;
                    EndPage = Lst[0].End;
                }

                // calculate start and end item indexes
                var StartIndex = (CurrentPage - 1) * PageSize;
                var EndIndex = Math.min(StartIndex + PageSize - 1, TotalItems - 1);

                // create an array of pages to ng-repeat in the pager control
                var Pages = [];
                for (var i = StartPage; i <= EndPage; i++) {
                    Pages.push(i);
                }
                if (CurrentPage <= 0)
                    CurrentPage = 1;
                // return object with all pager properties required by the view
                scope.pager.PageSize = PageSize;
                scope.pager.StartPage = StartPage;
                scope.pager.EndPage = EndPage;
                scope.pager.StartIndex = StartIndex;
                scope.pager.EndIndex = EndIndex;
                scope.pager.Pages = Pages;
            }

            scope.$watch('totalItems', function (value) {
                scope.pager.TotalItems = scope.totalItems;
                scope.InitPager();
            });
            scope.$watch('pager.CurrentPage', function (value) {
                scope.InitPager();
            });
            scope.InitPager = function () {
                $timeout(function () {
                    scope.pager.TotalPages = Math.ceil(scope.pager.TotalItems / scope.pager.PageSize);

                    //Case: cập nhật mà bị mất row, thì fai~ pagecurrent--
                    if (scope.pager.CurrentPage > scope.pager.TotalPages) {
                        scope.pager.CurrentPage = scope.pager.TotalPages;
                        if (scope.pager.TotalPages == 0) {
                            scope.pager.CurrentPage = 1;//gán = 1 để khi set page, nếu totalpages có data thì currentpage bắt đầu là 1
                        }
                    }

                    setPage();
                });
            };

            scope.Exec = function (intPageClicked) {
                if (intPageClicked > scope.pager.TotalPages) {
                    return;
                }

                scope.fnCallBack({ PageClicked: intPageClicked });
                //setPage();
            }
            scope.ExecFirst = function (intPageClicked) {
                if (intPageClicked > scope.pager.TotalPages) {
                    intPageClicked = scope.pager.TotalPages;
                }
                if (intPageClicked <= 0) {
                    intPageClicked = 1;
                }
                scope.pager.StartPage = scope.pager.StartPage - 10;
                scope.pager.EndPage = scope.pager.EndPage - 10;
                if (scope.pager.StartPage <= 0) {
                    scope.pager.StartPage = 1;
                    scope.pager.EndPage = 10;
                }
                scope.fnCallBack({ PageClicked: intPageClicked });
                //setPage();
            }
            scope.ExecLast = function (intPageClicked) {
                if (intPageClicked > scope.pager.TotalPages) {
                    intPageClicked = scope.pager.TotalPages;
                }
                scope.pager.StartPage = scope.pager.EndPage + 1;
                scope.pager.EndPage = scope.pager.StartPage + 9;
                if (scope.pager.EndPage > scope.pager.TotalPages) {
                    scope.pager.EndPage = scope.pager.TotalPages;
                    scope.pager.StartPage = scope.pager.EndPage - 9;
                }
                scope.fnCallBack({ PageClicked: intPageClicked });
                //setPage();
            }

            scope.pager.GetPageIndexReLoad = function (totalItem) {//dùng khi xóa row mà muốn tìm CurrentPage reload grid
                if (scope.pager.CurrentPage < scope.pager.TotalPages) return scope.pager.CurrentPage;
                if (totalItem % scope.pager.PageSize > 0) return scope.pager.CurrentPage;
                else return scope.pager.CurrentPage-1;
            }
        }
    };
};

paginationStyle1.$inject = ["$timeout"];