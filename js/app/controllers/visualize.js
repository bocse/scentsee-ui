'use strict';

appControllers.controller('VisualizeCtrl',['$scope', '$http', '$routeParams', '$location', '$window', '$cookies', '$rootScope','$interval', 'SingularSelectizeService',
    function($scope, $http, $routeParams, $location, $window, $cookies, $rootScope, $interval, SingularSelectizeService ) {

//        if ($cookies.get("accessKey") == null || $cookies.get("accessKey")=="null") {
//            $location.path('/login');
//            $location.search('destination', 'visualize');
//        }

        $scope.particles = [];
        $scope.springX=0;
        $scope.springY=$window.innerHeight/3;
        $scope.step = 0.1;
        $scope.drag = 0.075;
        $scope.emissionCount = 0;
        $scope.emissionFrequency = 0.99;
        $scope.emissionStop = 30;
        $scope.turbulence = 2;
        $scope.composition = null;
        $scope.mapping = null;
        $scope.tipVisible=false;
        $scope.tipValue='';
        //$scope.mappingUrl = 'http://localhost:8081/rest/constants/noteTypes';
        $scope.mappingUrl = $rootScope.protocol+'//scentsee.com/rest/constants/noteTypes';
        //$scope.visualizationUrl = 'http://localhost:8081/rest/visualization/retrieve';
        $scope.visualizationUrl = $rootScope.protocol+'//scentsee.com/rest/visualization/retrieve';
        $scope.assetPath = 'images/visualize/classes/';
        $scope.particleIndex = 0;
        $scope.stages = ["top", "heart", "base"];
        $scope.switchAge = 7.0;
        $scope.wiggle=0.1;
        $rootScope.showResetBtns=false;

        console.log("Visualize");

        var w = angular.element($window);
        w.bind('resize', function () {
            $scope.springX=0;
            $scope.springY=$window.innerHeight/4;
        });

        $scope.clock=null;
        var selectizeId = "selectize";
        $scope.selectizeOptions = [];
        $scope.selectizeModel = 1;

        $scope.selectizeConfig = SingularSelectizeService.getSelectizeConfig(selectizeId, function() {
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
            SingularSelectizeService.resetSelectize(selectizeId);
            $scope.serverError = responseData != null ? responseData.error : "Failed to get the results from server";
        });

        $scope.resetSelectize = function() {
            $scope.showSearchResultsWrapper = false;
            $scope.hideGenderBtns = false;
            $scope.showResetBtns=false;
            $rootScope.hideFooter=false;
            $rootScope.hideHeader=false;
            $scope.showDropDown = true;
            $scope.selectizeModel = 1; //reset ids previously inputed in selectize input
            $scope.selectizeOptions = [];
            SingularSelectizeService.resetSelectize(selectizeId);
        };

        //set active button
        $scope.selectGender = function(item) {
            $scope.selected = item;
            $scope.resetSelectize();
        };

        $scope.doSearch = function() {
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
            $scope.retrievePerfume($scope.selectizeModel, 100);



        };

        $scope.retrieveMapping = function () {
            $http
                //.get($rootScope.host + url)
                .get($scope.mappingUrl)
                .then(function successCallback(response) {
                    $scope.mapping = response.data;

                }, function errorCallback(response) {
                    $scope.mapping = null;
                });
        };
        $scope.retrievePerfume = function (id, volume) {

            var finalUrl=$scope.visualizationUrl + '?id=' + id + '&volume=' + volume;
            if ($cookies.get("accessKey")!=null && $cookies.get("secretKey")!=null)
            {
                finalUrl+='&accessKey='+$cookies.get("accessKey");
                finalUrl+='&secretKey='+$cookies.get("secretKey");
            }
            $http
                //.get($rootScope.host + url)
                .get(finalUrl)
                .then(function successCallback(response) {
                    $scope.composition = response.data;
                    $scope.showRecommendationsLoader = false;
                    $scope.startAnimation();


                }, function errorCallback(response) {
                    $scope.composition = null;
                    $scope.showRecommendationsLoader = false;
                    //$scope.serverError = response.data != null ? response.data.error : "Failed to get the results from server";
                    $scope.serverError = $rootScope.defaultError;
                    console.error(response.data != null ? response.data.error+" "+response.data.message : "Unknown error occurred.");
                });

        };

        function leftPad(number, targetLength) {
            var output = number + '';
            while (output.length < targetLength) {
                output = '0' + output;
            }
            return output;
        }

        $scope.createParticle = function (particleIndex) {
            var particle = {};
            var alpha = (Math.random() - 0.5) * Math.PI / 2.5;
            var amplitude = Math.random() * 80 + 20;
            particle.dx = amplitude * Math.cos(alpha);
            particle.dy = amplitude * Math.sin(alpha);
            particle.x = $scope.springX+130;
            particle.y = $scope.springY-2;

            particle.ddx = 0;
            particle.ddy = 0;
            particle.w = 50;
            particle.h = 50;
            particle.visible = true;
            particle.age = 0;
            particle.stage = 1;
            particle.version = 1+Math.floor(Math.random()*3);
            particle.index = particleIndex;
            particle.zindex = 1;
            particle.name=getParticleName(particle);
            var filename = getParticleImage(particle);
            particle.image = getParticleImage(particle);
            $scope.particles.push(particle);
        };

        function getParticleName(particle)
        {
            var compositionStage = $scope.composition[$scope.stages[particle.stage - 1]];
            var classIndex = compositionStage[particle.index % compositionStage.length];
            var version = particle.version;
            return $scope.mapping[classIndex].toLowerCase();
        }
        function getParticleImage(particle) {
            var compositionStage = $scope.composition[$scope.stages[particle.stage - 1]];
            var classIndex = compositionStage[particle.index % compositionStage.length];
            var version = particle.version;
            var filename = $scope.mapping[classIndex].toLowerCase().replace("_","-") + '-' + version;
            return $scope.assetPath + filename + '.png';
        }


        $scope.cleanupParticle = function () {
            angular.forEach($scope.particles, function (particleValue, key) {
                if (particleValue.age >= $scope.switchAge) {
                    if (particleValue.stage >= 3) {
                        particleValue.visible = false;
                    }
                    else {
                        particleValue.age = 0;
                        particleValue.stage = particleValue.stage + 1;
                        particleValue.image = getParticleImage(particleValue);
                        particleValue.name=getParticleName(particleValue);
                    }
                }
            });
            $scope.particles = $scope.particles.filter(function(item) {
                return item.visible;
            });
        };


        $scope.updateTimeStep = function () {
            if ($scope.mapping == null)
                return;
            if ($scope.composition == null)
                return;
            var renderSomething=false;
            angular.forEach($scope.particles, function (particleValue, key) {
                if (particleValue.visible) {
                    renderSomething=true;
                    particleValue.ddx = -$scope.drag * particleValue.dx + $scope.turbulence * Math.sin(particleValue.age * Math.cos(particleValue.age));
                    particleValue.ddy = -$scope.drag * particleValue.dy + $scope.turbulence * Math.cos(particleValue.age * Math.sin(particleValue.age));
                    particleValue.dx += $scope.step * particleValue.ddx;
                    particleValue.dy += $scope.step * particleValue.ddy;
                    particleValue.x += $scope.step * particleValue.dx;
                    particleValue.y += $scope.step * particleValue.dy;

                    particleValue.age += $scope.step;

                    particleValue.w = 200 * (1.0 / (1.0 + Math.abs(particleValue.age + $scope.wiggle*Math.sin(particleValue.age) - $scope.switchAge/2.0) * 0.15));
                    particleValue.h = 200 * (1.0 / (1.0 + Math.abs(particleValue.age + $scope.wiggle*Math.cos(particleValue.age) - $scope.switchAge/2.0) * 0.15));
                    if (particleValue.x+particleValue.w+5>$window.innerWidth)
                    {
                        particleValue.x-=particleValue.x+particleValue.w-$window.innerWidth;
                        particleValue.dx=-particleValue.dx;

                    }
                    if (particleValue.y+particleValue.h+5>$window.innerHeight)
                    {
                        particleValue.y-=particleValue.y+particleValue.h-$window.innerHeight;
                        particleValue.dy=-particleValue.dy;

                    }
                    if (particleValue.y<0)
                    {
                        particleValue.dy=-particleValue.dy;
                        particleValue.y=-particleValue.y;
                    }
                }
            });
            if (Math.random() < $scope.emissionFrequency) {
                $scope.cleanupParticle();
                if ($scope.emissionCount < $scope.emissionStop) {
                    var emitCount = 1;
                    for (var emitIndex = 0; emitIndex < emitCount; emitIndex++) {

                        $scope.createParticle($scope.particleIndex++);

                        $scope.emissionCount = $scope.emissionCount + 1;
                    }
                }
            }
            if ($scope.particles.length==0)
            {
                $scope.terminateAnimation();

            }
            else
            {
                //$scope.showResetBtns=false;
            }

        };

        $scope.startAnimation = function () {

            // $scope.createParticle($scope.particleIndex++);
            if ($scope.clock!=null)
            {
                $interval.cancel($scope.clock);
            }
            $scope.showResetBtns=false;
            $rootScope.hideFooter=true;
            $rootScope.hideHeader=true;
            $scope.resetParticles();
            $scope.createParticle($scope.particleIndex++);
             $scope.clock= $interval($scope.updateTimeStep, 50);
        };

        $scope.terminateAnimation=function()
        {
            //$rootScope.hideFooter=false;
            //$rootScope.hideHeader=false;
            $scope.showResetBtns=true;
            $interval.cancel($scope.clock);
            $scope.particles = [];
            $scope.clock=null;

        };
        $scope.pauseAnimation=function()
        {
            if ($scope.clock)
                $interval.cancel($scope.clock);
            //$rootScope.hideFooter=false;
            //$rootScope.hideHeader=false;
        };

        $scope.restartAnimation=function()
        {
            $scope.clock= $interval($scope.updateTimeStep, 50);

        };

        $scope.increaseEmission=function()
        {
            $scope.emissionStop+=25;
            if ($scope.clock==null)
                $scope.startAnimation();
        };
        $scope.resetParticles=function ()
        {
            $scope.particleIndex = 0;
            $scope.emissionCount = 0;
            $scope.particles = [];
        };

        $scope.retrieveMapping();
        //$scope.retrievePerfume(969013414245411, 50);
    }]);
