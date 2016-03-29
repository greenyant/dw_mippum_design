angular.module("makingQZ")
.controller("MakingQZCtrl", function ($scope){
    $scope.const_str = const_str;
    $scope.choice_mark_types = choice_mark_types;
    $scope.choice_mark_type = choice_mark_types[1];
    
    $scope.default_num_of_choices = 5;
    $scope.candidates_for_num_of_choices = []; 
    
    $scope.using_math_flag = false;
    
	for (var i = 2; i <= 15; i++) {
	    $scope.candidates_for_num_of_choices.push(i);
	}
    
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
    $scope.basic_ct_candidates = [];
    
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
    $scope.select_basic_ct_name = function(order){
    	//console.log($scope.qz.ct[order].level_label);
    	$scope.basic_ct_candidates = $scope.qz.ct[order].level_label;
    	$scope.qz.basic_ct = {};
    	$scope.qz.basic_ct.order = order;
    };
    
    $scope.select_basic_ct_depth = function(depth){
    	$scope.qz.basic_ct.depth = depth;
    };
    //end of area for ct
     
    $scope.down_mpqz_file = function(){
        //download($scope.down_dat = angular.toJson($scope.qz, true), 
        //        $scope.ct.name+".mpct", "text/plain");
    };
    
});