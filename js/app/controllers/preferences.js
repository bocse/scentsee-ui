'use strict';

appControllers.controller('PrefCtrl', ['$scope', '$http', '$rootScope', '$location', '$cookies', 'ModalService', 'SelectizeService',
                                        function($scope, $http, $rootScope, $location, $cookies, ModalService, SelectizeService) {
	var selectizeId = "selectize";
	
	$scope.showNotMatchError = false;
	$scope.showNoSelectionError = false;
	$scope.showModal = false;
	$scope.shareUri = $rootScope.host;
	
	$scope.selectizeOptions = [];
	$scope.selectizeModel = 1;	
	$scope.selectizeConfig = SelectizeService.getSelectizeConfig(selectizeId, function() {
		$scope.showSelectizeLoader = true;
		$scope.serverError = null;
		$scope.showNotMatchError = false;
		$scope.showNoSelectionError = false;
		$scope.showSearchResultsWrapper = false;
		return $scope.selected.gender;
	}, function(noOptionsFound) {
		$scope.showSelectizeLoader = false;
		if (noOptionsFound) {
			$scope.showNotMatchError = true;
		}
	}, function(responseData) {
		$scope.showSelectizeLoader = false;
		SelectizeService.resetSelectize(selectizeId);
		$scope.serverError = responseData != null ? responseData.error : "Failed to get the results from server";
	});

	$scope.resetSelectize = function() {
		$scope.showSearchResultsWrapper = false;
		$scope.hideGenderBtns = false;
		$scope.showDropDown = true;
		$scope.selectizeModel = 1; //reset ids previously inputed in selectize input
		$scope.selectizeOptions = [];
		SelectizeService.resetSelectize(selectizeId);
	};
	
	//set active button	
	$scope.selectGender = function(item) {
		$scope.selected = item;
		$scope.resetSelectize();
	};
	
	$scope.requestRecommendations = function() {
		if ($scope.selectizeOptions.length == 0) {
			$scope.showNoSelectionError = true;
			return;
		}
		
		$scope.serverError = null;
		$scope.showRecommendationsLoader = true;
		$scope.showMoreRecommmendationsBtn = false;
		$scope.showSearchResultsWrapper = false;
		$scope.showDropDown = false;
		$scope.hideGenderBtns = true;
		$scope.showNoResultsStatus = false;		
		$scope.showResetBtns = false;
		
		var url = '/rest/recommendation/byFavoriteFragranceId?';
		if ($scope.selected.gender!=null)
		url += 'gender=' + $scope.selected.gender;
		if($scope.selectizeModel != 1) {
			url += '&ids[]=' + $scope.selectizeModel;
		} 
		url += '&maxResults=8&mustBeInStock=false&includeRarePerfumes=false';
        var urlNoSecurity=url+"";
        if ($cookies.get("accessKey")!=null && $cookies.get("secretKey")!=null)
        {
            url+='&accessKey='+$cookies.get("accessKey");
            url+='&secretKey='+$cookies.get("secretKey");
        }

		$scope.shareUri = $rootScope.frontHost + "/#/share?uri=" + Base64.encode(urlNoSecurity);
        //$rootScope.$on("$locationChangeStart",function(event, next, current){
        //    if (next.indexOf('share')>-1) {
        //        event.preventDefault();
        //        console.log(event + " - " + next + " " + current);
        //    }
        //});
        //$location.path("/share?uri=" + Base64.encode(url), false);

        $http
		.get($rootScope.host + url)
		.then(function successCallback(response) {
                //$rootScope.$window.$location.assign($scope.shareUri);
                $scope.basedOnSearch = response.data.basedOn;
				$scope.recommendationsList = response.data.recommendations;
				if ($scope.recommendationsList.length > 4) {
					$scope.showMoreRecommmendationsBtn = true;
					$scope.showResetBtns = false;
				} else if ($scope.recommendationsList.length < 1) {
					$scope.showNoResultsStatus = true;
					$scope.showResetBtns = true;
				} else {
					$scope.showResetBtns = true;
				}
					
				$scope.showMoreRecommmendationsBtn = true;
				$scope.showSearchResultsWrapper = true;
				$scope.showRecommendationsLoader = false;
			}, function errorCallback(response) {
				$scope.shareUri = null;
				$scope.showRecommendationsLoader = false;
				//$scope.serverError = response.data != null ? response.data.message : $rootScope.defaultError;
				$scope.serverError = $rootScope.defaultError;
                console.error(response.data != null ? response.data.error+" "+response.data.message : "Unknown error occurred.");
		});
		
	};
	$scope.loadMoreRecommendations = function() {
		$scope.showMoreRecommmendationsBtn = false;
	};

	$scope.toggleModal = function(data) {  //data is recommendations array with objects
		$scope.showModal = !$scope.showModal;
		$scope.modalContent = data;
	};
	
	$scope.getPhotoUrl = function(element) {
		return ModalService.getPhotoUrl(element); 
	};

}]);


