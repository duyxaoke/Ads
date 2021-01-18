var CreateController = ($scope, $rootScope, $timeout, $filter, ApiHelper, UtilFactory, DataFactory, $q, CommonFactory) => {

    //#region declare variable
    $rootScope.Permission = {};
    //$rootScope.Permission.isExportExcel = $rootScope.UserPricinpal.IsInRole("AccountingEntry.ExportOnline");

    $scope.AccountingEntry = {
        btnCreate: {},
        isNewRow: false
    };
    $scope.AccountingEntry.Lst = [];
    $scope.AccountingEntry.LstProduct = [];
    $scope.objAccountingEntry = {};
    $scope.PnPayFormDetail = DataSetting.objAccountEntry;
    $scope.PnPayFormDetail.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };
    $scope.PnPayFormDetail.PayFormDetails = DataSetting.objAccountEntry.Details;

    //#endregion

    //#region Build DateTime
    $scope.dtmEntryDate = { Core: {}, CallBack: {} };
    $scope.dtmEntryDate.Core.DateType = "Date";
    $scope.dtmEntryDate.Core.IsDisabled = true;
    $scope.dtmEntryDate.CallBack.OnValuechanged = (x) => {
        let DueDate = x;
        if (!UtilJS.DateTime.IsValid(x)) {
            DueDate = null;
        }
        $scope.objAccountingEntry.ACCEntryDate = moment(DueDate).format('MM/DD/YYYY 23:59:59');
    };
    //#endregion



    //#region Select2
    $scope.ddlCompany = { Core: {}, CallBack: {} };
    $scope.ddlCompany.Core.Text = 'CompanyName';
    $scope.ddlCompany.Core.IDValue = 'CompanyID';
    $scope.ddlCompany.Core.IsDisabled = true;
    $scope.ddlCompany.CallBack.Onchanged = function () {
        //$scope.objBankBranchs.Details.BankID = $scope.ddlBank.Value;
    };
    //#endregion

    $scope.addRow = function () {
        let objProduct = {};
        $scope.AccountingEntry.LstProduct.push(objProduct);

        UtilJS.Table.ResetScrollLeft();
        $scope.AccountingEntry.isNewRow = false;
    };

    //#region Export Excel
    $scope.btnExport_OnClick = function () {
        if ($scope.PnPayFormDetail.PayFormDetails.length == 0) {
            jAlert.Warning('Không có dữ liệu để xuất');
            return;
        }

        var obj = {};
        obj.id = $scope.PnPayFormDetail.ACCEntryID;
        obj.companyName = $scope.ddlCompany.Lst.find(x => x.CompanyID == $scope.ddlCompany.Value)?.CompanyName;

        UtilJS.Files.Download({
            url: "/AccountingEntries/ExportExcelForDetail",
            data: obj,
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
    
    //#region load data
    UtilJS.Loading.Show();
    $q.all({
        Companies: DataFactory.Companies_Get(),
        r4: UtilFactory.WaitingLoadDirective([
        ])
    }).then((Multiples) => {
        $scope.ddlCompany.Lst = Multiples.Companies.Data;
        $scope.ddlCompany.API.SetValue($scope.PnPayFormDetail.CompanyID);
        $scope.dtmEntryDate.API.SetValue($scope.PnPayFormDetail.ACCEntryDate);
        UtilJS.Loading.Hide();
        });


    UtilJS.Table.InitScrollTable("tabletest");
    
    $(function () {
        //customValidate.SetForm('formAddProduct', '');
        let mydata = DataSetting.treeAccount

        //$('#ddlPayableValue').comboTree({
        //    source: mydata,
        //    isMultiple: false,
        //    cascadeSelect: true,
        //    collapse: false
        //});
    });

    //#endregion
}
CreateController.$inject = ["$scope", "$rootScope", "$timeout", "$filter", "ApiHelper", "UtilFactory", "DataFactory", "$q", "CommonFactory"];
addController("CreateController", CreateController);
