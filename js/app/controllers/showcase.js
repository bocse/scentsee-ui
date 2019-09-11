'use strict';

appControllers.controller('LandingCtrl', function($scope, $location, $cookies) {
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
    
    $scope.isLoggedIn = function() {
        var access=$cookies.get("accessKey");
        var isLoggedIn=(access!=null);
        return isLoggedIn;
    };
	
    $scope.logout = function() {
		$cookies.remove("secretKey");
		$cookies.remove("accessKey");
	}
});


