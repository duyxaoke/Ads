//TypeSearch
//: All, Internal, External

var supplierSearchModal = function ($http, $timeout, $filter, $rootScope, CommonFactory, UtilFactory) {
    return {
        restrict: 'E',

        scope: {
            myroot: "="
        },

        templateUrl: "/script-handler/app/directives/UC/SupplierSearchModal/supplierSearchModal.html",

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
            if (!scope.myroot.Core.SupplierTypeSearch) {
                scope.myroot.Core.SupplierTypeSearch = "All";
            }

            scope.PnSupplierSearchModal = { btnSearch: {} };
            scope.PnSupplierSearchModal.Lst = [];
            scope.PnSupplierSearchModal.txtSearch = { Text: '' };
            scope.PnSupplierSearchModal.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };
            scope.PnSupplierSearchModal.CustomFilter = function (item) {
                if (scope.PnSupplierSearchModal.txtSearch.Text) {
                    if (!UtilJS.String.IsContain(item.SupplierName, scope.PnSupplierSearchModal.txtSearch.Text)
                        && !UtilJS.String.IsContain(item.SupplierAddress, scope.PnSupplierSearchModal.txtSearch.Text)
                        && !UtilJS.String.IsContain(item.SupplierPhone, scope.PnSupplierSearchModal.txtSearch.Text)
                        && !UtilJS.String.IsContain(item.SupplierEmail, scope.PnSupplierSearchModal.txtSearch.Text)) {
                        return false;
                    }
                }
                return true;
            };

            scope.PnSupplierSearchModal.btnSearch.OnClick = function (intPage) {
                if (scope.PnSupplierSearchModal.Lst == undefined || scope.PnSupplierSearchModal.Lst.length == 0) {
                    //xu ly data all thì post len server
                    UtilJS.Loading.Show();
                    var url = "/Directives/GetSupplier/";
                    dataSend = {};
                    dataSend.SupplierTypeSearch = scope.myroot.Core.SupplierTypeSearch;

                    CommonFactory.PostDataAjax(url, dataSend,
                        function (beforeSend) { },
                        function (response) {
                            if (response.objCodeStep.Status == 'Error') {
                                jAlert.Error(response.objCodeStep.Message);
                                UtilJS.Loading.Hide();
                                return;
                            }
                            if (response.objCodeStep.Status == 'Success') {
                                scope.PnSupplierSearchModal.Lst = response.Lst || [];
                                scope.PnSupplierSearchModal.Pager.CurrentPage = 1;
                                UtilJS.Loading.Hide();
                            }
                            scope.myroot.API.ShowModal();
                        },
                        function (error) {
                            UtilJS.Loading.Hide();
                            scope.myroot.API.HideModal();
                            return;
                        }
                    );
                }
                else {
                    intPage = !intPage ? 1 : intPage;
                    scope.PnSupplierSearchModal.Pager.CurrentPage = intPage;
                }
            };
            scope.PnSupplierSearchModal.ChooseProduct = function (item) {
                scope.myroot.CallBack.ChoosedItem(item);
            };
            scope.myroot.Core.txtSearch = scope.PnSupplierSearchModal.txtSearch;

            scope.myroot.API.ShowModal = function () {
                $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
            };
            scope.myroot.API.Search = function () {
                if (scope.PnSupplierSearchModal.Lst.length > 0) {
                    scope.myroot.API.ShowModal();
                }
                scope.PnSupplierSearchModal.btnSearch.OnClick(1);
            };
            scope.myroot.API.HideModal = function () {
                $(element[0].querySelector('.PnSupplierSearchModal')).modal('hide');
            };
            if (scope.myroot.CallBack.OnHiddenBsModal) {
                $(element[0].querySelector('.PnSupplierSearchModal')).on("hidden.bs.modal", function () {
                    scope.myroot.CallBack.OnHiddenBsModal();
                    if ($('.modal:visible').length) {
                        $('body').addClass('modal-open');
                    }
                });
            }
        }
    };
};

supplierSearchModal.$inject = ["$http", "$timeout", "$filter", "$rootScope", "CommonFactory", "UtilFactory"];

$('.modal').on('hidden.bs.modal', function () {
    if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
    }
});