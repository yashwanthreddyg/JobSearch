angular.module('JobSearch')
    .controller('NavBarController', ['NetworkService',
        '$routeParams',
        '$location',
        '$rootScope',
        function (NetworkService, $routeParams, $location, $rootScope) {
            var self = this;
            self.doLogout = function () {
                NetworkService.logout();
                $rootScope.isLoggedIn = false;
                $location.path('/login');
            }
        }
    ]);
