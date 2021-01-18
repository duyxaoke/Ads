var HelperFactory = function ($rootScope, $timeout, CommonFactory) {
    var service = {};

    service.User = {};
    service.User.GetAccessToken = function () {
        if (!service.User.AccessToken) {
            UtilJS.Loading.Show();
            CommonFactory.PostDataAjaxAsync('/Home/GetAccesToken', null,
                function (beforeSend) { },
                function (response) {
                    UtilJS.Loading.Hide();
                    if (response.objCodeStep.Status == 'Error') {
                        console.log(response);
                        throw response.objCodeStep.Message;
                    }
                    if (response.objCodeStep.Status == 'Success') {
                        service.User.AccessToken = response.strAccesToken;
                    }
                },
                function (error) {
                    UtilJS.Loading.Hide();
                    console.log(error);
                    throw "error";
                }
            );
        }
        return service.User.AccessToken;
    };
    return service;
};

HelperFactory.$inject = ["$rootScope", "$timeout", "CommonFactory"];