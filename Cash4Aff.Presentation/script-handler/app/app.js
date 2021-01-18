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