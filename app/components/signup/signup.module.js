angular
    .module('so.signup', [
        'ui.router',
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state('soSignup', {
                url: '/signup',
                templateUrl: 'components/signup/signup.html'
            });
    });

