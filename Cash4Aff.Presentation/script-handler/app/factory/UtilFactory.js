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