angular
    .module('so.auth.login')
    .controller('SoAuthLoginController', ['$scope', '$http', '$cookies', '$state',SoAuthLoginController]);


function SoAuthLoginController($scope, $http, $cookies, $state, AuthService)  {


    //$scope.api_domain =  "http://localhost:8020/api";
    $scope.api_domain = "https://parachutefs.com/api";
    $scope.cookie_error = false;

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
            console.log("no cookies allowed");
            $scope.cookie_error = true;
            return false 
        }     
    };

    $scope.email = "";
    $scope.password = "";
    $scope.submit_pressed = false;
    $scope.no_email_entered;

    $scope.alerts = [];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
    $scope.err = null;
    $scope.errObject = null;

    $scope.success = '';

    $scope.login = function() {
        if ($scope.email == "" && $scope.password == "") {
            $scope.alerts.push({type: 'danger', msg: 'Opps, can you enter your email and password?'});
            $scope.submit_pressed = false;
            return;
        };

        if ($scope.email == "") {
            $scope.alerts.push({type: 'danger', msg: 'Opps, can you enter your email?'});
            $scope.submit_pressed = false;
            return;
        };

        if ($scope.password == "") {
            $scope.alerts.push({type: 'danger', msg: 'Opps, can you enter your password?'});
            $scope.submit_pressed = false;
            return;
        };

        var url = $scope.api_domain + "/users/signin";
        var auth_string = String($scope.email) + ':' + String($scope.password)
        var auth_cred = btoa(auth_string)

        $http.get(url, {
            headers: {'Authorization': 'Basic ' + auth_cred }
        }).then(
            function(value) {
                $scope.submit_pressed = false;

                if(value['data']['status'] == "success"){

                    sessionStorage.setItem('token', value['data']['token']);
                    sessionStorage.setItem('devices', value['data']['devices']);
                    sessionStorage.setItem('device_count', value['data']['device_count']);
                    sessionStorage.setItem('email', value['data']['email']);

                    // Check if this user has a temp password
                    try { 
                        if (value['data']['is_temp_password']) {
                            $state.go('profile.user_settings');
                        } else {
                            $state.go('profile.devices');
                        }
                    }
                    catch(err) { 
                        console.log('error caught');
                        $state.go('profile.devices');
                    } 
                }
            }, 
            function(value) {
                $scope.submit_pressed = false;
                $scope.alerts.push({type: 'danger', msg: "Opps, your email and password don't match our records."}); 
            }
        );
    }
}