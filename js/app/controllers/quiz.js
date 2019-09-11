'use strict';

appControllers.controller('QuizCtrl',['$scope', '$http', '$document', '$cookies', 'smoothScroll', '$rootScope', 'ModalService',
                                      function($scope, $http, $document, $cookies, smoothScroll, $rootScope, ModalService) {

	$scope.quizGenders=$rootScope.quizGenders;

	$scope.quizQuestions = [];
	//set active button	
	$scope.populateQuiz = function(item) {
		//choose quiz object
		$scope.selected = item;
		if($scope.selected.gender == "FEMALE") {
			$scope.quizQuestions = quizQuestionsFemale;
		} else {
			$scope.quizQuestions = quizQuestionsMale;
		}
		
		$scope.hideGenderBtns = true;
		$scope.showQuiz = true;
		
		$scope.answersSize = 0;
		$scope.totalAnswers = $scope.quizQuestions.length;
	};
	
	$scope.showQuiz = false;
	$scope.hideRecommmendationsBtn = true;
	$scope.answers = [];
	$scope.resultsLimit = 4;
	$scope.showResetBtns = false;
	$scope.shareUri = $rootScope.host;
	
	$scope.persist = function(questionId, answerId) {
		$scope.answers[questionId] = answerId;
		$scope.answersSize = Object.keys($scope.answers).length;
		if($scope.answersSize > 5) {
			$scope.hideRecommmendationsBtn = false;
		}
		
		for (var i = 0; i < $scope.quizQuestions.length; i++) {
			var question = $scope.quizQuestions[i];
			if(question.id == questionId && i < ($scope.quizQuestions.length - 1)) {
				$scope.setSelectedQuestion($scope.quizQuestions[i + 1].id);
			}
		}
        if ($scope.answersSize==$scope.quizQuestions.length)
        {
            $scope.requestRecommendations();
        }
	};
	
	$scope.requestRecommendations = function() {
		$scope.showRecommendationsLoader = true;
		$scope.hideRecommmendationsBtn = true;
		$scope.showQuiz = false;
		$scope.showSearchResultsWrapper = false;
		$scope.showMoreRecommmendationsBtn = false;
		$scope.showNoResultsStatus = false;
		$scope.serverError = null;
//		if($scope.answersSize <=5) {
//			return;
//		} TODO
		var url = '/rest/recommendation/byQuestionnaireAnswersId?';
		url+='mustBeInStock=false&includeRarePerfumes=false';
		if ($scope.selected.gender!=null)
		    url += '&gender=' + $scope.selected.gender;
		for (var o in $scope.answers) {
			url += '&' + o + '=' + $scope.answers[o];
		}
        var urlNoSecurity=url+"";
        if ($cookies.get("accessKey")!=null && $cookies.get("secretKey")!=null)
        {
            url+='&accessKey='+$cookies.get("accessKey");
            url+='&secretKey='+$cookies.get("secretKey");
        }

		$scope.shareUri = $rootScope.frontHost + "/#/share?uri=" + Base64.encode(urlNoSecurity);

		$http
		.get($rootScope.host + url.slice(0))
		.then(function successCallback(response) {
				$scope.showRecommendationsLoader = false;
				$scope.showSearchResultsWrapper = true;
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
					
			}, function errorCallback(response) {
				$scope.recommendationsList = {};
				$scope.shareUri = null;
				$scope.showRecommendationsLoader = false;
				//$scope.serverError = response.data != null ? response.data.message : $rootScope.defaultError;
                $scope.serverError = $rootScope.defaultError;
                console.error(response.data != null ? response.data.error+" "+response.data.message : "Unknown error occurred.");
		});
	};
	
	$scope.loadMoreRecommendations = function() {
		$scope.resultsLimit = 8;
		$scope.showMoreRecommmendationsBtn = false;
		$scope.showResetBtns = true;
	};

	$scope.$on('renderFinished', function (event) {
		$scope.setSelectedQuestion($scope.quizQuestions[0].id);
	});
	
	$scope.setSelectedQuestion = function(id) {
		$scope.selectedQuestion = id;
		
		var firstAnswer = angular.element('#answer-' + id)[0];
		if (firstAnswer == undefined) {
			firstAnswer = angular.element('#quizAnswers');
		}
		var firstQuestion = angular.element('#question-' + id)[0];
		if (firstQuestion == undefined) {
			firstQuestion = angular.element('#quizQuestions');
		}
		
		smoothScroll(firstAnswer, {
			duration: 700,
			easing: 'easeInQuad',
			containerId: "quizAnswers",
			offset: angular.element('#quizAnswers').offset().top // offset changes when loading new quiz for different gender 
		});
		smoothScroll(firstQuestion, {
			duration: 700,
			easing: 'easeInQuad',
			containerId: "quizQuestions",
			offset: angular.element('#quizQuestions').offset().top // offset changes when loading new quiz for different gender 
		});
	};
	
	$scope.resetQuiz = function() {
		$scope.showQuiz = false;
		$scope.showSearchResultsWrapper = false;
		$scope.hideRecommmendationsBtn = true;
		$scope.resultsLimit = 4;
		$scope.recommendationsList = {};
		$scope.answers = {};
		$scope.answersSize = 0;
		$scope.showResetBtns = false;
		$scope.hideGenderBtns = false;
	};

	$scope.toggleModal = function(data) {  //data is recommendations array with objects
		$scope.showModal = !$scope.showModal;
		$scope.modalContent = data;
	};
	
	$scope.getPhotoUrl = function(element) {
		return ModalService.getPhotoUrl(element); 
	};
	
}]);

