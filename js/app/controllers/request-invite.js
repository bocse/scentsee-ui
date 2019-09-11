'use strict';

appControllers.controller('InviteCtrl', function($scope, $http, $location, $cookies, $routeParams) {

    $scope.inviteMessage="";
    $scope.destination=$routeParams.destination;
    if (! $scope.destination)
    {
        $scope.destination="/premium";
    }
    $scope.destination=$scope.destination.trim();
    $scope.loginUrl="#login?destination="+$scope.destination;

	$scope.requestInvite = function(user) {
		if(!user) {
			return;
		}
        //console.log($cookies.get("accessKey"));

		var url = $scope.protocol+"//scentsee.com/rest/authentication/requestInvite";
        $http
		.post(url, 
			'email=' + user.email + '&fullName=' + user.fullName+'&reason=' + user.reason,
			{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		).then(function successCallback(response) {
			//if(response.data.success == true) {
			//
			//}
                $scope.inviteMessage="Invitation request is sent.";

		}, function errorCallback(response) {
			console.log('error Post' + response);

			$scope.inviteMessage = "Invitation request could not be sent. Please retry later.";
		});
	};

});

