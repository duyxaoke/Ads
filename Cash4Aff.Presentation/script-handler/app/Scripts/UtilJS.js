var UtilJS = {};
UtilJS.Files = {};
UtilJS.Table = {};
UtilJS.Cookie = {};

//#region  ux ui 
UtilJS.Loading = {};
UtilJS.ShowMenuRight = function () {
    $("body").addClass("openmenuright");
}
UtilJS.HideMenuRight = function () {
    $("body").removeClass("openmenuright");
}
UtilJS.Loading.Show = function () {
    UtilJS.Loading.IsLoading = true;
    $("#cover-spin").removeClass("hide");
    //console.log('UtilJS.Loading.Show');
}
UtilJS.Loading.Hide = function (num) {
    UtilJS.Loading.IsLoading = false;
    if (!num) {
        $("#cover-spin").addClass("hide");
        //console.log('UtilJS.Loading.Hide');
    }
    else {
        setTimeout(function () {
            $("#cover-spin").addClass("hide");
            //console.log('UtilJS.Loading.Hide');
        }, num);
    }
}
UtilJS.Loading.ShowProgress = function (obj) {
    progressJs().start();
    progressJs().set(5);
    obj.i = 5;
    obj.interval = setInterval(() => {
        if (true) {
            obj.i += 5;
            if (obj.i >= 90) {
                clearInterval(obj.interval);
            }
            progressJs().increase(5);
        }
    }, 500);
}
UtilJS.Loading.HideProgress = function () {
    progressJs().end();
}
UtilJS.Table.InitScrollTable = function (elementID) {
    elementID = "#" + elementID;
    var divFooter = elementID + " .divFooter";
    $(document).ready(function () {
        $(divFooter).scroll(function (e) {
            $(elementID + ' .divHeader').scrollLeft($(divFooter).scrollLeft());
            $(elementID + ' .grid_header th.anchor').css("left", $(divFooter).scrollLeft());

            $(elementID + ' .divBody').scrollLeft($(divFooter).scrollLeft());
            $(elementID + ' .grid_body td.anchor').css("left", $(divFooter).scrollLeft());

            $(elementID + ' .grid_footer th.anchor').css("left", $(divFooter).scrollLeft());
        });
    });
};
UtilJS.Table.UpdateBodyTable = function (elementID, heightBody) {
    $(elementID + ".scroll-table tbody").css('height', heightBody);
};
UtilJS.Table.ResetScrollLeft = function () {
    setTimeout(function () {
        $(".divFooter").scrollLeft(0);
    }, 0);
};

UtilJS.ParseQueryString = function (queryString) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

UtilJS.Cookie.Create = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
UtilJS.Cookie.Remove = function (name) {
    UtilJS.Cookie.Create(name, "", -1);
}

