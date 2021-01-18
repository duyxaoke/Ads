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
var customSelect2 = function ($q) {
    return {
        restrict: 'E',
        scope: {
            myroot: "="
        },
        templateUrl: "/script-handler/app/directives/CustomSelect2/customSelect2.html",

        link: function (scope, element, attrs) {
            //#region function
            scope.myroot.UpdateValueSelected = function () {
                clearInterval(scope.myroot.myTimer);
                let defer = $q.defer();
                scope.myroot.myTimer = setInterval(() => {
                    if (scope.myroot.IsFinishRender) {
                        if (scope.myroot.IsDebug) {
                            debugger;
                        }
                        clearInterval(scope.myroot.myTimer);
                        scope.SetValid(scope.myroot.Value);

                        scope.myControl.val(scope.myroot.Value);

                        scope.myControl_s2id = $(element[0]).find('.select2-container');
                        scope.myControl_s2id.select2("val", scope.myroot.Value);
                        //scope.myControl.val(scope.myroot.Value).trigger('change');
                        defer.resolve(scope.myroot.Value);
                    }
                }, 100);
                return defer.promise;
            }
            scope.SetValid = function (ValueClient, IsValid) {
                if (ValueClient === "") {
                    $("input[name=" + scope.myroot.ID + "]").val('');
                }
                else {
                    $("input[name=" + scope.myroot.ID + "]").val(ValueClient);
                }
                try {
                    IsValid && ($("input[name=" + scope.myroot.ID + "]").valid());
                } catch (e) { }
            };
            //#endregion

            scope.myControl = $(element[0]).find('.myControl');
            //required 

            //default
            //myroot.Core.ValidType == "Required"

            //result
            //scope.myroot.Value => scope.myroot.Value 
            if (scope.myroot.IsDebug) {
                debugger;
            }
            if (!scope.myroot.Core.Label) {
                scope.myroot.Core.label = attrs.label;
                
            }
            else {
                scope.myroot.Core.label2 = scope.myroot.Core.Label;
            }

            if (!scope.myroot.Core.label2) {
                scope.myroot.Core.label2 = "Chọn " + attrs.label.charAt(0).toLowerCase() + attrs.label.slice(1);
            }
            scope.myroot.ID = attrs.myroot.replace(".", "_");
            scope.myroot.IsFinishRender = !scope.myroot.Lst || scope.myroot.Lst && scope.myroot.Lst.length == 0;

            !scope.myroot.API && (scope.myroot.API = {});
            !scope.myroot.CallBack && (scope.myroot.CallBack = {});

            !scope.myroot.Core.ValueDefault && (scope.myroot.Core.ValueDefault = "");

            scope.myroot.ValueOrginal = '';
            if (scope.myroot.Value) {
                scope.myroot.ValueOrginal = scope.myroot.Value;
                scope.myroot.Value = scope.myroot.Value.toString();
            }
            else {
                scope.myroot.Value = scope.myroot.Core.ValueDefault;
            }

            scope.myroot.Onchange = function () {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                scope.SetValid(scope.myroot.Value, true);
                scope.myroot.CallBack.OnValuechanged && (scope.myroot.CallBack.OnValuechanged(scope.myroot.Value));
                scope.myroot.CallBack.Onchanged && (scope.myroot.CallBack.Onchanged());
            };
            scope.myroot.API.DiscardChange = function () {
                scope.myroot.API.SetValue(scope.myroot.ValueOrginal, true);
            };
            scope.myroot.API.SetValue = function (Value, IsNotFireChangedEvent) {
                try {
                    if (scope.myroot.IsDebug) {
                        debugger;
                    }
                    if (Value === null || Value === undefined) {
                        Value = scope.myroot.Core.ValueDefault;
                    }
                    scope.myroot.ValueOrginal = Value;
                    scope.myroot.Value = Value.toString();
                    scope.myroot.UpdateValueSelected().then((x) => {
                        if (scope.myroot.IsDebug) {
                            debugger;
                        }
                        if (!IsNotFireChangedEvent) { 
                            scope.myroot.CallBack.OnValuechanged && (scope.myroot.CallBack.OnValuechanged(x));
                        }
                    });
                } catch (e) {
                    debugger;
                    throw e;
                }
            };
            scope.myroot.API.DataSource = function (Lst) {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                scope.myroot.Lst = Lst;
                scope.myroot.UpdateValueSelected();
            };
            scope.myroot.API.OnStart = function () {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                scope.myroot.IsFinishRender = false;
            };
            scope.myroot.API.OnEnd = function () {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                scope.myroot.IsFinishRender = true;
            };
            //ready
            scope.myroot.UpdateValueSelected();
            scope.myControl.select2();

            scope.myroot.IsReady = true;
        }
    };
};
customSelect2.$inject = ["$q"];
var dateTimePicker = function () {
    return {
        restrict: 'E',
        scope: {
            myroot: "="
        },
        templateUrl: "/script-handler/app/directives/DateTimePicker/dateTimePicker.html",

        link: function (scope, element, attrs) {
            scope.input = $(element[0]).find('.myDtm');
            //default
            //scope.myroot.Core.ValidType == "Required" 
            //scope.myroot.Core.DateType == "Date" // "DateTime" 
            //scope.myroot.Core.IsComparedtmTo : so sánh với 1 dtm khác ??? nên callback lại thì hay hơn

            //result
            //scope.myroot.Value => scope.myroot.Value 
            !scope.myroot.API && (scope.myroot.API = {});
            !scope.myroot.CallBack && (scope.myroot.CallBack = {});

            scope.myroot.ID = attrs.myroot.replace(".", "_");
            scope.myroot.Core.showTodayButton = true;
            scope.myroot.Core.showClear = true;
            scope.myroot.Core.showClose = true;

            scope.myroot.Core.label = attrs.label;

            if (scope.myroot.Core.DateType == "MonthYear") {
                !scope.myroot.Core.FormatValueDisplay
                    && (scope.myroot.Core.format = 'MM/YYYY');
                !scope.myroot.Core.FormatValue
                    && (scope.myroot.Core.FormatValue = 'MM/YYYY');
            }
            else if (scope.myroot.Core.DateType == "DateTime") {
                !scope.myroot.Core.FormatValueDisplay
                    && (scope.myroot.Core.format = 'DD/MM/YYYY HH:mm');
                !scope.myroot.Core.FormatValue
                    && (scope.myroot.Core.FormatValue = 'MM/DD/YYYY HH:mm');
            }
            else {
                !scope.myroot.Core.FormatValueDisplay
                    && (scope.myroot.Core.format = 'DD/MM/YYYY');
                !scope.myroot.Core.FormatValue
                    && (scope.myroot.Core.FormatValue = 'MM/DD/YYYY');
            }

            scope.myroot.ValueOrginal = undefined;
            if (scope.myroot.Value) {
                scope.myroot.ValueOrginal = scope.myroot.Value;
                scope.myroot.ValueDisplay = moment(scope.myroot.Value).format(scope.myroot.Core.format);
                scope.myroot.Value = moment(scope.myroot.Value).format(scope.myroot.Core.FormatValue);
            }
            else {
                scope.myroot.Value = null;
            }

            //trigger change ???
            scope.myroot.API.SetValue = function (Value, IsNotCB) {
                try {
                    if (scope.myroot.IsDebug) {
                        debugger;
                    }
                    scope.myroot.ValueOrginal = Value;
                    if (Value === null || Value === undefined) {
                        scope.myroot.ValueDisplay = null;
                        scope.myroot.Value = null;
                    }
                    else {
                        scope.myroot.ValueDisplay = moment(Value).format(scope.myroot.Core.format);
                        scope.myroot.Value = moment(Value).format(scope.myroot.Core.FormatValue);
                    }
                    $("input[name=" + scope.myroot.ID + "]").val(scope.myroot.Value);
                    !IsNotCB && scope.myroot.CallBack.OnValuechanged && (scope.myroot.CallBack.OnValuechanged(scope.myroot.Value));
                } catch (e) {
                    debugger;
                    throw e;
                }
            };
            scope.myroot.config = {};
            scope.myroot.config.format = scope.myroot.Core.format;
            scope.myroot.config.showTodayButton = true;
            scope.myroot.config.showClear = true;
            scope.myroot.config.showClose = true;

            if (scope.myroot.Core.MinDate) {
                scope.myroot.config.minDate = scope.myroot.Core.MinDate;
            }
            else {
                scope.myroot.config.minDate = new Date(0);
            }
            if (scope.myroot.Core.UseCurrent != undefined) {
                scope.myroot.config.useCurrent = scope.myroot.Core.UseCurrent;
            }
            scope.input.datetimepicker(scope.myroot.config);
            scope.input.on("dp.change", function (e) {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                if (!e.date) {
                    scope.myroot.ValueDisplay = null;
                    scope.myroot.Value = null;
                }
                else {
                    scope.myroot.ValueDisplay = scope.input.val();
                    scope.myroot.Value = moment(e.date).format(scope.myroot.Core.FormatValue);
                }
                $("input[name=" + scope.myroot.ID + "]").val(scope.myroot.Value);
                try {
                    $("input[name=" + scope.myroot.ID + "]").valid();
                } catch (e) { }

                //let EndDate = new Date($scope.PriceSearchRes.DateTo);
                //if (e.date._d.getTime() > EndDate.getTime()) {
                //    e.date._d.setHours(23, 59, 0, 0);
                //    $('#txtToDate').data("DateTimePicker").date(e.date);
                //}
                //e.date._d.setHours(0, 0, 0, 0);
                //$('#txtToDate').data("DateTimePicker").minDate(e.date);

                scope.myroot.CallBack.OnValuechanged && (scope.myroot.CallBack.OnValuechanged(scope.myroot.Value));
            });
            scope.myroot.API.SetMinDate = function (date) {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                if (moment(date).isValid()) {
                    date = moment(date)._d;
                    //date.setHours(0, 0, 0, 0);
                    scope.input.data("DateTimePicker").minDate(date);
                }
            }
            scope.myroot.API.SetMinTime = function (date) {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                if (moment(date).isValid()) {
                    let str = moment(date).format('HH:mm');
                    scope.input.setOptions({
                        minTime: str
                    });
                }
            }
            scope.myroot.API.SetMaxDate = function (date) {
                if (scope.myroot.IsDebug) {
                    debugger;
                }
                if (moment(date).isValid()) {
                    date = moment(date)._d;
                    //date.setHours(0, 0, 0, 0);
                    scope.input.data("DateTimePicker").maxDate(date);
                }
            }
            $("input[name=" + scope.myroot.ID + "]").val(scope.myroot.Value);

            scope.myroot.IsReady = true;
        }
    };
};
dateTimePicker.$inject = [];
//addDirective("dateTimePicker", dateTimePicker);
var formatMoney = function ($filter, $timeout) {
    return {
        require: '?ngModel',
        restrict: "A",
        scope: {
            myModel: "=",
            precision: "=",
            formatMoneyNoInput: "="
        },
        link: function (scope, elem, attrs, ctrl) {
            if (scope.precision == null || scope.precision == undefined)
                scope.precision = 0;
            elem.maskMoney({
                allowNegative: true, thousands: ',', decimal: '.', affixesStay: false, allowZero: true, precision: scope.precision
            });
            elem.keydown(function (event) {
                var c = String.fromCharCode(event.which);
                if (_.contains(scope.formatMoneyNoInput, c)) {
                    event.preventDefault();
                    return;
                }
                $timeout(function () {
                    scope.myModel = parseFloat(elem.val().replace(new RegExp(",", 'g'), ""));
                    elem.trigger("change");
                });
            });
            scope.$watch('myModel', function () {
                if ($.isNumeric(scope.myModel) && scope.myModel.toString().indexOf('.') > 0) {
                    elem.val(scope.myModel.toFixed(scope.precision)).trigger('mask.maskMoney');
                }
                else {
                    elem.val(scope.myModel).trigger('mask.maskMoney');
                }
            });
        }
    }
};
formatMoney.$inject = ['$filter', '$timeout'];
var getWidth = function ($timeout, $interval) {
    return {
        restrict: 'A',

        scope: {
            getWidth: "=",
        },

        link: function (scope, element, attrs) {
            $(function () {
                scope.getWidth = element[0].offsetWidth; 

                $interval(function () {
                    scope.getWidth = element[0].offsetWidth;
                }, 500); 
            });
        }
    };
};

