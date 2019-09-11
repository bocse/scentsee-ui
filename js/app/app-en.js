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
    'chart.js'
 ]);

var appControllers = angular.module('appControllers', []);

scentSeeApp.config([ '$routeProvider', '$httpProvider', '$locationProvider',
                     function($routeProvider, $httpProvider, $locationProvider) {
	$routeProvider.when('/landing', {
		templateUrl : 'partials-en/landing.html',
		controller : 'LandingCtrl'
	}).when('/preferences', {
		templateUrl : 'partials-en/preferences.html',
		controller : 'PrefCtrl'
	}).when('/quiz', {
		templateUrl : 'partials-en/quiz.html',
		controller : 'QuizCtrl'
	}).when('/login', {
		templateUrl : 'partials-en/login.html',
		controller: 'LoginCtrl'
	}).when('/premium', {
		templateUrl : 'partials-en/premium.html',
		controller : 'PremiumCtrl'
	}).when('/share', {
		templateUrl : 'partials-en/share.html',
		controller : 'ShareCtrl'
	}).when('/scents', {
		templateUrl : 'partials-en/scents.html',
		controller: 'ScentsCtrl'
	}).when('/error404', {
		templateUrl : 'partials-en/404.html'
	}).when('/for-whom', {
		templateUrl : 'partials-en/for-whom.html'
	}).when('/how-it-works', {
		templateUrl : 'partials-en/how-it-works.html'
	}).when('/stores', {
		templateUrl : 'partials-en/stores.html'
	})
	.when('/cookies', {
    		templateUrl : 'partials-en/cookies.html'
    	}).when('/navigation', {
        templateUrl : 'partials-en/navigation.html'
    }).when('/labs', {
        templateUrl: 'partials-en/labs.html',
        controller: 'LandingCtrl'
    }).when('/showcase', {
        templateUrl : 'partials-en/labs.html',
        controller:'LandingCtrl'
    }).when('/request-invite', {
        templateUrl : 'partials-en/request-invite.html',
        controller: 'InviteCtrl'
    }).when('/partners', {
		templateUrl : 'partials-en/partners.html'
    }).when('/baneasa', {
      		templateUrl : 'partials-en/baneasa.html'
          }) .when('/analytics', {
        templateUrl : 'partials-en/analytics.html',
        controller: 'AnalyticsCtrl'
    }).when('/architect', {
        templateUrl : 'partials-en/architect.html',
        controller: 'ArchitectCtrl'
    }).when('/navigation', {
        templateUrl : 'partials-en/navigation.html',
        controller: 'NavigationCtrl'
    }).when('/visualize', {
        templateUrl : 'partials-en/visualize.html',
        controller: 'VisualizeCtrl'
    }).when('/network', {
        templateUrl : 'partials-en/network.html',
        controller: 'NetworkCtrl'
    }).when('/contact', {
		templateUrl : 'partials-en/contact.html'
	}).otherwise({
		redirectTo : '/landing',
		controller : 'LandingCtrl'
	});

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
} ]);

scentSeeApp.run(function($rootScope, $window) {
    $rootScope.scents = scents;
    $rootScope.language = 'en';
    $rootScope.defaultError="You performed more than 25 requests in the last hour. Please contact us and request a ScentSee Premium account for professional use.";
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
    },
    {
        "name": "all",
            "gender": null
    }
    ];

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