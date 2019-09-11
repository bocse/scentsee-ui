'use strict';

var scentSeeApp = angular.module('scentSeeAnalyticsApp', [
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
    'chart.js'

 ]);
//angular.module("scentSeeAnalyticsApp", ["chart.js"]).config(function(ChartJsProvider) {
//    ChartJsProvider.setOptions({ onAnimationComplete: function(){
//        this.datasets[0].points[2].fillColor = "red";
//        this.update();
//    } });
//})

var appControllers = angular.module('appControllers', []);

scentSeeApp.config([ '$routeProvider', '$httpProvider', '$locationProvider',
                     function($routeProvider, $httpProvider, $locationProvider) {
	$routeProvider
        .when('/login', {
            templateUrl : 'partials-en/login.html',
            controller: 'LoginCtrl'
        })
        .when('/analytics', {
        templateUrl : 'partials-en/analytics.html',
        controller: 'AnalyticsCtrl'
	}).when('/contact', {
		templateUrl : 'partials-en/contact.html'
	}).otherwise({
		redirectTo : '/analytics',
		controller : 'AnalyticsCtrl'
	});

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
} ]);

scentSeeApp.run(function($rootScope, $window) {
    $rootScope.scents = scents;
    $rootScope.defaultError="You performed more than 25 requests in the last hour. Please contact us and request a ScentSee Premium account for professional use.";
    $rootScope.language = 'en';
    $rootScope.affiliatesListObj = affiliatesListObj;
    $rootScope.prefButtons = [{
        "name": "for her",
        "gender": "FEMALE"
    }, {
        "name": "for him",
        "gender": "MALE"
    }, {
        "name": "unisex",
        "gender": "UNI"
    }];

    $rootScope.quizGenders = [{
        "name": "for her",
        "gender": "FEMALE"
    }, {
        "name": "for him",
        "gender": "MALE"
    }];
    var protocol = 'http:';
    if ($window.location.protocol == 'https:')
        protocol = 'https:';
    $rootScope.protocol=protocol;
    $rootScope.frontHost = protocol + '//en.scentsee.com';
    $rootScope.host = protocol + '//scentsee.com';

    $rootScope.accessKey = '';
});


//scentSeeApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
//    var original = $location.path;
//    $location.path = function (path, reload) {
//        if (reload === false) {
//            var lastRoute = $route.current;
//            var un = $rootScope.$on('$locationChangeSuccess', function () {
//                $route.current = lastRoute;
//                un();
//            });
//        }
//        return original.apply($location, [path]);
//    };
//}])