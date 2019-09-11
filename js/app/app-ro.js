'use strict';

var scentSeeApp = angular.module('scentSeeApp', [
	 'ngRoute',
	 'ngAnimate',
	 'ngCookies',
	 'selectize',
	 'smoothScroll',
	 'rzModule',
	 'ngclipboard',
	 'appServices',
	 'appControllers',
	 'appDirectives',
 ]);

var appControllers = angular.module('appControllers', []);

scentSeeApp.config([ '$routeProvider', '$httpProvider', '$locationProvider',
                     function($routeProvider, $httpProvider, $locationProvider) {
                         $locationProvider.html5Mode(false);
	$routeProvider.when('/landing', {
		templateUrl : 'partials-ro/landing.html',
		controller : 'LandingCtrl'
	}).when('/preferences', {
		templateUrl : 'partials-ro/preferences.html',
		controller : 'PrefCtrl'
	}).when('/quiz', {
		templateUrl : 'partials-ro/quiz.html',
		controller : 'QuizCtrl'
	}).when('/login', {
		templateUrl : 'partials-ro/login.html',
		controller: 'LoginCtrl'
	}).when('/premium', {
		templateUrl : 'partials-ro/premium.html',
		controller : 'PremiumCtrl'
	}).when('/share', {
		templateUrl : 'partials-ro/share.html',
		controller : 'ShareCtrl'
	}).when('/scents', {
		templateUrl : 'partials-ro/scents.html',
		controller: 'ScentsCtrl'
	}).when('/error404', {
		templateUrl : 'partials-ro/404.html'
	}).when('/for-whom', {
		templateUrl : 'partials-ro/for-whom.html'
	}).when('/how-it-works', {
		templateUrl : 'partials-ro/how-it-works.html'
	}).when('/stores', {
		templateUrl : 'partials-ro/stores.html'
	}).when('/partners', {
		templateUrl : 'partials-ro/partners.html'
	}).when('/visualize', {
        templateUrl : 'partials-ro/visualize.html',
        controller: 'VisualizeCtrl'
    }).when('/analytics', {
        templateUrl : 'partials-ro/analytics.html',
        controller: 'AnalyticsCtrl'
    }).when('/contact', {
		templateUrl : 'partials-ro/contact.html'
	}).otherwise({
		redirectTo : '/landing',
		controller : 'LandingCtrl'
	});

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
} ]);

scentSeeApp.run(function($rootScope, $window) {
    $rootScope.scents = scents;
    $rootScope.language = 'ro';
    $rootScope.defaultError="Ai cerut mai mult de 25 de recomandări în ultima oră. Contactează-ne pentru un cont ScentSee premium, destinat uzului profesional.";
    $rootScope.affiliatesListObj = affiliatesListObj;
    $rootScope.prefButtons = [{
        "name": "pentru ea",
        "gender": "FEMALE"
    }, {
        "name": "pentru el",
        "gender": "MALE"
    }, {
        "name": "unisex",
        "gender": "UNI"
    }];

    $rootScope.quizGenders = [{
        "name": "pentru ea",
        "gender": "FEMALE"
    }, {
        "name": "pentru el",
        "gender": "MALE"
    }];

    var protocol = 'http:';
    if ($window.location.protocol == 'https:')
        protocol = 'https:';

    $rootScope.protocol=protocol;
    $rootScope.frontHost = protocol + '//scentsee.com';
    $rootScope.host = protocol + '//scentsee.com';

    $rootScope.accessKey = '';


});
