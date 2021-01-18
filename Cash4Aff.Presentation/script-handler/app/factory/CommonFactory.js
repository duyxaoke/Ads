//last update : 21/07/2018 hau 
var CommonFactory = function ($rootScope, $localstorage, $timeout, UtilFactory, $q, $http) {
    var service = {}; 
    service.CodeStep = {
        Status: "",
        StatusCode: 0,
        ErrorStep: "",
        Message: "",
        ErrorMessage: "",
        Data: ""
    };
    service.JsonStatusCode = {
        Success: "Success",
        Error: "Error",
        Warning: "Warning",
        Info: "Info"
    };
    service.WriteLog = function (url, data) {
        if (MasterData.APIDebug) {
            console.log(url, JSON.stringify(data));
        }
    }
    service.WriteLogServerError = function (error, title, ConcungContextID) {
        if (!ConcungContextID) {
            ConcungContextID = UtilJS.guid().replace(/-/g, "");
        }
        title = !title ? "" : title + "/n/n";
        let msg = title + JSON.stringify({ message: error.message, stack: error.stack });
        service.WriteLogServer(msg, ConcungContextID);
    }
    service.WriteLogServer = function (msg, ConcungContextID) {
        var DataLog = { type: 'APIHelper', data: msg, url: window.location.href };
        var req = {
            method: 'POST',
            url: '/ClientLogs/consolescript',
            headers: {
                'Accept': 'application/json',
                'UserID': $rootScope.UserPricinpal.Username
            },
            data: DataLog
        }
        if (ConcungContextID != undefined && ConcungContextID != "") {
            req.headers.ConcungContextID = ConcungContextID;
        }
        $http(req).then(function (jqXHR) { });
    }

    service.PostDataAjax = function (url, data, beforeSend, success, errorFunction, timeout) {
        try {
            if (!timeout) {
                timeout = 60000;
            }

            $.ajax({
                url: url,
                type: "POST",
                //timeout: timeout,
                //cache: true,
                //crossDomain: true,
                //contentType: "application/json; charset=utf-8;",//cho nay dung thi data phai stringjfly 

                //accept: "application/json", 
                //acceptEncoding: 'gzip', 
                dataType: "json",
                data: data,
                //processData: true,
                beforeSend: beforeSend,//được kích hoạt trươc khi một Ajax request được bắt đầu
                //async: true,
                //tryCount: 0,
                //retryLimit: 3,
                success: function (response) {
                    $timeout(function () {
                        success(response);
                    });
                },
                error: function (error, textStatus, xhr) {
                    if (error.status == 401 || error.status == 440 || error.status == 0 || error.status == -1) {
                        let obj = { status: 401 };
                        service.ConfirmRedirectLogin(obj);
                    }
                    else {
                        UtilFactory.Alert.RequestError(error);
                        $timeout(function () {
                            errorFunction(error);
                        });
                    }
                },
                complete: function (complete) {
                }
            }).always(function () {
            });
        } catch (e) {
            console.log('CommonFactory.PostDataAjax() error :' + e);
        }
    }; 
    service.GetDataAjax = function (url, data, beforeSend, success, errorFunction, timeout) {
        try {
            if (!timeout) {
                timeout = 60000;
            }
            $.ajax({
                url: url,
                type: "GET",
                //timeout: timeout,
                //cache: true,
                //crossDomain: true,
                //contentType: "application/json; charset=utf-8",//cho nay dung thi data phai stringjfly
                dataType: "json",
                data: data,
                //processData: true,
                beforeSend: beforeSend,//được kích hoạt trươc khi một Ajax request được bắt đầu
                //async: true,
                //tryCount: 0,
                //retryLimit: 3,
                success: function (response) {
                    $timeout(function () {
                        success(response);
                    });
                },
                error: function (error, textStatus, xhr) {
                    if (error.status == 401 || error.status == 440 || error.status == 0 || error.status == -1) {
                        let obj = { status: 401 };
                        service.ConfirmRedirectLogin(obj);
                    }
                    else {
                        UtilFactory.Alert.RequestError(error);
                        $timeout(function () {
                            errorFunction(error);
                        });
                    }
                },
                complete: function (complete) {
                }
            }).always(function () {
            });
        } catch (e) {
            console.log('CommonFactory.PostDataAjax() error :' + e);
        }
    };

    service.PostDataAjaxAsync = function (url, data, beforeSend, success, errorFunction, timeout) {
        try {
            if (!timeout) {
                timeout = 60000;
            }

            $.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                data: data,
                beforeSend: beforeSend,
                async: false,
                success: function (response) {
                    success(response);
                },
                error: function (error, textStatus, xhr) {
                    if (error.status == 401 || error.status == 440 || error.status == 0 || error.status == -1) {
                        let obj = { status: 401 };
                        service.ConfirmRedirectLogin(obj);
                    }
                    else {
                        UtilFactory.Alert.RequestError(error);
                        $timeout(function () {
                            errorFunction(error);
                        });
                    }
                },
                complete: function (complete) {
                }
            }).always(function () {
            });
        } catch (e) {
            console.log('CommonFactory.PostDataAjaxAsync() error :' + e);
        }
    };
    service.PostPromise = function (url, data) {
        var q = $q.defer();
        $http({
            method: 'POST',
            url: url,
            data: data
        }).then(function SuccessResolve(response) {
            q.resolve(response);
        }, function ErrorReject(response) {
            q.reject(response);
        });
        return q.promise;
    };
    service.GetPromise = function (url, data) {
        var q = $q.defer();
        $http({
            method: 'GET',
            url: url,
            params: data
        }).then(function SuccessResolve(response) {
            q.resolve(response);
        }, function ErrorReject(response) {
            q.reject(response);

        });
        return q.promise;
    };

    service.PostMethod = function (url, data, config) {
        if (config && config.CacheKeyClient) {
            $localstorage.remove(config.CacheKeyClient);
        }
        let defer = $q.defer();
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'TabBrowserKey': MasterData.TabBrowserKey
            },
            data: data
        }
        service.WriteLog(url, data);
        $http(req).then(function (jqXHR) {
            defer.resolve(jqXHR.data);
        }, function (jqXHR) {
            if (jqXHR.status == 401 || jqXHR.status == 440 || jqXHR.status == 0 || jqXHR.status == -1)
            {
                let obj = { status: 401 };
                service.ConfirmRedirectLogin(obj);
            }
            else {
                jqXHR.objCodeStep = {};
                jqXHR.objCodeStep.Status = service.JsonStatusCode.Error;
                jqXHR.objCodeStep.Message = service.StatusCodeMessage(jqXHR.status);
                //if (config.IsAwait) {
                //    throw jqXHR;
                //}
                defer.reject(jqXHR);
            }
        });
        return defer.promise;
    }; 
    service.GetMethod = function (url, data, config) {
        if (config && config.CacheKeyClient) {
            $localstorage.remove(config.CacheKeyClient);
        }
        let defer = $q.defer();
        var req = {
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: data
        }
        service.WriteLog(url, data);
        $http(req).then(function (jqXHR) {
            defer.resolve(jqXHR.data);
        }, function (jqXHR) {
            if (jqXHR.status == 401 || jqXHR.status == 440 || jqXHR.status == 0 || jqXHR.status == -1) {
                let obj = { status: 401 };
                service.ConfirmRedirectLogin(obj);
            }
            else {
                jqXHR.objCodeStep = {};
                jqXHR.objCodeStep.Status = service.JsonStatusCode.Error;
                jqXHR.objCodeStep.Message = service.StatusCodeMessage(jqXHR.status);
                defer.reject(jqXHR);
            }
        });
        return defer.promise;
    };

    //service.PostMethodAsync = async function (url, data, config) {  
    //    let response = await service.PostMethod(url, data, config).catch((res) => { 
    //        throw res;
    //    }); 
    //    return response;
    //};

    service.StatusCodeMessage = function (status) {
        var strMessage = '';
        switch (status) {
            case 400:
                strMessage = 'Lỗi dữ liệu không hợp lệ';
                break;
            case 401:
                strMessage = 'Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.';
                break;
            case 403:
                strMessage = 'Bạn không có quyền thực hiện thao tác này.';
                break;
            case 404:
                strMessage = 'URL action không chính xác';
                break;
            case 405:
                strMessage = 'Phương thức không được chấp nhận';
                break;
            case 500:
                strMessage = 'Lỗi hệ thống';
                break;
            case 502:
                strMessage = 'Đường truyền kém';
                break;
            case 503:
                strMessage = 'Dịch vụ không hợp lệ';
                break;
            case 504:
                strMessage = 'Hết thời gian chờ';
                break;
            case 440:
                strMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
                break;
            default:
                strMessage = 'Lỗi chưa xác định';
                break;
        }
        return strMessage;
    };
    service.ConfirmRedirectLogin = function (obj) {
        $timeout(() => {
            UtilJS.Loading.Hide();
        }, 500);
        if ($rootScope.IsShowConfirmRedirectLogin) {
            return;
        }
        $rootScope.IsShowConfirmRedirectLogin = true;
        let content = 'Phiên đăng nhập hết hạn, vui lòng bấm đồng ý để đăng nhập lại';
        if (obj !== undefined && obj.Message) {
            content = obj.Message;
        }

        $.confirm({
            title: 'Thông báo!',
            content: content,
            buttons: {
                formSubmit: {
                    text: '<i class="fa fa-check-circle"></i> Đồng ý',
                    btnClass: 'btn cc-btn-style cc-btn-color-blue',
                    action: function () {
                        //UtilJS.Cookie.Remove("returnUrl");
                        //UtilJS.Cookie.Create("returnUrl", window.location.href, 30);
                        //$rootScope.IsShowConfirmRedirectLogin = false;
                        //if (obj && obj.status == 401) {
                        //    window.location.href = "/Accounts/Login";
                        //}
                        //else {
                        //    location.reload();
                        //}
                        $rootScope.IsShowConfirmRedirectLogin = false;
                        UtilJS.openReLogin();
                    }
                },
                formSubmit2: {
                    text: 'Hủy',
                    btnClass: 'btn cc-btn-style',
                    action: function () {
                        $rootScope.IsShowConfirmRedirectLogin = false;
                    }
                }
            }
        });
    }
    return service;
};
CommonFactory.$inject = ["$rootScope", "$localstorage", "$timeout", "UtilFactory", "$q", "$http"]; 