//last update: 31/7/2018
var jsTree = function ($http, $timeout, $q) {
    var treeDir = {
        restrict: 'EA',
        scope: {
            myroot: "=",
            treeData: "=",
            treeContextmenu: "=",
            treeTypes: "=",
            treeDnd: "=",
            treeCore: "=",
            treeEvents: "=",
            treeSearch: "=",
        },
        link: function (s, e, a) { // scope, element, attribute 
            var UpdateSelected = function (LstSelected) {
                s.myroot.IsFinishUpdateSelected = false;
                try {
                    s.myroot.NodeResult.NameSelected = '';
                    s.myroot.NodeResult.IDSelected = [];
                    s.myroot.NodeResult.NodeSelected = [];
                    s.myroot.NodeResult.LstParents = [];

                    var i, j, r = [], v = [];
                    for (i = 0, j = LstSelected.length; i < j; i++) {
                        var node = s.myroot.element.jstree(true).get_node(LstSelected[i]);
                        r.push(node.text ? node.text.trim() : '');
                        v.push(node.id);
                        node.code = node.original.code == undefined ? "" : node.original.code;
                        s.myroot.NodeResult.NodeSelected.push(node);
                        s.myroot.NodeResult.LstParents = node.parents;
                    }

                    s.myroot.NodeResult.NameSelected = r.join(', ').trim();
                    s.myroot.NodeResult.IDSelected = v;

                    if (s.myroot.TreeData && s.myroot.NodeResult.IDSelected.length == s.myroot.TreeData.length && s.myroot.TreeData.length > 0) {
                        s.myroot.NodeResult.NameSelected = 'Tất cả';
                        s.myroot.IsCheckedAll = true;
                    }
                    else {
                        s.myroot.IsCheckedAll = false;
                    }

                    if (s.myroot.CallBack && s.myroot.CallBack.Changed_Jstree) {
                        s.myroot.CallBack.Changed_Jstree();
                    }
                    if (s.myroot.IsSetScrollTop) {
                        s.myroot.IsSetScrollTop = false;
                        $(function () {
                            s.boxjstree = $(e[0]).closest('.boxjstree');
                            s.boxjstree.scrollTop(0);
                            window.scrollTo(0, 0);
                        });
                    }
                    s.myroot.IsFinishUpdateSelected = true;

                } catch (e) {
                    debugger;
                    throw e;
                }
            };
            s.myroot.element = e;
            s.myroot.IsSearchActived = false;
            s.myroot.IsChkAllActived = false;
            s.myroot.NodeResult = {};
            s.myroot.NodeResult.NameSelected = '';
            s.myroot.NodeResult.IDSelected = [];
            s.myroot.NodeResult.NodeSelected = [];
            s.myroot.IsSearchFound = true;

            s.fetchResource = function (url, cb) {
                return $http.get(url).then((data) => {
                    if (cb) cb(data.data);
                });
            };
            s.managePlugins = function (s, e, a, config) {
                if (s.myroot.treePlugins) {
                    a.treePlugins = s.myroot.treePlugins;
                }
                if (a.treePlugins) {
                    config.plugins = a.treePlugins.split(',');
                    config.plugins.push('conditionalselect');

                    config.core = config.core || {};
                    config.core.check_callback = config.core.check_callback || true;

                    if (config.plugins.indexOf('state') >= 0) {
                        config.state = config.state || {};
                        config.state.key = a.treeStateKey;
                    }

                    if (config.plugins.indexOf('search') >= 0) {
                        if (!s.myroot.IsSearchActived) {
                            var to = false;

                            s.$watch("treeSearch", function (n, o) {
                                clearTimeout(to);
                                to = setTimeout(function () {
                                    if (!s.treeSearch) {
                                        s.treeSearch = "";
                                    }
                                    s.myroot.IsSearchFound = true;
                                    $(e).jstree(true).show_all();
                                    $(e).jstree(true).search(s.treeSearch);
                                }, 250);
                            }, true);
                            s.myroot.IsSearchActived = true;
                        }
                    }

                    if (config.plugins.indexOf('checkbox') >= 0) {
                        config.checkbox = config.checkbox || {};
                    }
                    else {
                        config.core.multiple = false;
                    }

                    if (config.plugins.indexOf('contextmenu') >= 0) {
                        if (a.treeContextmenu) {
                            config.contextmenu = s.treeContextmenu;
                        }
                    }

                    if (config.plugins.indexOf('types') >= 0) {
                        if (a.treeTypes) {
                            config.types = s.treeTypes;
                            console.log(config);
                        }
                    }

                    if (config.plugins.indexOf('dnd') >= 0) {
                        if (a.treeDnd) {
                            config.dnd = s.treeDnd;
                            console.log(config);
                        }
                    }

                    if (!s.myroot.IsChkAllActived) {
                        if (config.plugins.indexOf('chkall') >= 0 && !s.myroot.IsHideChkAll) {
                            s.myroot.IsChkAllActived = true;
                            $(e).jstree('check_all');
                        }
                    }
                }
                return config;
            };
            s.manageEvents = function (s, e, a) {
                var IsEvChanged = false;
                if (a.treeEvents) {
                    angular.forEach(s.treeEvents, function (fn, key) {
                        var tree_event = key;
                        if (tree_event == "changed") {
                            IsEvChanged = true;
                        }
                        if (tree_event.indexOf('.') < 0) {
                            tree_event = tree_event + '.jstree';
                        }
                        s.myroot.treeconfig.on(tree_event, fn);
                    });
                }
                if (!IsEvChanged) {
                    s.myroot.treeconfig.on("ready.jstree", function (e, data) {
                        if (s.myroot.IsDebug) {
                            debugger;
                        }
                        s.InitElementStopClick();

                        //ktra neu cay đã load ready thì mới check sư kiện checkall
                        if (s.myroot.IsSelectedAll) {
                            s.myroot.element.jstree('check_all');
                        }
                        else if (s.myroot.IsLoadNodeSelected) {
                            s.myroot.API.LoadNodeSelected();
                        }

                        if (s.myroot.IsDisabledALLTree) {
                            s.myroot.IsHideChkAll = true;
                            s.myroot.API.DisabledALLTree();
                        }

                        if (s.myroot.CallBack && s.myroot.CallBack.Ready_Jstree) {
                            s.myroot.CallBack.Ready_Jstree();
                        }
                        s.myroot.IsFinishRender = true;
                        s.myroot.IsFinishUpdateSelected = true;
                    });
                    s.myroot.treeconfig.on("changed.jstree", function (e, data) {
                        s.myroot.IsFinishUpdateSelected = false;

                        //xu ly su kien on change
                        s.JStreeOnChangedTimeOut;
                        $timeout.cancel(s.JStreeOnChangedTimeOut);
                        s.JStreeOnChangedTimeOut = $timeout(function () {
                            UpdateSelected(data.selected);
                        });
                    });
                    s.myroot.treeconfig.on("search.jstree", function (nodes, str, res) {
                        if (str.nodes.length === 0) {
                            $(e).jstree(true).hide_all();
                            s.myroot.IsSearchFound = false;
                        }
                    });
                }
            };


            //get het note lá multiple level
            s.FilterLastChildsByParentID = function (LstFull, id, LstOut) {
                let LstParent = _.where(LstFull, { id: id });
                if (LstParent.length > 0) {
                    let LstChild = _.where(LstFull, { parent: LstParent[0].id });
                    if (LstChild.length > 0) {
                        LstChild.forEach(function (item) {
                            s.FilterLastChildsByParentID(LstFull, item.id, LstOut);
                        });
                    }
                    else if (LstChild.length == 0) {
                        LstOut.push(id);
                    }
                }
            };

            s.myroot.API = {};
            s.myroot.API.GetLastChildSelected = function (LstCategoryID) { 
                let CategoryNodeParentIDs = s.myroot.TreeData.filter(Node => (Node.parent == '#'));
                let CategoryIDsLastChild = [];
                CategoryNodeParentIDs.forEach((NodeParent) => {
                    let CategoryIDTmps = [];
                    s.FilterLastChildsByParentID(
                        s.myroot.TreeData,
                        NodeParent.id,
                        CategoryIDTmps);
                    if (CategoryIDTmps.length > 0)
                        CategoryIDsLastChild = _.union(CategoryIDsLastChild, CategoryIDTmps);
                });
                let LstCategoryIDResult = [];
                CategoryIDsLastChild.forEach((x) => {
                    if (_.contains(LstCategoryID.map(String), x)) {
                        LstCategoryIDResult.push(x);
                    }
                }); 
                return LstCategoryIDResult;
            }
            s.myroot.API.LoadNodeSelected = function () {
                s.myroot.NodeResult.NameSelected = "";
                s.myroot.NodeResult.IDSelected = [];
                s.myroot.element.jstree('open_all');
                if (s.myroot.LoadLstNodeSelected && s.myroot.LoadLstNodeSelected.length > 0)
                {
                    s.myroot.LoadLstNodeSelected = s.myroot.API.GetLastChildSelected(s.myroot.LoadLstNodeSelected);
                }
                else { 
                    s.myroot.LoadLstNodeSelected = [];
                }
                for (var i = 0; i < s.myroot.LoadLstNodeSelected.length; i++) {
                    var valueCheck = s.myroot.LoadLstNodeSelected[i]; 
                    s.myroot.element.find('ul li').each((i, o) => {
                        var ID = $(o).attr('id');
                        if (valueCheck == ID) {
                            //case 23/7/2019 : id cha selected nhưng có 1 ids con mới thêm dưới db chưa đc check
                            //let ChildrenTree = s.myroot.element.jstree().get_node(ID);
                            //if (ChildrenTree.children.length > 0) {
                            //    let countChildrenData = s.myroot.LoadLstNodeSelected.filter((t) => _.contains(ChildrenTree.children, t.toString())).length;
                            //    if (ChildrenTree.children.length > countChildrenData) { 
                            //        return;
                            //    }
                            //}
                            //end case 23/7/2019

                            var NodeID = s.myroot.element.find('#' + ID);
                            if (!s.myroot.element.jstree('is_checked', NodeID) || !s.myroot.element.jstree('is_selected', NodeID)) {
                                NodeID.find('>a.jstree-anchor').click();
                            }
                            if (s.myroot.IsDisableNodeSelected) {
                                s.myroot.element.jstree('disable_node', $('#' + ID));
                            }
                        }
                    });
                }
                s.myroot.element.jstree('close_all');
            };

            // hàm này để render lại item Name nào đã chọn lên textbox
            s.myroot.API.UpdateSelected = function () {
                UpdateSelected(s.myroot.element.jstree(true).get_selected());
            };

            s.myroot.API.GetNodeParent = function (ID) {
                let Lstparent = [];
                var node = s.myroot.element.jstree().get_node(ID),
                    formatted_name = s.myroot.element.jstree().get_text(node);

                $.each(node.parents, function (key, parentId) {
                    if (parentId !== "#") {
                        var parent = s.myroot.element.jstree().get_node(parentId);
                        Lstparent.push(parent);
                        formatted_name = s.myroot.element.jstree().get_text(parent) + "->" + formatted_name;
                    }
                });
                console.log(formatted_name);
                return Lstparent;
            };

            s.init = function (s, e, a, config) {
                if (s.myroot.IsConditionalSelect) {
                    config.conditionalselect = function (node, event) {
                        if (node.state.disabled) {
                            return false;
                        }
                        if (!s.myroot.LoadLstNodeSelected) {
                            return true;
                        }
                        let o = _.find(s.myroot.LoadLstNodeSelected, (x) => {
                            if (_.find(node.children_d, (n) => n == x) !== undefined) {
                                return true;
                            }
                            return false;
                        });
                        if (o !== undefined) {
                            if (!node.state.open) {
                                s.myroot.element.jstree('open_node', $('#' + node.id));
                            }
                            if (!node.state.selected) {
                                let status = !node.state.selected;
                                node.children_d.filter((x) => {
                                    if (_.find(s.myroot.LoadLstNodeSelected, (n) => n == x) === undefined) {
                                        let nodeChild = s.myroot.element.jstree("get_node", x)
                                        if (status !== nodeChild.state.selected) {
                                            s.myroot.element.find('#' + x).find('>a.jstree-anchor').click();
                                        }
                                    }
                                });
                            }
                            else {
                                let status = !node.state.selected;
                                node.children_d.filter((x) => {
                                    if (_.find(s.myroot.LoadLstNodeSelected, (n) => n == x) === undefined) {
                                        let nodeChild = s.myroot.element.jstree("get_node", x);
                                        if (status !== nodeChild.state.selected) {
                                            s.myroot.element.find('#' + x).find('>a.jstree-anchor').click();
                                        }
                                    }
                                });
                            }
                            return false;
                        }
                        return true;
                    };
                }
                s.managePlugins(s, e, a, config);
                s.myroot.treeconfig = $(e).jstree(config);
                s.manageEvents(s, e, a);
            };
            s.InitElementStopClick = function () {
                if (s.myroot.IsRegInitElementStopClick) {
                    return;
                }
                s.myroot.IsRegInitElementStopClick = true;
                $(function () {
                    s.RootElement = $(e[0]).closest('.input-group');
                    s.ngHelpTrees = $(s.RootElement).find('.ngHelpTrees');
                    s.Inputdropdown_HelpTrees = $(s.RootElement).find('.dropdown_HelpTrees');
                    s.ngHelpTreesPlugins = $(s.RootElement).find('.ngHelpTreesPlugins');

                    s.searchInput_HelpTrees = $(s.RootElement).find('.searchInput_HelpTrees');

                    $(s.Inputdropdown_HelpTrees).on('click', function (e) {
                        $timeout(function () {
                            s.searchInput_HelpTrees[0].focus();
                        });
                    });
                    $(s.ngHelpTrees).each(function (i, o) {
                        $(o).on('click', function (e) {
                            e.stopPropagation();
                        });

                        span = $(o).parents('.input-group').children().eq(1);
                        $(span).click(function (e) {
                            e.stopPropagation();
                            $(this).parent().children().eq(0).children().children().eq(0).click();
                        });
                    });
                    $(s.ngHelpTreesPlugins).each(function (i, o) {
                        $(o).on('click', function (e) {
                            e.stopPropagation();
                        });
                    });
                });
            };


            let SetDelParentIDNotExists = function (Lst) {
                Lst.forEach((x) => {
                    if (x.parent != "#") {
                        let exist = _.find(Lst, (xx) => x.parent == xx.id);
                        if (exist == undefined) {
                            x.IsDeleted = true;
                            console.log("nodenoparent", x);
                        }
                    }
                });
            };

            s.myroot.API.GetTreeDataSelected = function () {
                var LstID = [];
                s.myroot.NodeResult.IDSelected.forEach((x) => {
                    s.myroot.element.jstree("get_node", x).parents.forEach((xx) => {
                        if (xx != "#" && !_.contains(LstID, xx)) {
                            LstID.push(xx);
                        }
                    })
                });
                var LstIDAll = _.union(s.myroot.NodeResult.IDSelected, LstID);
                LstIDAll = _.uniq(LstIDAll);
                return s.myroot.TreeData.filter((item) => _.contains(LstIDAll, item.id.toString()));
            };

            //#region ver moi   

            s.myroot.WaitFinishUpdateSelected = function () {
                clearInterval(s.myroot.myTimerWaitFinishUpdateSelected);
                let defer = $q.defer();
                s.myroot.myTimerWaitFinishUpdateSelected = setInterval(() => {
                    if (s.myroot.IsFinishUpdateSelected) {
                        clearInterval(s.myroot.myTimerWaitFinishUpdateSelected);
                        defer.resolve();
                    }
                }, 100);
                return defer.promise;
            }

            s.myroot.WaitFinishRender = function () {
                clearInterval(s.myroot.myTimer);
                let defer = $q.defer();
                s.myroot.myTimer = setInterval(() => {
                    if (s.myroot.IsFinishRender) {
                        clearInterval(s.myroot.myTimer);
                        defer.resolve();
                    }
                }, 100);
                return defer.promise;
            }

            s.myroot.API.DeselectAll = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.element.jstree('deselect_all');
                    s.myroot.element.jstree('close_all');
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.SetSelected = function (LstNodeID) {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.NodeResult.NameSelected = "";
                    s.myroot.NodeResult.IDSelected = [];
                    s.myroot.element.jstree('open_all');
                    if (!LstNodeID)
                        LstNodeID = [];
                    for (var i = 0; i < LstNodeID.length; i++) {
                        var valueCheck = LstNodeID[i];
                        s.myroot.element.find('ul li').each(function (i, o) {
                            var ID = $(o).attr('id');
                            if (valueCheck == ID) {
                                var NodeID = s.myroot.element.find('#' + ID);
                                if (!s.myroot.element.jstree('is_checked', NodeID) || !s.myroot.element.jstree('is_selected', NodeID)) {
                                    NodeID.find('>a.jstree-anchor').click();
                                }
                                if (s.myroot.IsDisableNodeSelected) {
                                    s.myroot.element.jstree('disable_node', $('#' + ID));
                                    //disable parent id
                                    //let ParentID = s.myroot.element.jstree('get_parent', ID);
                                    //if (ParentID != "#") {
                                    //    s.myroot.element.jstree('disable_node', $('#' + ParentID));
                                    //}
                                }
                            }
                        });
                    }
                    s.myroot.element.jstree('close_all');
                    defer.resolve();
                });

                return defer.promise;
            };

            s.myroot.API.DataSource = function (data) {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.IsFinishRender = false;
                    s.myroot.TreeData = data;
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.CloseAll = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.element.jstree('close_all');
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.OpenAll = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.element.jstree('open_all');
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.DisabledALLTree = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.element.find('ul li').each(function (i, o) {
                        var ID = $(o).attr('id');
                        s.myroot.element.jstree('disable_node', $('#' + ID));
                        //disable parent id
                        //let ParentID = s.myroot.element.jstree('get_parent', ID);
                        //if (ParentID != "#") {
                        //    s.myroot.element.jstree('disable_node', $('#' + ParentID));
                        //}
                    });
                    defer.resolve();
                });
                return defer.promise;
            };

            s.myroot.API.NodeToggleEnable = function (LstID, enable) {
                let defer = $q.defer();
                s.myroot.WaitFinishRender().then(() => {
                    let action = enable ? 'enable_node' : 'disable_node';
                    LstID = LstID || [];
                    for (var i = 0; i < LstID.length; i++) {
                        var ID = LstID[i];
                        s.myroot.element.jstree(action, $('#' + ID));
                        //let ParentID = s.myroot.element.jstree('get_parent', ID);
                        //if (ParentID != "#") {
                        //    s.myroot.element.jstree(action, $('#' + ParentID));
                        //}
                    }
                    defer.resolve();
                });
                return defer.promise;
            };

            s.myroot.API.EnableAllTree = function () {
                s.myroot.WaitFinishRender().then(() => {
                    s.myroot.element.find('ul li').each(function (i, o) {
                        var ID = $(o).attr('id');
                        var node = s.myroot.element.jstree().get_node(ID);
                        s.myroot.element.jstree().enable_node(node);
                    });
                });
            };

            s.myroot.API.GetIDSelected = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishUpdateSelected().then(() => {
                    defer.resolve(s.myroot.NodeResult.IDSelected);
                });
                return defer.promise;
            };

            s.myroot.API.SetValid = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishUpdateSelected().then(() => {
                    try {
                        $(`input[name=${s.myroot.TreeID}]`).val("").valid();
                        if (s.myroot.NodeResult.IDSelected.length > 0) {
                            $(`input[name=${s.myroot.TreeID}]`).val("1").valid();
                        }
                    } catch (e) {

                    }
                    defer.resolve();
                });
                return defer.promise;
            };

            s.myroot.API.GetChildID = function (id) {
                let defer = $q.defer();
                s.myroot.WaitFinishUpdateSelected().then(() => {
                    var node = s.myroot.element.jstree(true).get_node(id);
                    defer.resolve(node.children_d);
                });
                return defer.promise;
            };

            //#endregion

            s.myroot.API.Init = function (isFirst) {
                var config = {};
                // users can define 'core'
                config.core = {};

                config.search = {
                    //"case_insensitive": true,
                    "show_only_matches": true,
                    "show_only_matches_children": true
                };

                if (a.treeCore) {
                    config.core = $.extend(config.core, s.treeCore);
                }

                // clean Case
                a.treeDataType = a.treeDataType ? a.treeDataType.toLowerCase() : 'scope';
                a.treeSrc = a.treeSrc ? a.treeSrc.toLowerCase() : '';

                $timeout(function () {
                    //filter lai lấy data ko lỗi
                    if (s.treeData == undefined) s.treeData = [];
                    SetDelParentIDNotExists(s.treeData);
                    s.treeData = s.treeData.filter((x) => !x.IsDeleted);

                    config.core.data = s.treeData;
                    s.init(s, e, a, config);

                    if (isFirst) {
                        s.$watch("treeData", function (n, o) {
                            if (n) {
                                //filter lai lấy data ko lỗi  
                                if (s.treeData == undefined) s.treeData = [];
                                SetDelParentIDNotExists(s.treeData);
                                s.treeData = s.treeData.filter((x) => !x.IsDeleted);
                                config.core.data = s.treeData;

                                s.myroot.IsFinishRender = false;
                                $(e).jstree('destroy');
                                s.init(s, e, a, config);
                            }
                        }, true);
                    }
                });
            }
            s.myroot.API.ReInit = function () {
                s.myroot.IsFinishRender = false;
                $(e).jstree('destroy');
                s.myroot.API.Init();
            };
            s.myroot.API.GetNodeParentRoot = function () {
                let parentsTmps = [];
                $.each($(e).jstree("get_checked", true), function () {
                    if (!this.parents || this.parents.length < 2) {
                        return;
                    }
                    let nodeparent = $(e).jstree(true).get_node(this.parents[this.parents.length - 2]);
                    let lstFilter = parentsTmps.filter((x) => {
                        return x.id == nodeparent.id;
                    });
                    if (lstFilter.length == 0) {
                        parentsTmps.push(nodeparent);
                    }
                    return;
                });
                return parentsTmps;
            };

            $(function () {
                s.myroot.API.Init(true);
            });
            s.myroot.IsReady = true;
        }
    };

    return treeDir;
};

jsTree.$inject = ['$http', "$timeout", "$q"];
addDirective("jsTree", jsTree);
