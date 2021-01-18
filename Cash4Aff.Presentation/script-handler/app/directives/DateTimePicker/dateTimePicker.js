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