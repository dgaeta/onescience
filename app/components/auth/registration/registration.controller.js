angular
    .module('so.auth.registration')
    .controller('SoAuthRegistrationController', SoAuthRegistrationController);

function SoAuthRegistrationController($scope, $state, $http) {

    //$scope.api_domain =  "http://localhost:8040/api";
    $scope.api_domain =  "https://parachutefs.com/api";

	$scope.user_details = {
		'name': '', 
		'email': '',
		'interested_in': '' 
	}

	$scope.empty_fields = false;
	$scope.details_submitted = false;

	$scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.submit = function() {
    	var keys = Object.keys($scope.user_details);
        for (var i = keys.length - 1; i >= 0; i--) {
        	if ( ! $scope.user_details[keys[i]] ) {
        		// $scope.empty_fields = true;
        		console.log(keys[i]);
        		$scope.finish_pressed = false;
        		$scope.alerts = [{type: 'danger', msg: 'Opps, please fill out all fields. Thanks!'}];
        		return;
        	}
        }

        if (! $scope.user_details['email'].includes('@') || ! $scope.user_details['email'].includes('.com')) {
            $scope.finish_pressed = false;
                $scope.alerts = [{type: 'danger', msg: 'Opps, please enter a valid email address. Thanks!'}];
                return;
        };

        $scope.details_submitted = true;

        var url = $scope.api_domain + "/users/add_email_recipient";
        console.log($scope.user_details);

        $http({
            url: url,
            method: "POST",
            data: { 'name' : $scope.user_details['name'], 
                'city' : $scope.user_details['city'],
                'state' : $scope.user_details['state'],
                'organization': $scope.user_details['organization'],
                'email': $scope.user_details['email'],
                'interested_in': $scope.user_details['interested_in']
            }
        })
        .then(function(response) {
            console.log(response);

            if(response['data']['status'] == "success"){

            }
            
        }, 
        function(response) {
            // failure
            console.log(response);
            console.log("failure");
            //$scope.alerts.push({type: 'danger', msg: "Opps, there was a problem submitting."}); 
            
        });
    }

    $scope.register = function() {

    }


}