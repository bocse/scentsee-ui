'use strict';

var appServices = angular.module('appServices', []);


appServices.service('SingularSelectizeService', function($rootScope, $http) {
    var selectize = {};

    this.getSelectizeConfig = function(id, init, success, error) {
        return {
            plugins: ['remove_button'],
            maxItems: 1,
            maxOptions: 25,
            valueField: 'id',
            labelField: 'name',
            searchField: ['brand', 'name'],
            selectOnTab: true,
            closeAfterSelect: true,
            create: false,

            load: function (query, callback) {
                if (!query.length || query.length < 3) {
                    return callback();
                }

                var gender = init();

                var url = '/rest/collection/queryFull?query=';
                url += query;
                if (gender!=null)
                url += '&gender=' + gender;

                $http
                    .get($rootScope.host + url + $rootScope.accessKey)
                    .then(function successCallback(response) {
                        callback(response.data);
                        success(!response.data || response.data.length == 0);
                    }, function errorCallback(response) {
                        selectize[id].clearOptions();
                        error(response.data);
                        callback();
                    });

            },
            render: {
                option : function(item, escape) {
                    var pictureURL = "";
                    pictureURL=item.pictureURL.replace("http:", $rootScope.protocol);
                    if(pictureURL == null || pictureURL == "") {
                        pictureURL = "/images/default-perfume-picture.png";
                    }
                    pictureURL=pictureURL.replace("static.scentsee.com","d298nire0sgah8.cloudfront.net");
                    return '<div class="result-img"><img src="' + pictureURL + '"><span>'+ item.brand + '</span> <span>' + item.name + '</span></div>';
                }
            },
            onInitialize: function (s) {
                selectize[id] = s;
            }
        }
    };

    this.resetSelectize = function(id){
        selectize[id].clearOptions();
    };

});

appServices.service('SelectizeService', function($rootScope, $http) {
	var selectize = {};
	
	this.getSelectizeConfig = function(id, init, success, error) {
		return {
			plugins: ['remove_button'],
			maxItems: 4,
	        maxOptions: 25,
	        valueField: 'id',
	        labelField: 'name',
	        searchField: ['brand', 'name'],
	        selectOnTab: true,
	        closeAfterSelect: true,
	        create: false,        
			
			load: function (query, callback) {
				if (!query.length || query.length < 3) {
					return callback();
				}
	
				var gender = init();
				
	            var url = '/rest/collection/queryFull?query=';
				url += query;
				if (gender!=null)
				url += '&gender=' + gender;
				
				$http
				.get($rootScope.host + url + $rootScope.accessKey)
				.then(function successCallback(response) {
					callback(response.data);
					success(!response.data || response.data.length == 0);
				}, function errorCallback(response) {
					selectize[id].clearOptions();
					error(response.data);
					callback();
				});
				
	        },
			render: {
				option : function(item, escape) {
					var pictureURL = "";

                    //if (item.affiliateProducts.length > 0) {
					//	pictureURL = item.affiliateProducts[0].photoURL;
					//} else {
					//	pictureURL = item.pictureURL;
					//}
					pictureURL=item.pictureURL.replace("http:", $rootScope.protocol);
                    if(pictureURL == null || pictureURL == "") {
						pictureURL = "/images/default-perfume-picture.png";
					}
					pictureURL=pictureURL.replace("static.scentsee.com","d298nire0sgah8.cloudfront.net");
					return '<div class="result-img"><img src="' + pictureURL + '"><span>'+ item.brand + '</span> <span>' + item.name + '</span></div>';
				}
			},
			onInitialize: function (s) {
				selectize[id] = s;
			}
		}
	};
	
	this.resetSelectize = function(id){
		selectize[id].clearOptions();
	};
	
});

appServices.service('BrandSelectizeService', function($rootScope, $http) {
    var selectize = {};

    this.getSelectizeConfig = function (id, init, success, error) {
        return {
            plugins: ['remove_button'],
            maxItems: 4,
            maxOptions: 25,
            valueField: 'name',
            labelField: 'name',
            searchField: ['name'],
            selectOnTab: true,
            closeAfterSelect: true,
            create: false,

            load: function (query, callback) {
                if (!query.length || query.length < 1) {
                    return callback();
                }


                var url = '/rest/collection/queryBrands?query=';
                url += query;


                $http
                    .get($rootScope.host + url + $rootScope.accessKey)
                    //.get('http://localhost:8081' + url + $rootScope.accessKey)

                    .then(function successCallback(response) {
                        callback(response.data);
                        success(!response.data || response.data.length == 0);
                    }, function errorCallback(response) {
                        selectize[id].clearOptions();
                        error(response.data);
                        callback();
                    });

            },
            render: {
                option: function (item, escape) {

                    return '<div class="result-img">' + item.name + '</div>';
                }
            },
            onInitialize: function (s) {
                selectize[id] = s;
            }
        }
    };

    this.resetSelectize = function (id) {
        selectize[id].clearOptions();
    };

});

appServices.service('ModalService', function($rootScope) {
	
	this.getPhotoUrl = function(element) {
		if(!element) {
			return "";
		}
		
		//var key = Object.keys(element.affiliateProducts)[0];
		//var affiliates = element.affiliateProducts[key];
		//if (affiliates) {
		//	for (var int = 0; int < affiliates.length; int++) {
		//		if (affiliates[int].photoURL && affiliates[int].photoURL.length > 0) {
		//			return affiliates[int].photoURL;
		//		}
		//	}
		//}
        var url=element.pictureURL.replace("http:", $rootScope.protocol);
        url=url.replace("static.scentsee.com","d298nire0sgah8.cloudfront.net");
		return url;
	};
	
});