getWidth.$inject = ["$timeout", "$interval"];

var getHeight = function ($timeout, $interval) {
    return {
        restrict: 'A',

        scope: {
            getHeight: "=",
        },

        link: function (scope, element, attrs) {
            $(function () { 
                scope.getHeight = element[0].offsetHeight; 

                $interval(function () {
                    scope.getHeight = element[0].offsetHeight;
                }, 500);
            });
        }
    };
};

getHeight.$inject = ["$timeout", "$interval"];
var lazyLoad = function ($timeout, $window) {
    return {
        restrict: 'A',
        scope: {
            fncallback: "&lazyLoad"
        },

        link: function (scope, element, attrs) {
            scope.IsLoaded = false;
            scope.raw = element[0];  
            angular.element($window).bind("scroll", function (e) {
                var IsVisible = $(scope.raw).is(':visible');
                if (!scope.IsLoaded && IsVisible) {
                    var PositionYofElement = $(scope.raw).position().top;
                    if (this.pageYOffset + this.innerHeight >= PositionYofElement) {
                        scope.fncallback();
                        scope.IsLoaded = true; 
                        scope.$apply();
                    }

                }
            });
        }
    };
};

lazyLoad.$inject = ["$timeout", "$window"];
 
var noInput = function () {
    return {
        restrict: 'A',

        scope: {
            noInput: "="
        }, 

        link: function (scope, element, attrs) {  
            element.bind("keydown keypress", function (event) { 
                var c = String.fromCharCode(event.which);
                if (_.contains(scope.noInput, c)) { 
                    event.preventDefault();
                } 
            });

            //scope.KeyCode = [];
            //scope.noInput.forEach(function (item) {
            //    scope.KeyCode.push(item.charCodeAt(0));
            //});

            //element.bind("keydown keypress", function (event) {
            //    if (_.contains(scope.KeyCode, event.which)) {
            //        event.preventDefault();
            //    }
            //});
        }
    }; 
};
noInput.$inject = [];
var whenEnter = function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.whenEnter);
                });

                event.preventDefault();
            }
        });
    };
};
whenEnter.$inject = [];
var compile = function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
          function (scope) {
              // watch the 'compile' expression for changes
              return scope.$eval(attrs.compile);
          },
          function (value) {
              // when the 'compile' expression changes
              // assign it into the current DOM
              element.html(value);

              // compile the new DOM and link it to the current
              // scope.
              // NOTE: we only compile .childNodes so that
              // we don't get into infinite loop compiling ourselves
              $compile(element.contents())(scope);
          }
      );
    };
};
compile.$inject = ["$compile"];
var gridSort = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            sort: "=",
            columnName: "=",
            fnCallBack: "&"
        },

        templateUrl: "/script-handler/app/directives/GridSort/GridSort.html",  

        link: function (scope, element, attrs) {

        }
    };
};

