'use strict';

appControllers.controller('PremiumCtrl', ['$scope', '$http', '$rootScope', '$location', '$cookies', 'ModalService', 'SelectizeService', 
                                        function($scope, $http, $rootScope, $location, $cookies, ModalService, SelectizeService) {
	if ($cookies.get("accessKey") == null) {
		$location.path('/login');
	}
	
	$scope.shareUri = $rootScope.host;
	
	//selectize Affinity
	var selectizeAffinityId = "selectizeAffinity";
	$scope.selectizeAffinityOptions = []; //list of perfumes suggested on typing in selectize input
	$scope.selectizeAffinityModel = 1; //id of inputed perfumes
	$scope.selectizeAffinityConfig = SelectizeService.getSelectizeConfig(selectizeAffinityId, function() {
		$scope.serverErrorAffinity = null;
		$scope.showSelectizeLoaderAffinity = true;
		$scope.showNotMatchErrorAffinity = false;
		return $scope.selected.gender;
	}, function(noOptionsFound) {
		$scope.showSelectizeLoaderAffinity = false;
		if (noOptionsFound) {
			$scope.showNotMatchErrorAffinity = true;
		}
	}, function(responseData) {
		$scope.showSelectizeLoaderAffinity = false;
		SelectizeService.resetSelectize(selectizeAffinityId);
		$scope.serverErrorAffinity = responseData != null ? responseData.error : "Failed to get the results from server";
	});
	
	//selectize Adversity
	var selectizeAdversityId = "selectizeAdversity";
	$scope.selectizeAdversityOptions = []; //list of perfumes suggested on typing in selectize input
	$scope.selectizeAdversityModel = 1; //id of inputed perfumes
	$scope.selectizeAdversityConfig = SelectizeService.getSelectizeConfig(selectizeAdversityId, function() {
		$scope.serverErrorAdversity = null;
		$scope.showSelectizeLoaderAdversity = true;
		$scope.showNotMatchErrorAdversity = false;
		return $scope.selected.gender;
	}, function(noOptionsFound) {
		$scope.showSelectizeLoaderAdversity = false;
		if (noOptionsFound) {
			$scope.showNotMatchErrorAdversity = true;
		}
	}, function(responseData) {
		$scope.showSelectizeLoaderAdversity = false;
		SelectizeService.resetSelectize(selectizeAdversityId);
		$scope.serverErrorAdversity = responseData != null ? responseData.error : "Failed to get the results from server";
	});
	
	$scope.showAdvancedOptions = false;
	$scope.selectGender = function(item) {
		$scope.selected = item;
		$scope.showAdvancedOptions = true;
		SelectizeService.resetSelectize(selectizeAffinityId);
		SelectizeService.resetSelectize(selectizeAdversityId);
	};
	
	$scope.priceSlider = {
		min: 50,
		max: 1000,
		options: {
			floor: 50,
			step: 50
		}
	};
	
	//sliders
	$scope.scentSlidersList = [];
	$scope.addSlider = function(id) {
		var sliderInList = $scope.isSliderInList(id);
		if(sliderInList == false) {
			$scope.scentSlidersList.push({
				id: id, 
				model: 2, // 0 based index of slider steps
				options: {
					stepsArray: ['dislike', 'slighly dislike', 'indifferent', 'like it', 'love it'],
					showTicks: true,
					showTicksValues: true
				}
			});
		}
	};
	
	$scope.removeSlider = function(id) {
		$scope.scentSlidersList = $scope.scentSlidersList.filter(function (el) {
			return el.id !== id;
		});
	};
	
	$scope.isSliderInList = function(id) {
		for (var i = 0; i < $scope.scentSlidersList.length; i++) {
			var element = $scope.scentSlidersList[i];
			if(element.id == id) {
				return true;
			}
		}
		return false;
	};

	$scope.inputValueBrand = '';
	$scope.inputValueName = '';
	$scope.affiliatesCheck = true;
	$scope.stockCheck = true;
	$scope.affiliatesListObj = affiliatesListObj;
	$scope.affiliatesListValues = {};
	
	for (var key in $scope.affiliatesListObj) {
		$scope.affiliatesListValues[key] = true;
	}
	
	
	$scope.hideGenderBtns = false;
	$scope.requestRecommendations = function() {
		$scope.hideGenderBtns = true;
		$scope.showNoResultsStatus = false;
		$scope.showAdvancedOptions = false;
		$scope.showRecommendationsLoader = true;
		$scope.showSearchResultsWrapper = false;
		$scope.showNoResultsStatus = false;	
		
		//compose url with params
		var url = '/rest/recommendation/byAdvancedSearch?';
		if ($scope.selected.gender!=null)
		url += 'gender=' + $scope.selected.gender;
		url += '&includeRarePerfumes=false';
		if($scope.selectizeAffinityModel != 1) {
			url += '&affinityIds[]=' + $scope.selectizeAffinityModel;
		}
		if($scope.selectizeAdversityModel != 1) {
			url += '&adversityIds[]=' + $scope.selectizeAdversityModel;
		}
		if($scope.priceSlider.min != 50) {
			url += '&priceMin=' + $scope.priceSlider.min;
		}
		if($scope.priceSlider.max != 1000) {
			url += '&priceMax=' + $scope.priceSlider.max;
		}
		url += '&maxResults=8';
		
		for (var key in $scope.scentSlidersList) {
			var slider = $scope.scentSlidersList[key];
			url += '&' + slider.id + '=' + (slider.model + 1);
		}
		if($scope.inputValueBrand.length > 0) {
			url += '&brandFragments=' + $scope.inputValueBrand;
		}
		if($scope.inputValueName.length > 0) {
			url += '&nameFragments=' + $scope.inputValueName;
		}
			url += '&mustBeInStock=false'
//
//		if($scope.stockCheck == true) {
//			url += '&mustBeInStock=' + $scope.stockCheck;
//		}
//		var affList = '';
//		for (var key in $scope.affiliatesListValues) {
//			if($scope.affiliatesListValues[key] == true) {
//				if(affList.length > 0 ) {
//					affList += ',';
//				}
//				affList += key;
//			}
//		}
//		if(affList.length > 0 ) {
//			url += '&acceptedAffiliates[]=' + affList;
//		}

        var urlNoSecurity=url+"";
        if ($cookies.get("accessKey")!=null && $cookies.get("secretKey")!=null)
        {
            url+='&accessKey='+$cookies.get("accessKey");
            url+='&secretKey='+$cookies.get("secretKey");
        }
		$scope.shareUri = $rootScope.frontHost + "/#/share?uri=" + Base64.encode(urlNoSecurity);
		
		//ajax call to get recommendation
		$http
		.get($rootScope.host + url)
		.then(function successCallback(response) {
				$scope.recommendationsList = response.data.recommendations;
				$scope.showRecommendationsLoader = false;
				$scope.showSearchResultsWrapper = true;
				if ($scope.recommendationsList.length < 1) {
					$scope.showNoResultsStatus = true;
				}
			}, function errorCallback(response) {
				$scope.showRecommendationsLoader = false;
				$scope.shareUri = null;
				$scope.serverError = response.data != null ? response.data.message  : $rootScope.defaultError;
		});
		
	};
	
	$scope.modifyAdvancedSearch = function(){
		$scope.showSearchResultsWrapper = false;
		$scope.recommendationsList = {};
		$scope.showAdvancedOptions = true;
		$scope.hideGenderBtns = false;
	};
	
	$scope.resetAdvancedSearch = function() {
		$scope.showAdvancedOptions = false;
		$scope.hideRecommmendationsBtn = true;
		$scope.showSearchResultsWrapper = false;
		$scope.showResetBtns = false;
		$scope.hideGenderBtns = false;
		$scope.recommendationsList = {};
		$scope.priceSlider.min = 50;
		$scope.priceSlider.max = 1000;
		$scope.selected = null;
		$scope.scentSlidersList = [];
		
		$scope.selectizeAffinityOptions = [];
		$scope.selectizeAdversityOptions = [];
		SelectizeService.resetSelectize(selectizeAffinityId);
		SelectizeService.resetSelectize(selectizeAdversityId);
		$scope.selectizeAffinityModel = 1; //reset ids previously inputed in selectize input
		$scope.selectizeAdversityModel = 1; //reset ids previously inputed in selectize input
		
		$scope.inputValueBrand = '';
		$scope.inputValueName = '';
		for (var key in $scope.affiliatesListObj) {
			$scope.affiliatesListValues[key] = true;
		}
		$scope.stockCheck = true;
	};

	$scope.toggleModal = function(data) {  //data is recommendations array with objects
		$scope.showModal = !$scope.showModal;
		$scope.modalContent = data;
	};
	
	$scope.getPhotoUrl = function(element) {
		return ModalService.getPhotoUrl(element); 
	};
}]);


