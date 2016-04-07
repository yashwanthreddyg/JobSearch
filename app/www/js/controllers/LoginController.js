angular.module('JobSearch')
    .controller('LoginController', ['NetworkService',
        '$routeParams',
        '$location',
        '$scope',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $scope, $rootScope) {
            var self = this;
            self.loginEmail = "";
            self.loginPassword = "";
            self.loginServer = "";

            self.registerEmail = "";
            self.registerPassword = "";
            self.registerConfirmPassword = "";
            self.registerServer = "";
            self.doLogin = function () {
                var loginSuccess = function () {
                    // alert("login success");
                    $location.path('/employee/search');
                    $rootScope.isLoggedIn=true;
                };
                var loginFailure = function () {
                    alert("login failure");
                };
                NetworkService.getToken(self.loginEmail, self.loginPassword, self.loginServer, loginSuccess, loginFailure);
            };
            self.doRegister = function () {
                var registerSuccess = function () {
                    alert("register success");
                    self.registerEmail = "";
                    self.registerPassword = "";
                    self.registerServer = "";
                    self.registerConfirmPassword = "";
                    $location.path('/login');
                };
                var registerFailure = function () {
                    alert("register failure");
                };
                NetworkService.registerUser(self.registerEmail,self.registerPassword,self.registerServer,registerSuccess,registerFailure);
            };
        }
    ]);
