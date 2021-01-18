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