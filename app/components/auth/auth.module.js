angular
    .module('so.auth', [
        'ui.router',
        'so.auth.registration',
        'so.auth.social',
        'so.auth.login',
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state('soAuth', {
                url: '/auth/',
                templateUrl: 'components/auth/auth.html'
            });
    });

