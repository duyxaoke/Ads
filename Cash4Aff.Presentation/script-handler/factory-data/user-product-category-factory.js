var UserProductCategoryFactory = function ($rootScope, $localstorage, $timeout, UtilFactory, $q, $http, CommonFactory) {

    var service = {};

    service.GetLstUserProductCategoryTree = function (BusinessType, IsPermission_AllCategories) {
        return $q(function (resolve, reject) { 
            if (!$rootScope.DataRoot.LstUserProductCategoryTree) {
                UtilJS.Loading.Show();
                dataSend = {};
                dataSend.BusinessType = BusinessType;
                dataSend.IsPermission_AllCategories = IsPermission_AllCategories;
                CommonFactory.PostDataAjax("/Directives/GetProductCategoryByUserID", dataSend,
                    function (beforeSend) { },
                    function (response) {
                        $timeout(function () {
                            UtilJS.Loading.Hide();
                            if (response.objCodeStep.Status == jAlert.Status.Error) {
                                jAlert.Error(response.objCodeStep.Message, 'Thông báo');
                                reject();
                            }
                            if (response.objCodeStep.Status == jAlert.Status.Warning) {
                                jAlert.Warning(response.objCodeStep.Message, 'Thông báo');
                                reject();
                            }
                            if (response.objCodeStep.Status == jAlert.Status.Success) {
                                $rootScope.DataRoot.LstUserProductCategoryTree = response.LstUserProductCategoryTree;
                                resolve($rootScope.DataRoot.LstUserProductCategoryTree);
                            }
                        }, 100);
                    },
                    function (error) {
                        UtilJS.Loading.Hide();
                        reject();
                    }
                );
            }
            else {
                resolve($rootScope.DataRoot.LstUserProductCategoryTree);
            } 
        });
    };

    service.FilterCategoryByParentID = function (LstFull, id, LstOut) {
        let LstParent = _.where(LstFull, { id: id });
        if (LstParent.length > 0) {
            LstOut.push(LstParent[0]);

            let LstChild = _.where(LstFull, { parent: LstParent[0].id });
            if (LstChild.length > 0) {
                LstChild.forEach(function (item) {
                    service.FilterCategoryByParentID(LstFull, item.id, LstOut);
                });
            }
        }
    };
      
    //get het note lá multiple level
    service.FilterLastChildsByParentID = function (LstFull, id, LstOut) {
        let Parent = _.find(LstFull, (x) => x.id == id);
        if (Parent) {
            let LstChild = _.filter(LstFull, { parent: Parent.id });
            if (LstChild.length > 0) {
                LstChild.forEach(function (item) {
                    service.FilterLastChildsByParentID(LstFull, item.id, LstOut);
                });
            }
            else if (LstChild.length == 0) {
                LstOut.push(id);
            }
        }
    };

    return service;
};

UserProductCategoryFactory.$inject = ["$rootScope", "$localstorage", "$timeout", "UtilFactory", "$q", "$http", "CommonFactory"];
addFactory("UserProductCategoryFactory", UserProductCategoryFactory);
