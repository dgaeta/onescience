angular
    .module('so.profile')
    .controller('PathController', PathController);


function PathController($stateParams, $scope, $cookies, $http, $state ) {


    //$scope.api_domain =  "http://localhost:8020/api";
    $scope.api_domain =  "https://parachutefs.com/api";

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;


    // User account details
	$scope.token = sessionStorage.getItem('token');
    $scope.email = sessionStorage.getItem('email');
    // User devices details
    $scope.devices = sessionStorage.getItem('devices');
    $scope.deviceCount = sessionStorage.getItem('device_count');
    // Current device details
    $scope.curr_device_id = sessionStorage.getItem('device_id');
    $scope.root_node = JSON.parse(sessionStorage.getItem('root_node'));
    $scope.device_name = sessionStorage.getItem('device_name');
    
    $scope.path = $stateParams.path;

    $scope.file_pressed = false;
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Based on the valye of 'path', navigate the device's filesystem. 
    if (!$scope.root_node) {
        // No root_node stored in sessionStorage
        // Making async network call to get root_node data
        getRoot();   
    } else if ($scope.path == "" ){
        // No path on current scope
        // Setting curr_node to root_node
        $scope.curr_node = $scope.root_node;
        $scope.children = $scope.curr_node['children'];
        $scope.num_children = Object.keys($scope.curr_node['children']).length;
    } else if ($scope.path != "") {
        // path property is set.");

        var path_array = $scope.path.split("/");

        // Recursing root_node to path location");
        var curr = $scope.root_node;
        var i;
        for (i = 0; i < path_array.length; i++) { 
            if (path_array[i] != "") {
                var next_node = curr['children'][path_array[i]];
                curr = next_node;
            }
        }
        $scope.curr_node = curr;
        $scope.children = $scope.curr_node['children'];
        $scope.num_children = Object.keys($scope.curr_node['children']).length;
    }

    // for (var key in $scope.children) {
    //     if (key.includes("_thumb")) {
    //         delete $scope.children[key];
    //     };
    // }

    $scope.thumb_images = {};
    for (var key in $scope.children) {

        var lowerCaseKey = key.toLowerCase();

      if ($scope.children[key]['is_dir']) {
        $scope.thumb_images[key] = "/images/mac_folder.png";
      } else if (lowerCaseKey.includes('_thumb')) {
        var regularImageName = key.substring(0,key.length - 6);
        $scope.thumb_images[regularImageName] = getThumbnail($scope.children[regularImageName]['name'], $scope.children[regularImageName]['file_id']);
      }
      else if ( (lowerCaseKey.includes('png') || lowerCaseKey.includes('jpg')) && 
            ! $scope.thumb_images.hasOwnProperty(key) && ! $scope.children.hasOwnProperty( key + "_thumb" )) {
        $scope.thumb_images[key] = getThumbnail($scope.children[key]['name'], $scope.children[key]['file_id']);
      } else {
        $scope.thumb_images[key] =  "/images/mac_file.png";
      }
    }

    function getDocument(node){
        $scope.file_pressed = true;

        console.log("Attepting to download"); 
        console.log("file_id: " + node.file_id);
        console.log("name: " + node.name);
        console.log("On device_id: " + String($scope.curr_device_id));

        // Set up the network call
        var url = $scope.api_domain + "/files/get_data_all";
        // Auth needed for network call 
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);
        var document_path = $scope.path + "/" + node.name;

        // Execute the network call       
        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': 'Basic ' + auth_cred},
            data: {'device_id': $scope.curr_device_id, 'device_name': $scope.device_name,
                'file_id': node.file_id, 'path': document_path},
            config: {'responseType':'arraybuffer'} 
        })
        .then(function(response) {
            $scope.file_pressed = false;
            console.log(response);

            if(response['data']['status'] == "failure"){
                $scope.alerts.push(
                    {type: 'danger', msg: "Opps, there was a problem getting your file."}
                ); 
                return;

            }

            if(response['data']['status'] == "success"){
                console.log("downloading success.");

                // Convert the Base64 string back to text.
                var byteString = atob(response['data']['data']);

                // Convert that text into a byte array.
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                // Blob for saving.
                var file_name_array = node.name.split(".");
                var file_type = file_name_array[file_name_array.length-1];
                console.log("file_type is " + file_type);

                var file_type = file_type.toUpperCase();

                var content_type = 'text/plain';
                var is_picture = false;
                if (file_type.includes('JPG')) {
                    content_type = 'image/jpeg';
                    is_picture = true;
                } else if (file_type.includes('PDF')) {
                    content_type = 'application/pdf';
                    is_picture = true;
                } else if (file_type.includes('PNG')) {
                    content_type = 'image/png';
                    is_picture = true;
                };

                // if (!is_picture) {
                //     window.saveAs(byteString, node.name);
                //}

                //var blob = new Blob([ia], { type: 'application/pdf' });
                var blob = new Blob([ia], { type: content_type });

                // Tell the browser to save.
                //saveAs(blob, node.name);
                objectURL = URL.createObjectURL(blob);
                // console.log(objectURL);
                // window.open(objectURL);
                window.saveAs(blob, node.name);
                console.log("Browser downloading");
                $scope.file_pressed = false;
            
            }
        }, 
        function(response) {
            // failure

            console.log(response['data']);
            if(response['data'] == "Unauthorized Access"){
                $state.go('soAuthLogin');
            }

            $scope.file_pressed = true;
            console.log("downloading failure.");
            console.log(response);
            $scope.alerts.push({type: 'danger', msg: "Opps, there was a problem getting your file."}); 

            
        });
    }

    $scope.clickedItem = function(node){
        console.log("Item clicked: " + node.name);
       
        if (node.is_file) {

            console.log("file clicked");
            getDocument(node);

        } else {

            if ($scope.path == "") {
                var new_path = $scope.path + node.name;
            } else {
                var new_path = $scope.path + '/' + node.name;
            };
            
            console.log("changing path from : " + $scope.path);
            console.log("to: " + new_path);

            sessionStorage.setItem('path', new_path);
            sessionStorage.setItem('curr_node', '');
            $state.go('profile.path', {'path': new_path}, {'location': true});

        } 
        
    }

    $scope.isSymbolic = function(name){
        if (name[0] == ".") {
            console.log("Hiding symlink: " + name);
            return true;
        } else {
            return false;
        };
    }

    $scope.isHidden = function(name){
        console.log("in isHidden " + name);
        if (name[0] == ".") {
            console.log("Hiding symlink: " + name);
            return true;
        } else if (name.includes('_thumb')) {
            console.log("Hiding thumb: " + name);
            return true;
        } else {
            console.log("Not hiding: " + name)
            return false;
        };
    }

    function getRoot() {
        console.log("!!!! GET ROOT CALLED !!!!");
        var url = $scope.api_domain + "/devices/get_root_client";
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);

        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': 'Basic ' + auth_cred },
            data: { 'device_id' : $scope.curr_device_id}
        })
        .then(function(response) {
            console.log(response);

            if(response['data']['status'] == "success"){
                //$cookies.put('root_node', response['data']['device_root']);
                $scope.root_node = response['data']['device_root'];
                $scope.curr_node = response['data']['device_root'];
                $scope.curr_node['children'] = JSON.parse($scope.curr_node['children']);
                //$cookies.put('curr_node', JSON.stringify($scope.curr_node));

                //$cookies.put('root_node', JSON.stringify($scope.root_node));
                sessionStorage.root_node = JSON.stringify($scope.root_node);
                console.log(sessionStorage.root_node);
                console.log($cookies.get('root_node'));
            }
            console.log($scope.root_node);
            console.log(typeof(response['data']['device_root']))

            if ($scope.path != "") {
                console.log("in recursing, path exists");
                // Recurse to the last name in $scope.path
                var path_array = $scope.path.split("/");
                console.log($scope.root_node);
                var curr = $scope.root_node;

                var i;
                for (i = 0; i < path_array.length; i++) { 
                    if (path_array[i] != "") {
                        console.log($scope.root_node2)
                        console.log(curr);
                        curr = curr['children'][path_array[i]];
                    };
                    console.log(curr);
                }
                console.log("final curr is " + curr);
                $scope.curr_node = curr;
            };
            
        }, 
        function(response) {
            // failure
            console.log(response);
            console.log("failure");
            // TODO: need to display error message to user

            if(response['data'] == "Unauthorized Access"){
                $state.go('soAuthLogin');
            }
            
        });
    }

    function getThumbnail(name, file_id) {
        console.log("!!!! GET thumbnail called !!!!");
        var url = $scope.api_domain + "/files/get_thumbnail";
        var auth_string = String($scope.token) + ':' + String('unused');
        var auth_cred = btoa(auth_string);

        var file_type;
        var lowerName = name.toLowerCase();
        if (lowerName.includes('jpg')) {
            file_type = 'jpg';
        } else{
            file_type = 'png';
        };


        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': 'Basic ' + auth_cred },
            data: { 'device_id' : $scope.curr_device_id, 'file_id': file_id, 'file_type': file_type}
        })
        .then(function(response) {
            console.log(response);

            if(response['data']['status'] == "success"){
                console.log("success");
                $scope.thumb_images[name] = response['data']['thumb_image'];
                return response['data']['thumb_image'];
            }
        }, 
        function(response) {
            // failure
            console.log(response);
            console.log("failure");
            // TODO: need to display error message to user
            return "/images/mac_file.png";
            
        });
    }

    


}