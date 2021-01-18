var productInventorySearchModal = function ($http, $timeout, $filter, $rootScope, CommonFactory, UserProductCategoryFactory) {
    return {
        restrict: 'E',

        scope: {
            myroot: "="
        },

        templateUrl: "/script-handler/app/directives/UC/ProductInventorySearchModal/OSProductSearchModal.html",

        link: function (scope, element, attrs) {
            //#region default param 
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
            scope.myroot.Core.IsInitData = false;

            scope.myroot.Core.TotalColumn = 5;
            scope.myroot.Core.IsShowQuanity = false;

            if (!scope.myroot.Core.PopupType) {
                scope.myroot.Core.PopupType = "Single";
            }

            if (scope.myroot.Core.PopupType == "Single") {
                scope.myroot.Core.TotalColumn = scope.myroot.Core.TotalColumn--;
            }
            if (!scope.myroot.Core.SearchType) {
                scope.myroot.Core.SearchType = "Inventory";
            }
            if (!scope.myroot.Core.ActionURL) {
                if (scope.myroot.Core.SearchType == "SearchList") {
                    //hiện tại api này chưa chạy được do, fai~ truyền PID. chưa có api nào search nguyên list mà allow pid = null
                    scope.myroot.Core.ActionURL = "/Directives/UCIvenCurrentInStocksSearchList";
                }
                else {
                    scope.myroot.Core.ActionURL = "/Directives/GetIvenCurrentInStocksInventory";
                }
            }

            //#region hien cay
            if (!scope.myroot.ddlUserProductCategory) { 
                scope.myroot.ddlUserProductCategory = { IDSelectedTimeOut: false, IsSelectedAll: false };
            }
            scope.myroot.ddlUserProductCategory.core = {
                themes: {
                    icons: false
                }
            };
            if (!scope.myroot.Core.IsShowCategory) {
                scope.myroot.Core.IsShowCategory = false;
            }
            if (scope.myroot.Core.IsShowCategory) {
                if (!scope.myroot.Core.IsInitData && scope.myroot.Core.LstUserProductCategoryTree) {
                    scope.myroot.ddlUserProductCategory.TreeData = scope.myroot.Core.LstUserProductCategoryTree;
                    scope.myroot.Core.IsInitData = true;
                }
            }
            //#endregion hien cay

            //#endregion default param 

            scope.myroot.Lst = [];
            scope.myroot.txtSearch = { Text: '' };
            scope.myroot.btnSearch = {};
            scope.myroot.btnAdd = {};

            scope.myroot.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };
            scope.myroot.CustomFilter = function (item) {
                return true;
            };
            scope.myroot.btnSearch.OnClick = function (intPage) {
                if (!scope.myroot.Core.StoreID) {
                    jAlert.Warning("Vui lòng chọn cửa hàng xuất", "Thông báo");
                    return;
                }
                intPage = !intPage ? 1 : intPage;

                //#region tim node la' cho page IVENOutputOrders create
                // hiện tại page này chỉ cần hiện cây ko có chkbox
                let CategoryIDs = [];
                if (scope.myroot.Core.IsShowCategory) {
                    if (scope.myroot.ddlUserProductCategory.NodeResult.IDSelected.length == 0) {
                        jAlert.Warning("Vui lòng chọn ngành hàng", "Thông báo");
                        return;
                    }
                    let categoryid = scope.myroot.ddlUserProductCategory.NodeResult.IDSelected[0].toString();
                    UserProductCategoryFactory.FilterLastChildsByParentID(
                        scope.myroot.ddlUserProductCategory.TreeData,
                        categoryid,
                        CategoryIDs);

                    if (CategoryIDs.length == 0) {
                        jAlert.Warning("Vui lòng chọn ngành hàng có nhánh con", "Thông báo");
                        return;
                    }
                }
                //#endregion

                dataSend = {};
                dataSend.strKeyWord = scope.myroot.txtSearch.Text;
                dataSend.StoreID = scope.myroot.Core.StoreID;
                dataSend.CategoryIDs = CategoryIDs;
                dataSend.intPage = intPage;

                UtilJS.Loading.Show();

                CommonFactory.PostDataAjax(scope.myroot.Core.ActionURL, dataSend,
                    function (beforeSend) { },
                    function (response) {
                        $timeout(function () {
                            scope.myroot.Lst = [];
                            scope.myroot.Pager.TotalItems = 0;
                            scope.myroot.Pager.CurrentPage = 1; 

                            UtilJS.Loading.Hide();
                            if (response.objCodeStep.Status == 'Error') {
                                jAlert.Error(response.objCodeStep.Message, 'Thông báo');
                                return;
                            }
                            if (response.objCodeStep.Status == 'Warning') {
                                jAlert.Warning(response.objCodeStep.Message, 'Thông báo');
                                return;
                            }
                            if (response.objCodeStep.Status == 'Success') {
                                scope.myroot.Lst = response.LstProduct;
                                scope.myroot.Pager.TotalItems = response.TotalItems;
                                scope.myroot.Pager.CurrentPage = intPage;
                            }
                        }, 100);
                    },
                    function (error) {
                        UtilJS.Loading.Hide();
                        return;
                    }
                );
            };
            scope.myroot.Paging = function (intPage) {
                intPage = !intPage ? 1 : intPage;
                scope.myroot.btnSearch.OnClick(intPage);
                //scope.myroot.Pager.CurrentPage = intPage;
            };

            scope.myroot.ChoosedProduct = function (item) {
                scope.myroot.CallBack.ChoosedItem(item);
            };

            scope.myroot.btnAdd.OnClick = function () {
                var LstSelected = $filter("filter")(scope.myroot.Lst, { IsChecked_: true }) || [];
                scope.myroot.CallBack.ChoosedItems(LstSelected);
            };

            scope.myroot.API.ShowModal = function () { 
                if (!scope.myroot.Core.IsShowCategory) {
                    $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                    return;
                }
                if (scope.myroot.Core.IsInitData) {
                    $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                    return;
                }
                

                if (scope.myroot.Core.LstUserProductCategoryTree) {
                    scope.myroot.ddlUserProductCategory.TreeData = scope.myroot.Core.LstUserProductCategoryTree;
                    scope.myroot.Core.IsInitData = true;
                    $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                }
                else { 
                    UserProductCategoryFactory.GetLstUserProductCategoryTree(scope.myroot.Core.BusinessType, scope.myroot.Core.IsPermission_AllCategories)
                    .then(function (LstUserProductCategoryTree) {
                        scope.myroot.ddlUserProductCategory.TreeData = LstUserProductCategoryTree;
                        $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                        scope.myroot.Core.IsInitData = true;
                    });
                }
            };
            scope.myroot.API.Search = function () { 
                scope.myroot.btnSearch.OnClick(1);
            };
            scope.myroot.API.HideModal = function () {
                $(element[0].querySelector('.PnSupplierSearchModal')).modal('hide');
            };
            scope.myroot.API.ResetModal = function () { 
                scope.myroot.txtSearch.Text = '';
                scope.myroot.Lst = [];
                //scope.myroot.ddlUserProductCategory.element.jstree('deselect_all');
            };
        }
    };
};

productInventorySearchModal.$inject = ["$http", "$timeout", "$filter", "$rootScope", "CommonFactory", "UserProductCategoryFactory"];
addDirective("productInventorySearchModal", productInventorySearchModal);