//last update : 21/07/2018 hau 
var ApiHelper = function ($rootScope, $localstorage, $timeout, $q, $http) {
    var service = {};

    //#region defind 
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
    //#endregion

    //#region LocalStore  
    service.LS = {};
    service.LS.CheckCacheExist = (config) => {
        let objServer = DataCacheKey[config.CacheKeyClient];
        if (!objServer) {
            throw new "Không tồn tại key " + config.CacheKeyClient;
        }
        if (!objServer.Version) {
            return false;
        }
        let storerage = $localstorage.getObject(config.CacheKeyClient);
        if (!storerage) {
            return false;
        }
        if (storerage.Version != objServer.Version) {
            return false;
        }
        if (config.UserID && objServer.UserID != $rootScope.UserPricinpal.UserID) {
            return false;
        }
        if (!storerage.Data) {
            return false;
        }
        return true;
    };
    service.LS.GetCache = (config) => {
        let storerage = $localstorage.getObject(config.CacheKeyClient);
        return storerage.Data;
    };
    service.LS.AddCache = (config, data) => {
        let objServer = DataCacheKey[config.CacheKeyClient];
        if (!objServer) {
            return false;
        }
        if (!objServer.Version) {
            //case này do view output có DataCacheKey ko đồng nhất khai báo với config.CacheKeyClient
            //vo set lai view cho đúng, hoặc xóa cache render ra
            return;
        }

        let storerage = {};
        storerage.Version = objServer.Version;
        storerage.Data = data;

        if (config.UserID) {
            storerage.UserID = $rootScope.UserPricinpal.UserID;
        }

        $localstorage.remove(config.CacheKeyClient);
        $localstorage.setObject(config.CacheKeyClient, storerage);
    };

    //#endregion

    //#region JsCaching 
    service.JsCaching = {};
    service.JsCaching.CheckCacheExist = (config) => {
        let objServer = DataCacheKey[config.CacheKeyClient];
        if (!objServer) {
            throw new "Không tồn tại key " + config.CacheKeyClient;
        }
        if (!objServer.Version) {
            return false;
        }
        let storerage = $localstorage.getObject(config.CacheKeyClient);
        if (!storerage) {
            return false;
        }
        if (storerage.Version != objServer.Version) {
            return false;
        }
        if (config.UserID && objServer.UserID != $rootScope.UserPricinpal.UserID) {
            return false;
        }
        if (!objServer.Data) {
            return false;
        }
        return true;
    };
    service.JsCaching.GetCache = (config) => {
        let objServer = DataCacheKey[config.CacheKeyClient];
        return objServer;
    };
    service.JsCaching.AddCache = (config) => {
        let objServer = DataCacheKey[config.CacheKeyClient];
        if (!objServer) {
            return false;
        }
        if (!objServer.Version) {
            //case này do view output có DataCacheKey ko đồng nhất khai báo với config.CacheKeyClient
            //vo set lai view cho đúng, hoặc xóa cache render ra
            return;
        }

        let storerage = {};
        storerage.Version = objServer.Version;
        if (config.UserID) {
            storerage.UserID = $rootScope.UserPricinpal.UserID;
        }

        $localstorage.remove(config.CacheKeyClient);
        $localstorage.setObject(config.CacheKeyClient, storerage);
    };
    service.JsCaching.GetCachePromise = (config) => {
        let defer = $q.defer();
        if (service.JsCaching.CheckCacheExist(config)) {
            let response = {};
            response.Data = service.JsCaching.GetCache(config).Data;
            defer.resolve(response);
        }
        else {
            //required file js
            if ($("body").find("#" + config.CacheKeyClient).length == 0) {
                let objServer = DataCacheKey[config.CacheKeyClient];
                var js = document.createElement("script");
                js.type = "text/javascript";
                js.src = `/CacheStorerages/CreateCacheJS?version=${objServer.Version}&CacheKeyClient=${config.CacheKeyClient}&StrRedisCacheNames=${objServer.StrRedisCacheNames}`;
                document.body.appendChild(js);
            }
            config.Timer = setInterval(() => {
                let response = {};
                let objServer = service.JsCaching.GetCache(config);
                if (objServer.StatusCode !== undefined && objServer.StatusCode !== 200) {
                    clearInterval(config.Timer);
                    service.ConfirmRedirectLogin(objServer);
                    return;
                }
                if (objServer.Data !== undefined) {
                    response.Data = objServer.Data;
                    service.JsCaching.AddCache(config);
                    clearInterval(config.Timer);
                    if (typeof response.Data == 'array') {
                        response.Data = _.map(response.Data, _.clone);
                    }
                    defer.resolve(response);
                }
            }, 100);
        }
        return defer.promise;
    };
    //#endregion

    service.GetMethod = function (url, data, config) {
        let defer = $q.defer();

        let codeStep = jQuery.extend({}, ApiHelper.CodeStep);
        codeStep.ConcungContextID = UtilJS.guid().replace(/-/g, "");

        if (!service.CheckToken()) {
            UtilJS.Loading.Hide();
            defer.reject(codeStep);
            return defer.promise;
        };

        if (config && config.CacheKeyClient) {
            if (config.CacheTypeID) {
                if (service.LS.CheckCacheExist(config)) {
                    let response = {};
                    response.Data = service.LS.GetCache(config);
                    defer.resolve(response);
                    return defer.promise;
                }
            }
            else {
                return service.JsCaching.GetCachePromise(config);
            }
        }

        var req = {
            method: 'GET',
            url: url,
            headers: {
                'Authorization': "Bearer " + $rootScope.UserPricinpal.Token,
                'Accept': 'application/json',
                'ConcungContextID': codeStep.ConcungContextID,
                'UserID': $rootScope.UserPricinpal.Username,
                'SessionID': MasterData.SessID
            },
            data: data
        }
        service.WriteLog(url, data);
        $http(req).then(function (jqXHR) {
            if (jqXHR.status == 204) {
                codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
                defer.reject(codeStep);
            } else {
                codeStep.Status = service.JsonStatusCode.Success;
                codeStep.Data = jqXHR.data;

                config && config.CacheKeyClient && service.LS.AddCache(config, codeStep.Data);

                defer.resolve(codeStep);
            }
        }, function (jqXHR) {
            codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
            defer.reject(codeStep);
        });
        return defer.promise;
    };

    service.PostMethod = function (url, data, config) {
        if (config && config.CacheKeyClient) {
            $localstorage.remove(config.CacheKeyClient);
        }
        let codeStep = jQuery.extend({}, ApiHelper.CodeStep);
        codeStep.ConcungContextID = UtilJS.guid().replace(/-/g, "");

        let defer = $q.defer();

        if (!service.CheckToken()) {
            UtilJS.Loading.Hide();
            defer.reject(codeStep);
            return defer.promise;
        };

        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Authorization': "Bearer " + $rootScope.UserPricinpal.Token,
                'Accept': 'application/json',
                'ConcungContextID': codeStep.ConcungContextID,
                'UserID': $rootScope.UserPricinpal.Username,
                'SessionID': MasterData.SessID
            },
            data: data
        }
        service.WriteLog(url, data);
        $http(req).then(function (jqXHR) {
            if (jqXHR.status == 204) {
                codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
                defer.reject(codeStep);
            } else {
                codeStep.Status = service.JsonStatusCode.Success;
                codeStep.Data = jqXHR.data;
                defer.resolve(codeStep);
            }
        }, function (jqXHR) {
            codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
            defer.reject(codeStep);
        });
        return defer.promise;
    };

    service.PutMethod = function (url, data, config) {
        if (config && config.CacheKeyClient) {
            $localstorage.remove(config.CacheKeyClient);
        }

        let codeStep = jQuery.extend({}, ApiHelper.CodeStep);
        codeStep.ConcungContextID = UtilJS.guid().replace(/-/g, "");

        let defer = $q.defer();
        if (!service.CheckToken()) {
            UtilJS.Loading.Hide();
            defer.reject(codeStep);
            return defer.promise;
        };

        var req = {
            method: 'PUT',
            url: url,
            headers: {
                'Authorization': "Bearer " + $rootScope.UserPricinpal.Token,
                'Accept': 'application/json',
                'ConcungContextID': codeStep.ConcungContextID,
                'UserID': $rootScope.UserPricinpal.Username,
                'SessionID': MasterData.SessID
            },
            data: data
        }
        service.WriteLog(url, data);
        $http(req).then(function (jqXHR) {
            if (jqXHR.status == 204) {
                codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
                defer.reject(codeStep);
            } else {
                codeStep.Status = service.JsonStatusCode.Success;
                codeStep.Data = jqXHR.data;
                defer.resolve(codeStep);
            }
        }, function (jqXHR) {
            codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
            defer.reject(codeStep);
        });
        return defer.promise;
    };

    service.DeleteMethod = function (url, data, config) {
        if (config && config.CacheKeyClient) {
            $localstorage.remove(config.CacheKeyClient);
        }

        let codeStep = jQuery.extend({}, ApiHelper.CodeStep);
        codeStep.ConcungContextID = UtilJS.guid().replace(/-/g, "");

        let defer = $q.defer();

        if (!service.CheckToken()) {
            UtilJS.Loading.Hide();
            defer.reject(codeStep);
            return defer.promise;
        };

        var req = {
            method: 'DELETE',
            url: url,
            headers: {
                'Authorization': "Bearer " + $rootScope.UserPricinpal.Token,
                'Accept': 'application/json',
                'ConcungContextID': codeStep.ConcungContextID,
                'UserID': $rootScope.UserPricinpal.Username,
                'SessionID': MasterData.SessID
            },
            data: data
        }
        service.WriteLog(url, data);
        $http(req).then(function (jqXHR) {
            if (jqXHR.status == 204) {
                codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
                defer.reject(codeStep);
            } else {
                codeStep.Status = service.JsonStatusCode.Success;
                codeStep.Data = jqXHR.data;
                defer.resolve(codeStep);
            }
        }, function (jqXHR) {
            codeStep = service.SetErrorAPI(jqXHR, url, codeStep.ConcungContextID);
            defer.reject(codeStep);
        });
        return defer.promise;
    };

    service.PostPromise = function (url, Method, data, SuccessCallback, ErrorCallback) {
        var q = $q.defer();
        $http({
            method: Method,
            url: url,
            data: data
        }).then(function SuccessResolve(response) {
            if (SuccessCallback) {
                SuccessCallback(response);
            }
            q.resolve(response);
        }, function ErrorReject(response) {
            if (ErrorCallback) {
                ErrorCallback(response);
            }
            q.reject(response);

        });
        return q.promise;
    };

    service.RemoveCache = function (CacheKey) {
        ApiHelper.GetMethod(url, { 'CacheKey': CacheKey }, function () { }, function () { }, function () { });
    }

    service.SetErrorAPI = function (jqXHR, ApiEndPoint, ConcungContextID) {
        var codeStep = jQuery.extend({}, service.CodeStep);
        if (jqXHR.status == 200 || jqXHR.status == 201) return;
        codeStep.Status = service.JsonStatusCode.Error;
        codeStep.StatusCode = jqXHR.status;
        codeStep.ErrorStep = "API error " + jqXHR.status + ", ApiEndPoint:" + ApiEndPoint;
        switch (jqXHR.status) {
            case 400:
                var errorLst = jqXHR.data;
                codeStep.ErrorMessage = errorLst;
                if (jQuery.type(errorLst) == "array") {
                    codeStep.ErrorMessage = errorLst.join("</br>");
                }
                codeStep.Message = service.StatusCodeMessage(jqXHR.status);
                service.WriteLogServer(codeStep.Message, ConcungContextID);
                break;
            case 406:
                var errorLst = jqXHR.data;
                codeStep.Status = service.JsonStatusCode.Warning;
                codeStep.Message = errorLst;
                if (jQuery.type(errorLst) == "array") {
                    codeStep.Message = errorLst.join("</br>");
                }
                service.WriteLogServer(codeStep.Message, ConcungContextID);
                break;
            case 500:
                //var errorLst = jqXHR.data;
                codeStep.ErrorMessage = jqXHR.data;
                codeStep.Message = service.StatusCodeMessage(jqXHR.status);
                break;
            case 204:
                codeStep.Message = "Không có dữ liệu hoặc bạn không có quyền xem dữ liệu";
                codeStep.Status = service.JsonStatusCode.Warning;
                break;
            case 401:
                let objWrite = {};
                objWrite.Token = $rootScope.UserPricinpal.Token;
                objWrite.ExpireDate = $rootScope.UserPricinpal.ExpireDate;
                service.WriteLogServer("401 API Token hết hạn: " + JSON.stringify(objWrite), ConcungContextID);

                codeStep.Status = "";
                let obj = { status: 401, IsOnlyShowAlert: true };
                service.ConfirmRedirectLogin(obj);
                break;
            default:
                codeStep.Message = service.StatusCodeMessage(jqXHR.status);
                break;
        }
        return codeStep;
    }

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

    service.CheckToken = function () {
        return true;
        let dtmNow = new Date();
        if (!$rootScope.UserPricinpal.ExpireDate) {
            let obj = { status: 401 };
            service.ConfirmRedirectLogin(obj);
            return false;
        }
        if (moment($rootScope.UserPricinpal.ExpireDate)._d.getTime() > dtmNow.getTime()) {
            return true;
        }
        let dataSend = {};
        dataSend.RefreshToken = $rootScope.UserPricinpal.RefreshToken;

        var IsSuccess = false;
        try {
            $.ajax({
                url: "/Accounts/RefreshToken",
                type: "POST",
                async: false,
                dataType: "json",
                data: dataSend,
                success: function (response, textStatus, jqXHR) {
                    if (response.objCodeStep.Status != 'Success') {
                        console.log("MVC Refesh token fail");
                        console.log(response.objCodeStep);
                        IsSuccess = false;

                        let objWrite = {};
                        objWrite.Token = $rootScope.UserPricinpal.Token;
                        objWrite.ExpireDate = $rootScope.UserPricinpal.ExpireDate;
                        service.WriteLogServer("MVC Refesh token fail: " + JSON.stringify(objWrite));

                        let obj = { status: 401, IsOnlyShowAlert: true };
                        service.ConfirmRedirectLogin(obj);
                    }
                    else {
                        $rootScope.InitUserPrincipal(response.objUserPrincipal);
                        IsSuccess = true;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Error call action MVC Refesh token");
                    IsSuccess = false;
                    service.ConfirmRedirectLogin();
                }
            })
        } catch (e) {
            IsSuccess = false;
            jAlert.Warning("Error Refesh token fail");
            console.log('ApiHelper.CheckToken() error :' + e);
        }
        return IsSuccess;
    };
    service.ConfirmRedirectLogin = function (obj) {
        $timeout(() => {
            UtilJS.Loading.Hide();
        }, 500);
        if (obj !== undefined && obj.IsOnlyShowAlert) {
            jAlert.Warning("Thao tác không thành công, vui lòng thử lại");
            return;
        }
        if ($rootScope.IsShowConfirmRedirectLogin) {
            return;
        }
        $rootScope.IsShowConfirmRedirectLogin = true;
        let content = 'Phiên đăng nhập hết hạn, vui lòng bấm đồng ý để tải lại trang';
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
                        UtilJS.Cookie.Remove("returnUrl");
                        UtilJS.Cookie.Create("returnUrl", window.location.href, 30);
                        $rootScope.IsShowConfirmRedirectLogin = false;
                        if (obj && obj.status == 401) {
                            window.location.href = "/Accounts/Login";
                        }
                        else {
                            location.reload();
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
            }
        });
    }

    return service;
};
ApiHelper.$inject = ["$rootScope", "$localstorage", "$timeout", "$q", "$http"];