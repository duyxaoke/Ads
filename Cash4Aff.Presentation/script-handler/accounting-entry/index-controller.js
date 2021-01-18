var IndexController = ($scope, $rootScope, $timeout, $filter, ApiHelper, UtilFactory, DataFactory, $q, CommonFactory) => {

    //#region declare variable
    $scope.objAccount = {}

    $scope.objAccount.FormSearch = {
        DepartmentID: '-1',
        txtSearch: { Text: '' },
        btnSearch: {},
        btnExportExcel: {},
        IsOSID: '-1'
    };
    $scope.objAccount.Lst = [];
    $scope.objAccount.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };
    $scope.objAccount.FormSearch.dtmFrom = '';
    $scope.objAccount.FormSearch.dtmTo = '';
    //#endregion

    //#region Build Select Multi
    $scope.ddlCompany = { Core: {}, CallBack: {} };
    $scope.ddlCompany.Core.Text = 'CompanyName';
    $scope.ddlCompany.Core.IDValue = 'CompanyID';
    $scope.ddlCompany.Core.Label = 'Tất cả';
    $scope.ddlCompany.Core.IsCheckAll = true;
    $scope.ddlCompany.Core.IsShowCheckboxAll = true;
    $scope.ddlCompany.Core.IsShowSearch = true;
    $scope.ddlCompany.Lst = [];


    $scope.ddlBusinessType = { Core: {}, CallBack: {} };
    $scope.ddlBusinessType.Core.Text = 'BusinessTypeName';
    $scope.ddlBusinessType.Core.IDValue = 'BusinessTypeID';
    $scope.ddlBusinessType.Core.Label = 'Tất cả';
    $scope.ddlBusinessType.Core.IsCheckAll = true;
    $scope.ddlBusinessType.Core.IsShowCheckboxAll = true;
    $scope.ddlBusinessType.Core.IsShowSearch = true;
    $scope.ddlBusinessType.Lst = [];

    $scope.ddlSupplier = { Core: {}, CallBack: {} };
    $scope.ddlSupplier.Core.Text = 'SupplierName';
    $scope.ddlSupplier.Core.IDValue = 'SupplierID';
    $scope.ddlSupplier.Core.Label = 'Tất cả';
    $scope.ddlSupplier.Core.IsCheckAll = true;
    $scope.ddlSupplier.Core.IsShowCheckboxAll = true;
    $scope.ddlSupplier.Core.IsShowSearch = true;
    $scope.ddlSupplier.Lst = [];
    //#endregion

    //#region build DateTime
    $scope.dtmDateFrom = { Core: {}, CallBack: {} };
    $scope.dtmDateFrom.Core.DateType = "Date";
    $scope.dtmDateFrom.CallBack.OnValuechanged = (x) => {
        $scope.objAccount.DateFrom = null;
        if (UtilJS.DateTime.IsValid(x)) {
            $scope.objAccount.DateFrom = x + " 00:00:00";
            let StartDate = moment(x)._d;
            $scope.dtmDateTo.API.SetMinDate(StartDate);
        }
    };
    $scope.dtmDateTo = { Core: {}, CallBack: {} };
    $scope.dtmDateTo.Core.DateType = "Date";
    $scope.dtmDateTo.CallBack.OnValuechanged = (x) => {
        $scope.objAccount.DateTo = null;
        if (x) {
            $scope.objAccount.DateTo = x + " 23:59:59";
        }
    };
    //#endregion

    //#region Load List

    $scope.Paging = function (intPage) {
        intPage = !intPage ? 1 : intPage;
        $scope.objAccount.Pager.CurrentPage = intPage;
        $scope.Search(intPage);
    }

    $scope.Search = function (intPage) {
        intPage = !intPage ? 1 : intPage;

        if ($scope.ddlCompany.Result.LstIDSelected.length === 0) {
            jAlert.Warning("Vui lòng chọn công ty");
            return;
        }

        if ($scope.ddlBusinessType.Result.LstIDSelected.length === 0) {
            jAlert.Warning("Vui lòng chọn loại nghiệp vụ");
            return;
        }

        if ($scope.ddlSupplier.Result.LstIDSelected.length === 0) {
            jAlert.Warning("Vui lòng chọn nhà cung cấp");
            return;
        }

        let obj = {};
        obj.KeySearch = $scope.objAccount.txtSearch;
        obj.FromDate = $scope.objAccount.DateFrom;
        obj.ToDate = $scope.objAccount.DateTo;
        obj.CompanyIDs = $scope.ddlCompany.chkAll.IsChecked_ ? [] : $scope.ddlCompany.Result.LstIDSelected;
        obj.BusinessTypeIDs = $scope.ddlBusinessType.chkAll.IsChecked_ ? [] : $scope.ddlBusinessType.Result.LstIDSelected;
        obj.SupplierIDs = $scope.ddlSupplier.chkAll.IsChecked_ ? [] : $scope.ddlSupplier.Result.LstIDSelected;
        obj.PageIndex = intPage;
        obj.PageSize = 10;
        UtilJS.Loading.Show();

        var url = "/AccountingEntries/Search";
        CommonFactory.PostDataAjax(url,
            obj,
            function (beforeSend) { },
            function (response) {
                UtilJS.Loading.Hide();
                $scope.objAccount.Lst = [];
                if (response.objCodeStep.Status != jAlert.Status.Success) {
                    $scope.objAccount.Lst = [];
                    jAlert.Notify(response.objCodeStep);
                    return;
                } else if (response.objCodeStep.Status == jAlert.Status.Success) {
                    $scope.objAccount.Lst = response.objCodeStep.Data.Records;
                    $scope.objAccount.Pager.TotalItems = response.objCodeStep.Data.TotalRecord;
                    $scope.objAccount.Pager.CurrentPage = intPage;
                    $scope.objAccount.Pager.PageSize = response.objCodeStep.Data.PageSize;
                }
            },
            function (error) {
                UtilJS.Loading.Hide();
                return;
            }
        );


    }
    //#endregion

    //#region Export Excel
    $scope.btnExport_OnClick = function () {
        if ($scope.objAccount.Lst.length == 0) {
            jAlert.Warning('Không có dữ liệu để xuất');
            return;
        }
        let obj = {};
        obj.KeySearch = $scope.objAccount.txtSearch;
        obj.FromDate = $scope.objAccount.DateFrom;
        obj.ToDate = $scope.objAccount.DateTo;
        obj.CompanyIDs = $scope.ddlCompany.chkAll.IsChecked_ ? [] : $scope.ddlCompany.Result.LstIDSelected;
        obj.BusinessTypeIDs = $scope.ddlBusinessType.chkAll.IsChecked_ ? [] : $scope.ddlBusinessType.Result.LstIDSelected;
        obj.SupplierIDs = $scope.ddlSupplier.chkAll.IsChecked_ ? [] : $scope.ddlSupplier.Result.LstIDSelected;
        obj.PageIndex = -1;
        obj.PageSize = -1;
        UtilJS.Files.Download({
            url: "/AccountingEntries/ExportExcel",
            data: { obj:obj},
            beforsend: function () {
                $timeout(function () { UtilJS.Loading.Show(); });
            },
            callback: function (result) {
                $timeout(function () { UtilJS.Loading.Hide(); });
                if (result == undefined) return;
                if (result.objCodeStep.Status != jAlert.Status.Success) {
                    jAlert.Notify(result.objCodeStep);
                    return;
                }
            }
        });
    };

    //#endregion

    $scope.Create = function () { 
        window.open('/AccountingEntries/Create', '_blank');
    }

    UtilJS.Loading.Show();
    $q.all({
        Company: DataFactory.Companies_Get(),
        BusinessType: DataFactory.BusinessType_Get(),
        Suppliers: DataFactory.Suppliers_Get(),
        wait: UtilFactory.WaitingLoadDirective([

        ])
    }).then((Multiples) => {
        let today = new Date();
        let fromday = new Date();
        fromday.setDate(fromday.getDate() - 7);

        $scope.dtmDateFrom.API.SetValue(fromday);
        $scope.dtmDateTo.API.SetValue(today);

        $scope.ddlCompany.Lst = Multiples.Company.Data;
        $scope.ddlCompany.API.SelectAll();

        $scope.ddlBusinessType.Lst = Multiples.BusinessType.Data;
        $scope.ddlBusinessType.API.SelectAll();

        $scope.ddlSupplier.Lst = Multiples.Suppliers.Data;
        $scope.ddlSupplier.API.SelectAll();
        $timeout(() => { $rootScope.IsLoadPage = true; }, 0);
        UtilJS.Loading.Hide();
    });

}
IndexController.$inject = ["$scope", "$rootScope", "$timeout", "$filter", "ApiHelper", "UtilFactory", "DataFactory", "$q", "CommonFactory"];
addController("IndexController", IndexController);
