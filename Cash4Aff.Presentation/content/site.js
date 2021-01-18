
var sys = (function () {
    var Alert, Loading, HideLoading, CheckNull, CheckNumber, CheckExistAttribute, DeleteRow, FormatMoney,
        UnFormatMoney, GetURLParameter, UrlDecode, FormatDate, SetCache, GetCache, RemoveCache, ClearCacheUI;

    ClearCacheUI = function () {
        $.ajax({
            "url": "/OutputCache/Remove",
            "type": "GET",
            "dataType": 'json',
            "Content-Type": 'application/json; charset=utf-8',
            success: function (response) {
                sys.Alert(true, 'Xóa thành công!');
                setTimeout(function () {
                    location.reload();
                }, 1000);
            },
            error: function (e) {
                sys.Alert(false, 'Xóa thất bại, vui lòng thử lại!');
            }
        });
    };

    SetCache = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    GetCache = function (key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    };
    RemoveCache = function (key) {
        localStorage.removeItem("token");
    };

    Alert = function (status, text) {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        toastr[status === true ? "success" : "error"](text);
    };
    Loading = function () {
        $("body").loading();
    };
    HideLoading = function () {
        $("body").loading('stop');
    };

    CheckNull = function (value) {
        if (value === null || !value || (typeof value === 'undefined'))
            return "";
        return value;
    }
    CheckNumber = function (value) {
        if (isNaN(parseFloat(value)) || value === null || !value || (typeof value === 'undefined'))
            return 0;
        return value;
    }
    CheckExistAttribute = function (elements, attrName, attrValue) {
        var result = true;
        if (attrValue) { // if we're checking their value...
            for (i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute(attrName) == attrValue)
                    result = false;
            }
        }
        return result;
    }
    DeleteRow = function (elements) {
        if (confirm('Bạn chắc chắn muốn xóa dòng này?')) {
            $(elements).closest('tr').remove();
        }
    }
    FormatMoney = function (data, float) {
        var data = CheckNumber(data);
        return accounting.formatNumber(data, float);
    };

    UnFormatMoney = function (data) {
        return data.toString().replace(/,/g, '');
    }

    GetURLParameter = function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
    UrlDecode = function (str) {
        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    }

    FormatDate = function (elements) {
        var date = $(elements).val();
        if (CheckNull(date) == "") {
            $(elements).datepicker('setDate', 'today');
        }
        else {
            let fdate = sys.UrlDecode(date);
            let from = fdate.split("/");
            $(elements).datepicker("setDate", new Date(from[2], from[1] - 1, from[0]));
        }
    }
    return {
        ClearCacheUI: ClearCacheUI,
        Alert: Alert,
        SetCache: SetCache,
        GetCache: GetCache,
        RemoveCache: RemoveCache,
        Loading: Loading,
        HideLoading: HideLoading,
        CheckNull: CheckNull,
        CheckNumber: CheckNumber,
        CheckExistAttribute: CheckExistAttribute,
        DeleteRow: DeleteRow,
        FormatMoney: FormatMoney,
        UnFormatMoney: UnFormatMoney,
        GetURLParameter: GetURLParameter,
        UrlDecode: UrlDecode,
        FormatDate: FormatDate,
    };
})();
