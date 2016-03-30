var answer_type_candidates = [{
	'name':'choiceNumber',
	'text':'객관식'
},{
	'name':'shortString',
	'text':'문자단답형'
},{
	'name':'number',
	'text':'숫자단답형'
},{
	'name':'OX',
	'text':'OX퀴즈'
},{
	'name':'essay',
	'text':'서술형'
}];

angular.module("makingQZ")
.controller("MakingQZCtrl", function ($scope){
    $scope.const_str = const_str;
    $scope.choice_mark_types = choice_mark_types;
    $scope.choice_mark_type = choice_mark_types[1];
    
    $scope.answer_type_candidates = answer_type_candidates;
    
    $scope.default_num_of_choices = 5;
    $scope.candidates_for_num_of_choices = []; 
    for (var i = 2; i <= 15; i++) {
	    $scope.candidates_for_num_of_choices.push(i);
	}
    
    $scope.using_math_flag = false;
    
    $scope.qz = {
        "name":"",
        "items": []
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
     
    $scope.down_mpqz_file = function(){ //fix me
        //download($scope.down_dat = angular.toJson($scope.qz, true), 
        //        $scope.ct.name+".mpct", "text/plain");
    };
    
    $scope.add_item = function(){
    	//console.log("add itmes");
    	//:$scope.default_num_of_choices
    	var default_choices = [];
    	for(var i=0; i<$scope.default_num_of_choices; i++){
    		default_choices.push({ order:i, value:"", answer:false});
    		
    	}
    	$scope.qz.items.push({
    		order:$scope.qz.items.length,
    		question:"",
    		
    		edit:{
    			answerType:"choiceNumber",
    			choices:default_choices,
    			numOfChoicesEachRow:1,
    			numOfChoicesEachRow_candidates:[1].concat($scope.candidates_for_num_of_choices).slice(0, default_choices.length),
    			using_solution:false
    		}
    	});
    };
    $scope.add_item(); //fixme
    
    $scope.change_num_of_choices = function(item, num){
    	if(num < item.edit.choices.length) {
    		item.edit.choices = item.edit.choices.slice(0,num);
    	} else {
    		for(var i=item.edit.choices.length; i<num; i++){
    			item.edit.choices.push({order:i,value:"", answer:false});
    		}
    	} 
    	item.edit.numOfChoicesEachRow = 1;
    	item.edit.numOfChoicesEachRow_candidates = [1].concat($scope.candidates_for_num_of_choices).slice(0, item.edit.choices.length);
    };


});

