angular
    .module('so.auth.registration', ['ui.router'])
    .config(function($stateProvider) {
        $stateProvider
            .state('soAuthRegistration', {
                url: '/auth/registration/',
                controller: 'SoAuthRegistrationController',
                templateUrl: 'components/auth/registration/registration.html'
            });
    });

    
    
