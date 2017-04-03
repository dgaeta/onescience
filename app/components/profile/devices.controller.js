angular
    .module('so.profile')
    .controller('DevicesController', DevicesController);

function DevicesController($scope, $cookies, AuthService, UserService) {

	$scope.alerts = [];

    $scope.device_pressed = true;

    //$scope.api_domain =  "http://localhost:8020/api";
    $scope.api_domain =  "https://parachutefs.com/api";

	$scope.token = sessionStorage.getItem('token');
    $scope.devices = JSON.parse(sessionStorage.getItem('devices'));
    $scope.deviceCount = sessionStorage.getItem('device_count');
    $scope.email = sessionStorage.getItem('email');

    console.log($scope.token);
    console.log($scope.devices);
    console.log($scope.deviceCount);
    console.log($scope.email);

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

    $scope.ClickedDevice = function(device_name) {
        $scope.device_pressed = true;
        console.log("ClickedDevice");
        var device_id = $scope.email + device_name;

     	console.log(device_name);
        console.log(device_id);

        var url = $scope.api_domain + "/devices/get_node";
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);

        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': 'Basic ' + auth_cred },
            data: { 'device_id' : device_id, 'path': ''}
        })
        .then(function(response) {
            console.log(response);

            if(response['data']['status'] == "success"){
                sessionStorage.setItem('device_id', device_id);
                sessionStorage.setItem('device_name', device_name);
                sessionStorage.setItem('root_node', response['data']['node']);
                sessionStorage.setItem('curr_node', response['data']['node']);
               
            }
            $scope.device_pressed = false;
            $state.go('profile.path', {'path':''});
            
        }, 
        function(response) {
            // failure
            console.log(response);
            console.log("failure");
            $scope.alerts.push({type: 'danger', msg: "Opps, there was a problem getting your device."}); 

            // TODO: need to display error message to user
            
        });

     	
    }

}