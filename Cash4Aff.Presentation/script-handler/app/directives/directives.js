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