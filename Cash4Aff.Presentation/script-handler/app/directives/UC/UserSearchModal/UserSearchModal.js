//TypeSearch
//: All=null, Employee=1, Supplier=2

var userSearchModal = function ($http, $timeout, $filter, $rootScope, CommonFactory, UtilFactory) {
    return {
        restrict: 'E',

        scope: {
            myroot: "="
        },

        templateUrl: "/script-handler/app/directives/UC/UserSearchModal/UserSearchModal.html",

        link: function (scope, element, attrs) {
            if (!scope.myroot) {
                scope.myroot = {
                    Core: {},
                    CallBack: {},
                    API: {}
                };
            }
            if (!scope.myroot.CallBack) {
                scope.myroot.CallBack = {};
            }
            if (!scope.myroot.Core) {
                scope.myroot.Core = {};
            }
            if (!scope.myroot.API) {
                scope.myroot.API = {};
            }
            if (!scope.myroot.Core.UserTypeSearch) {
                scope.myroot.Core.UserTypeSearch = '';
            }
            if (!scope.myroot.Core.PopupType) {
                scope.myroot.Core.PopupType = "Single";
            }
            if (scope.myroot.Core.PopupType == "Single") {
                scope.myroot.Core.TotalColumn = scope.myroot.Core.TotalColumn--;
            }
            if (!scope.myroot.Core.EndPoint) {
                scope.myroot.Core.EndPoint = "/Directives/GetUser/";
            }
            scope.myroot.Lst = [];
            scope.myroot.LstSelected = [];
            scope.myroot.txtSearch = { Text: '' };
            scope.myroot.btnSearch = {};
            scope.myroot.btnAdd = {};
            scope.myroot.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };

            scope.myroot.CustomFilter = function (item) {
                if (scope.myroot.txtSearch.Text) {
                    if (!UtilJS.String.IsContain(item.Username, scope.myroot.txtSearch.Text)
                        && !UtilJS.String.IsContain(item.FullName, scope.myroot.txtSearch.Text)
                        && !UtilJS.String.IsContain(item.PositionName, scope.myroot.txtSearch.Text)
                        && !UtilJS.String.IsContain(item.DepartmentName, scope.myroot.txtSearch.Text)) {
                        return false;
                    }
                }
                if (item.Username == null) {
                    return false;
                }
                return true;
            };

            scope.myroot.btnSearch.OnClick = function (intPage) {
                UtilJS.Loading.Show();
                var url = scope.myroot.Core.EndPoint;
                dataSend = {};
                dataSend.UserTypeSearch = scope.myroot.Core.UserTypeSearch;
                dataSend.intPage = intPage;
                dataSend.PageSize = scope.myroot.Pager.PageSize;
                dataSend.strKeyWord = scope.myroot.txtSearch.Text;

                CommonFactory.PostDataAjax(url, dataSend,
                    function (beforeSend) { },
                    function (response) {
                        UtilJS.Loading.Hide();
                        if (response.objCodeStep.Status == 'Error') {
                            jAlert.Error(response.objCodeStep.Message);
                            return;
                        }
                        if (response.objCodeStep.Status == 'Warning') {
                            jAlert.Warning(response.objCodeStep.Message);
                            return;
                        }
                        if (response.objCodeStep.Status == 'Success') {
                            scope.myroot.Lst = response.Lst;
                            if (scope.myroot.LstSelected.length > 0) {
                                scope.myroot.LstSelected.forEach(function (user_Selected) {
                                    scope.myroot.Lst.forEach(function (user) {
                                        if (scope.myroot.IsCheckedAll || user.UserID == user_Selected.UserID) {
                                            user.IsChecked = true;
                                        }
                                    });
                                });
                            }
                            scope.myroot.Pager.TotalItems = response.TotalItems;
                            scope.myroot.Pager.CurrentPage = intPage;
                        }
                        scope.myroot.API.ShowModal();
                    },
                    function (error) {
                        UtilJS.Loading.Hide();
                        scope.myroot.API.HideModal();
                        return;
                    }
                );
            };

            scope.myroot.ChooseUser = function (item) {
                scope.myroot.CallBack.ChoosedItem(item);
            };
            //scope.myroot.CheckUser = function (event,item) {
            //    var IsChecked = event.target.checked;
            //    if (IsChecked) {
            //        scope.myroot.LstSelected.push(item);
            //    }
            //    else {
            //        scope.myroot.LstSelected = scope.myroot.LstSelected.filter(function (user) {
            //            return user.UserID != item.UserID;
            //        });
            //    }
            //};
            //scope.myroot.CheckAllUser = function (event, item) {
            //    var IsChecked = event.target.checked;
            //    if (IsChecked) {
            //        scope.myroot.LstSelected.push(item);
            //    }
            //    else {
            //        scope.myroot.LstSelected = scope.myroot.LstSelected.filter(function (user) {
            //            return user.UserID != item.UserID;
            //        });
            //    }
            //};
            scope.myroot.btnAdd.OnClick = function () {
                var LstSelected = $filter("filter")(scope.myroot.Lst, { IsChecked_: true }) || [];
                scope.myroot.CallBack.ChoosedItems(LstSelected);
            };

            scope.myroot.API.ShowModal = function () {
                $(element[0].querySelector('.PnUserSearchModal')).modal('show');
            };
            scope.myroot.API.Search = function () {
                if (scope.myroot.Lst.length > 0) {
                    scope.myroot.API.ShowModal();
                }
                //scope.myroot.btnSearch.OnClick(1);
            };
            scope.myroot.API.HideModal = function () {
                $(element[0].querySelector('.PnUserSearchModal')).modal('hide');
            };
            if (scope.myroot.CallBack.OnHiddenBsModal) {
                $(element[0].querySelector('.PnUserSearchModal')).on("hidden.bs.modal", function () {
                    scope.myroot.CallBack.OnHiddenBsModal();
                    if ($('.modal:visible').length) {
                        $('body').addClass('modal-open');
                    }
                });
            }
        }
    };
};

userSearchModal.$inject = ["$http", "$timeout", "$filter", "$rootScope", "CommonFactory", "UtilFactory"];

$('.modal').on('hidden.bs.modal', function () {
    if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
    }
});