UtilJS.Files.Download = function (objRequest) {
    var Option = { url: "", method: "POST", data: {}, success: undefined, ContentType: "application/x-www-form-urlencoded; charset=UTF-8", ResponseType: "blob", callback: undefined, beforsend: undefined };
    $.extend(Option, objRequest);
    var checkBlob = false;
    try {
        var MyBlob = new Blob(['test text'], { type: 'text/plain' });
        checkBlob = MyBlob instanceof Blob;
    } catch (e) {
    }
    if (checkBlob)
        UtilJS.Files.DownloadWithXHR(Option);
    else
        UtilJS.Files.DownLoadWithIFrame(Option);
}
UtilJS.Files.DownloadWithXHR = function (Option) {
    if (Option.beforsend != undefined) Option.beforsend();
    var xhr = new XMLHttpRequest();
    xhr.onload = function (event) {
        if (xhr.status !== 200) return;

        var blob = xhr.response;
        if (blob.type == "application/json") {
            var reader = new FileReader();
            reader.onloadend = function () {
                try {
                    var result = JSON.parse(reader.result);
                    if (Option.callback != undefined) Option.callback(result);
                    if (Option.success != undefined) Option.success(result);
                } catch (e) {
                    if (Option.callback != undefined) Option.callback();
                    if (Option.success != undefined) Option.success();
                }
            }
            reader.readAsText(blob);
            return;
        }
        var fileName = this.getResponseHeader('FileName');
        if (fileName == null || fileName == undefined) {
            jAlert.Warning("Không thể tải file");
            if (Option.callback != undefined) Option.callback();
            if (Option.success != undefined) Option.success();
            return;
        }
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 1000);
        } else {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        if (Option.callback != undefined) Option.callback();
        if (Option.success != undefined) Option.success();
        return;
    };
    xhr.onreadystatechange = function (oEvent) {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                switch (xhr.status) {
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
                if (xhr.status == 401 || xhr.status == 440 || xhr.status == 0) {
                    UtilJS.ConfirmRedirectLogin();
                }
                else {
                    jAlert.Warning(strMessage);
                }
                if (Option.callback != undefined) Option.callback();
                if (Option.success != undefined) Option.success();
            }
        }
    };
    xhr.open(Option.method, Option.url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = Option.ResponseType; //arraybuffer
    try {
        if (Option.method == 'POST') {
            xhr.setRequestHeader('Content-Type', Option.ContentType);
            var formInput = [];
            var fdata = "";
            UtilJS.Files.SetFromData(formInput, Option.data);
            for (var i = 0; i < formInput.length; i++) {
                fdata += formInput[i].name + "=" + formInput[i].data + "&";
            }
            xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
            xhr.send(fdata);
        } else {
            xhr.send();
        }
    } catch (e) {

    }
}
UtilJS.Files.DownLoadWithIFrame = function (Option) {
    var frm = $('<form id="frameExport" action="' + Option.url + '" method="' + Option.method + '" target="frameExport"></form>');
    var input = { Text: '' };
    var formInput = [];
    var fdata = "";
    UtilJS.Files.SetFromData(formInput, Option.data);
    for (var i = 0; i < formInput.length; i++) {
        fdata += '<input name="' + formInput[i].name + '" value="' + formInput[i].data + '">';
    }
    $(frm).append(fdata);
    if ($("#frameExport").length == 0)
        $("body").append('<iframe id="frameExport" name="frameExport" style="display:none" onload="UtilJS.Files.IframeOnLoad();"></iframe>');
    $(frm).appendTo('body').submit().remove();
    //$("#frameExport").remove();
}
UtilJS.Files.IframeOnLoad = function () {
    var iframe = document.getElementById('frameExport');
    var iframeWindow = iframe.contentDocument.body.innerHTML;
    var result = $(iframeWindow).text();
    if (result == undefined || result == '') {
        return;
    }
    result = JSON.parse(result);
    if (result.objCodeStep.Status != jAlert.Status.Success) {
        jAlert.Notify(result.objCodeStep);
        return;
    }
}
UtilJS.Files.SetFromData = function (frm, data, name) {
    if (typeof data === 'object') {
        var lstKeys = Object.keys(data);
        for (var i = 0; i < lstKeys.length; i++) {
            if (data[lstKeys[i]] == null) continue;
            if (name == '' || name == undefined)
                UtilJS.Files.SetFromData(frm, data[lstKeys[i]], lstKeys[i]);
            else
                UtilJS.Files.SetFromData(frm, data[lstKeys[i]], name + '[' + lstKeys[i] + ']');
        }
    } else {
        frm.push({ 'name': name, 'data': data });
    }

}
UtilJS.Files.DownloadFile = function (obj) {
    var link = $(obj).attr("href");
    var filename = $(obj).attr("filename");
    //filename = filename.replaceAll(",", "");
    filename = encodeURIComponent(filename).replace(/'/g, "%27").replace(/"/g, "%22");
    var fulllink = "/Directives/DownloadFileDocument?pathFile=" + link + "&filename=" + filename;
    //window.location.href = "/Directives/DownloadFileDocument?pathFile=" + link + "&filename=" + filename;
    window.open(fulllink, '_blank');
    return false;
}
UtilJS.ConfirmRedirectLogin = function (obj) {
    if (UtilJS.IsShowConfirmRedirectLogin) {
        return;
    }
    UtilJS.IsShowConfirmRedirectLogin = true;

    $.confirm({
        title: 'Thông báo!',
        content: 'Phiên đăng nhập hết hạn, vui lòng bấm đồng ý để tải lại trang',
        buttons: {
            formSubmit: {
                text: '<i class="fa fa-check-circle"></i> Đồng ý',
                btnClass: 'btn cc-btn-style cc-btn-color-blue',
                action: function () {
                    UtilJS.Cookie.Remove("returnUrl");
                    UtilJS.Cookie.Create("returnUrl", window.location.href, 30);
                    UtilJS.IsShowConfirmRedirectLogin = false;
                    if (obj && obj.IsRedirectLogin) {
                        window.location.href = "/Accounts/Login";
                    }
                    else {
                        location.reload();
                    }
                }
            },
            formSubmit2: {
                text: 'Hủy',
                btnClass: 'btn cc-btn-style',
                action: function () {
                    UtilJS.IsShowConfirmRedirectLogin = false;
                }
            }
        }
    });
}

UtilJS.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
window.onerror = function (msg, url, line, columnNo, error) {
    var DataLog = { type: 'error', data: msg, stack: error.stack, url: window.location.href };
    $.ajax({
        url: '/ClientLogs/consolescript',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DataLog),
        success: function (response) {
        },
    });
};
UtilJS.openReLogin = function () {
    var newwindow;
    var screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
        screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
        outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth,
        outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22),
        width = 500,
        height = 450,
        left = parseInt(screenX + ((outerWidth - width) / 2), 10),
        top = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
        features = (
            'width=' + width +
            ',height=' + height +
            ',left=' + left +
            ',top=' + top
        );
    newwindow = window.open('/Accounts/ReLogin', 'Refresh login', features);
    if (window.focus) { newwindow.focus() }
    return false;
}
window.ReLoginCallback = function (isReLogin, Username) {
    if (isReLogin) {
        if (jconfirm.instances[0] != undefined)
            jconfirm.instances[0].close();
        jAlert.Success("Đăng nhập lại thành công");
        var UserPricinpal = JSON.parse(localStorage.getItem("UserPricinpal"));
        if (Username != UserPricinpal.Username) {
            $.confirm({
                title: 'Thông báo!',
                content: 'Bạn đã đăng nhập tài khoản khác, vui lòng bấm đồng ý để tải lại trang',
                buttons: {
                    formSubmit: {
                        text: '<i class="fa fa-check-circle"></i> Đồng ý',
                        btnClass: 'btn cc-btn-style cc-btn-color-blue',
                        action: function () {
                            location.reload();
                        }
                    }
                }
            });
        }
        if (UtilJS.Relogin != undefined && UtilJS.Relogin.Action != undefined) {
            UtilJS.Relogin.Action();
            UtilJS.Relogin.scope.$apply();
        }
        else {
            location.reload();
        }
        UtilJS.Relogin = {};
    } else {
        jAlert.Warning("Không thể đăng nhập");
    }
}
UtilJS.reValidForm = function (idForm) {
    var form = $("#" + idForm).removeData("validator").removeData("unobtrusiveValidation");
    $.validator.unobtrusive.parse(form);
    customValidate.SetForm(idForm, '');
};

