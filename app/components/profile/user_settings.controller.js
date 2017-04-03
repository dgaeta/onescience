angular
    .module('so.profile')
    .controller('UserSettingsController', UserSettingsController);

function UserSettingsController($scope, $state, $http) {



    //$scope.api_domain =  "http://localhost:8020/api";
    $scope.api_domain =  "https://parachutefs.com/api";

	$scope.token = sessionStorage.getItem('token');
    $scope.devices = JSON.parse(sessionStorage.getItem('devices'));
    $scope.deviceCount = sessionStorage.getItem('device_count');
    $scope.email = sessionStorage.getItem('email');

    $scope.alerts = [];
    $scope.submit_pressed_cp = false; // cp means change password

    // Change password metadata params
    $scope.change_password_metadata = {'current_password': '', 'new_password': '', 'retype_new_password': ''};


    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.resetPassword = function() {
        $scope.submit_pressed_cp = true;

        var keys = Object.keys($scope.change_password_metadata);
        for (var i = keys.length - 1; i >= 0; i--) {
            if (! $scope.change_password_metadata[keys[i]]) {
                $scope.alerts.push({type: 'danger', msg: "Opps, don't forget to fill in all the fields above!"}); 
                $scope.submit_pressed_cp = false;
                return;
            }
        };

        var url = $scope.api_domain + "/users/change_password";
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);

        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': 'Basic ' + auth_cred },
            data: { 'current_password' : $scope.change_password_metadata.current_password, 
                'new_password' : $scope.change_password_metadata.new_password,
                'retype_new_password' : $scope.change_password_metadata.retype_new_password}
        })
        .then(function(response) {
            if(response['data']['status'] == "success"){
               $scope.submit_pressed_cp = false; 
               $scope.alerts.push(
                    {type: 'success', msg: "Great, your password was changed successfully!"}
                ); 
            }
            
        }, 
        function(response) {
            // failure
            console.log("failure");
            $scope.alerts.push({type: 'danger', msg: "Opps, there was a problem changing your password."}); 

            if(response['data'] == "Unauthorized Access"){
                $state.go('soAuthLogin');
            }

            
        });
    };


    

}