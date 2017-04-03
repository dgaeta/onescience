angular
    .module('so.about', [
        'ui.router',
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state('soAbout', {
                url: '/about',
                templateUrl: 'components/about/about.html'
            });
    });

