'use strict';

appControllers.controller('AnalyticsCtrl',['$scope', '$http', '$location', '$routeParams', '$cookies', '$rootScope','$interval','BrandSelectizeService',
    function($scope, $http, $location, $routeParams, $cookies, $rootScope, $interval, BrandSelectizeService ) {

        if ($cookies.get("accessKey") == null || $cookies.get("accessKey")=="null") {
            $location.path('/login');
        }

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.isLoggedIn = function() {
            var access=$cookies.get("accessKey");
            var isLoggedIn=(access!=null) && (access!="null");
            return isLoggedIn;
        };

        $scope.logout = function() {
            $cookies.remove("secretKey");
            $cookies.remove("accessKey");
        };

        var selectizeId = "selectize";
        $scope.noteTypes=[];
        $scope.filterYear=false;
        //$scope.analyticsUrl='js/app/mockups/noteTypeFrequency.json';

        $scope.analyticsUrl=$rootScope.protocol+'//scentsee.com/rest/analytics/noteTypeFrequency';
        //$scope.analyticsUrl='http://localhost:8081/rest/analytics/noteTypeFrequency';
        $scope.analytics=null;
        $scope.maxClasses=30;
        $scope.hideGenderBtns = false;
        $scope.showDropDown = true;
        $scope.selected=$scope.prefButtons[0];

        $scope.showNotMatchError = false;
        $scope.showNoSelectionError = false;

        $scope.priceSlider = {
            value:2014,
            options: {
                floor: 2000,
                ceil:2015,
                step: 1,


                onChange: function(id) {
                    $scope.retrieveAnalytics();
                }
            }
        };
        Chart.defaults.global.colors=[  '#009900','#990000', '#000099'];

        $scope.selectizeOptions = [];
        $scope.selectizeModel = null;
        $scope.selectizeConfig = BrandSelectizeService.getSelectizeConfig(selectizeId, function() {
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
            BrandSelectizeService.resetSelectize(selectizeId);
            $scope.serverError = responseData != null ? responseData.error : "Failed to get the results from server";
        });

        $scope.activateYearFilter=function(){
            $scope.filterYear=true;
        };

        $scope.resetSelectize = function() {
            $scope.showSearchResultsWrapper = false;
            $scope.hideGenderBtns = false;
            $scope.showDropDown = true;
            $scope.selectizeModel = 1; //reset ids previously inputed in selectize input
            $scope.selectizeOptions = [];
            BrandSelectizeService.resetSelectize(selectizeId);
        };

        $scope.retrieveAnalytics = function () {
            var finalUrl=$scope.analyticsUrl+'?normalization=true';
            if ($scope.filterYear) {
                finalUrl += "&startYear=" + $scope.priceSlider.value;
                finalUrl += "&endYear=" + $scope.priceSlider.value;
            }
                finalUrl+="&gender="+$scope.selected.gender;
            if ($scope.selectizeModel!=null)
            finalUrl+="&brands="+$scope.selectizeModel;
            if ($cookies.get("accessKey")!=null && $cookies.get("secretKey")!=null)
            {
                finalUrl+='&accessKey='+$cookies.get("accessKey");
                finalUrl+='&secretKey='+$cookies.get("secretKey");
            }
            //console.log($scope.selected.gender);
            $http
                .get(finalUrl)
                .then(function successCallback(response) {
                    $scope.analytics = response.data;
                    var topArray=[];
                    var heartArray=[];
                    var baseArray=[];
                    $scope.noteTypes=[];
                    angular.forEach($scope.analytics.top, function (noteType, key) {
                        if ($scope.noteTypes.indexOf(key)==-1)
                            $scope.noteTypes.push(key);
                    });
                    angular.forEach($scope.analytics.heart, function (noteType, key) {
                        if ($scope.noteTypes.indexOf(key)==-1)
                            $scope.noteTypes.push(key);
                    });
                    angular.forEach($scope.analytics.base, function (noteType, key) {
                        if ($scope.noteTypes.indexOf(key)==-1)
                            $scope.noteTypes.push(key);
                    });

                    var classIndex=0;
                    angular.forEach($scope.noteTypes, function (noteType, key) {
                        if (classIndex>$scope.maxClasses)
                            return;
                       console.log(noteType+' '+key);
                        if ($scope.analytics.top.hasOwnProperty(noteType))
                        topArray.push($scope.analytics.top[noteType]);
                        else
                        topArray.push(0);

                        if ($scope.analytics.heart.hasOwnProperty(noteType))
                            heartArray.push($scope.analytics.heart[noteType]);
                        else
                            heartArray.push(0);

                        if ($scope.analytics.base.hasOwnProperty(noteType))
                            baseArray.push($scope.analytics.base[noteType]);
                        else
                            baseArray.push(0);

                        classIndex++

                    });

                    $scope.data=[];
                    $scope.series = ["Top", "Heart", "Base"];
                    $scope.data.push(topArray);
                    $scope.data.push(heartArray);
                    $scope.data.push(baseArray);


                    $scope.labels=$scope.noteTypes.slice(0, $scope.maxClasses);


                    }, function errorCallback(response) {
                    $scope.analytics = null;
                });
        };

        $scope.retrieveAnalytics();

        $scope.options= {scales: {
            yAxes: [{
                ticks: {
                    max: 1.0,
                    min: 0.0,
                    stepSize: 0.1

                },
                stacked: true
            }]
            , xAxes:[{ticks: {
                min: 1,
                max: 1000,
                autoSkip:false
            },
                stacked:true
            }]
        }
            ,
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
           };


        $scope.selectGender = function(item) {
            $scope.selected = item;
            //$scope.resetSelectize();
            $scope.retrieveAnalytics();
        };
    }]);


