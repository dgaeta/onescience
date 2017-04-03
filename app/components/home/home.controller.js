angular
    .module('so.home')
    .controller('HomeController', HomeController);

function HomeController($rootScope, $scope, $state, $http, $location, $anchorScroll, $timeout) {

    $scope.hideForm=true;
    $scope.joinClicked = false;
    $scope.submitted = false;

    //$scope.api_domain =  "http://localhost:8040/api";
    $scope.api_domain = "https://parachutefs.com/api";

    $scope.email = "";
    $scope.name = "";

    $scope.email_added = false;
    $scope.show_welcome_message = false;
    $scope.show_product_images = false;

    // Loadind done here - Show message for 3 more seconds.
    $timeout(function() {
        $scope.show_welcome_message = true;
    }, 100);

    $timeout(function() {
        $scope.show_welcome_message = false;
    }, 3000);

    // Loadind done here - Show message for 3 more seconds.
    $timeout(function() {
        $scope.show_welcome_message = false;
        $scope.show_product_images = true;
    }, 4000);

    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }

    $scope.addEmailToSendGrid = function() {
        if (!$scope.email.includes("@") || !$scope.email.includes(".com") ) {
            return;
        };

        $scope.hideForm=true; 
        $scope.submitted=true;

        console.log($scope.email);
        console.log("name");

        var url = $scope.api_domain + "/users/add_email_recipient";
       
        $http({
            url: url,
            method: "POST",
            data: {'email' : $scope.email, 'name': $scope.name }
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
            // TODO: need to display error message to user
            
        });

        
    }


}