var fileUpload = function ($q, $timeout, CommonFactory, $localstorage, ApiHelper) {
    return {
        restrict: 'A',
        transclude: true,

        scope: {
            root: "=",
            isMultipleFile: "=",
            isLoading: "=",
            accept: "="
        },
        template: '<ng-transclude></ng-transclude>',

        link: function (scope, element, attrs) {
            function objFile() {
                this.IsDeleted = false,
                    this.Base64 = '',
                    this.Src = '',
                    this.DataType = '',
                    this.Http = new XMLHttpRequest(),
                    this.FileInput = {},
                    this.Percent = 0,
                    this.FileName = ''
            };
            if (!scope.root) {
                scope.root = {};
            }
            if (!scope.root.LstFile) {
                scope.root.LstFile = [];
            }
            scope.btnOpenDialog = element[0].querySelector('.btnOpenDialog');
            scope.input = element[0].querySelector('.files');

            if (!scope.root.ActionUpload) {
                scope.root.ActionUpload = "/Directives/UploadFile/";
            }
            if (!scope.root.PathUpload) {
                scope.root.PathUpload = "/";
            }

            if (scope.btnOpenDialog) {
                scope.btnOpenDialog.addEventListener('click', function (e) {
                    $timeout(function () {
                        angular.element(scope.input).trigger('click');
                    });
                });
            }

            scope.input.addEventListener('change', function (e) {
                if (!ApiHelper.CheckToken()) {
                    UtilJS.Loading.Hide();
                    return;
                };
                $timeout(function () {
                    var files = e.target.files;
                    if (files.length == 0) {
                        return;
                    }
                    var size = files[0].size / 1024 / 1024;//MB
                    if (size > 10) {
                        jAlert.Warning("Đính kèm không vượt quá 10 MB.");
                        return;
                    }
                    if (!scope.root.IsMultipleFile) {
                        scope.root.LstFile = [];
                        if (files.length > 1) {
                            jAlert.Warning("Vui lòng up 1 file");
                            return;
                        }
                        if (scope.root.accept == undefined && files[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            && files[0].type != "application/vnd.ms-excel") {
                            jAlert.Error("Lỗi cập nhật sản phẩm từ Excel");
                            return;
                        }
                        else if (scope.root.accept != undefined && (!UtilJS.String.IsContain(scope.root.accept, files[0].type)) || files[0].type == '') {
                            jAlert.Warning("Định dạng file không đúng.");
                            return;
                        }
                    }

                    for (var i = 0; i < files.length; i++) {
                        var objFileNew = new objFile();
                        objFileNew.FileInput = files[i];

                        objFileNew.FileName = files[i].name.normalize();
                        //objFileNew.FileName = UtilJS.String.RemoveUnicode(objFileNew.FileName);

                        if (scope.root.IsListenProgress) {
                            objFileNew.AlertNotFoundTimeout = false;
                            ListenProgress(objFileNew);
                            ListenStateChange(objFileNew);
                        }
                        scope.root.LstFile.push(objFileNew);

                        if (scope.root.TypeUpload == "AttachFile") {
                            scope.root.CallBack.UploadBegin && (scope.root.CallBack.UploadBegin(objFileNew));

                            objFileNew.Http.open("POST", scope.root.ActionUpload, true);
                            var formData = new FormData();
                            formData.append("file", objFileNew.FileInput);
                            objFileNew.Http.send(formData);
                        }
                        else if (!scope.root.IsMultipleFile) {
                            let strName = objFileNew.FileInput.name;
                            strName = strName.normalize();
                            strName = strName.toLowerCase();

                            UtilJS.Loading.Show();
                            objFileNew.Http.open("POST", scope.root.ActionUpload, true);
                            objFileNew.Http.setRequestHeader("Content-Type", "multipart/form-data");
                            objFileNew.Http.setRequestHeader("FileName", UtilJS.String.RemoveUnicode(strName));
                            objFileNew.Http.setRequestHeader("FileSize", objFileNew.FileInput.size);
                            objFileNew.Http.setRequestHeader("FileType", objFileNew.FileInput.type);
                            objFileNew.Http.setRequestHeader("SaveTo", scope.root.SaveTo);
                            //objFileNew.Http.setRequestHeader("Authorization", 'Bearer ' + scope.strToken);

                            objFileNew.Http.send(objFileNew.FileInput);
                        }
                    }
                }).then(function () {
                    angular.element(scope.input).val(null);
                });
            });

            scope.root.API = {};
            scope.root.API.ClearLstItem = function () {
                scope.root.LstFile = [];
            };

            scope.root.API.ResetItem = function (objFileNew) {
                objFileNew.Percent = 0;
                objFileNew.FileName = '';
                objFileNew.FilePathSaved = '';
            };

            var ListenProgress = function (objFileNew) {
                objFileNew.Http.upload.addEventListener('progress', function (event) {
                    $timeout(function () {
                        fileLoaded = event.loaded; //Đã load được bao nhiêu
                        fileTotal = event.total; //Tổng cộng dung lượng cần load
                        fileProgress = parseInt((fileLoaded / fileTotal) * 100) || 0;
                        objFileNew.Percent = fileProgress;
                    }, 50);
                }, false);
            };
            var ListenStateChange = function (objFileNew) {
                objFileNew.Http.onreadystatechange = function (event) {
                    if (objFileNew.Http.readyState == 4 && objFileNew.Http.status == 200) {
                        $timeout(function () {
                            var response = JSON.parse(objFileNew.Http.responseText);
                            if (scope.root.TypeUpload == "AttachFile") {
                                UtilJS.Loading.Hide();
                                let obj = response.data[0];
                                Object.assign(objFileNew, obj);
                                objFileNew.IsSuccess = true;
                                scope.root.CallBack.UploadDone && (scope.root.CallBack.UploadDone(objFileNew));
                                return;
                            }
                            if (response.Code != 200) {
                                objFileNew.Percent = 0;
                                objFileNew.FileName = '';
                                jAlert.Error("Upload file thất bại", 'Thông báo');
                                UtilJS.Loading.Hide();
                                return;
                            }
                            if (response.Code == 200 && response.Success) {
                                objFileNew.Percent = 100;
                                objFileNew.FilePathSaved = response.Data.PathFile;
                                objFileNew.FilePathRelative = response.FilePathRelative;
                                //jAlert.Success("Upload file thành công.", 'Thông báo');
                            }
                            UtilJS.Loading.Hide();

                            //objFileNew.Http.removeEventListener('progress', false);
                        }, 200);
                    }
                    else if (objFileNew.Http.readyState == 4 && objFileNew.Http.status != 200) {
                        $timeout.cancel(objFileNew.AlertNotFoundTimeout);
                        objFileNew.AlertNotFoundTimeout = $timeout(function () {
                            if (objFileNew.Http.status == 404) {
                                jAlert.Error("Định dạng file không đúng.", 'Thông báo');
                            }
                            else if (objFileNew.Http.status == 401) {
                                CommonFactory.ConfirmRedirectLogin();
                            }
                            else {
                                jAlert.Error("Lỗi Không xác định, vui lòng thử lại " + objFileNew.Http.status, 'Thông báo');
                                console.log(objFileNew.Http);
                            }
                            objFileNew.Percent = 0;
                            objFileNew.FileName = '';
                            UtilJS.Loading.Hide();
                            return;
                        }, 200);
                    }
                    scope.$apply();
                }
            };

            scope.root.IsReady = true;
        } //link
    }; //return
};

fileUpload.$inject = ["$q", "$timeout", "CommonFactory", "$localstorage", "ApiHelper"];
addDirective("fileUpload", fileUpload);