gridSort.$inject = ["$timeout"];
var paginationStyle1 = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            pager: "=",//{ TotalItems: 0, PageSize: 10, CurrentPage: 1 }
            totalItems: "=",
            fnCallBack: "&"
        },
        templateUrl: "/script-handler/app/directives/pagination-style/pagination-style.html",

        link: function (scope, element, attrs) {
            scope.pager.TotalItems = 0;
            scope.pager.TotalPages = 0;

            function setPage() {
                if (!scope.pager.CurrentPage || scope.pager.CurrentPage < 1 || scope.pager.CurrentPage > scope.pager.TotalPages) {
                    scope.pager.Pages = [];
                    return;
                }

                if (!scope.pager.TotalPages) {
                    scope.pager.Pages = [];
                    return;
                }

                // get pager object from service
                GetPager(scope.pager.TotalItems, scope.pager.CurrentPage, scope.pager.PageSize);
            }

            function GetPager(TotalItems, CurrentPage, PageSize) {
                // default to first page
                CurrentPage = CurrentPage || 1;
                // default page size is 10
                PageSize = PageSize || 10;

                var StartPage, EndPage;
                StartPage = scope.pager.StartPage || 1;
                EndPage = scope.pager.EndPage || 10;
                //số page trên 1 trang
                var NumberPageSize = 10;
                var Lst = [];
                var NumberPager = Math.floor(scope.pager.TotalPages / NumberPageSize);
                var decimalPager = scope.pager.TotalPages % NumberPageSize;

                for (var i = 1; i <= NumberPager; i++) {
                    var Start = (i - 1) * PageSize;
                    var End = Start + NumberPageSize;
                    Lst.push({ Start: Start + 1, End: End });
                }
                if (decimalPager > 0) {
                    Lst.push({ Start: NumberPager * NumberPageSize + 1, End: NumberPager * NumberPageSize + decimalPager });
                }
                var IsHasCurrentPage = false;
                for (var i = 0; i < Lst.length; i++) {
                    if (CurrentPage >= Lst[i].Start && CurrentPage <= Lst[i].End) {
                        StartPage = Lst[i].Start;
                        EndPage = Lst[i].End;
                        if (EndPage > 10 && EndPage - StartPage < 9) {
                            StartPage = EndPage - 9;
                        }
                        IsHasCurrentPage = true;
                        break;
                    }
                }
                if (!IsHasCurrentPage) {
                    CurrentPage = Lst[0].Start;
                    StartPage = Lst[0].Start;
                    EndPage = Lst[0].End;
                }

                // calculate start and end item indexes
                var StartIndex = (CurrentPage - 1) * PageSize;
                var EndIndex = Math.min(StartIndex + PageSize - 1, TotalItems - 1);

                // create an array of pages to ng-repeat in the pager control
                var Pages = [];
                for (var i = StartPage; i <= EndPage; i++) {
                    Pages.push(i);
                }
                if (CurrentPage <= 0)
                    CurrentPage = 1;
                // return object with all pager properties required by the view
                scope.pager.PageSize = PageSize;
                scope.pager.StartPage = StartPage;
                scope.pager.EndPage = EndPage;
                scope.pager.StartIndex = StartIndex;
                scope.pager.EndIndex = EndIndex;
                scope.pager.Pages = Pages;
            }

            scope.$watch('totalItems', function (value) {
                scope.pager.TotalItems = scope.totalItems;
                scope.InitPager();
            });
            scope.$watch('pager.CurrentPage', function (value) {
                scope.InitPager();
            });
            scope.InitPager = function () {
                $timeout(function () {
                    scope.pager.TotalPages = Math.ceil(scope.pager.TotalItems / scope.pager.PageSize);

                    //Case: cập nhật mà bị mất row, thì fai~ pagecurrent--
                    if (scope.pager.CurrentPage > scope.pager.TotalPages) {
                        scope.pager.CurrentPage = scope.pager.TotalPages;
                        if (scope.pager.TotalPages == 0) {
                            scope.pager.CurrentPage = 1;//gán = 1 để khi set page, nếu totalpages có data thì currentpage bắt đầu là 1
                        }
                    }

                    setPage();
                });
            };

            scope.Exec = function (intPageClicked) {
                if (intPageClicked > scope.pager.TotalPages) {
                    return;
                }

                scope.fnCallBack({ PageClicked: intPageClicked });
                //setPage();
            }
            scope.ExecFirst = function (intPageClicked) {
                if (intPageClicked > scope.pager.TotalPages) {
                    intPageClicked = scope.pager.TotalPages;
                }
                if (intPageClicked <= 0) {
                    intPageClicked = 1;
                }
                scope.pager.StartPage = scope.pager.StartPage - 10;
                scope.pager.EndPage = scope.pager.EndPage - 10;
                if (scope.pager.StartPage <= 0) {
                    scope.pager.StartPage = 1;
                    scope.pager.EndPage = 10;
                }
                scope.fnCallBack({ PageClicked: intPageClicked });
                //setPage();
            }
            scope.ExecLast = function (intPageClicked) {
                if (intPageClicked > scope.pager.TotalPages) {
                    intPageClicked = scope.pager.TotalPages;
                }
                scope.pager.StartPage = scope.pager.EndPage + 1;
                scope.pager.EndPage = scope.pager.StartPage + 9;
                if (scope.pager.EndPage > scope.pager.TotalPages) {
                    scope.pager.EndPage = scope.pager.TotalPages;
                    scope.pager.StartPage = scope.pager.EndPage - 9;
                }
                scope.fnCallBack({ PageClicked: intPageClicked });
                //setPage();
            }

            scope.pager.GetPageIndexReLoad = function (totalItem) {//dùng khi xóa row mà muốn tìm CurrentPage reload grid
                if (scope.pager.CurrentPage < scope.pager.TotalPages) return scope.pager.CurrentPage;
                if (totalItem % scope.pager.PageSize > 0) return scope.pager.CurrentPage;
                else return scope.pager.CurrentPage-1;
            }
        }
    };
};