UtilJS.Tree = {};
UtilJS.Tree.CheckParentIDNotExists = function (Lst) {
    Lst.forEach((x) => {
        if (x.parent != "#") {
            let exist = _.find(Lst, (xx) => xx.parent == x.id);
            if (exist == undefined) {
                debugger;
            }
        }
    });
};
//#endregion

//#region function calculate 
var _cf = (function () {
    function _shift(x) {
        var parts = x.toString().split('.');
        return (parts.length < 2) ? 1 : Math.pow(10, parts[1].length);
    }
    return function () {
        return Array.prototype.reduce.call(arguments, function (prev, next) { return prev === undefined || next === undefined ? undefined : Math.max(prev, _shift(next)); }, -Infinity);
    };
})();
Math.add = function () {
    var f = _cf.apply(null, arguments); if (f === undefined) return undefined;
    function cb(x, y, i, o) { return Math.round(x) + f * y; }
    return Array.prototype.reduce.call(arguments, cb, 0) / f;
};
Math.subtraction = function (l, r) { var f = _cf(l, r); return (l * f - r * f) / f; };
Math.multiplication = function () {
    var f = _cf.apply(null, arguments);
    function cb(x, y, i, o) { return Math.round(x * f) * Math.round(y * f) / (f * f); }
    return Array.prototype.reduce.call(arguments, cb, 1);
};
Math.division = function (l, r) { var f = _cf(l, r); return (l * f) / (r * f); };

