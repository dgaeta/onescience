angular
    .module('so.profile', [
        'ui.router'
    ])
    .config(function($stateProvider) {
        var profile = {
            name: 'profile',
            url: '/profile',
            templateUrl: 'components/profile/profile.html',
            controller: 'ProfileController',
        }

        var devices = {
            name: 'profile.devices',
            url: '/devices',
            parent: profile,  //mandatory
            templateUrl: 'components/profile/devices.html'
            // controller: 'DevicesController'
        }

        var user_settings = { 
            name: 'profile.user_settings', //mandatory. This counter-intuitive requirement addressed in issue #368
            url: '/settings',
            parent: profile,  //mandatory
            templateUrl: 'components/profile/user_settings.html',
            controller: 'UserSettingsController'
        }

        var path = { 
            name: 'profile.path', //mandatory. This counter-intuitive requirement addressed in issue #368
            url: '/{path:any}',
            parent: profile,  //mandatory
            templateUrl: 'components/profile/path.html',
            controller: 'PathController'
        }

        $stateProvider
            .state(profile)
            .state(devices)
            .state(user_settings) 
            .state(path) 
            
    });