paginationStyle1.$inject = ["$timeout"];
var paginationStyle2 = function ($timeout) {
    return {
        restrict: "E",

        scope: {
            pager: "=",
            totalItems: "=",
            fnCallBack: "&"
        },
        templateUrl: "/script-handler/app/directives/pagination-style2/pagination-style2.html",

        link: function (scope, element, attrs) {
            scope.pager.MaxPage = -1;

            scope.$watch('totalItems', function (value) {
                scope.pager.TotalItems = scope.totalItems;
                scope.pager.MaxPage = -1;
                scope.InitPager();
            });
            scope.$watch('pager.CurrentPage', function (value) {
                scope.InitPager();
            });
            scope.InitPager = function () {
                $timeout(function () {
                    var StartIndex = (scope.pager.CurrentPage - 1) * scope.pager.PageSize;
                    var nextIndex = StartIndex + scope.pager.PageSize;
                    scope.pager.StartIndex = StartIndex;
                    if (nextIndex >= scope.pager.TotalItems)
                        scope.pager.MaxPage = scope.pager.CurrentPage;
                });
            };
            scope.Exec = function (intPageClicked, event) {
                //$(event.currentTarget).blur();
                if ((scope.pager.MaxPage > -1) && (intPageClicked > scope.pager.MaxPage)) {
                    return;
                }
                if (intPageClicked <=0) {
                    return;
                }
                scope.fnCallBack({ PageClicked: intPageClicked });
            }
        }
    };
};

