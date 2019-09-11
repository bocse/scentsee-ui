'use strict';

appControllers.controller('ShareCtrl',['$scope', '$http', '$routeParams', '$cookies', '$rootScope', 'ModalService',
                                       function($scope, $http, $routeParams, $cookies, $rootScope, ModalService) {

                                           var url= Base64.decode($routeParams.uri).trim();
                                           if ($cookies.get("accessKey")!=null && $cookies.get("secretKey")!=null)
                                           {
                                               url+='&accessKey='+$cookies.get("accessKey");
                                               url+='&secretKey='+$cookies.get("secretKey");
                                           }
	$http
	.get($rootScope.host + url)
	.then(function successCallback(response) {
			$scope.basedOnSearch = response.data.basedOn;
			$scope.recommendationsList = response.data.recommendations;
		}, function errorCallback(response) {
			$scope.serverError = response.data != null ? response.data.error : "Failed to get the results from server";
	});

	$scope.toggleModal = function(data) {  //data is recommendations array with objects
		$scope.showModal = !$scope.showModal;
		$scope.modalContent = data;
	};
	
	$scope.getPhotoUrl = function(element) {
		return ModalService.getPhotoUrl(element); 
	};
}]);


