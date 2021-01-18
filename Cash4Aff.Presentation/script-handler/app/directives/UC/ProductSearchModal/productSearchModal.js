var productSearchModal = function ($http, $timeout, $filter, $rootScope, CommonFactory, $q, UserProductCategoryFactory) {
    return {
        restrict: 'E',

        scope: {
            myroot: "="
        },

        templateUrl: "/script-handler/app/directives/UC/ProductSearchModal/OSProductSearchModal.html",

        link: function (scope, element, attrs) {

            //#region Default param
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
            if (scope.myroot.Core.IsShowQuantity === undefined) {
                scope.myroot.Core.IsShowQuantity = false;
            }

            if (!scope.myroot.Core.ActionURL) {
                scope.myroot.Core.ActionURL = "/Directives/GetProduct";
            }
            //else if (scope.myroot.Core.ActionURL == "/Directives/UCIvenCenterStocksSearch") {
            //    scope.myroot.Core.TotalColumn = 6;
            //    scope.myroot.Core.IsShowQuanity = true;
            //}
            if (scope.myroot.Core.IsShowQuanity) {
                scope.myroot.Core.TotalColumn = 6;
            }

            if (!scope.myroot.Core.PopupType) {
                scope.myroot.Core.PopupType = "Single";
            }
            if (scope.myroot.PopupType == "Single") {
                scope.myroot.Core.TotalColumn = scope.myroot.Core.TotalColumn--;
            }

            if (!scope.myroot.Core.treePlugins) {
                scope.myroot.Core.treePlugins = 'search';
            }
            //#endregion default param

            scope.myroot.Lst = [];
            if (!scope.myroot.txtSearch) {
                scope.myroot.txtSearch = { Text: '' };
            }
            if (!scope.myroot.txtSearch.placeholder) {
                scope.myroot.txtSearch.placeholder = 'Mã sản phẩm, tên sản phẩm';
            }
            scope.myroot.btnSearch = {};
            scope.myroot.btnAdd = {};

            scope.myroot.ddlUserProductCategory = { IDSelectedTimeOut: false, IsSelectedAll: scope.myroot.IsSelectedAll }; 
            scope.myroot.ddlUserProductCategory.core = {
                themes: {
                    icons: false
                }
            };
            if (!scope.myroot.Core.IsInitData && scope.myroot.Core.LstUserProductCategoryTree) {
                scope.myroot.ddlUserProductCategory.TreeData = scope.myroot.Core.LstUserProductCategoryTree;
                scope.myroot.Core.IsInitData = true;
            }

            scope.myroot.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };
            scope.myroot.CustomFilter = function (item) {
                return true;
            };
            scope.myroot.btnSearch.OnClick = function (intPage) {
                if (scope.myroot.ddlUserProductCategory.NodeResult.IDSelected.length == 0) {
                    jAlert.Warning("Vui lòng chọn ngành hàng", "Thông báo");
                    return;
                }
                let CategoryIDs = [];
                if (scope.myroot.Core.treeType && scope.myroot.Core.treeType == 'GetLastNodeChildren') {
                    let categoryid = scope.myroot.ddlUserProductCategory.NodeResult.IDSelected[0].toString();
                    UserProductCategoryFactory.FilterLastChildsByParentID(
                        scope.myroot.ddlUserProductCategory.TreeData,
                        categoryid,
                        CategoryIDs);

                    if (CategoryIDs.length > 1) {
                        jAlert.Warning("Vui lòng chọn ngành hàng có nhánh con", "Thông báo");
                        return;
                    }
                }
                else {
                    CategoryIDs = scope.myroot.ddlUserProductCategory.NodeResult.IDSelected;
                }

                //let CategoryIDs = [];
                //if (scope.myroot.ddlUserProductCategory.NodeResult.IDSelected.length == 0) {
                //    jAlert.Warning("Vui lòng chọn ngành hàng", "Thông báo");
                //    return;
                //}
                //let categoryid = scope.myroot.ddlUserProductCategory.NodeResult.IDSelected[0].toString();
                //UserProductCategoryFactory.FilterLastChildsByParentID(
                //    scope.myroot.ddlUserProductCategory.TreeData,
                //    categoryid,
                //    CategoryIDs);

                //if (CategoryIDs.length == 0) {
                //    jAlert.Warning("Vui lòng chọn ngành hàng có nhánh con", "Thông báo");
                //    return;
                //}

                intPage = !intPage ? 1 : intPage; 
                dataSend = {
                    intPage: intPage,
                    strKeyWord: scope.myroot.txtSearch.Text,
                    CategoryIDs: CategoryIDs 
                };
                if (scope.myroot.Core.ActionURL == "/Directives/GetProduct4StoreChange") {
                    dataSend.StoreID = scope.myroot.Core.StoreID; 
                }
                //get kho DC (keppel)
                //if (scope.myroot.Core.ActionURL == "/Directives/UCIvenCenterStocksSearch") {
                //    dataSend.Stocktype = scope.myroot.Core.Stocktype;
                //}
                //get kho cửa hàng, kho lỗi, kho trung tâm
                if (scope.myroot.Core.ActionURL == "/Directives/GetIvenCurrentInStocksInventory") {
                    if (!scope.myroot.Core.StoreID) {
                        jAlert.Warning("Vui lòng chọn cửa hàng xuất", "Thông báo");
                        return;
                    }
                    dataSend.StoreID = scope.myroot.Core.StoreID;
                }
                if (!scope.myroot.txtSearch.Text) {
                    jAlert.Warning("Vui lòng nhập từ khóa tìm kiếm", "Thông báo");
                    return;
                }

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

            scope.myroot.ChoosedProduct = function (item) {
                scope.myroot.CallBack.ChoosedItem(item);
            };

            scope.myroot.btnAdd.OnClick = function () {
                var LstSelected = $filter("filter")(scope.myroot.Lst, { IsChecked_: true }) || [];
                scope.myroot.CallBack.ChoosedItems(LstSelected);
            };

            scope.myroot.API.ShowModal = function () {
                if (!scope.myroot.Core.IsInitData && scope.myroot.Core.LstUserProductCategoryTree) {
                    scope.myroot.ddlUserProductCategory.TreeData = scope.myroot.Core.LstUserProductCategoryTree;
                    scope.myroot.Core.IsInitData = true;
                    $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                }
                else if (!scope.myroot.Core.IsInitData) {
                    UserProductCategoryFactory.GetLstUserProductCategoryTree(scope.myroot.Core.BusinessType, scope.myroot.Core.IsPermission_AllCategories)
                    .then(function (LstUserProductCategoryTree) {
                        scope.myroot.ddlUserProductCategory.TreeData = LstUserProductCategoryTree;
                        scope.myroot.Core.IsInitData = true;
                        $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                    });
                }
                else {
                    scope.myroot.Core.IsInitData = true;
                    $(element[0].querySelector('.PnSupplierSearchModal')).modal('show');
                }
            };
            scope.myroot.API.Search = function () {
                if (scope.myroot.Core.ActionURL == "/Directives/GetProduct4StoreChange" && !scope.myroot.Core.StoreID) {
                    jAlert.Warning("Vui lòng chọn cửa hàng xuất", "Thông báo");
                    return;
                }
                scope.myroot.Lst = [];
                scope.myroot.btnSearch.OnClick(1);
            };
            scope.myroot.API.HideModal = function () {
                $(element[0].querySelector('.PnSupplierSearchModal')).modal('hide');
            };
            scope.myroot.API.ResetModal = function () {
                scope.myroot.txtSearch.Text = '';
                scope.myroot.Lst = [];
                scope.myroot.ddlUserProductCategory.element.jstree('deselect_all');
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

productSearchModal.$inject = ["$http", "$timeout", "$filter", "$rootScope", "CommonFactory", "$q", "UserProductCategoryFactory"];
addDirective("productSearchModal", productSearchModal);