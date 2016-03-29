angular.module("makingQZ")
.controller("MakingQZCtrl", function ($scope){
    $scope.const_str = const_str;
    $scope.qz = {
        "name":"",
        "itmes": []
    };
    
    $scope.open_mpqz_file = function(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        
        
        reader.onload = function(progressEvent){
            // Entire file
            $scope.qz = angular.fromJson(this.result);
            $scope.$apply();
        };
        reader.readAsText(file);
    };
    
    //start of area for ct
    $scope.open_mpct_file = function(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            if($scope.qz.ct == undefined){
                $scope.qz.ct =[];
            }
            new_ct = angular.fromJson(this.result);
            new_ct.order = $scope.qz.ct.length;
            $scope.qz.ct.push(new_ct);
            
            $scope.$apply();
        };
        reader.readAsText(file);
    };
    
    $scope.down_mpct_file = function(order){
    	//copy and delete order before download.
        var down_ct = angular.fromJson(angular.toJson($scope.qz.ct[order]));
        delete down_ct.order;
        download(angular.toJson(down_ct, true), 
                 down_ct.name+".mpct", "text/plain");
    };
    $scope.del_ct = function(order){
        $scope.qz.ct.splice(order, 1);
        for(var i=order; i<$scope.qz.ct.length; i++){
        	$scope.qz.ct[i].order = i;
        }
    };
    //end of area for ct
     
    $scope.down_mpqz_file = function(){
        //download($scope.down_dat = angular.toJson($scope.qz, true), 
        //        $scope.ct.name+".mpct", "text/plain");
    };
    
});