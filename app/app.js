// app.js

var so = angular.module('so', [
    'ui.router',
    'ui.bootstrap',
    'so.home',
    'so.auth',
    'so.about',
    'so.signup',
    'so.profile',
    'ngCookies',
    'ui.bootstrap',
    'ngAnimate'
]);


so.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    
});

so.controller("soCtrl", ["$scope", "$rootScope", "$cookies", "$state",
	function($scope, $rootScope, $cookies, $state) {


        //sessionStorage.setItem('api_domain', "http://127.0.0.1:8040");

        $scope.tokenExists = function() {
             try { 
                if (sessionStorage.getItem('token')){
                    return true;
                }
                else {
                    return false;
                }
            }
            catch(err) { 
                return false 
            }

            
        };

        $scope.logout = function() {
            console.log("User clicked logout.");
            sessionStorage.setItem('token', '');
            $scope.token = "";
            $state.go('soHome');
            sessionStorage.clear();

        };
    }
]);

so.directive('pfsSetHeight', function($window){
  return{
    link: function(scope, element, attrs){
        element.css('min-height', $window.innerHeight + 'px');
        //element.height($window.innerHeight/3);
    }
  }
});

so.directive('pfsSetHeightQuarterPage', function($window){
  return{
    link: function(scope, element, attrs){
        element.css('min-height', $window.innerHeight/4 + 'px');
        //element.height($window.innerHeight/3);
    }
  }
});


so.directive('pfsSetFourthPaddingTop', function($window){
  return{
    link: function(scope, element, attrs){
        element.css('padding-top', $window.innerHeight/4 + 'px');
        //element.height($window.innerHeight/3);
    }
  }
});

so.directive('pfsSetEigthPaddingTop', function($window){
  return{
    link: function(scope, element, attrs){
        element.css('padding-top', $window.innerHeight/8 + 'px');
        //element.height($window.innerHeight/3);
    }
  }
});

so.directive('pfsSetThirdPaddingTop', function($window){
  return{
    link: function(scope, element, attrs){
        element.css('padding-top', $window.innerHeight/3 + 'px');
        //element.height($window.innerHeight/3);
    }
  }
});

so.directive('pfsSetHalfInnerPaddingTop', function($window){
  return{
    link: function(scope, element, attrs){
        console.log(element);
        console.log(element[0].clientHeight);
        console.log(element[0].clientHeight/2 + 'px');
        element.css('padding-top', element[0].clientHeight/2 + 'px');
        //element.height($window.innerHeight/3);
    }
  }
});

so.run(function($rootScope, $state) {

    // $state.go('soHome');

    $rootScope.$on('$routeChange', function(event, next, previous) {
        console.log('Route Change');
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_REQUIRED') {
            $state.go('soAuthLogin');
        }
    });
});