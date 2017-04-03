angular
    .module('so.home', [
        'ui.router',
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state('soHome', {
                url: '/',
                templateUrl: 'components/home/home.html',
                controller: 'HomeController',
            });
    });

