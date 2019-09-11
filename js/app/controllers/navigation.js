'use strict';

appControllers.controller('NavigationCtrl',['$scope', '$http', '$location', '$routeParams', '$cookies', '$rootScope','$interval','BrandSelectizeService',
    function($scope, $http, $location, $routeParams, $cookies, $rootScope, $interval, BrandSelectizeService ) {

        if ($cookies.get("accessKey") == null || $cookies.get("accessKey") == "null") {
            $location.path('/login');
        }


        $scope.isLoggedIn = function () {
            var access = $cookies.get("accessKey");
            var isLoggedIn = (access != null) && (access != "null");
            return isLoggedIn;
        };

        $scope.logout = function () {
            $cookies.remove("secretKey");
            $cookies.remove("accessKey");
        };
    }]);