paginationStyle2.$inject = ["$timeout"];
var inputFormat = function ($filter) {
    return {
        require: '?ngModel',
        restrict: "A",
        link: function (scope, elem, attrs, ctrl) {
            function isFloat(n) {
                return Number(n) === n && n % 1 !== 0;
            }
            var allowdecimal = (attrs["allowDecimal"] == 'true') ? true : false;
            scope.allowdecimal = allowdecimal;
            scope.defaultValue = attrs["defaultValue"] ? attrs["defaultValue"] : false;
            if (!ctrl) return;

            elem.bind("keypress", function (event) {
                var keyCode = event.which || event.keyCode;
                var allowdecimal = (attrs["allowDecimal"] == 'true') ? true : false;
                if (((keyCode > 47) && (keyCode < 58)) || (keyCode == 8) || (keyCode == 9) || (keyCode == 190) || (keyCode == 39) || (keyCode == 37) || (keyCode == 43) || (allowdecimal && keyCode == 46))
                    return true;
                else
                    event.preventDefault();
            });

            ctrl.$formatters.unshift(function (a) {
                let valueDefault = 0;
                if (attrs["defaultValue"] !== undefined) {
                    valueDefault = attrs["defaultValue"];
                }
                let finalVal = $filter(attrs.inputFormat)(ctrl.$modelValue ? ctrl.$modelValue : valueDefault);
                if (finalVal == "0") {
                    finalVal = "";
                }
                return finalVal;
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var allowdecimal = (attrs["allowDecimal"] == 'true') ? true : false;
                if (!parseInt(viewValue)) {
                    viewValue = attrs["defaultValue"];
                }
                else if (!allowdecimal && isFloat(parseFloat(viewValue))) {
                    viewValue = scope.defaultValue;
                }
                var plainNumber = viewValue.replace(/[^\d|\.|\-]/g, '');
                plainNumber = plainNumber || 0;
                if (plainNumber == '') return;
                var dots = plainNumber.match(/\./g);
                var dotAF = plainNumber.match(/\.$/g);
                dots = (dots != null && dots.length == 1 && dotAF != null) ? '.' : '';
                var temp = $filter(attrs.inputFormat)(plainNumber);

                elem.val(temp + dots).trigger('change');

                return parseFloat(plainNumber);
            });
        }
    }
};
inputFormat.$inject = ['$filter'];
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
var dateFormat = function ($filter) {
    return function (input, optional) {

        if (!input) {
            return "";
        }
        if (optional == undefined || optional == '') optional = "dd/MM/yyyy";
        var resultDate;

        if (input instanceof Date) {
            resultDate = input;
        } else {
            var temp = input.replace(/\//g, "").replace("(", "").replace(")", "").replace("Date", "").replace("+0700", "").replace("-0000", "");

            if (input.indexOf("Date") > -1) {
                resultDate = new Date(+temp);
            } else {
                resultDate = new Date(temp);
            }

            var utc = resultDate.getTime() + (resultDate.getTimezoneOffset() * 60000);

            // create new Date object for different city
            // using supplied offset
            var resultDate = new Date(utc + (3600000 * 7));
        }

        return $filter("date")(resultDate, optional);
    };
};
dateFormat.$inject = ["$filter"];
var formatMonthYear = function ($filter) {
    return function (input) {

        var year = input.toString().substr(0, 4);
        var month = input.toString().substr(4, 2);

        var result = month + "/" + year;

        return result;
    };
};

formatMonthYear.$inject = ["$filter"];
var trustHtml = function ($sce) {
    return function (input) {
        if (!input) {
            return "";
        }
        return $sce.trustAsHtml(input);
    };
};
trustHtml.$inject = ["$sce"];
var ifEmpty = function () {
    return function (input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '' || input === 'Invalid date') {
            return defaultValue;
        }
        return input;
    }
};
var toFixedDecimal = function ($filter) {
    try {
        return function (value, optional) {
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
                value = $filter('number')(parseFloat(value), optional);
            } else {
                value = $filter('number')(value);
            }
            return value;
        }
    } catch (e) {
        return 0;
    }
};
toFixedDecimal.$inject = ["$filter"];
var lstDependency = [];
lstDependency.push("ngRoute");
lstDependency.push("angular.filter");
lstDependency.push("ngTagsInput");
//lstDependency.push("ngAnimate");

