//TypeSearch
//: All=null, Employee=1, Supplier=2

var customerSearchModal = function ($http, $timeout, $filter, $rootScope, CommonFactory, UtilFactory, DataFactory, $q) {
    return {
        restrict: 'E',

        scope: {
            myroot: "="
        },

        templateUrl: "/script-handler/app/directives/UC/CustomerSearchModal/CustomerSearchModal.html",

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

            scope.PnCustomerSearchModal = { btnSearch: {} };
            scope.PnCustomerSearchModal.Lst = [];
            scope.PnCustomerSearchModal.LstSelected = [];
            scope.PnCustomerSearchModal.txtSearch = { Text: '' };
            scope.PnCustomerSearchModal.btnSearch = {};
            scope.PnCustomerSearchModal.btnAdd = {};
            scope.PnCustomerSearchModal.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };

            scope.PnCustomerSearchModal.btnSearch.OnClick = function (intPage) {
                if (!scope.PnCustomerSearchModal.txtSearch.Text) {
                    jAlert.Warning("Vui lòng nhập thông tin tìm kiếm", "Thông báo");
                    return;
                }
                intPage = !intPage ? 1 : intPage;

                //xu ly data all thì post len server
                UtilJS.Loading.Show();
                var url = "/Directives/GetCustomer";
                dataSend = {};
                dataSend.KeySearch = scope.PnCustomerSearchModal.txtSearch.Text;
                dataSend.PageIndex = intPage - 1;
                dataSend.PageSize = scope.PnCustomerSearchModal.Pager.PageSize;

                CommonFactory.PostMethod(url, dataSend)
                    .then(function (response) {
                        UtilJS.Loading.Hide();
                        if (response.objCodeStep.Status == 'Error') {
                            jAlert.Warning("Không có dữ liệu hoặc bạn không có quyền xem dữ liệu"); //Y/C cua QC => warning
                            return;
                        }
                        if (response.objCodeStep.Status == 'Warning') {
                            jAlert.Warning(response.objCodeStep.Message);
                            return;
                        }
                        if (response.objCodeStep.Status == 'Success') {
                            scope.PnCustomerSearchModal.Lst = response.Lst || [];
                            scope.PnCustomerSearchModal.Pager.TotalItems = response.Lst.length;
                            scope.PnCustomerSearchModal.Pager.CurrentPage = intPage;
                        }
                        scope.myroot.API.ShowModal();
                    })
                    .catch(function (response) {
                        UtilJS.Loading.Hide();
                        scope.PnCustomerSearchModal.Lst = [];
                        jAlert.Warning("Không có dữ liệu hoặc bạn không có quyền xem dữ liệu"); //Y/C cua QC => warning
                    });
            };
            scope.PnCustomerSearchModal.btnSearch.OnLoad = function (intPage) {
                scope.PnCustomerSearchModal.Pager.CurrentPage = intPage;
            }
            scope.PnCustomerSearchModal.ChooseItem = function (item) {
                scope.myroot.CallBack.ChoosedItem(item);
            };
            scope.myroot.Core.txtSearch = scope.PnCustomerSearchModal.txtSearch;

            scope.myroot.API.ShowModal = function () {
                $(element[0].querySelector('.PnCustomerSearchModal')).modal('show');
            };
            scope.myroot.API.Search = function () {
                //scope.PnCustomerSearchModal.btnSearch.OnClick(1);
            };
            scope.myroot.API.HideModal = function () {
                $(element[0].querySelector('.PnCustomerSearchModal')).modal('hide');
            };
            if (scope.myroot.CallBack.OnHiddenBsModal) {
                $(element[0].querySelector('.PnCustomerSearchModal')).on("hidden.bs.modal", function () {
                    scope.myroot.CallBack.OnHiddenBsModal();
                    if ($('.modal:visible').length) {
                        $('body').addClass('modal-open');
                    }
                });
            }
        }
    };
};

customerSearchModal.$inject = ["$http", "$timeout", "$filter", "$rootScope", "CommonFactory", "UtilFactory", "DataFactory", "$q"];
addDirective("customerSearchModal", customerSearchModal);
$('.modal').on('hidden.bs.modal', function () {
    if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
    }
});