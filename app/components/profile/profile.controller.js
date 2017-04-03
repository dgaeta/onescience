angular
    .module('so.profile')
    .controller('ProfileController', ProfileController);

function ProfileController($scope, $cookies, $state, $http) {
    //$scope.api_domain =  "http://localhost:8020/api";
    $scope.api_domain =  "https://parachutefs.com/api";

	$scope.token = sessionStorage.getItem('token');
    $scope.devices = JSON.parse(sessionStorage.getItem('devices'));
    $scope.deviceCount = sessionStorage.getItem('device_count');
    $scope.email = sessionStorage.getItem('email');
    $scope.device_pressed = false;

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

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

    $scope.ClickedDevice = function(device_name) {
        $scope.device_pressed = true;
        console.log("ClickedDevice");
        var device_id = $scope.email + device_name;

        console.log(device_name);
        console.log(device_id);

        var url = $scope.api_domain + "/devices/get_root_client";
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
                sessionStorage.setItem('root_node', JSON.stringify(response['data']['root']));
                sessionStorage.setItem('curr_node', JSON.stringify(response['data']['root']));
                
                $scope.device_pressed = false;
                $state.go('profile.path', {'path':''});
            }
            
        }, 
        function(response) {
            // failure
            console.log(response);
            console.log("failure");
            // TODO: need to display error message to user
            
        });

        
    }

    function getDevices() {
    	$scope.api_domain =  "http://127.0.0.1:8040"
    	var url = $scope.api_domain + "/devices/list_devices";
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);

		$http({
			url: url,
			method: "GET",
    		headers: {'Authorization': 'Basic ' + auth_cred }
    	})
    	.then(function(response) {
        	console.log(response);

        	if(response['data']['status'] == "success"){
            	console.log(response);
            	$cookies.put('devices', JSON.stringify(response['data']['devices']));
            	$cookies.put('device_count', response['data']['device_count']);
        	}
        }, 
        function(response) {
        	// failure
            console.log(response);
        	
        });
		
    }

    function getDevice(device_id) {
    	$scope.api_domain =  "http://127.0.0.1:8040"
    	var url = $scope.api_domain + "/devices/get_root";
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);

		$http({
			url: url,
			method: "POST",
    		headers: {'Authorization': 'Basic ' + auth_cred },
    		data: { 'device_id' : $scope.clicked_id }
    	})
    	.then(function(response) {
        	console.log(response);

        	if(response['data']['status'] == "success"){
            	console.log(response);
            	$state.go('profile.device');
        	}
        }, 
        function(response) {
        	// failure
            console.log(response);
        	
        });
		
    }

}