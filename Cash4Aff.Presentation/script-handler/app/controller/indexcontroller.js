var MasterPageController = function ($scope, $rootScope, $timeout, $filter, CommonFactory, UtilFactory, $localstorage, ApiHelper) {
    $rootScope.MasterPage = { IsLoading: false };
    $rootScope.UserPricinpal = {};
    $rootScope.DataRoot = {};
    $rootScope.InitUserPrincipal = function (objUserPrincipal, IsRefesh) {
        try {
            $localstorage.remove("UserPricinpal");
            if (objUserPrincipal
                && objUserPrincipal.UserPermission
                && objUserPrincipal.UserPermission.length > 0) {
                objUserPrincipal.UserPermission = objUserPrincipal.UserPermission
                    .map(x => x.RoleFunctionName)
                    .filter((value, index, self) => self.indexOf(value) === index);
            }
            $localstorage.setObject("UserPricinpal", objUserPrincipal);

            if (IsRefesh) {
                $rootScope.UserPricinpal.Token = objUserPrincipal.Token;
                $rootScope.UserPricinpal.ExpireDate = objUserPrincipal.ExpireDate;
            }
        } catch (e) {
            ApiHelper.WriteLogServerError(e, "UserPricinpal.InitUserPrincipal");
        }
    };
    if (MasterData.NeedUpdate) {
        if (MasterData.objUserPrincipal === undefined) {
            MasterData.objUserPrincipal = {};
        }
        $rootScope.InitUserPrincipal(MasterData.objUserPrincipal);
    }
    $rootScope.UserPricinpal = $localstorage.getObject("UserPricinpal");
    if (!$rootScope.UserPricinpal) {
        $rootScope.UserPricinpal = {};
    }
    //xử lý tạm user login khác localstorage
    if (MasterData.UserIDCurrent !== $rootScope.UserPricinpal.UserID) {
        $localstorage.remove("UserPricinpal");
        $rootScope.UserPricinpal = {};
    }

    $rootScope.MasterPage.RemoveCache = function () {
        //UtilJS.Loading.Show();
        $timeout(function () {
            var url = "/OutputCaches/Remove";
            var dataSend = {};
            CommonFactory.PostDataAjax(url, dataSend,
                function (beforeSend) { },
                function (response) {
                    //UtilJS.Loading.Hide();
                    $timeout(function () {
                        if (response.objCodeStep.Status == 'Error') {
                            jAlert.Error(response.objCodeStep.Message);
                            return;
                        }
                        if (response.objCodeStep.Status == 'Success') {
                            jAlert.Success("Xóa Outputcache thành công");
                            return;
                        }
                    }, 100);
                },
                function (error) {
                    //UtilJS.Loading.Hide();
                    return;
                }
            );
        });
    }
    $rootScope.UserPricinpal.IsInRole = function (RoleFunctionName) {
        let UserPricinpal = $localstorage.getObject("UserPricinpal");
        if (!UserPricinpal) {
            return false;
        }
        if (UserPricinpal.Username == '0000') return true;
        let LstExist = _.filter(UserPricinpal.UserPermission, function (roleFunctionName) {
            if (RoleFunctionName == roleFunctionName) {
                return true;
            }
            return false;
        });
        if (LstExist.length == 0) {
            return false;
        }
        return true;
    }
    $rootScope.UserPricinpal.IsAllowDepartment = function (departmentID) { 
        return _.find($rootScope.UserPricinpal.UserRoleDepartmentIDs, (x) => x == departmentID) !== undefined;
    }
    $rootScope.scrollToTopInputValid = function () {
        if ($($('.has-error')[0]) != undefined)
            $("html, body").animate({ scrollTop: $($('.has-error')[0]).offset().top }, "slow");
    };
    
}
MasterPageController.$inject = ["$scope", "$rootScope", "$timeout", "$filter", "CommonFactory", "UtilFactory", "$localstorage", "ApiHelper"];