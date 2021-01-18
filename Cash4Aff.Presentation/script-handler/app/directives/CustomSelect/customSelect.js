var customSelect = function ($http, $timeout, $filter) { 
    return {
        restrict: 'E',  
        scope: {
            myroot: "=",
            placeHolder: "="
        }, 
        templateUrl: "/script-handler/app/directives/CustomSelect/customSelect.html",  
        link: function (scope, element, attrs) { 
            var UpdateSelected = function () {
                scope.myroot.Result.LstSelected = [];
                scope.myroot.Result.LstIDSelected = [];

                scope.myroot.chkAll.IsChecked_ = false;
                scope.myroot.txtDisplay.Text = "";

                scope.myroot.Lst.forEach(function (item) {
                    if (item.IsChecked_) {
                        scope.myroot.txtDisplay.Text += item[scope.myroot.Core.Text].toString() + ", ";
                        scope.myroot.Result.LstSelected.push(item);

                        if (scope.myroot.Core.IDValue) {
                            scope.myroot.Result.LstIDSelected.push(item[scope.myroot.Core.IDValue]);
                        }
                    }
                });
                scope.myroot.txtDisplay.Text = scope.myroot.txtDisplay.Text.trim();
                scope.myroot.txtDisplay.Text = scope.myroot.txtDisplay.Text.substring(0, scope.myroot.txtDisplay.Text.length - 1);

                //hiển thị kq 
                if (scope.myroot.Result.LstSelected.length > 0) {
                    if (scope.myroot.Result.LstSelected.length > 9) {
                        scope.myroot.txtDisplay.Text = scope.myroot.Result.LstSelected.length + " được chọn";
                    }
                    if (scope.myroot.Result.LstSelected.length == scope.myroot.Lst.length) {
                        scope.myroot.chkAll.IsChecked_ = true;
                        scope.myroot.txtDisplay.Text = "Tất cả";
                    }
                } 

                if (scope.myroot.CallBack && scope.myroot.CallBack.OnUpdateSelected) {
                    scope.myroot.CallBack.OnUpdateSelected(scope.myroot.Core.ID);  
                }
            };
            !scope.myroot.Lst && (scope.myroot.Lst = []);
            scope.myroot.element = element;
            scope.myroot.txtDisplay = { Text: '' };
            scope.myroot.txtKeySearch = { Text: '' };
            scope.myroot.chkAll = { IsChecked_: false };
            scope.myroot.Result = { LstSelected: [] };
             
            scope.myroot.API = {};
            scope.myroot.API.ClearSelection = function () {
                $timeout.cancel(scope.ClearSelectionTimeout);
                scope.ClearSelectionTimeout = $timeout(function () {
                    scope.myroot.Lst.forEach(function (item) {
                        item.IsChecked_ = false;
                    });
                }, 50);
            }; 
            scope.myroot.API.SelectAll = function () {
                $timeout.cancel(scope.SelectionAllTimeout);
                scope.SelectionAllTimeout = $timeout(function () {
                    scope.myroot.Lst.forEach(function (item) {
                        item.IsChecked_ = true;
                    });
                }, 50)
            };
            scope.myroot.API.UpdateSelected = function () {
                UpdateSelected();
            };
             
            if (!scope.myroot.Core.CustomSelectType) {
                scope.myroot.Core.CustomSelectType = 'Multiple';
            }
            if (scope.myroot.IsLoadSelected) {
                scope.myroot.Lst.forEach(function (item) {
                    if (_.contains(scope.myroot.LoadLstSelected, item[scope.myroot.Core.IDValue])) { 
                        item.IsChecked_ = true;
                    }
                });
            }
            else if (scope.myroot.Core.IsCheckAll) {
                scope.myroot.API.SelectAll();
            }
            scope.myroot.Core.ID = attrs.myroot;

            scope.myroot.CustomFilter = function (item) {
                if (scope.myroot.txtKeySearch.Text) {
                    if (!UtilJS.String.IsContain(item[scope.myroot.Core.Text].toString(), scope.myroot.txtKeySearch.Text)) {
                        return false;
                    }
                }
                return true;
            }

            scope.$watch("myroot.Lst", function (n, o) { 
                //$timeout.cancel(scope.MyrootLstWatch);
                //scope.MyrootLstWatch = $timeout(function () { 
                //    UpdateSelected();
                //}, 100);
                try { 
                    UpdateSelected();
                } catch (e) {
                    console.log(element);
                    throw e;
                }
            }, true);

            scope.myroot.chkAll.OnClick = function () {
                $timeout.cancel(scope.chkAllClickWatch);
                scope.chkAllClickWatch = $timeout(function () {
                    scope.myroot.Lst.forEach(function (item) {
                        item.IsChecked_ = scope.myroot.chkAll.IsChecked_;
                    });
                }, 50);
            }

            scope.myroot.OnItemClick = function (item) {
                if (scope.myroot.Core.CustomSelectType == 'Single') {
                    $timeout.cancel(scope.OnItemClickWatch);
                    scope.OnItemClickWatch = $timeout(function () { 
                        var IsChecked = _.clone(item.IsChecked_);
                        scope.myroot.Lst.forEach(function (item) {
                            item.IsChecked_ = false;
                        });
                        item.IsChecked_ = IsChecked;
                    }, 50);
                }
                if (scope.myroot.CallBack && scope.myroot.CallBack.OnSelectedItem != undefined && typeof scope.myroot.CallBack.OnSelectedItem === "function")
                    scope.myroot.CallBack.OnSelectedItem(item);
            };

            var InitElementStopClick = function () {
                $(function () {
                    $(element[0].querySelector('.dropdown_HelpTrees')).on('click', function (e) {
                        $timeout(function () {
                            $(element[0].querySelector('.searchInput_HelpTrees')).focus();
                        });
                    });
                    $(element[0].querySelector('.ngCustomSelect')).each(function (i, o) {
                        $(o).on('click', function (e) {
                            e.stopPropagation();
                        });

                        span = $(o).parents('.input-group').children().eq(1);
                        $(span).click(function (e) {
                            e.stopPropagation();
                            $(this).parent().children().eq(0).children().children().eq(0).click();
                        });
                    });
                    $(element[0].querySelector('.ngCustomSelectPlugins')).each(function (i, o) {
                        $(o).on('click', function (e) {
                            e.stopPropagation();
                        });
                    });
                });
            };

            InitElementStopClick();

            if (scope.myroot.CallBack && scope.myroot.CallBack.OnHiddenBsDropdown) { 
                $(element[0].querySelector('.dropdown')).on('hidden.bs.dropdown', function () {
                    scope.myroot.CallBack.OnHiddenBsDropdown();
                });
            }

            $(function () {
                $(document).on('select2-open', function (e) {
                    if ($(element[0].querySelector('.dropdown')) != undefined) {
                        $(element[0].querySelector('.dropdown')).removeClass('open');
                    }
                });
            });

            scope.myroot.IsReady = true;
        }
    };
}; 
customSelect.$inject = ["$http", "$timeout", "$filter"];
addDirective("customSelect", customSelect);