var MyApp = angular.module("MyApp", lstDependency);
////#region Khai báo Factories

var addFactory = function (name, factory) {
    try {
        MyApp.factory(name, factory);
    } catch (e) {
        console.log(JSON.stringify(e));
    }
}
//#region EWorking
addFactory("$localstorage", $localstorage);
addFactory("CommonFactory", CommonFactory);
addFactory("UtilFactory", UtilFactory);
//addFactory("HelperFactory", HelperFactory);
//addFactory("ApiHelper", ApiHelper);
addFactory("DataFactory", DataFactory);

//#endregion

//#endregion

//#region Khai báo Controllers

var addController = function (name, controller) {
    try {
        MyApp.controller(name, controller);
    } catch (e) {
        console.log(JSON.stringify(e));
    }
}

//#region Index
//addController("MasterPageController", MasterPageController);
//#endregion

//#region Khai báo Directives

var addDirective = function (name, directive) {
    try {
        MyApp.directive(name, directive);
    } catch (e) {
        console.log(JSON.stringify(e));
    }
}
addDirective("customSelect2", customSelect2);
addDirective("dateTimePicker", dateTimePicker);
addDirective("formatMoney", formatMoney);
addDirective("getWidth", getWidth);
addDirective("getHeight", getHeight);
addDirective("lazyLoad", lazyLoad);
addDirective("noInput", noInput);
addDirective("whenEnter", whenEnter);
addDirective("compile", compile);
addDirective("gridSort", gridSort);
addDirective("inputFormat", inputFormat);
addDirective("paginationStyle1", paginationStyle1);
addDirective("paginationStyle2", paginationStyle2);
//addDirective("exportData", exportData);