UtilJS.precise_round = function (num, dec) {

    if ((typeof num !== 'number') || (typeof dec !== 'number'))
        return false;

    var num_sign = num >= 0 ? 1 : -1;

    return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
}
UtilJS.toFixedDecimal = function (value, optional) {
    if (!value)
        return 0;
    var decimal = value.toString().split('.')[1]; // 0 | 0123456
    if (decimal) {
        if (optional == undefined || optional === '') {
            optional = decimal.length;
        }
        else {
            decimal = decimal.toString().slice(0, optional);

            for (var i = decimal.length; i > 0; i--) {
                if (decimal.charAt(i - 1) != 0) {
                    break;
                }
                else {
                    decimal = decimal.substring(0, decimal.length - 1);
                }
            }
            optional = decimal.length;
        }
        value = Number(UtilJS.precise_round(parseFloat(value), optional));
        return value;
    } else {
        return value;
    }
    return value;
}

UtilJS.DateTime = {};
UtilJS.DateTime.IsValid = function (value) {
    if (!value) {
        return false;
    }
    if (Date.parse(value) < 0) {
        return false;
    }
    return moment(value).isValid();
}
UtilJS.DateTime.ToString = function (strDate, strFormat) {
    if (!strDate) {
        return 'underfine';
    }
    var value = new Date
        (
            parseInt(strDate.replace(/(^.*\()|([+-].*$)/g, ''))
        );
    //day
    var intDay = value.getDate();
    var strDay = intDay.toString();
    if (intDay <= 9) {
        strDay = "0" + strDay;
    }
    //month
    var intMonth = value.getMonth() + 1;
    var strMonth = intMonth.toString();
    if (intMonth <= 9) {
        strMonth = "0" + strMonth;
    }
    //return value
    if (strFormat == "dd/mm/yyyy") {
        return strDay + "/" +
            strMonth + "/" +
            value.getFullYear();
    }
    return strDay + "-" +
        strMonth + "-" +
        value.getFullYear();
}

UtilJS.String = {};
UtilJS.String.IsNullOrEmpty = function (str) {
    if (!str || str == null) {
        return true;
    }
    return false;
};

UtilJS.String.RemoveUnicode = function (str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
}
UtilJS.String.IsContain = function (strRoot, strRequest, IsSearchWithFormat) {
    if (UtilJS.String.IsNullOrEmpty(strRoot)) {
        return false;
    }
    if (UtilJS.String.IsNullOrEmpty(strRequest)) {
        return true;
    }
    strRoot = strRoot.normalize();
    strRequest = strRequest.normalize();
    strRoot = strRoot.toLowerCase();
    strRequest = strRequest.toLowerCase();

    if (IsSearchWithFormat) {
        strRoot = UtilJS.String.RemoveUnicode(strRoot);
        strRequest = UtilJS.String.RemoveUnicode(strRequest);
    }

    if (strRoot.indexOf(strRequest) < 0) {
        return false;
    }
    return true;
};
UtilJS.String.IsContainUnsigned = function (strRoot) {
    if (UtilJS.String.IsNullOrEmpty(strRoot)) {
        return false;
    }
    strRoot = strRoot.normalize();
    strRoot = strRoot.toLowerCase();
    strRoot = UtilJS.String.RemoveUnicode(strRoot);

    if (/^[a-zA-Z0-9- ]*$/.test(strRoot) == false) {
        return true;
    }
    return false;
};

UtilJS.isNumber = function (evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;
    return true;
}

UtilJS.SumDecimal = function (Number) {
    return Math.round(Number * 1e12) / 1e12;
}

UtilJS.Array = {};
UtilJS.Array.Sort = function (Array, ColName, TypeData) {
    return _.sortBy(Array, function (item) {
        try {
            if (!item[ColName]) {
                return "";
            }
            let str = item[ColName].normalize();
            str = str.toLowerCase();
            return UtilJS.String.RemoveUnicode(str);
        } catch (e) {
            debugger;
            throw e;
        }
    });
};
UtilJS.Array.Picks = function (Array, Props, IsNotClone) {
    let arr = [];
    Array.forEach((x) => {
        let obj = {};
        Props.forEach((o) => {
            obj[o] = x[o];
        });
        if (IsNotClone) {
            arr.push(obj);
        }
        else {
            arr.push(_.clone(obj));
        }
    });
    return arr;
};
UtilJS.Array.IsDuplicate = function (Array, Prop) {
    let arr = [];
    for (var i = 0; i < Array.length; i++) {
        let x = Array[i];
        let u = _.find(arr, (a) => a == x[Prop]);
        if (u != undefined) {
            return true;
        }
        arr.push(x[Prop]);
    }
    return false;
};
UtilJS.Array.Count = function (Array, fnGetIndex) {
    let count = 0;
    Array.forEach((item) => {
        if (fnGetIndex(item)) {
            count += 1;
        }
    });
    return count;
};
UtilJS.Array.Sum = function (Array, name, fnGetIndex) {
    let rs = 0;
    if (fnGetIndex) {
        Array.forEach((item) => {
            if (fnGetIndex(item)) {
                rs = Math.add(rs, item[name]);
            }
        });
    }
    else {
        Array.forEach((item) => {
            rs = Math.add(rs, item[name]);
        });
    }
    return rs;
};
UtilJS.Array.Removes = function (Array, fnGetIndex) {
    let index = -1;
    do {
        index = _.findIndex(Array, function (objIndex) {
            return fnGetIndex(objIndex)
        });
        if (index >= 0) {
            Array.splice(index, 1);
        }
    } while (index >= 0);
};
UtilJS.Array.Remove = function (Array, fnGetIndex) {
    let index = _.findIndex(Array, function (objIndex) {
        return fnGetIndex(objIndex)
    });
    if (index < 0) {
        console.log(index);
        throw ("Không tồn tại item xóa");
    }
    Array.splice(index, 1);
};
UtilJS.Array.RemoveAll = function (Array, fnGetIndex) {
    Array.splice(0, Array.length);
};
//#endregion

//#region prototype 
Object.defineProperty(Number.prototype, "ctmAdd", {
    enumerable: false,
    value: function ctmAdd(num) {
        let value = this.valueOf();
        return Math.add(value, num);
    }
});
Object.defineProperty(Number.prototype, "ctmSub", {
    enumerable: false,
    value: function ctmSub(num) {
        let value = this.valueOf();
        return Math.subtraction(value, num);
    }
});
Object.defineProperty(Number.prototype, "ctmMul", {
    enumerable: false,
    value: function ctmMul(num) {
        let value = this.valueOf();
        return Math.multiplication(value, num);
    }
});
Object.defineProperty(Number.prototype, "ctmDiv", {
    enumerable: false,
    value: function ctmDiv(num) {
        let value = this.valueOf();
        return Math.division(value, num);
    }
});
Object.defineProperty(Number.prototype, "ctmToString", {
    enumerable: false,
    value: function ctmToString(option) {
        let x = this.valueOf();
        if (option) {
            let numFix = parseInt(option.replace('N', ''));
            return x.toFixed(numFix).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
Object.defineProperty(Number.prototype, "BFormatter", {
    enumerable: false,
    value: function BFormatter() {
        let num = this.valueOf();
        var result;
        if (num >= 1000000000) {
            result = (num / 1000000000).toFixed(0);
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "B";
        }
        else if (num >= 1000000) {
            result = (num / 1000000).toFixed(0);
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "M";
        }
        else if (num >= 1000) {
            result = (num / 1000).toFixed(0);
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "K";
        }
        else {
            result = num;
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
});
Object.defineProperty(Number.prototype, "BFormatterNumber", {
    enumerable: false,
    value: function BFormatterNumber() {
        let num = this.valueOf();
        var result = num;
        if (num > 1000000000) {
            result = (num / 1000000000).toFixed(1);
        }
        else if (num > 1000000) {
            result = (num / 1000000).toFixed(0);
        }
        else if (num > 1000) {
            result = (num / 1000).toFixed(0);
        }
        return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});

if (!String.format) {
    Object.defineProperty(String.prototype, "format", {
        enumerable: false,
        value: function format(option) {
            var args = Array.prototype.slice.call(arguments, 1);
            return option.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        }
    });
}
Object.defineProperty(String.prototype, "replaceAll", {
    enumerable: false,
    value: function replaceAll(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    }
});
Object.defineProperty(String.prototype, "ctmRemove", {
    enumerable: false,
    value: function ctmRemove(num) {
        return this.substring(0, num);
    }
});
Object.defineProperty(String.prototype, "ctmSubString", {
    enumerable: false,
    value: function ctmSubString(start, end) {
        return this.substring(start, start + end);
    }
});

Object.defineProperty(Array.prototype, "ctmCount", {
    enumerable: false,
    value: function ctmCount(fnc) {
        let arr = this.valueOf();
        let rs = 0;
        arr.forEach((x) => {
            if (fnc(x)) {
                rs += 1;
            }
        });
        return rs;
    }
});

Object.defineProperty(Array.prototype, "ctmSum", {
    enumerable: false,
    value: function ctmSum(fnc) {
        let arr = this.valueOf();
        let rs = 0;
        arr.forEach((x) => {
            rs = rs.ctmAdd(fnc(x));
        });
        return rs;
    }
});

Object.defineProperty(Array.prototype, "ctmOrderBy", {
    enumerable: false,
    value: function ctmOrderBy(fnc) {
        let arr = this.valueOf();
        arr = _.sortBy(arr, (x) => {
            let value = fnc(x);
            if (!value) {
                return "";
            }
            //else if (value instanceof Date) {
            //    return value;
            //}
            else if (typeof value == "string") {
                let str = value.normalize();
                str = str.toLowerCase();
                return UtilJS.String.RemoveUnicode(str);
            }
            return value;
        });
        return arr;
    }
});
Object.defineProperty(Array.prototype, "ctmOrderByDescending", {
    enumerable: false,
    value: function ctmOrderByDescending(fnc) {
        let arr = this.valueOf();
        arr = arr.ctmOrderBy(fnc).reverse();
        return arr;
    }
});
Object.defineProperty(Array.prototype, "ctmAverage", {
    enumerable: false,
    value: function ctmAverage(fnc) {
        let arr = this.valueOf();
        let rs = 0;
        if (fnc === undefined) {
            rs = arr.ctmSum(x => x).ctmDiv(arr.length);
        }
        else {
            rs = arr.ctmSum(x => fnc(x)).ctmDiv(arr.length);
        }
        return rs;
    }
});
Object.defineProperty(Array.prototype, "ctmFind", {
    enumerable: false,
    value: function ctmFind(fnc) {
        let arr = this.valueOf();
        for (var i = 0; i < arr.length; i++) {
            let x = arr[i];
            if (fnc(x)) {
                return x;
            }
        }
    }
});
Object.defineProperty(Array.prototype, "ctmDistinct", {
    enumerable: false,
    value: function ctmDistinct() {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (!_.contains(arr, this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    }
});

Object.defineProperty(Array.prototype, "ctmDistinctBy", {
    enumerable: false,
    value: function ctmDistinctBy(predicate) {
        let arr = this.valueOf();
        const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
        const result = [];
        const map = new Map();
        arr.forEach((item) => {
            const key = (item === null || item === undefined) ? item : cb(item);

            if (!map.has(key)) {
                map.set(key, item);
                result.push(item);
            }
        });
        return result;
    }
});


Object.defineProperty(Array.prototype, "ctmGroupBy", {
    enumerable: false,
    value: function ctmGroupBy(groupNames) {
        let arr = this.valueOf();

        return arr.reduce((r, rest) => {
            var key = rest[groupNames[0]];

            for (var i = 1; i < groupNames.length; i++) {
                key += "-" + rest[groupNames[i]];
            }
            if (r[key] != undefined) {
                r[key]["data"].push(rest);
            }
            else {
                r[key] = {};
                r[key]["data"] = [];
                for (var i = 0; i < groupNames.length; i++) {
                    r[key][groupNames[i]] = rest[groupNames[i]];
                }
                r[key]["data"].push(rest);
            }
            return r;
        }, {});
    }
});

Object.defineProperty(Array.prototype, "ctmMax", {
    enumerable: false,
    value: function ctmGroupBy(fnc) {
        let arr = this.valueOf();
        return Math.max.apply(null, arr.filter(x => fnc(x)));
    }
});
Object.defineProperty(Array.prototype, "ctmAny", {
    enumerable: false,
    value: function ctmAny(fnc) {
        let arr = this.valueOf();
        if (fnc !== undefined) {
            return arr.ctmFind(x => fnc(x)) != undefined;
        }
        else {
            return arr.length > 0;
        }
    }
});
Object.defineProperty(Array.prototype, "ctmFirst", {
    get: function ctmFirst() {
        return this[0];
    }
});
Object.defineProperty(Array.prototype, "ctmLast", {
    get: function ctmLast() {
        return this[this.length - 1];
    }
});
Object.defineProperty(Date.prototype, "ctmMonth", {
    get: function ctmMonth() {
        return this.getMonth() + 1;
    }
});
Object.defineProperty(String.prototype, "ctmToLower", {
    enumerable: false,
    value: function ctmToLower() {
        let strRoot = this.normalize();
        strRoot = strRoot.toLowerCase();
        return strRoot;
    }
});
Object.defineProperty(Date.prototype, "ctmTotalDays", {
    get: function ctmTotalDays() {
        return this.getTime() / (1000 * 3600 * 24);
    }
});
Object.defineProperty(Date.prototype, "ctmYear", {
    get: function ctmYear() {
        return this.getFullYear();
    }
});

Object.defineProperty(Date.prototype, "ctmAddDays", {
    enumerable: false,
    value: function ctmAddDays(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
});
Object.defineProperty(Date.prototype, "ctmAddMonths", {
    enumerable: false,
    value: function ctmAddMonths(num) {
        var dtm = new Date(this.getTime());
        return new Date(dtm.setMonth(dtm.getMonth() + num));
    }
});
Object.defineProperty(Date.prototype, "ctmToString", {
    enumerable: false,
    value: function ctmToString(option) {
        return moment(this).format(option);
    }
});
Object.defineProperty(Object.prototype, 'ctmSelect', {
    value: function (fnGetItem) {
        let arr = [];
        for (var propertyName in this) {
            arr.push(fnGetItem(this[propertyName]));
        }
        return arr;
    },
    enumerable: false,
    configurable: true
});

//#endregion