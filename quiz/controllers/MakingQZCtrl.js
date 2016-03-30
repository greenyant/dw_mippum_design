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
.controller("MakingQZCtrl", function ($scope, $sce){
	$scope.trustAsHtml = $sce.trustAsHtml;
	
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
            
            default_edit_category = {order:$scope.qz.ct.length-1, select_order:[], selected_contents:[]};
            
            for(var i=0;i<new_ct.level_label.length;i++){
                default_edit_category.select_order.push(-1);
                if(i==0){
                   default_edit_category.selected_contents.push(new_ct.contents);
                } else {
                    default_edit_category.selected_contents.push([]);
                }
                default_edit_category.selected_contents[i].depth = i;
            }
	        //console.log(default_edit_category);
	        
	        for(var i=0;i<$scope.qz.items.length;i++){
	        	if($scope.qz.items[i].edit.categories === undefined){
	        		$scope.qz.items[i].edit.categories = [];
	        	}
	        	$scope.qz.items[i].edit.categories.push(default_edit_category);
	        }
            
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
        default_edit_categories = [];
        if($scope.qz.ct !== undefined){
            for(var i=0;i<$scope.qz.ct.length;i++){
                default_edit_categories.push({order:i, select_order:[], selected_contents:[]});
                for(var j=0;j<$scope.qz.ct[i].level_label.length;j++){
                    default_edit_categories[i].select_order.push(-1);
                    if(j==0){
                       default_edit_categories[i].selected_contents.push($scope.qz.ct[i].contents);
                        
                    } else {
                        default_edit_categories[i].selected_contents.push([]);
                    }
                    default_edit_categories[i].selected_contents[j].depth = j;
                }
            }
        }
        
    	$scope.qz.items.push({
    		order:$scope.qz.items.length,
    		question:"",
    		numOfChoicesEachRow:1,
    		edit:{
    			answerType:"choiceNumber",
    			choices:default_choices,
    			numOfChoicesEachRow:1,
    			numOfChoicesEachRow_candidates:[1,2,3,4,6],
    			using_solution:false,
    			show_flag:true,
    			editting_flag:true,
                categories:default_edit_categories
    		},
    		finished:{
    			
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
    	//item.edit.numOfChoicesEachRow_candidates = [1].concat($scope.candidates_for_num_of_choices).slice(0, item.edit.choices.length);
    };
	$(document).on('click','.btn-group .btn.disabled',function(event){
		//console.log('de click');
		event.stopPropagation();
	});
	$scope.use_solution = function(item, value){
		if(item.edit.editting_flag){
			item.edit.using_solution = value;
		}
	};
	
	$scope.change_item_ct = function(category, depth){
		if(category.select_order[depth] == -1){
			category.selected_contents[depth+1] = [];
			category.selected_contents[depth+1].depth = depth+1;
		} else if(depth < category.selected_contents.length-1){
			category.selected_contents[depth+1] = category.selected_contents[depth][category.select_order[depth]].sub_contents;
			category.selected_contents[depth+1].depth = depth+1;
		}
		for(var i=depth+2; i<category.select_order.length;i++){
			category.selected_contents[i] = [];
			category.selected_contents[i].depth = i;
		}
	};
	
	$scope.apply_item = function(item){
		item.finished = angular.fromJson(angular.toJson(item.edit));
		item.question = item.edit.question;
		item.answerType = item.edit.answerType;
		
		if(item.answerType =="choiceNumber"){
			item.numOfChoicesEachRow = item.edit.numOfChoicesEachRow;
			item.choices = [];
			
			
			for(var i=0; i<item.edit.choices.length; i++){
				item.choices.push(item.edit.choices[i].value);
				
			}
		}
		
		console.log(item.question);
		console.log(item);
		
	};
});