//addDirective("gridCheckBox", gridCheckBox);
//addDirective("gridCheckBoxVertical", gridCheckBoxVertical);
//addDirective("gridCheckBoxParent", gridCheckBoxParent);
//
//addDirective("gridCheckBoxProCat", gridCheckBoxProCat);
//addDirective("gridCheckBoxVerticalProCat", gridCheckBoxVerticalProCat);
//addDirective("gridCheckBoxParentProCat", gridCheckBoxParentProCat);
//
//#endregion Khai báo Directives

//#region Khai báo Filters

var addFilter = function (name, filter) {
    try {
        MyApp.filter(name, filter);
    } catch (e) {
        console.log(JSON.stringify(e));
    }
}

addFilter("dateFormat", dateFormat);
addFilter("trustHtml", trustHtml);
addFilter("ifEmpty", ifEmpty);
addFilter("toFixedDecimal", toFixedDecimal);
addFilter("formatMonthYear", formatMonthYear);


//addFilter("dateTimeFormat", dateTimeFormat);
//addFilter("timeFormatStoreRent", timeFormatStoreRent);
//addFilter("trustHtml", trustHtml);
//addFilter("timeFormat", timeFormat);
//addFilter("propsFilter", propsFilter);
//addFilter("currency", currency);
//addFilter("tel", telFormat);
//addFilter("webstatus", webstatus);
//addFilter("shortenedName", shortenedName);
//addFilter("numberFormat", numberFormat);
//addFilter("numberSerialFormat", numberSerialFormat);
//addFilter("roundFloatNumber", roundFloatNumber);

