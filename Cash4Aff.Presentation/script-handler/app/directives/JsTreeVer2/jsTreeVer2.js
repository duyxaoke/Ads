//last update: 31/7/2018
var jsTreeVer2 = function ($http, $timeout, $q) {
    return {
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
            s.myroot.element = e;
            s.myroot.IsSearchActived = false;
            s.myroot.IsChkAllActived = false;
            s.myroot.NodeResult = {};
            s.myroot.NodeResult.NameSelected = '';
            s.myroot.valueSelected = [];
            s.myroot.nodeSelected = [];
            s.myroot.IsSearchFound = true;
            s.myroot.API = {};
            s.myroot.status = {};

            //#region api exist when scope ready   
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
            s.myroot.API.GetTreeDataSelected = function () {
                var LstID = [];
                s.myroot.valueSelected.forEach((x) => {
                    s.myroot.element.jstree("get_node", x).parents.forEach((xx) => {
                        if (xx != "#" && !_.contains(LstID, xx)) {
                            LstID.push(xx);
                        }
                    })
                });
                var LstIDAll = _.union(s.myroot.valueSelected, LstID);
                LstIDAll = _.uniq(LstIDAll);
                return s.myroot.TreeData.filter((item) => _.contains(LstIDAll, item.id.toString()));
            };
            s.myroot.API.DeselectAll = function () {
                let defer = $q.defer();
                s.myroot.hold(['ready']).then(() => {
                    s.myroot.element.jstree('deselect_all');
                    s.myroot.element.jstree('close_all');
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.DataSource = function (data) {
                let defer = $q.defer();
                s.myroot.hold(['ready']).then(() => {
                    s.myroot.status.ready = false;
                    s.myroot.TreeData = data;
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.CloseAll = function () {
                let defer = $q.defer();
                s.myroot.hold(['ready']).then(() => {
                    s.myroot.element.jstree('close_all');
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.OpenAll = function () {
                let defer = $q.defer();
                s.myroot.hold(['ready']).then(() => {
                    s.myroot.element.jstree('open_all');
                    defer.resolve();
                });
                return defer.promise;
            };
            s.myroot.API.DisabledALLTree = function () {
                let defer = $q.defer();
                s.myroot.hold(['ready']).then(() => {
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
                s.myroot.hold(['ready']).then(() => {
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
                s.myroot.hold(['ready']).then(() => {
                    s.myroot.element.find('ul li').each(function (i, o) {
                        var ID = $(o).attr('id');
                        var node = s.myroot.element.jstree().get_node(ID);
                        s.myroot.element.jstree().enable_node(node);
                    });
                });
            };
            s.myroot.API.SetValid = function () {
                let defer = $q.defer();
                s.myroot.WaitFinishUpdateSelected().then(() => {
                    try {
                        $(`input[name=${s.myroot.TreeID}]`).val("").valid();
                        if (s.myroot.valueSelected.length > 0) {
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

            s.myroot.getSelected = function () {
                let defer = $q.defer();
                s.myroot.hold(['ready','updated']).then(() => {
                    defer.resolve(s.myroot.valueSelected);
                });
                return defer.promise;
            };
            s.myroot.setSelected = function (ids) {
                let defer = $q.defer();
                s.myroot.hold(['ready']).then(() => { 
                    s.myroot.setData(s.myroot.TreeData, ids);
                    s.myroot.dataBinding(s.myroot.TreeData).then(() => defer.resolve()); 
                }); 
                return defer.promise;
            };
            s.myroot.dataBinding = function (data) {
                let defer = $q.defer();
                $(e).jstree('destroy');
                s.myroot.status = {};
                let config = {};
                // users can define 'core'
                config.core = {};

                config.search = {
                    "case_insensitive": true,
                    "show_only_matches": true,
                    "show_only_matches_children": true
                };

                if (a.treeCore) {
                    config.core = $.extend(config.core, s.treeCore);
                }

                // clean Case
                a.treeDataType = a.treeDataType ? a.treeDataType.toLowerCase() : 'scope';
                a.treeSrc = a.treeSrc ? a.treeSrc.toLowerCase() : '';

                s.treeData = data;
                if (s.treeData == undefined) s.treeData = [];
                SetDelParentIDNotExists(s.treeData);
                s.treeData = s.treeData.filter((x) => !x.IsDeleted);

                config.core.data = s.treeData;
                s.init(s, e, a, config);
                s.myroot.hold(['ready']).then(() => { 
                    defer.resolve();
                });
                return defer.promise;
            };
            //#endregion

            //#region function output
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
            let UpdateSelected = function (LstSelected) {
                try {
                    s.myroot.NodeResult.NameSelected = '';
                    s.myroot.valueSelected = [];
                    //s.myroot.nodeSelected = [];

                    var i, j, r = [], v = [];
                    for (i = 0, j = LstSelected.length; i < j; i++) {
                        let node = s.myroot.element.jstree(true).get_node(LstSelected[i]);
                        r.push(node.text ? node.text.trim() : '');
                        v.push(node.id);
                        s.myroot.nodeSelected.push(node);
                    }

                    s.myroot.NodeResult.NameSelected = r.join(', ').trim();
                    s.myroot.valueSelected = v;

                    if (s.myroot.TreeData && s.myroot.valueSelected.length == s.myroot.TreeData.length && s.myroot.TreeData.length > 0) {
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
                    s.myroot.status.updated = true;

                } catch (e) {
                    debugger;
                    throw e;
                }
            };

            s.myroot.setData = function (data, ids, type) {
                if (!type) {//set selected
                    data.forEach(node => {
                        node.state = {};
                        node.state.selected = false;
                        if (_.find(ids, (x) => x == node.id) !== undefined) {
                            node.state.selected = true;
                        }
                    });
                }
            };
            s.myroot.hold = function (keys) {
                let defer = $q.defer();
                clearInterval(s.myroot.myTimer);
                s.myroot.myTimer = setInterval(() => { 
                    let count = 0;
                    keys.forEach((key) => { 
                        if (s.myroot.status[key]) {
                            ++count;
                        }
                    });
                    if (count === keys.length) { 
                        clearInterval(s.myroot.myTimer);
                        defer.resolve();
                    }
                }, 100);
                return defer.promise;
            }

            s.init = function (s, e, a, config) {
                if (s.myroot.IsConditionalSelect) {
                    config.conditionalselect = function (node, event) {
                        if (node.state.disabled) {
                            return false;
                        }
                        if (!s.myroot.ConditionalSelectIDs) {
                            return true;
                        }
                        //nếu node đang thao tác, có child node thuộc node điều kiện thì ko cho thao tác
                        let o = _.find(s.myroot.ConditionalSelectIDs, (x) => {
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
                                    if (_.find(s.myroot.ConditionalSelectIDs, (n) => n == x) === undefined) {
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
                                    if (_.find(s.myroot.ConditionalSelectIDs, (n) => n == x) === undefined) {
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
            s.fetchResource = function (url, cb) {
                return $http.get(url).then((data) => {
                    if (cb) cb(data.data);
                });
            };
            s.managePlugins = function (s, e, a, config) {  
                config.plugins = s.myroot.plugins;
                config.plugins.push('conditionalselect');

                config.core = config.core || {};
                config.core.themes = {};
                config.core.themes.icons = false;

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
                                $(e).jstree('search', s.treeSearch);
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
                        if (s.myroot.IsDebug) debugger;
                        s.InitElementStopClick();     
                        s.myroot.status.ready = true;
                    });
                    s.myroot.treeconfig.on("changed.jstree", function (e, data) { 
                        s.myroot.status.updated = false; 
                        clearInterval(s.myroot.changedTimer);
                        s.myroot.changedTimer = setInterval(() => {
                            clearInterval(s.myroot.changedTimer);
                            UpdateSelected(data.selected);
                        }, 25);
                    });
                    s.myroot.treeconfig.on("search.jstree", function (nodes, str, res) {
                        if (str.nodes.length === 0) {
                            $(e).jstree(true).hide_all();
                            s.myroot.IsSearchFound = false;
                        }
                    });
                }
            };
            //#endregion 

            s.myroot.status.isReady = true;
            s.myroot.IsReady = true;
        }
    };  
}; 
jsTreeVer2.$inject = ['$http', "$timeout", "$q"];
addDirective("jsTreeVer2", jsTreeVer2);
