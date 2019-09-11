'use strict';

var appDirectives = angular.module('appDirectives', []);

appDirectives.directive('modal', ['$document', '$rootScope', 'ModalService', function ($document, $rootScope, ModalService) {
    return {
      templateUrl: "partials-"+$rootScope.language+"/modal.html",
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
        scope.modalScents = $rootScope.scents;

        scope.getPhotoUrl = function(element) {
			return ModalService.getPhotoUrl(element); 
		};
        
        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });
        
        scope.$watch(attrs.model, function(value){
        	scope.modalModel = value;
        });
        
        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
        
        $document.on('keydown', function(event) {
    		if (event.which === 27) {
    			$(element).modal('hide');
    		}
		});
      }
    };
}]);

appDirectives.directive('share', function ($document, $window, $rootScope) {
	return {
		template : "<div id='fb-root'></div>",
		restrict : 'E',
		replace : true,
		scope : true,
		link : function(scope, element, attrs) {
			if (!$window.FB) {
				// Load Facebook SDK if not already loaded
				$.getScript('//connect.facebook.net/en_US/sdk.js#xfbml=1', function() {
					$window.FB.init({
						status : true,
					    cookie : true,
						xfbml : true,
						version : 'v2.0'
					});
				});
			}
			scope.$watch(attrs.uri, function(value) {
				if ($window.FB && value != null) {
					element.html('<div class="fb-share-button" data-href="' + value + '" data-layout="button"></div>');
                    //element.html('<div class="fb-like" data-width="300" data-href="'+value+'"  data-layout="button" data-action="like" data-share="true"></div>');
					$window.FB.XFBML.parse(element.parent()[0]);
				}
			});

		}
	};
});

appDirectives.directive('onRender', function ($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			if (scope.$last === true) {
				$timeout(function() {
					scope.$emit('renderFinished');
				});
			}
		}
	};
});


appDirectives.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);

