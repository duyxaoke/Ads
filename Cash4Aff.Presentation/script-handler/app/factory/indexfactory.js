var $localstorage = function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) { return $window.localStorage[key] || defaultValue; },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            try {
                var temp = $window.localStorage[key];
                if (temp) {
                    return JSON.parse(temp || "{}");
                }
            } catch (e) {
                return JSON.parse("{}");
            }
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        clearAll: function () {
            $window.localStorage.clear();
        }
    };
};

$localstorage.$inject = ["$window"]; 
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
        let codeStep = jQuery.extend({}, ApiHelper.CodeStep);
        codeStep.ConcungContextID = UtilJS.guid().replace(/-/g, "");

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
            let response = jqXHR.data;
            if (response.objCodeStep.Status == service.JsonStatusCode.Error
                || response.objCodeStep.Status == service.JsonStatusCode.Warning) { 
                defer.reject(response);
            } else {
                defer.resolve(response);
            }
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
        let codeStep = jQuery.extend({}, ApiHelper.CodeStep);
        codeStep.ConcungContextID = UtilJS.guid().replace(/-/g, "");

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
            let response = jqXHR.data;
            if (response.objCodeStep.Status == service.JsonStatusCode.Error
                || response.objCodeStep.Status == service.JsonStatusCode.Warning) {
                defer.reject(response);
            } else {
                defer.resolve(response);
            }
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
var UtilFactory = function ($rootScope, $timeout, $q) {
    var service = {};
    //service.Confirm = async function (ask) {
    //    return new Promise((resolve, reject) => { 
    //        jConfirm('Thông báo', ask, function (isOK) { 
    //            resolve(isOK);
    //        });
    //    })
    //};

    //#region CHECK ROLE
    service.RoleEnum = Object.freeze(
        {
            "IT": [3147, 3193],
            "KT": [3172, 3202, 3203]
        });

    service.CheckInRole = function () {
        let RoleIDs = $rootScope.UserPricinpal.RoleIDs;
        let obj = _.find(RoleIDs, (x) => service.RoleEnum.IT.includes(x) || service.RoleEnum.KT.includes(x));
        if (!obj) {
            return false;
        }
        return true;
    };
    //#endregion
    //#region XEM THEO
    service.TypeViewEnum = Object.freeze(
        {
            "NganhHang": { "Value": 1, "Text": "Ngành hàng" },
            "SanPham": { "Value": 2, "Text": "Sản phẩm" },
            "KhachHang": { "Value": 3, "Text": "Khách hàng" }
        });

    service.DataTypeView = function (IDNotSelected) {
        let DataDropdownlist = [];
        var propNames = Object.getOwnPropertyNames(service.TypeViewEnum);
        propNames.forEach((x) => {
            let item = {};
            item.ID = service.TypeViewEnum[x].Value;
            item.Name = service.TypeViewEnum[x].Text;
            DataDropdownlist.push(item);
        });
        if (IDNotSelected && IDNotSelected.length > 0)
            DataDropdownlist = DataDropdownlist.filter(c => !IDNotSelected.includes(c.ID));
        return DataDropdownlist;
    };

    service.RequiredDataTypeView = function (typeview) {
        var scope = angular.element(document.getElementById('ddlUserProductCategory')).scope();
        //san pham
        if (typeview == service.TypeViewEnum.SanPham.Value) {
            scope.myroot.IsShowProduct = true;
            scope.myroot.ddlUserProductCategory.IsDisableOpenTree = !false;
            scope.myroot.IsShowCustomer = false;
            //clear data
            scope.myroot.ddlUserProductCategory.API.DeselectAll();
            scope.myroot.PID = null;
            scope.myroot.ProductID = null;
            scope.myroot.ProductName = null;
            scope.myroot.CustomerID = null;
            scope.myroot.CustomerName = null;
        }
        //khach hang
        else if (typeview == service.TypeViewEnum.KhachHang.Value) {
            scope.myroot.IsShowCustomer = true;
            scope.myroot.ddlUserProductCategory.IsDisableOpenTree = !false;
            scope.myroot.IsShowProduct = false;
            //clear data
            scope.myroot.ddlUserProductCategory.API.DeselectAll();
            scope.myroot.PID = null;
            scope.myroot.ProductID = null;
            scope.myroot.ProductName = null;
            scope.myroot.CustomerID = null;
            scope.myroot.CustomerName = null;
        }
        //mac dinh chon nganh hang
        else {
            scope.myroot.ddlUserProductCategory.IsDisableOpenTree = !true;
            scope.myroot.IsShowProduct = false;
            scope.myroot.IsShowCustomer = false;
            //clear data
            scope.myroot.ddlUserProductCategory.API.DeselectAll();
            scope.myroot.PID = null;
            scope.myroot.ProductID = null;
            scope.myroot.ProductName = null;
            scope.myroot.CustomerID = null;
            scope.myroot.CustomerName = null;
        }
    };

    service.PrepareData = function (typeview, obj) {
        let object = new Object();
        object.CategoryIDs = [];
        object.PID = -2;
        object.CustomerID = -2;
        if (typeview == service.TypeViewEnum.NganhHang.Value) {
            if (obj.CategoryIDs !== undefined && obj.CategoryIDs.length == 0) {
                jAlert.Warning("Vui lòng chọn ngành hàng", "Thông báo");
                return false;
            }
            if (obj.hasOwnProperty("PID"))
                obj.PID = object.PID;
            if (obj.hasOwnProperty("ProductID"))
                obj.ProductID = object.PID;
            if (obj.hasOwnProperty("CustomerID"))
                obj.CustomerID = object.CustomerID;
        }
        if (typeview == service.TypeViewEnum.SanPham.Value) {
            if ((obj.PID !== undefined && !obj.PID) || (obj.ProductID !== undefined && !obj.ProductID)) {
                jAlert.Warning("Vui lòng chọn sản phẩm", "Thông báo");
                return false;
            }
            if (obj.hasOwnProperty("CategoryIDs"))
                obj.CategoryIDs = object.CategoryIDs;
            if (obj.hasOwnProperty("CustomerID"))
                obj.CustomerID = object.CustomerID;
        }
        if (typeview == service.TypeViewEnum.KhachHang.Value) {
            if (obj.CustomerID !== undefined && !obj.CustomerID) {
                jAlert.Warning("Vui lòng chọn khách hàng", "Thông báo");
                return false;
            }
            if (obj.hasOwnProperty("CategoryIDs"))
                obj.CategoryIDs = object.CategoryIDs;
            if (obj.hasOwnProperty("PID"))
                obj.PID = object.PID;
            if (obj.hasOwnProperty("ProductID"))
                obj.ProductID = object.PID;
        }
        return obj;
    };
    //#endregion

    service.sortBy = (function () {
        var toString = Object.prototype.toString,
            // default parser function
            parse = function (x) { return x; },
            // gets the item to be sorted
            getItem = function (x) {
                var isObject = x != null && typeof x === "object";
                var isProp = isObject && this.prop in x;
                return this.parser(isProp ? x[this.prop] : x);
            };

        /**
         * Sorts an array of elements.
         *
         * @param  {Array} array: the collection to sort
         * @param  {Object} cfg: the configuration options
         * @property {String}   cfg.prop: property name (if it is an Array of objects)
         * @property {Boolean}  cfg.desc: determines whether the sort is descending
         * @property {Function} cfg.parser: function to parse the items to expected type
         * @return {Array}
         */
        return function sortby(array, cfg) {
            if (!(array instanceof Array && array.length)) return [];
            if (toString.call(cfg) !== "[object Object]") cfg = {};
            if (typeof cfg.parser !== "function") cfg.parser = parse;
            cfg.desc = !!cfg.desc ? -1 : 1;
            return array.sort(function (a, b) {
                a = getItem.call(cfg, a);
                b = getItem.call(cfg, b);
                return cfg.desc * (a < b ? -1 : +(a > b));
            });
        };

    }());

    service.ParseJsonDate = function (jsonDateString) {
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    }

    //convert DateTime.Now => "yyyymmdd" or "yyyymm"
    service.GetDateString = function (value, format) {
        var date = value == undefined ? new Date() : value;
        date.setDate(date.getDate());
        var DateView = date.toISOString().slice(0, 10).replace(/-/g, "");
        if (format == "yyyyMM" || format == "yyyymm") {
            date.setMonth(date.getMonth() - 1);
            DateView = date.toISOString().slice(0, 8).replace(/-/g, "");
        }
        return DateView;
    };

    //convert DateTime => "yyyymmdd" or "yyyymm"
    service.GetDateStringByValue = function (value, format) {
        if (!value) {
            service.GetDateString(format);
        }
        if (format == "yyyyMM" || format == "yyyymm") {
            return value.replace(/(\d\d)\/(\d{4})/, "$2$1");
        }
        else {
            return value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3$2$1");
        }
    };

    service.FormatDateTime = function (value, isDate) {
        value = value.toString();
        var year = value.substring(2, 4);
        var month = value.substring(4, 6);
        if (isDate) {
            var day = value.substring(6, 8);
            return day + '.' + month;
        }
        return month + '.' + year;
    }

    service.FormatDateTimeFull = function (value) {
        value = value.toString();
        var year = value.substring(0, 4);
        var month = value.substring(4, 6);
        var day = value.substring(6, 8);
        return day + '/' + month + '/' + year;
    }

    // format int to month/year
    service.FormatMonthYear = function (value) {
        var year = value.toString().substr(0, 4);
        var month = value.toString().substr(4, 2);

        return month + "/" + year;
    }

    service.WaitingLoadDirective = function (arrar) {
        clearInterval(service.myTimer);
        let defer = $q.defer();
        service.myTimer = setInterval(() => {
            if (arrar.filter((x) => x.IsReady == true).length == arrar.length) {
                clearInterval(service.myTimer);
                defer.resolve();
            }
        }, 100);
        return defer.promise;
    };
    service.InitArrayNoIndex = function (number) {
        var arr = new Array();
        for (var i = 1; i < number; i++) {
            arr.push(i);
        }
        return arr;
    };
    service.String = {};
    service.String.IsNullOrEmpty = function (str) {
        if (!str || str == null) {
            return true;
        }
        return false;
    };
    service.String.IsContain = function (strRoot, strRequest) {
        if (service.String.IsNullOrEmpty(strRoot)) {
            return false;
        }
        if (service.String.IsNullOrEmpty(strRequest)) {
            return true;
        }
        if (strRoot.indexOf(strRequest) < 0) {
            return false;
        }
        return true;
    };

    service.Alert = {};
    service.Alert.RequestError = function (e) {
        console.log(e);

        var strMessage = '';
        switch (e.status) {
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

        jAlert.Error(strMessage, 'Thông báo');
    };

    return service;
};

UtilFactory.$inject = ["$rootScope", "$timeout", "$q"];
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