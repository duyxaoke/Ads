var CreateController = ($scope, $rootScope, $timeout, $filter, ApiHelper, UtilFactory, DataFactory, $q, CommonFactory, UserProductCategoryFactory) => {

    //#region declare variable
    $rootScope.Permission = { isReadCategory: $rootScope.UserPricinpal.IsInRole("UserProductCategory.Read.All"), isCreate: $rootScope.UserPricinpal.IsInRole("AccountingEntry.Create")};
    $scope.objAccountingEntry = {};
    $scope.objAccountingEntryDetail = {};
    $scope.LstSelectAccount = DataSetting.lstAccount;
    //#endregion

    //#region Tree
    $scope.PayableAccount = { IDSelectedTimeOut: false, IsSelectedAll: false, IsLoadNodeSelected: true,  NodeResult: { IDSelected: [] } };
    $scope.PayableAccount.TreeData = [];
    $scope.PayableAccount.core = {
        themes: {
            icons: false
        }
    };
    $scope.PayableAccount.CallBack = {};
    $scope.PayableAccount.CallBack.OnHiddenBsDropdown = function () {
    };
    $scope.PayableAccount.CallBack.Changed_Jstree = function () {
        if ($scope.PayableAccount.NodeResult.IDSelected && $scope.PayableAccount.NodeResult.IDSelected.length > 0) {
            $scope.objAccountingEntryDetail.PayableID = $scope.PayableAccount.NodeResult.IDSelected[0];
            $('#PayableAccount').val($scope.objAccountingEntryDetail.PayableID).valid();
        }
        else {
            $('#PayableAccount').val('').valid();
        }
    };

    $scope.ReceivableAccount = { IDSelectedTimeOut: false, IsSelectedAll: false, IsLoadNodeSelected: true,  NodeResult: { IDSelected: [] } };
    $scope.ReceivableAccount.TreeData = [];
    $scope.ReceivableAccount.core = {
        themes: {
            icons: false
        }
    };
    $scope.ReceivableAccount.CallBack = {};
    $scope.ReceivableAccount.CallBack.OnHiddenBsDropdown = function () {
    };
    $scope.ReceivableAccount.CallBack.Changed_Jstree = function () {
        if ($scope.ReceivableAccount.NodeResult.IDSelected && $scope.ReceivableAccount.NodeResult.IDSelected.length > 0) {
            $scope.objAccountingEntryDetail.ReceivableID = $scope.ReceivableAccount.NodeResult.IDSelected[0];
            $('#ReceivableAccount').val($scope.objAccountingEntryDetail.ReceivableID).valid();
        }
        else {
            $('#ReceivableAccount').val('').valid();
        }
    };

    $scope.Departments = { IDSelectedTimeOut: false, IsSelectedAll: false, IsLoadNodeSelected: true,  NodeResult: { IDSelected: [] } };
    $scope.Departments.TreeData = [];
    $scope.Departments.core = {
        themes: {
            icons: false
        }
    };
    $scope.Departments.CallBack = {};
    $scope.Departments.CallBack.OnHiddenBsDropdown = function () {
    };
    $scope.Departments.CallBack.Changed_Jstree = function () {
        if ($scope.Departments.NodeResult.IDSelected && $scope.Departments.NodeResult.IDSelected.length > 0) {
            $scope.objAccountingEntryDetail.DepartmentID = $scope.Departments.NodeResult.IDSelected[0];
            $('#Departments').val($scope.objAccountingEntryDetail.DepartmentID).valid();
        }
        else {
            $('#Departments').val('').valid();
        }
    };

    $scope.IsCheckInvoice = false;

    //#endregion

    //#region Build DateTime
    $scope.dtmEntryDate = { Core: {}, CallBack: {} };
    $scope.dtmEntryDate.Core.DateType = "Date";
    $scope.dtmEntryDate.CallBack.OnValuechanged = (x) => {
        let DueDate = x;
        if (!UtilJS.DateTime.IsValid(x)) {
            DueDate = null;
        }
        $scope.objAccountingEntry.ACCEntryDate = moment(DueDate).format('MM/DD/YYYY 23:59:59');
    };
    //#endregion

    //#region Thông tin chi tiết
    $scope.PnPayFormDetail = {};
    $scope.PnPayFormDetail.Pager = { TotalItems: 0, PageSize: 10, CurrentPage: 1 };
    $scope.PnPayFormDetail.btnSearch = {};
    $scope.PnPayFormDetail.btnSearch.OnClick = function (intPage) {
        intPage = !intPage ? 1 : intPage;
        $scope.PnPayFormDetail.Pager.CurrentPage = intPage;
    };
    $scope.PnPayFormDetail.PayFormDetails = [];
    $scope.PnPayFormDetail.OpenModal = function () {
        $scope.PayableAccount.NameSelected = '';
        $scope.PayableAccount.NodeResult = [];
        $scope.PayableAccount.LoadLstNodeSelected = [];
        $('#PayableAccount').val('')
        $scope.ReceivableAccount.NameSelected = '';
        $scope.ReceivableAccount.NodeResult = [];
        $scope.ReceivableAccount.LoadLstNodeSelected = [];
        $('#ReceivableAccount').val('')
        $scope.Departments.NameSelected = '';
        $scope.Departments.NodeResult = [];
        $scope.Departments.LoadLstNodeSelected = [];
        $('#Departments').val('')
        customValidate.Reset('PnAddDetailModalForm');
        $scope.PnAddDetailModal.Title = 'Thêm chi tiết bút toán';
        $scope.objAccountingEntryDetail = {};
        $scope.PnPayFormDetail.IsUpdate = false;
        $('.PnAddDetailModal').modal('show');
    };
    //#endregion Thông tin chi tiết

    //#region Popup Add Detail Order
    $scope.PnAddDetailModal = {};
    $scope.PnPayFormDetail.ItemOnDelete = function (item) {
        jConfirm('Thông báo', 'Bạn có chắc muốn xóa?', function (isOK) {
            if (isOK) {
                $timeout(function () {
                    let Lst = $scope.PnPayFormDetail.PayFormDetails.filter(function (item_filter) {
                        return item_filter.index_key != item.index_key;
                    });
                    $scope.PnPayFormDetail.PayFormDetails = Lst;
                    jAlert.Success('Xóa thành công.');
                }, 100);
            }
        });
    };
    $scope.PnPayFormDetail.ItemOnEdit = function (item) {
        customValidate.Reset('PnAddDetailModalForm');
        $scope.objAccountingEntryDetail = JSON.parse(JSON.stringify(item));
        $scope.PayableAccount.API.SetSelected([parseInt($scope.objAccountingEntryDetail.PayableID)]).then(() => {
            $scope.PayableAccount.API.CloseAll();
            $scope.PayableAccount.API.UpdateSelected();
        });
        $scope.ReceivableAccount.API.SetSelected([parseInt($scope.objAccountingEntryDetail.ReceivableID)]).then(() => {
            $scope.ReceivableAccount.API.CloseAll();
            $scope.ReceivableAccount.API.UpdateSelected();
        });
        $scope.Departments.API.SetSelected([parseInt($scope.objAccountingEntryDetail.DepartmentID)]).then(() => {
            $scope.Departments.API.CloseAll();
            $scope.Departments.API.UpdateSelected();
        });
        $scope.PnAddDetailModal.Title = 'Cập nhật chi tiết bút toán';
        $scope.PnPayFormDetail.IsUpdate = true;
        $('.PnAddDetailModal').modal('show');
    };

    $scope.PnAddDetailModal.btnAdd = {};
    $scope.PnAddDetailModal.btnAdd.OnClick = function () {
        if (!$('#PnAddDetailModalForm').valid()) {
            return;
        }
        if ($scope.PnPayFormDetail.IsUpdate) {
            $scope.PnPayFormDetail.Update();
        }
        else {
            $scope.PnPayFormDetail.Add();
        }
    };
    $scope.PnPayFormDetail.Add = function () {
        if ($scope.PayableAccount.NodeResult.IDSelected.length > 0) {
            let CategoryIDs = [];
            let categoryid = $scope.PayableAccount.NodeResult.IDSelected[0].toString();
            UserProductCategoryFactory.FilterLastChildsByParentID(
                $scope.PayableAccount.TreeData,
                categoryid,
                CategoryIDs);

            if (CategoryIDs.length > 1 || CategoryIDs[0] != categoryid) {
                jAlert.Warning("Vui lòng chọn tài khoản ghi nợ");
                return;
            }
        }
        if ($scope.ReceivableAccount.NodeResult.IDSelected.length > 0) {
            let CategoryIDs = [];
            let categoryid = $scope.ReceivableAccount.NodeResult.IDSelected[0].toString();
            UserProductCategoryFactory.FilterLastChildsByParentID(
                $scope.ReceivableAccount.TreeData,
                categoryid,
                CategoryIDs);

            if (CategoryIDs.length > 1 || CategoryIDs[0] != categoryid) {
                jAlert.Warning("Vui lòng chọn tài khoản ghi có");
                return;
            }
        }

        if ($scope.objAccountingEntryDetail.PayableValue !== $scope.objAccountingEntryDetail.ReceivableValue) {
            jAlert.Warning("Số tiền nợ phải bằng số tiền có");
            return;
        }

        let objAccountingEntryDetail = {};
        objAccountingEntryDetail.Description = $scope.objAccountingEntryDetail.Description;

        objAccountingEntryDetail.PayableID = $scope.PayableAccount.NodeResult.IDSelected[0];
        objAccountingEntryDetail.PayableCode = $scope.PayableAccount.NodeResult.NodeSelected[0].code;
        objAccountingEntryDetail.PayableName = $scope.PayableAccount.NodeResult.NodeSelected[0].text;
        objAccountingEntryDetail.PayableValue = $scope.objAccountingEntryDetail.PayableValue;

        objAccountingEntryDetail.ReceivableID = $scope.ReceivableAccount.NodeResult.IDSelected[0];
        objAccountingEntryDetail.ReceivableCode = $scope.ReceivableAccount.NodeResult.NodeSelected[0].code;
        objAccountingEntryDetail.ReceivableName = $scope.ReceivableAccount.NodeResult.NodeSelected[0].text;
        objAccountingEntryDetail.ReceivableValue = $scope.objAccountingEntryDetail.ReceivableValue;
        objAccountingEntryDetail.CostsIncurred = $scope.objAccountingEntryDetail.PayableValue;

        objAccountingEntryDetail.StoreID  = '';
        objAccountingEntryDetail.DepartmentID = $scope.Departments.NodeResult.IDSelected != undefined ? $scope.Departments.NodeResult.IDSelected[0] : null;
        objAccountingEntryDetail.DepartmentName = $scope.Departments.NodeResult.NodeSelected != undefined ? $scope.Departments.NodeResult.NodeSelected[0].text : null;

        objAccountingEntryDetail.SupplierID = $scope.objAccountingEntryDetail.SupplierID;
        objAccountingEntryDetail.SupplierName = $scope.objAccountingEntryDetail.SupplierName;

        objAccountingEntryDetail.PID = $scope.objAccountingEntryDetail.PID;
        objAccountingEntryDetail.CategoryID = $scope.objAccountingEntryDetail.CategoryID;
        objAccountingEntryDetail.CategoryName = $scope.objAccountingEntryDetail.CategoryName;

        if ($scope.objAccountingEntryDetail.ProductName) {
            objAccountingEntryDetail.ProductID = $scope.objAccountingEntryDetail.ProductID;
            objAccountingEntryDetail.ProductName = $scope.objAccountingEntryDetail.ProductName;
        }
        
        objAccountingEntryDetail.UnitName = $scope.objAccountingEntryDetail.UnitName;
        objAccountingEntryDetail.Quantity = $scope.objAccountingEntryDetail.Quantity;
        objAccountingEntryDetail.PriceBFVAT = $scope.objAccountingEntryDetail.PriceBFVAT;
        objAccountingEntryDetail.Price = $scope.objAccountingEntryDetail.Price;
        objAccountingEntryDetail.VAT = $scope.objAccountingEntryDetail.VAT;
        objAccountingEntryDetail.AmountBFVAT = $scope.objAccountingEntryDetail.AmountBFVAT;
        objAccountingEntryDetail.Amount = $scope.objAccountingEntryDetail.Amount;

        if ($scope.IsCheckInvoice) {
            objAccountingEntryDetail.InvoiceID = $scope.objAccountingEntryDetail.InvoiceID;
            objAccountingEntryDetail.InvoiceNo = $scope.objAccountingEntryDetail.InvoiceNo;
            objAccountingEntryDetail.InvoiceFormNo = $scope.objAccountingEntryDetail.InvoiceFormNo;
            objAccountingEntryDetail.InvoiceSign = $scope.objAccountingEntryDetail.InvoiceSign;
            objAccountingEntryDetail.InvoiceDate = $scope.objAccountingEntryDetail.InvoiceDate;
        }     

        objAccountingEntryDetail.CostsIncurred = $scope.objAccountingEntryDetail.PayableValue;

        $scope.PnPayFormDetail.PayFormDetails.push(objAccountingEntryDetail);
        jAlert.Success('Thêm thành công.');
        $('.PnAddDetailModal').modal('hide');
        $scope.objAccountingEntryDetail = {};
    };
    $scope.PnPayFormDetail.Update = function () {


        if ($scope.PayableAccount.NodeResult.IDSelected.length > 0) {
            let CategoryIDs = [];
            let categoryid = $scope.PayableAccount.NodeResult.IDSelected[0].toString();
            UserProductCategoryFactory.FilterLastChildsByParentID(
                $scope.PayableAccount.TreeData,
                categoryid,
                CategoryIDs);

            if (CategoryIDs.length > 1 || CategoryIDs[0] != categoryid) {
                jAlert.Warning("Vui lòng chọn tài khoản ghi nợ");
                return;
            }
        }
        if ($scope.ReceivableAccount.NodeResult.IDSelected.length > 0) {
            let CategoryIDs = [];
            let categoryid = $scope.ReceivableAccount.NodeResult.IDSelected[0].toString();
            UserProductCategoryFactory.FilterLastChildsByParentID(
                $scope.ReceivableAccount.TreeData,
                categoryid,
                CategoryIDs);

            if (CategoryIDs.length > 1 || CategoryIDs[0] != categoryid) {
                jAlert.Warning("Vui lòng chọn tài khoản ghi có");
                return;
            }
        }

        if ($scope.objAccountingEntryDetail.PayableValue !== $scope.objAccountingEntryDetail.ReceivableValue) {
            jAlert.Warning("Số tiền nợ phải bằng số tiền có");
            return;
        }

        $scope.PnPayFormDetail.PayFormDetails.forEach(function (item_Filter, index) {

            if (item_Filter.index_key == $scope.objAccountingEntryDetail.index_key) {
                item_Filter.Description = $scope.objAccountingEntryDetail.Description;

                item_Filter.PayableID = $scope.PayableAccount.NodeResult.IDSelected[0];
                item_Filter.PayableCode = $scope.PayableAccount.NodeResult.NodeSelected[0].code;
                item_Filter.PayableName = $scope.PayableAccount.NodeResult.NodeSelected[0].text;
                item_Filter.PayableValue = $scope.objAccountingEntryDetail.PayableValue;
                item_Filter.ReceivableID = $scope.ReceivableAccount.NodeResult.IDSelected[0];

                item_Filter.ReceivableCode = $scope.ReceivableAccount.NodeResult.NodeSelected[0].code;
                item_Filter.ReceivableName = $scope.ReceivableAccount.NodeResult.NodeSelected[0].text;
                item_Filter.ReceivableValue = $scope.objAccountingEntryDetail.ReceivableValue;
                item_Filter.CostsIncurred = $scope.objAccountingEntryDetail.PayableValue;

                item_Filter.StoreID = '';
                item_Filter.DepartmentID = $scope.Departments.NodeResult.IDSelected != undefined ? $scope.Departments.NodeResult.IDSelected[0] : null;
                item_Filter.DepartmentName = $scope.Departments.NodeResult.NodeSelected.length > 0 ? $scope.Departments.NodeResult.NodeSelected[0].text : null;

                item_Filter.SupplierID = $scope.objAccountingEntryDetail.SupplierID;
                item_Filter.SupplierName = $scope.objAccountingEntryDetail.SupplierName;

                item_Filter.PID = $scope.objAccountingEntryDetail.PID;
                item_Filter.CategoryID = $scope.objAccountingEntryDetail.CategoryID;
                item_Filter.CategoryName = $scope.objAccountingEntryDetail.CategoryName;
                if ($scope.objAccountingEntryDetail.ProductName) {
                    item_Filter.ProductID = $scope.objAccountingEntryDetail.ProductID;
                    item_Filter.ProductName = $scope.objAccountingEntryDetail.ProductName;
                }
                item_Filter.Quantity = $scope.objAccountingEntryDetail.Quantity;
                item_Filter.PriceBFVAT = $scope.objAccountingEntryDetail.PriceBFVAT;
                item_Filter.UnitName = $scope.objAccountingEntryDetail.UnitName;
                item_Filter.Price = $scope.objAccountingEntryDetail.PriceVAT;
                item_Filter.VAT = $scope.objAccountingEntryDetail.VAT;
                item_Filter.AmountBFVAT = $scope.objAccountingEntryDetail.PriceAmountBFVAT;
                item_Filter.Amount = $scope.objAccountingEntryDetail.PriceAmountVAT;

                if ($scope.IsCheckInvoice) {
                    item_Filter.InvoiceID = $scope.objAccountingEntryDetail.InvoiceID;
                    item_Filter.InvoiceNo = $scope.objAccountingEntryDetail.InvoiceNo;
                    item_Filter.InvoiceFormNo = $scope.objAccountingEntryDetail.InvoiceFormNo;
                    item_Filter.InvoiceSign = $scope.objAccountingEntryDetail.InvoiceSign;
                    item_Filter.InvoiceDate = $scope.objAccountingEntryDetail.InvoiceDate;
                }   
            }
        });
        jAlert.Success('Cập nhật thành công.');
        $('.PnAddDetailModal').modal('hide');
    };
    //#endregion Popup Add Detail Order

    //#region Select2
    $scope.ddlCompany = { Core: {}, CallBack: {} };
    $scope.ddlCompany.Core.Text = 'CompanyName';
    $scope.ddlCompany.Core.IDValue = 'CompanyID';
    $scope.ddlCompany.CallBack.Onchanged = function () {
        //$scope.objBankBranchs.Details.BankID = $scope.ddlBank.Value;
    };
    //#endregion

    //#region search hóa đơn
    $scope.LstProductByInvoice = [];
    $scope.btnSearchInvoice_Onclick = function () {
        if (!$scope.objAccountingEntryDetail.InvoiceFormNo) {
            jAlert.Warning("Vui lòng nhập mẫu hóa đơn", "Thông báo");
            return;
        }

        if (!$scope.objAccountingEntryDetail.InvoiceNo) {
            jAlert.Warning("Vui lòng nhập số hóa đơn", "Thông báo");
            return;
        }

        let strApiEndPoint = "/InvoicePurchases/ReadByInvoiceNo?invoiceNo=" + $scope.objAccountingEntryDetail.InvoiceNo + "&invoiceForm=" + $scope.objAccountingEntryDetail.InvoiceFormNo;
        UtilJS.Loading.Show();
        CommonFactory.PostMethod(strApiEndPoint)
            .then((response) => {
                UtilJS.Loading.Hide();

                if (response.Data.ACCEntryID !== null) {
                    jAlert.Warning("Hóa đơn " + response.Data.InvoiceNo + " / " + response.Data.InvoiceFormNo + " đã được tạo bút toán");
                    return;
                }

                $scope.objAccountingEntryDetail.InvoiceID = response.Data.InvoiceID;
                $scope.objAccountingEntryDetail.InvoiceSign = response.Data.InvoiceSign;
                $scope.objAccountingEntryDetail.InvoiceFormNo = response.Data.InvoiceFormNo;
                $scope.objAccountingEntryDetail.InvoiceDate = response.Data.InvoiceDate;
                $scope.objAccountingEntryDetail.SupplierID = response.Data.SupplierID;
                $scope.objAccountingEntryDetail.SupplierName = response.Data.SupplierName;
                $scope.LstProductByInvoice = response.Data.InvoicePurchaseDetails;
                $scope.IsCheckInvoice = true;
            })
            .catch((response) => {
                $scope.objAccountingEntryDetail.InvoiceID = null;
                $scope.objAccountingEntryDetail.InvoiceSign = null;
                $scope.objAccountingEntryDetail.InvoiceDate = null;
                $scope.objAccountingEntryDetail.SupplierID = null;
                $scope.objAccountingEntryDetail.SupplierName = null;
                jAlert.Notify(response.objCodeStep);
                $scope.IsCheckInvoice = false;
                UtilJS.Loading.Hide();
            });
    };
    //#endregion

    //popup search NCC
    $scope.btnSearchSupplierModal_Onclick = function () {
        $scope.PnSupplierSearchModal.API.ShowModal();
        $('.PnAddDetailModal').modal('hide');
        $scope.PnSupplierSearchModal.API.Search();
    };
    $scope.ClearSupplierInfo = function () {
        $scope.objAccountingEntryDetail.SupplierID = null;
        $scope.objAccountingEntryDetail.SupplierName = null;
    };

    $scope.PnSupplierSearchModal = {};
    $scope.PnSupplierSearchModal.Core = {};
    $scope.PnSupplierSearchModal.CallBack = {
        ChoosedItem: function (item) {
            $scope.objAccountingEntryDetail.SupplierID = item.SupplierID;
            $scope.objAccountingEntryDetail.SupplierName = item.SupplierName;
            $scope.PnSupplierSearchModal.API.HideModal();
        },
        OnHiddenBsModal: function () {
            $timeout(function () {
                $('.PnAddDetailModal').modal('show');
            }, 500);
        }
    };

    //#region search product
    $scope.btnSearchProduct_Onclick = function () {
        if (!$scope.objAccountingEntryDetail.ProductID) {
            jAlert.Warning("Vui lòng nhập mã sản phẩm", "Thông báo");
            return;
        }

        let strApiEndPoint = "/Directives/SupplierProduct_ReadByProductID";
        CommonFactory.PostMethod(strApiEndPoint, { ProductID: $scope.objAccountingEntryDetail.ProductID })
            .then(function (response) {
                UtilJS.Loading.Hide();
                $scope.objAccountingEntryDetail.PID = null;
                $scope.objAccountingEntryDetail.ProductID = null;
                if (response.objCodeStep.Status === "Warning") {
                    jAlert.Notify(response.objCodeStep);
                    return;
                }
                if (response.objCodeStep.Data.length > 1) {
                    jAlert.Warning("Sản phẩm " + $scope.objAccountingEntryDetail.ProductID + " tồn tại trong " + response.objCodeStep.Data.length + " NCC đặt hàng. Vui lòng kiểm tra lại");
                    return;
                }
                var product = response.objCodeStep.Data[0];
                $scope.objAccountingEntryDetail.PID = product.PID;
                $scope.objAccountingEntryDetail.ProductID = product.ProductID;
                $scope.objAccountingEntryDetail.ProductName = product.ProductName;
                $scope.objAccountingEntryDetail.CategoryID = product.CategoryID;
                $scope.objAccountingEntryDetail.CategoryName = product.CategoryName;
                $scope.objAccountingEntryDetail.SupplierID = product.SupplierID;
                $scope.objAccountingEntryDetail.SupplierName = product.SupplierName;
            })
            .catch(function (response) {
                $scope.objAccountingEntryDetail.PID = null;
                $scope.objAccountingEntryDetail.ProductID = null;
                $scope.objAccountingEntryDetail.ProductName = null;
                $scope.objAccountingEntryDetail.CategoryID = null;
                $scope.objAccountingEntryDetail.CategoryName = null;
                $scope.objAccountingEntryDetail.SupplierID = null
                $scope.objAccountingEntryDetail.SupplierName = null
                jAlert.Notify(response.objCodeStep);
                UtilJS.Loading.Hide();
            });
        }
    //#endregion

    //#region PnProductSearchModal
    $scope.PnProductSearchModal = {};
    $scope.PnProductSearchModal.Core = {};
    $scope.PnProductSearchModal.CallBack = {};

    $scope.PnProductSearchModal.CallBack = {
        ChoosedItem: function (item) {
            let strApiEndPoint = "/Directives/SupplierProduct_ReadByProductID";
            CommonFactory.PostMethod(strApiEndPoint, { ProductID: item.ProductID })
                .then(function (response) {
                    UtilJS.Loading.Hide();
                    $scope.objAccountingEntryDetail.PID = null;
                    $scope.objAccountingEntryDetail.ProductID = null;
                    if (response.objCodeStep.Status === "Warning") {
                        jAlert.Notify(response.objCodeStep);
                        return;
                    }
                    if (response.objCodeStep.Data.length > 1) {
                        jAlert.Warning("Sản phẩm " + item.ProductID + " tồn tại trong " + response.objCodeStep.Data.length + " NCC đặt hàng. Vui lòng kiểm tra lại");
                        return;
                    }
                    var product = response.objCodeStep.Data[0];
                    $scope.objAccountingEntryDetail.PID = product.PID;
                    $scope.objAccountingEntryDetail.ProductID = product.ProductID;
                    $scope.objAccountingEntryDetail.ProductName = product.ProductName;
                    $scope.objAccountingEntryDetail.CategoryID = product.CategoryID;
                    $scope.objAccountingEntryDetail.CategoryName = product.CategoryName;
                    $scope.objAccountingEntryDetail.SupplierID = product.SupplierID;
                    $scope.objAccountingEntryDetail.SupplierName = product.SupplierName;
                    $scope.PnProductSearchModal.API.HideModal();
                })
                .catch(function (response) {
                    $scope.objAccountingEntryDetail.PID = null;
                    $scope.objAccountingEntryDetail.ProductID = null;
                    $scope.objAccountingEntryDetail.ProductName = null;
                    $scope.objAccountingEntryDetail.CategoryID = null;
                    $scope.objAccountingEntryDetail.CategoryName = null;
                    $scope.objAccountingEntryDetail.SupplierID = null;
                    $scope.objAccountingEntryDetail.SupplierName = null;
                   jAlert.Notify(response.objCodeStep);
                    UtilJS.Loading.Hide();
                });
        },
        OnHiddenBsModal: function () {
            $timeout(function () {
                $('.PnAddDetailModal').modal('show');
            }, 500);
        }
    };
    $scope.btnSearchProductModal_Onclick = function () {
        $scope.PnProductSearchModal.Lst = [];
        $('.PnAddDetailModal').modal('hide');
        $scope.PnProductSearchModal.API.ShowModal();
    };
    //#endregion

    //#region Create
    $scope.btnCreate = {};
    $scope.btnCreate.IsDisabled = false;
    $scope.btnCreate.OnClick = function () {
        if (!CheckValidForm()) {
            return;
        }
        UtilJS.Loading.Show();
        $timeout(function () {
            var objEntry = {};
            objEntry.CompanyID = $scope.ddlCompany.Value;
            objEntry.ACCEntryDate = $scope.dtmEntryDate.Value;
            objEntry.ReferenceType = 1;
            objEntry.Description = $scope.objAccountingEntry.Description;
            objEntry.SupplierID = $scope.objAccountingEntry.SupplierID;
            objEntry.SupplierName = $scope.objAccountingEntry.SupplierName;

            //Detail Account Entry
            objEntry.DetailACCEntrys = [];
            $scope.PnPayFormDetail.PayFormDetails.forEach(function (Detail) {
                objEntry.DetailACCEntrys.push(Detail);
            });

            //Detail General Journal
            objEntry.DetailGeneralJournals = [];
            $scope.PnPayFormDetail.PayFormDetails.forEach(function (Detail) {
                let itemDetailGeneralJournals = {};
                itemDetailGeneralJournals.CompanyID = $scope.ddlCompany.Value;
                itemDetailGeneralJournals.PayableID = Detail.PayableID;
                itemDetailGeneralJournals.ReceivableID = Detail.ReceivableID;
                itemDetailGeneralJournals.CostsIncurred = Detail.CostsIncurred;
                itemDetailGeneralJournals.CategoryID = Detail.CategoryID;
                itemDetailGeneralJournals.CategoryName = Detail.CategoryName;
                itemDetailGeneralJournals.PID = Detail.PID;
                itemDetailGeneralJournals.ProductID = Detail.ProductID;
                itemDetailGeneralJournals.SupplierID = Detail.SupplierID;
                itemDetailGeneralJournals.SupplierName = Detail.SupplierName;
                itemDetailGeneralJournals.InvoiceID = Detail.InvoiceID;
                itemDetailGeneralJournals.InvoiceNo = Detail.InvoiceNo;
                itemDetailGeneralJournals.InvoiceFormNo = Detail.InvoiceFormNo;
                itemDetailGeneralJournals.InvoiceSign = Detail.InvoiceSign;
                itemDetailGeneralJournals.InvoiceDate = moment(Detail.InvoiceDate).format('YYYY/MM/DD HH:mm:ss');

                objEntry.DetailGeneralJournals.push(itemDetailGeneralJournals);
            });

            var url = "/AccountingEntries/CreateGeneral";
            debugger;
            CommonFactory.PostDataAjax(url, objEntry,
                function (beforeSend) { },
                function (response) {
                    UtilJS.Loading.Hide();
                    $timeout(function () {
                        if (response.objCodeStep.Status == 'Error') {
                            jAlert.Error(response.objCodeStep.Message);
                            return;
                        }
                        if (response.objCodeStep.Status == 'Warning') {
                            jAlert.Warning(response.objCodeStep.Message);
                        }
                        if (response.objCodeStep.Status == 'Success') {
                            $scope.btnCreate.IsDisabled = true;
                            jAlert.Success(response.objCodeStep.Message, function () {
                               window.location.href = '/AccountingEntries';
                            });
                        }
                    }, 100);
                },
                function (error) {
                    UtilJS.Loading.Hide();
                    return;
                }
            );
        });
    };

    function CheckValidForm() {
        if (!$('#PnHeaderForm').valid()) {
            $rootScope.scrollToTopInputValid();
            return false;
        }
        if ($scope.dtmEntryDate.Value == undefined || $scope.dtmEntryDate.Value == '') {
            jAlert.Warning('Vui lòng chọn ngày chứng từ');
            return false;
        }
        if (!$scope.ddlCompany.Value) {
            jAlert.Warning('Vui lòng chọn công ty');
            return false;
        }

        if ($scope.PnPayFormDetail.PayFormDetails.length == 0) {
            jAlert.Warning('Vui lòng thêm chi tiết bút toán');
            return false;
        }
        return true;
    }

    //#endregion

    //#region load data
    UtilJS.Loading.Show();
    $q.all({
        Companies: DataFactory.Companies_Get(),
        Department: DataFactory.DepartmentTree_Read(),
        Account: DataFactory.Accounts_Get(),
        ProductCategories: DataFactory.ProductCategoriesTree_Read($rootScope.Permission.isReadCategory),
        r4: UtilFactory.WaitingLoadDirective([])
    }).then((Multiples) => {
        $scope.PnProductSearchModal.ddlUserProductCategory.TreeData = Multiples.ProductCategories.Data;
        $scope.ddlCompany.Lst = Multiples.Companies.Data;
        $scope.Departments.TreeData = Multiples.Department.Data;
        $scope.dtmEntryDate.API.SetValue(new Date());
        $scope.PayableAccount.TreeData = Multiples.Account.Data;
        $scope.ReceivableAccount.TreeData = Multiples.Account.Data;
        UtilJS.Loading.Hide();
        });


    UtilJS.Table.InitScrollTable("tabletest");

    $(function () {
        customValidate.SetForm('PnHeaderForm');
        customValidate.SetForm('PnAddDetailModalForm', '');
    });
    //#endregion
}
CreateController.$inject = ["$scope", "$rootScope", "$timeout", "$filter", "ApiHelper", "UtilFactory", "DataFactory", "$q", "CommonFactory", "UserProductCategoryFactory"];
addController("CreateController", CreateController);
addDirective("supplierSearchModal", supplierSearchModal);

