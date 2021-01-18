var DataFactory = function ($rootScope, $localstorage, $timeout, UtilFactory, $q, $http, CommonFactory) {
    var service = {}; 

    service.DepartmentTree_Read = function () {
        let defer = $q.defer();
        service.Department_Get()
            .then(function (response) {
                let result = {};
                result.Data = _.map(response.Data, _.clone);
                result.Data.forEach((x) => {
                    x.id = x.DepartmentID;
                    x.text = x.DepartmentName;
                    x.parent = x.ParentID;
                    if (x.ParentID == 0) {
                        x.parent = "#";
                    }
                    if (x.id == x.parent) {
                        console.log('lỗi: id = parent', x);
                    }
                });

                defer.resolve(result);
            })
            .catch(function (response) {
                defer.reject(response);
            });
        return defer.promise;
    };
    service.Department_Get = function () {
        let strApiEndPoint = ApiEndPoint.DepartmentResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, { CacheKeyClient: CacheKeyClient.Department });
    };

    service.Suppliers_Get = function () {
        let strApiEndPoint = ApiEndPoint.SupplierResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, {
            CacheKeyClient: CacheKeyClient.Supplier
        });
    };
    service.CustomerMemberTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.CustomerMemberType 
        });
    };
    service.StoreTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.StoreType
        });
    };
    //#region IvenCenterStockType
    service.IvenCenterStockTypes_Get = function () {
        let strApiEndPoint = ApiEndPoint.IvenCenterStockTypesResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, {
            CacheKeyClient: CacheKeyClient.IvenCenterStockType
        });
    };
    //#endregion
    //#region PaymentType
    service.PaymentTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.PaymentType
        });
    };
    //#endregion

    //#region VoucherType
    service.VoucherTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.VoucherType
        });
    };
    //#endregion

    //#region VoucherGroup
    service.VoucherGroups_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.VoucherGroup
        });
    };
    //#endregion

    //#region Store
    service.Stores_Get = function () {
        let strApiEndPoint = ApiEndPoint.StoreResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, {
            CacheKeyClient: CacheKeyClient.Store
        });
    };
    //#endregion

    //#region InvoiceStatus
    service.InvoiceStatus_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.InvoiceStatus
        });
    };
    //#endregion

    //#region PayFormStatus
    service.PayFormStatus_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.PayFormStatus
        });
    };
    //#endregion

    //#region PayFormType
    service.PayFormTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.PayFormType
        });
    };
    //#endregion

    //#region VoucherBank
    service.VoucherBanks_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.VoucherBank
        });
    };
    //#endregion

    //#region OutputType
    service.OutputTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.OutputType
        });
    };
      
    service.OutputTypes_ByUserLogin = function () {
        let defer = $q.defer();
        CommonFactory.PostMethod("/OutputTypes/GetByUser/")
            .then((response) => {
                if (response.StatusCode == 204) {
                    response.Is204 = true;
                    response.Data = [];
                    return defer.resolve(response);
                }
                return defer.resolve(response);
            })
            .catch((response) => {
                response.Data = [];
                return defer.resolve(response);
            });
        return defer.promise;
    }

    //#endregion

    //#region OutputGroup
    service.OutputGroups_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.OutputGroup
        });
    };
    //#endregion

    //#region UserStore
    service.UserStores_Get = function () {
        let defer = $q.defer();
        CommonFactory.PostMethod("/Users/GetStore/")
            .then((response) => {
                if (response.StatusCode == 204) {
                    response.Is204 = true;
                    response.Data = [];
                    return defer.resolve(response);
                }
                return defer.resolve(response);
            })
            .catch((response) => {
                return defer.reject(response);
            });
        return defer.promise;
        //return CommonFactory.GetMethod("", {}, { CacheKeyClient: CacheKeyClient.UserStore_ID });
    };
    //#endregion

    service.Users_Get = () => {
        let defer = $q.defer();
        let strApiEndPoint = "/Users/List/";
        CommonFactory.PostMethod(strApiEndPoint)
            .then(function (response) {
                if (response.objCodeStep.Status === "Warning") {
                    defer.reject(response);
                }
                return defer.resolve(response);
            })
            .catch(function (response) {
                defer.reject(response);
            });
        return defer.promise;
    };

    //#region PurcOrderStatus
    service.PurcOrderStatus_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.PurcOrderStatus
        });
    };
    //#endregion

    //#region InputGroup
    service.InputGroups_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.InputGroup
        });
    };
    //#endregion

    //#region InputType
    service.InputTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.InputType
        });
    };
    //#endregion

    //#region SalaryShift
    service.SalaryShifts_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.SalaryShift
        });
    };
    //#endregion

    //#region PromotionType
    service.PromotionTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.PromotionType
        });
    };
    //#endregion

    //#region StoreChangeType
    service.StoreChangeTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.StoreChangeType
        });
    };
    //#endregion

    //#region TransportType
    service.TransportTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.TransportType
        });
    };
    //#endregion

    //#region Shelf
    service.Shelfs_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.Shelf
        });
    };
    //#endregion

    //#region StoreGroup Tree
    service.StoreGroup_Get = function (Lst) {
        //get parent
        let ParentStoreGroupManagers = Lst.filter((x) => x.ParentStoreGroupID === 0 && x.StoreID === 0);
        let StoreGroups = [];
        Lst.filter((x) => {
            if (_.find(StoreGroups, (c) => c.StoreGroupID === x.StoreGroupID && c.ParentStoreGroupID === x.ParentStoreGroupID)) {
                return;
            }
            StoreGroups.push({
                StoreGroupID: x.StoreGroupID,
                StoreGroupName: x.StoreGroupName,
                ParentStoreGroupID: x.ParentStoreGroupID
            });
        });
        let LstStoreGroup = [];
        ParentStoreGroupManagers.filter((x) => {
            StoreGroups.push({
                StoreGroupID: x.StoreGroupID,
                StoreGroupName: x.StoreGroupName,
                ParentStoreGroupID: x.ParentStoreGroupID,
                DeliveryDayNumber: x.DeliveryDayNumber,
                IsActived: x.IsActived
            });
        });
        return StoreGroups;
    };
    service.StoreGroup_ReadAll = function () {
        let defer = $q.defer();
        let strApiEndPoint = "/StoreGroups/List/";
        CommonFactory.PostMethod(strApiEndPoint)
            .then(function (response) {
                if (response.objCodeStep.Status === "Warning") {
                    defer.reject(response);
                }
                return defer.resolve(response);
            })
            .catch(function (response) {
                defer.reject(response);
            });
        return defer.promise;
    };
    service.StoreGroupTree_Read = function () {
        let defer = $q.defer();
        service.StoreGroup_ReadAll()
            .then(function (response) {
                defer.resolve(response);
            })
            .catch(function (response) {
                defer.reject(response);
            });
        return defer.promise;
    };
    //#endregion

    //#region StoreSize
    service.StoreSizes_Get = function () {
        let strApiEndPoint = ApiEndPoint.StoreSizeResource;
        //return CommonFactory.GetMethod(strApiEndPoint);
        return CommonFactory.GetMethod(strApiEndPoint, {}, { CacheKeyClient: CacheKeyClient.StoreSize });
    };
    //#endregion

    //#region Province
    service.Provinces_Get = function () {
        let strApiEndPoint = ApiEndPoint.ProvinceResource;
        //return CommonFactory.GetMethod(strApiEndPoint);
        return CommonFactory.GetMethod(strApiEndPoint, {}, { CacheKeyClient: CacheKeyClient.Province });
    };
    //#region District
    service.Districts_Get = function () {
        let strApiEndPoint = ApiEndPoint.DistrictResource;
        //return CommonFactory.GetMethod(strApiEndPoint);
        return CommonFactory.GetMethod(strApiEndPoint, {}, { CacheKeyClient: CacheKeyClient.District });
    };

    service.Areas_Get = function () {
        let strApiEndPoint = ApiEndPoint.AreasResource;
        //return CommonFactory.GetMethod(strApiEndPoint);
        return CommonFactory.GetMethod(strApiEndPoint, {}, { CacheKeyClient: CacheKeyClient.Areas });
    };

    //#region PriceRegion
    service.PriceRegions_Get = function () {
        let strApiEndPoint = ApiEndPoint.PriceRegionResource;
        //return CommonFactory.GetMethod(strApiEndPoint);
        return CommonFactory.GetMethod(strApiEndPoint, {}, { CacheKeyClient: CacheKeyClient.PriceRegions });
    };
    //#endregion

    service.ProductCategoriesTree_Read = function (ReadAllData) {
        let defer = $q.defer();
        if (ReadAllData) {
            service.ProductCategories_Get().then((response) => {
                let lstFull = response.Data;
                //mac dinh la chua chon het
                lstFull.forEach((item) => {
                    item.id = item.CategoryID;
                    item.text = item.CategoryName;
                    item.parent = item.ParentCategoryID == 0 ? "#" : item.ParentCategoryID;
                });
                return defer.resolve(response);
            }).catch((response) => {
                UtilJS.Loading.Hide();
                throw response;
            });
            return defer.promise;
        }
        else {
            $q.all({
                res1: service.ProductCategories_Get(),
                res2: service.ProductCategories_ByUserLogin()
            }).then((MultipleRes) => {
                let lstFull = MultipleRes.res1.Data;
                let lstChild = MultipleRes.res2.Data;

                //mac dinh la chua chon het
                lstFull.forEach((item) => {
                    item.id = item.CategoryID;
                    item.text = item.CategoryName;
                    item.parent = item.ParentCategoryID == 0 ? "#" : item.ParentCategoryID;
                    item.IsHide = true;
                });

                //lay ra cac id selected tren 2 ddl
                var lstIDChoosed = [];
                lstChild.filter((x) => lstIDChoosed.push(x.CategoryID));

                //tim ra cac id parent cua cac id selected dc ddl chọn
                lstFull.forEach((item) => {
                    if (_.contains(lstIDChoosed, item.id)) {
                        item.IsHide = false;
                        //tim ra cac unique parentid để hiện lên
                        service.GetParentsByID(lstFull, item.parent);
                    }
                });

                //filter cac id có selected trong list table
                let LstFilter = lstFull.filter((x) => !x.IsHide);

                MultipleRes.res2.Data = LstFilter;
                return defer.resolve(MultipleRes.res2);
            }).catch((response) => {
                UtilJS.Loading.Hide();
                throw response;
            });
            return defer.promise;
        }
    };
    service.GetParentsByID = function (Lst, parentid) {
        if (parentid != "#") {
            var ParentOwn = _.find(Lst, (x) => x.id === parentid);

            if (ParentOwn) {
                //node cha ma` da~ dc bật. tức là các level cha tiếp theo cũng đã được bật
                if (ParentOwn.IsHide) {
                    ParentOwn.IsHide = false;
                    service.GetParentsByID(Lst, ParentOwn.parent);
                }
            }
        }
    }
    service.ProductCategories_Get = () => {
        return CommonFactory.GetMethod("", {}, { CacheKeyClient: CacheKeyClient.ProductCategories });
    };
    service.ProductCategories_ByUserLogin = function () {
        let defer = $q.defer();
        CommonFactory.PostMethod("/Users/GetProductCategories/")
            .then((response) => {
                if (response.StatusCode == 204) {
                    response.Is204 = true;
                    response.Data = [];
                    return defer.resolve(response);
                }
                return defer.resolve(response);
            })
            .catch((response) => {
                return defer.reject(response);
            });
        return defer.promise;
    }

    //#region Store Tree
    service.StoreTree_Read = (ReadAllData) => {
        let defer = $q.defer();
        let cb = (lstFull) => {
            var LstUserStore = [];
            var LstArea = _.groupBy(lstFull, 'AreaID');
            for (var item in LstArea) {
                //add item cha
                var itemParent = {};
                itemParent.id = "G_" + item;
                itemParent.text = LstArea[item][0].AreaName;
                itemParent.parent = "#";
                itemParent.IsSaleStore = true; // chỉ hiển thị các kho bán hàng
                itemParent.ProvinceIDs = [];
                itemParent.DistrictIDs = [];
                //add item con
                LstArea[item].forEach((x) => {
                    var itemChild = x;
                    itemChild.id = x.StoreID;
                    itemChild.text = x.StoreName;
                    itemChild.parent = "G_" + x.AreaID.toString();
                    itemChild.ProvinceID = x.ProvinceID;
                    itemChild.DistrictID = x.DistrictID;
                    itemChild.ProvinceIDs = [];
                    itemChild.DistrictIDs = [];
                    LstUserStore.push(itemChild);
                    itemParent.ProvinceIDs.push(x.ProvinceID);// = LstArea[item][0].ProvinceID;
                    itemParent.DistrictIDs.push(x.DistrictID);// LstArea[item][0].DistrictID;


                });
                LstUserStore.push(itemParent);

            }
            return LstUserStore;
        };
        //isAdmin
        if (ReadAllData) {
            service.Stores_Get().then((response) => {
                response.Data = cb(response.Data.filter(c => c.IsActived));
                defer.resolve(response);
            }).catch((response) => {
                defer.reject(response);
            });
            return defer.promise;
        }
        //!isAdmin
        else {
            service.UserStores_Get().then((response) => {
                response.Data = cb(response.Data);
                defer.resolve(response);
            }).catch((response) => {
                defer.reject(response);
            });
            return defer.promise;
        }
    };
    //#endregion

    //#region DeliveryFees
    service.DeliveryFees_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.DeliveryFee
        });
    };
    //#endregion

    //#region DeliveryTypes
    service.DeliveryTypes_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.DeliveryType
        });
    };
    //#endregion

    //#region Company
    service.Companies_Get = function () {
        let strApiEndPoint = ApiEndPoint.CompaniesResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, {
            CacheKeyClient: CacheKeyClient.Company
        });
    };

    //#endregion

    //#region CurrencyUnit
    service.CurrencyUnit_Get = function () {
        let strApiEndPoint = ApiEndPoint.CurrencyUnitsResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, {
            CacheKeyClient: CacheKeyClient.CurrencyUnit
        });
    };
    //#endregion
    //#region InvoiceType
    service.InvoiceType_Get = function () {
        let strApiEndPoint = ApiEndPoint.ACC_InvoiceTypesResource;
        return CommonFactory.GetMethod(strApiEndPoint, {}, {
            CacheKeyClient: CacheKeyClient.InvoiceType
        });
    };
    //#endregion

    //#region ShippingStatus
    service.ShippingStatus_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.ShippingStatus
        });
    };
    //#endregion

    //#region BusinessType
    service.BusinessType_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.BusinessType
        });
    };
    //#endregion
    //#region TaxValue
    service.TaxValue_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.TaxValue
        });
    };
    //#endregion

    //#region Account
    service.Accounts_Get = function () {
        return CommonFactory.GetMethod("", {}, {
            CacheKeyClient: CacheKeyClient.Account
        });
    };
    //#endregion

    return service;
};
DataFactory.$inject = ["$rootScope", "$localstorage", "$timeout", "UtilFactory", "$q", "$http", "CommonFactory"];