//#endregion Khai báo Filters

//#region Khai báo hàm config (url nằm trong này)

//var configFunction = function ($routeProvider, $compileProvider) {
//    ////#region Khai báo URL
//    //var addURL = function (url, template, controller) {
//    //    try {
//    //        $routeProvider.when("/" + url, { templateUrl: template, controller: controller });
//    //    } catch (e) {
//    //        console.log(e);
//    //    }
//    //}

//    //var addEWorkingURL = function (url, template, controller) {
//    //    addURL(url, "/" + template, controller);
//    //}

//    ////#region Index

//    //addEWorkingURL("page1a", "Home/Page1A/", Page1AController);
//    //addEWorkingURL("page1b", "Home/Page1B/", Page1BController);

//    ////#endregion
//    //$routeProvider.otherwise({ redirectTo: "/page1a" });
//}

//configFunction.$inject = ["$routeProvider", "$compileProvider"];

//MyApp.config(configFunction);

MyAppSetConfig = {};
MyAppSetConfig.addURL = function (url, template, controller, routeProvider) {
    try {
        routeProvider.when("/" + url, { templateUrl: "/" + template, controller: controller });
    } catch (e) {
        console.log(e);
    }
}
MyAppSetConfig.Otherwise = function (DefaultURL, routeProvider) {
    routeProvider.otherwise({ redirectTo: "/" + DefaultURL });
}
addFactory("$exceptionHandler", function () {
    return function (exception, cause) {
        setTimeout(function () {
            throw exception;
        }, 1000);

    };
});
//#endregion