var IndexController = ($scope, $compile, $rootScope, $timeout, $filter, UtilFactory, DataFactory, $q, CommonFactory) => {
    //#region declare variable
    $scope.UpdateMode = false;
    $scope.Ads = {};
    //#endregion

    //#region ReadById
    var ReadById = (id) => {
        let strApiEndPoint = "/Admin/Ads/GetById";
        UtilJS.Loading.Show();
        CommonFactory.PostMethod(strApiEndPoint, { id: id })
            .then((response) => {
                $scope.Ads = response.data;
                console.log(response.data);
                UtilJS.Loading.Hide();
            })
            .catch((response) => {
                sys.Alert(false, response.Message);
                UtilJS.Loading.Hide();
            });
    };
    //#endregion

    //#region Create
    $scope.Create = function () {
        $scope.UpdateMode = false;
        $scope.Ads = {};
        $('#PnModal').appendTo('body').modal('show');
    };
    //#endregion

    //#region Update
    $scope.Update = function (id) {
        $scope.UpdateMode = true;
        ReadById(id);
        $('#PnModal').appendTo('body').modal('show');
    }
    //#endregion

    //#region Delete
    $scope.Delete = function (id) {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: "Một khi đã xóa, bạn không thể khôi phục lại",
            type: "warning",
            showCancelButton: !0,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Quay lại",
            confirmButtonClass: "btn btn-success mt-2",
            cancelButtonClass: "btn btn-danger ml-2 mt-2",
            buttonsStyling: !1
        }).then(function (t) {
            if (t.value) {
                let strApiEndPoint = "/Admin/Ads/Delete";
                UtilJS.Loading.Show();
                CommonFactory.PostMethod(strApiEndPoint, { id: id})
                    .then((response) => {
                        sys.Alert(true, 'Xóa thành công!');
                        $('#myTable').DataTable().ajax.reload(null, false);
                        UtilJS.Loading.Hide();
                    })
                    .catch((response) => {
                        sys.Alert(false, response.Message);
                        UtilJS.Loading.Hide();
                    });
            }
        });
    };
    //#endregion

    //#region Save
    $scope.Save = function () {
        if (!$scope.UpdateMode) {
            let strApiEndPoint = "/Admin/Ads/Create";
            UtilJS.Loading.Show();
            CommonFactory.PostMethod(strApiEndPoint, $scope.Ads)
                .then((response) => {
                    sys.Alert(true, 'Thêm thành công');
                    $('#myTable').DataTable().ajax.reload(null, false);
                    $('#PnModal').modal('hide');
                    UtilJS.Loading.Hide();
                })
                .catch((response) => {
                    sys.Alert(false, response.Message);
                    UtilJS.Loading.Hide();
                });
        }
        else {
            let strApiEndPoint = "/Admin/Ads/Update";
            UtilJS.Loading.Show();
            CommonFactory.PostMethod(strApiEndPoint, $scope.Ads)
                .then((response) => {
                    sys.Alert(true, 'Cập nhật thành công');
                    $('#myTable').DataTable().ajax.reload(null, false);
                    $('#PnModal').modal('hide');
                    UtilJS.Loading.Hide();
                })
                .catch((response) => {
                    sys.Alert(false, response.Message);
                    UtilJS.Loading.Hide();
                });
        }
    };
            //#endregion


    //#region Datatable
    $(function () {
         $('#myTable').DataTable({
            "bProcessing": true,
            "bSort": true,
            "bServerSide": true,
            "language": {
                paginate: {
                    previous: '<i class="fa fa-lg fa-angle-left"></i>',
                    next: '<i class="fa fa-lg fa-angle-right"></i>'
                }
            },
            "sAjaxSource": "/Admin/Ads/Data",
            "aoColumnDefs": [
                {
                    "sName": "Title",
                    "sTitle": "Tiêu đề",
                    "bSearchable": true,
                    "bSortable": true,
                    "aTargets": [0]
                },
                {
                    "sName": "Url",
                    "sTitle": "Url",
                    "bSearchable": true,
                    "bSortable": true,
                    "aTargets": [1]
                },
                {
                    "sName": "Price",
                    "sTitle": "Giá",
                    "bSearchable": true,
                    "bSortable": true,
                    "aTargets": [2]
                },
                {
                    "sName": "SecondView",
                    "sTitle": "Thời gian xem",
                    "bSearchable": true,
                    "bSortable": true,
                    "aTargets": [3]
                },
                {
                    'mRender': function (data, type, row, meta) {
                        return `
                                <div class="text-center">
                                    <a href="#" ng-click="Update('` + data + `');" class="text-success p-1 font-size-16"><i class="fas fa-pencil-alt"></i></a>
                                    <a href="#" ng-click="Delete('` + data + `');" class="text-danger p-1 font-size-16"><i class="fas fa-trash-alt"></i></a>
                                </div>`;
                    },
                    "sName": "Id",
                    "bSortable": false,
                    "aTargets": [4],
                    "sWidth": "150px"
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $compile(angular.element(row).contents())($scope);
            }
        });
    });
    //#endregion

}
IndexController.$inject = ["$scope", "$compile", "$rootScope", "$timeout", "$filter", "UtilFactory", "DataFactory", "$q", "CommonFactory"];
addController("IndexController", IndexController);
