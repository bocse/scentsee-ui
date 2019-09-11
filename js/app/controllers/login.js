'use strict';

appControllers.controller('LoginCtrl', function($scope, $http, $location, $cookies, $routeParams) {

    $scope.destination=$routeParams.destination;
    if (! $scope.destination)
    {
        $scope.destination="/premium";
    }
    $scope.destination=$scope.destination.trim();
    console.log($cookies.get("secretKey"));
    if ($cookies.get("accessKey")!=null && $cookies.get("accessKey")!="null" && $cookies.get("secretKey")!=null)
    {
        $location.path('/premium');
    }

	$scope.authenticate = function(user) {
		if(!user) {
			return;
		}
        console.log($cookies.get("accessKey"));

		var url = $scope.protocol+"//scentsee.com/rest/authentication/login";
        $http
		.post(url, 
			'email=' + user.email + '&password=' + user.password,
			{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		).then(function successCallback(response) {
			if(response.data.success == true) {
				$location.path($scope.destination);
                $location.search('destination', null);
				
				// Find tomorrow's date.
				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 30);
				$cookies.put("secretKey", response.data.secretKey, {'expires': expireDate});
				$cookies.put("accessKey", response.data.accessKey, {'expires': expireDate});
			} else {
				$scope.authenticationMessage = response.data.reason;
                $cookies.remove("secretKey");
                $cookies.remove("accessKey");
			}
		}, function errorCallback(response) {
			console.log('error Post' + response);
                $cookies.remove("secretKey");
                $cookies.remove("accessKey");
			$scope.authenticationMessage = response;
		});
	};

});

