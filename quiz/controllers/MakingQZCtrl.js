var answer_type_candidates = [{
	'name':'choiceOne',
	'text':'객관식일답'
},{
	'name':'choiceMulti',
	'text':'객관식다답'
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
    
    $scope.qz = {
        "name":"",
        "using_math_flag":false,
        "items": [],
        "refs":[]
    };
    
    function make_categories_from_edit(item){
		item.categories = [];
		item.category_texts = [];
		for(var i=0;i<item.edit.categories.length;i++){
			item.categories.push(item.edit.categories[i].select_order.slice());
			var content = $scope.qz.ct[i].contents;
			var category_text = $scope.qz.ct[i].name + " : ";
			for(var j=0; j<item.edit.categories[i].select_order.length; j++){
				if(item.edit.categories[i].select_order[j] == -1) break;
				if(j != 0) category_text += " > ";
				category_text += content[item.edit.categories[i].select_order[j]].name;
				if(content[item.edit.categories[i].select_order[j]].sub_contents !== undefined) 
					content = content[item.edit.categories[i].select_order[j]].sub_contents;
				else break;
			}
			item.category_texts.push(category_text);
		}
	}
	
    function make_selected_contents_from_ct(ct, select_order){
        var selected_contents = [];
        
        var selected_one = ct.contents;
        //console.log(select_order);
        //console.log(ct);
        for(var i=0; i< select_order.length; i++){
        	//console.log(selected_contents);
            if(i==0){
                //var selected_one = ct.contents;
                selected_contents.push(selected_one);
            } else {
            	if(selected_one[select_order[i-1]] != undefined){
            		selected_one = selected_one[select_order[i-1]].sub_contents;
                	selected_contents.push(selected_one);
            	}
            }
            selected_contents[i].depth = i;
        }
        return selected_contents;
    }
    
    $scope.open_mpqz_file = function(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        
        
        reader.onload = function(progressEvent){
            $scope.qz = angular.fromJson(this.result);
            //console.log($scope.qz.items.length);
            for(var i=0; i<$scope.qz.items.length; i++){
            	//console.log($scope.qz.items[i]);
            	var this_item = angular.fromJson(angular.toJson($scope.qz.items[i]));
            	
            	
            	if(this_item.solution == undefined || this_item.solution.length == 0){
            		this_item.using_solution = false;
            	} else this_item.using_solution = true;
            	
            	this_item.editting_flag = true;
            	this_item.show_item_flag = false;
            	this_item.show_edit_flag = false;
            	
                if(this_item.answerType == "shortString") {
                    this_item.shortString_answer = this_item.answer;
                } else if(this_item.answerType =="number"){
                    this_item.number_answer = this_item.answer;
                } else if(this_item.answerType =="OX"){
                    this_item.OX_answer = this_item.answer;
                } else if(this_item.answerType =="essay"){
                } else if(this_item.answerType =="choiceOne"){
                    this_item.choiceOne_answer = this_item.answer;
                } else if(this_item.answerType =="choiceMulti"){ 
                    for(var j=0; j<this_item.choices.length;j++){
                    	this_item.choices[j].answer = false;
                    	for(var k=0;k<this_item.answer.length;k++){
                    		if(this_item.choices[j].order == this_item.answer[k])
                    			this_item.choices[j].answer = true;
                    	}
                    }
                }
                
                //var select_order = this_item.categories;
                //console.log(this_item.categories);
                var edit_categories = [];
                for(var j=0; j<this_item.categories.length; j++){
                	var select_order = this_item.categories[j];
                	var selected_contents = make_selected_contents_from_ct($scope.qz.ct[j],select_order);
                	//console.log(selected_contents);
                	edit_categories.push({order:j, select_order:select_order, selected_contents:selected_contents});
                }
                this_item.categories = edit_categories;
                //this_item.categories
                //this_item.categories.selected_contents = make_selected_contents_from_ct($scope.qz.ct, this_item.categories.select_order);
                
            	$scope.qz.items[i].edit = this_item;
            	$scope.qz.items[i].finished = angular.fromJson(angular.toJson(this_item));
            	//console.log(this_item);
            	//console.log($scope.qz.items[i]);
            }
            for(var i=0; i<$scope.qz.refs.length; i++){
                var this_ref = angular.fromJson(angular.toJson($scope.qz.refs[i]));
                $scope.qz.refs[i].edit = this_ref;
            	$scope.qz.refs[i].finished = angular.fromJson(angular.toJson(this_ref));
            }
            
            $scope.$apply();
            
            setTimeout(function(){
			    MathJax.Hub.Typeset();
			}, 10);
        };
        reader.readAsText(file);
    };
    
    $scope.down_mpqz_file = function(){ 
    	var down_dat = angular.fromJson(angular.toJson($scope.qz));
    	for(i=0;i<down_dat.items.length;i++){
    		//console.log(down_dat.items[i]);
    		delete down_dat.items[i].edit; //fix me
    		delete down_dat.items[i].finished; //fix me
    	}
    	
    	if($scope.qz.name.length == 0){
    		download(angular.toJson(down_dat, true), "empty.mpqz", "text/plain");
    	} else {
        	download(angular.toJson(down_dat, true), $scope.qz.name+".mpqz", "text/plain");
        	//download(angular.toJson(down_dat, true), $scope.qz.name+"_not_deleted.mpqz", "text/plain"); //fix me
    	}
        
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
            
            for(var i=0;i<$scope.qz.items.length;i++){
	            var default_edit_category = {order:$scope.qz.ct.length-1, select_order:[], selected_contents:[]};
	            
	            for(var j=0;j<new_ct.level_label.length;j++){
	                default_edit_category.select_order.push(-1);
	                if(j==0){
	                   default_edit_category.selected_contents.push(new_ct.contents);
	                } else {
	                    default_edit_category.selected_contents.push([]);
	                }
	                default_edit_category.selected_contents[j].depth = j;
	            }
	        
	        	if($scope.qz.items[i].edit.categories === undefined){
	        		$scope.qz.items[i].edit.categories = [];
	        	}
	        	
	        	$scope.qz.items[i].edit.categories.push(default_edit_category);
	        	//$scope.qz.items[i].categories = $scope.qz.items[i].edit.categories.select_order;
	        	$scope.qz.items[i].finished.categories.push(angular.fromJson(angular.toJson(default_edit_category)));
	        	
	        	make_categories_from_edit($scope.qz.items[i]);
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
    	$scope.modal_title = '카테고리를 삭제하시겠습니까?';
        $scope.modal_warning_msg = '해당 카테고리와 관련된 데이터는 모두 사라집니다.';
        $scope.submit_btn_txt = const_str.delete;
        $scope.modal_warning_flag = true;
        $scope.selected_order = order;
        
        $scope.submitModal = function() {
        	var order = $scope.selected_order;
			console.log(order);
			if($scope.qz.basic_ct != undefined && $scope.qz.basic_ct.order == order){
	    		$scope.basic_ct_candidates = [];
	    		$scope.qz.basic_ct = {};
	    		$scope.qz.basic_ct.order = undefined;
	    	}
	    	
	        for(var i=0; i<$scope.qz.items.length; i++){
		        if($scope.qz.items[i].categories != undefined){
		        	$scope.qz.items[i].categories.splice(order, 1);
		        }
		        $scope.qz.items[i].edit.categories.splice(order, 1);
		        $scope.qz.items[i].finished.categories.splice(order, 1);
	        }
	        $scope.qz.ct.splice(order, 1);
	        
	        for(var i=order; i<$scope.qz.ct.length; i++){
	        	$scope.qz.ct[i].order = i;
	        	for(var j=0; j<$scope.qz.items.length; j++){
	        		$scope.qz.items[j].edit.categories[i].order = i;
	        		$scope.qz.items[j].finished.categories[i].order = i;
	        	}
	        }
	        $scope.showModal = false;
        };
    	$scope.showModal = true;
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
     
    
    
    // edit item sections
    
    $scope.add_item = function(){
    	//console.log("add itmes");
    	//:$scope.default_num_of_choices
    	var default_choices = [];
    	for(var i=0; i<$scope.default_num_of_choices; i++){
    		default_choices.push({ order:i, value:"", answer:false});
    		
    	}
        var default_edit_categories = [];
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
    		reference:-1,
    		edit:{
    			question:"",
    			answerType:"choiceNumber",
    			choices:default_choices,
    			numOfChoicesEachRow:1,
    			numOfChoicesEachRow_candidates:[1,2,3,4,6],
    			categories:default_edit_categories,
                using_solution:false,
    			editting_flag:true,
                
                choiceOne_answer:'',
                shortString_answer:'',
                number_answer:'',
                
                show_item_flag:true,
                show_edit_flag:true,
                reference:-1
    		}
    	});
    	//$scope.qz.items[$scope.qz.items.length-1].finished = $scope.qz.items[$scope.qz.items.length-1].edit;
    	$scope.qz.items[$scope.qz.items.length-1].finished = angular.fromJson(angular.toJson($scope.qz.items[$scope.qz.items.length-1].edit));
    	
    	make_categories_from_edit($scope.qz.items[$scope.qz.items.length-1]);
    };
    //$scope.add_item(); //fixme
    
    $scope.show_item_all = function (){
    	for(var i=0; i<$scope.qz.items.length; i++){
    		$scope.qz.items[i].edit.show_item_flag = true;
    	}
    };
    $scope.close_item_all = function(){
    	for(var i=0; i<$scope.qz.items.length; i++){
    		$scope.qz.items[i].edit.show_item_flag = false;
    	}
    };
    
    $scope.move_item_up = function(order){
    	if(order > 0){
    		var temp = $scope.qz.items[order-1];
    		$scope.qz.items[order-1] = $scope.qz.items[order];
    		$scope.qz.items[order] = temp;
    		$scope.qz.items[order-1].order = order-1;
    		$scope.qz.items[order].order = order;
    	}
    };
    $scope.move_item_down = function(order){
    	if(order < $scope.qz.items.length-1){
    		var temp = $scope.qz.items[order+1];
    		$scope.qz.items[order+1] = $scope.qz.items[order];
    		$scope.qz.items[order] = temp;
    		$scope.qz.items[order+1].order = order+1;
    		$scope.qz.items[order].order = order;
    	}
    };
    $scope.del_item = function(order){
    	$scope.modal_title = order+'번의 문항을 삭제하시겠습니까?';
        $scope.modal_warning_msg = '해당 문항의 데이터는 모두 사라집니다.';
        $scope.submit_btn_txt = const_str.delete;
        $scope.modal_warning_flag = true;
        
        $scope.submitModal = function() {
	        $scope.qz.items.splice(order,1);
	    	for(var i=order; i<$scope.qz.items.length; i++){
	    		$scope.qz.items[i].order = i;
	    	}
	    	$scope.showModal = false;
        };
    	$scope.showModal = true;
    };
    
    $scope.cancle_edit_item = function(item){
    	if(item.finished != undefined){
    		item.edit = angular.fromJson(angular.toJson(item.finished));
    	}
    	item.edit.show_edit_flag = false;
    };
    $scope.enable_edit_item = function(item){
    	item.edit.show_edit_flag = true;
    };
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
	
	$scope.set_OX_answer = function(item, value){
		if(item.edit.editting_flag){
			item.edit.OX_answer = value;
		}
	};
	
	$scope.use_solution = function(item, value){
		if(item.edit.editting_flag){
			item.edit.using_solution = value;
		}
	};
	
	$scope.change_item_ct = function(category, depth, value){
		category.select_order[depth] = value;
		if(depth >= category.select_order.length-1) return;
		
		if(category.select_order[depth] == -1){
			category.selected_contents[depth+1] = [];
			category.selected_contents[depth+1].depth = depth+1;
			category.select_order[depth+1] = -1;
		} else if(depth < category.selected_contents.length-1){
			category.selected_contents[depth+1] = category.selected_contents[depth][category.select_order[depth]].sub_contents;
			category.selected_contents[depth+1].depth = depth+1;
			category.select_order[depth+1] = -1;
		}
		for(var i=depth+2; i<category.select_order.length;i++){
			category.selected_contents[i] = [];
			category.selected_contents[i].depth = i;
			category.select_order[i] = -1;
		}
	};
	
	
	$scope.apply_item = function(item){
		
		item.finished = angular.fromJson(angular.toJson(item.edit));
		
		item.reference = item.edit.reference;
		item.question = item.edit.question;
		item.answerType = item.edit.answerType;
		
		if(item.edit.using_solution){
			item.solution = item.edit.solution;
		} else {
			item.solution = undefined;
		}
		
		make_categories_from_edit(item);
			
		if(item.answerType =="shortString"){
			item.answer = item.edit.shortString_answer;
			item.answerText = item.edit.shortString_answer;
			item.finished.choices = [];
		} else if(item.answerType =="number"){
			item.answer = item.edit.number_answer;
			item.answerText = item.edit.number_answer;
			item.finished.choices = [];
		} else if(item.answerType =="OX"){
			item.answer = item.edit.OX_answer;
			item.answerText = item.edit.OX_answer;
			item.finished.choices = [];
		} else if(item.answerType =="essay"){
			item.finished.choices = [];
		} else if(item.answerType =="choiceOne"){
			item.numOfChoicesEachRow = item.edit.numOfChoicesEachRow;
			
			item.choices = [];
			for(var i=0; i<item.edit.choices.length; i++){
				item.choices.push({
					order: item.edit.choices[i].order,
					value:item.edit.choices[i].value
				});
			}
			
			item.answer = item.edit.choiceOne_answer;
			item.answerText = $scope.choice_mark_type.marks[item.answer];
		} else if(item.answerType =="choiceMulti"){
			item.numOfChoicesEachRow = item.edit.numOfChoicesEachRow;
			
			item.choices = [];
			item.answer = [];
			for(var i=0; i<item.edit.choices.length; i++){
				item.choices.push({
					order: item.edit.choices[i].order,
					value:item.edit.choices[i].value
				});
				if(item.edit.choices[i].answer == true){
					item.answer.push(i);
				}
			}
			item.answerText = '';
			for(var i=0;i<item.answer.length;i++){
				item.answerText += $scope.choice_mark_type.marks[item.answer[i]];
			}
		}
		item.edit.show_edit_flag = false;
		setTimeout(function(){
		    MathJax.Hub.Typeset();
		}, 10);
		//MathJax.Hub.Typeset();
	};
	
	// edit ref section
	$scope.add_ref = function(){
        $scope.qz.refs.push({
            order:$scope.qz.refs.length,
            content:"",
            edit:{
                content:"",
                show_edit_flag:true,
                show_ref_flag:true,
            }
        });
        $scope.qz.refs[$scope.qz.refs.length-1].finished = angular.fromJson(angular.toJson($scope.qz.refs[$scope.qz.refs.length-1].edit));
	};
	//$scope.add_ref();
	//$scope.add_ref();
	//$scope.add_ref();
	
    $scope.show_ref_all = function (){
    	for(var i=0; i<$scope.qz.refs.length; i++){
    		$scope.qz.refs[i].edit.show_ref_flag = true;
    	}
    };
    $scope.close_ref_all = function(){
    	for(var i=0; i<$scope.qz.refs.length; i++){
    		$scope.qz.refs[i].edit.show_ref_flag = false;
    	}
    };
    
    $scope.cancle_edit_ref = function(ref){
    	if(ref.finished != undefined){
    		ref.edit = angular.fromJson(angular.toJson(ref.finished));
    	}
    	ref.edit.show_edit_flag = false;
    };
	
    $scope.enable_edit_ref = function(ref){
    	ref.edit.show_edit_flag = true;
    };
    
    $scope.del_ref = function(order){
    	
    	$scope.modal_title = (order+1)+'번의 참조글을 삭제하시겠습니까?';
        $scope.modal_warning_msg = '해당 참조글을 참조한 문항의 참조 링크는 없어집니다.<br /> 변경되는 참조글 번호에 맞게 문항의 참조 링크는 변경됩니다.';
        $scope.submit_btn_txt = const_str.delete;
        $scope.modal_warning_flag = true;
        
        $scope.submitModal = function() {
	        $scope.qz.refs.splice(order,1);
	    	for(var i=order; i<$scope.qz.refs.length; i++){
	    		$scope.qz.refs[i].order = i;
	    	}
	    	for(var i=order; i<$scope.qz.items.length; i++){
	    		if($scope.qz.items[i].reference == order){
	    			$scope.qz.items[i].reference = -1;
	    		} else if($scope.qz.items[i].reference >= order){
	    			$scope.qz.items[i].reference -= 1;
	    		}
	    		
	    		if($scope.qz.items[i].edit.reference == order){
	    			$scope.qz.items[i].edit.reference = -1;
	    		} else if($scope.qz.items[i].edit.reference >= order){
	    			$scope.qz.items[i].edit.reference -= 1;
	    		}
	    		
	    		if($scope.qz.items[i].finished.reference == order){
	    			$scope.qz.items[i].finished.reference = -1;
	    		} else if($scope.qz.items[i].finished.reference >= order){
	    			$scope.qz.items[i].finished.reference -= 1;
	    		}
	    	}
	    	$scope.showModal = false;
        };
    	$scope.showModal = true; 
    };
    
	$scope.apply_ref = function(ref){
		ref.finished = angular.fromJson(angular.toJson(ref.edit));
        ref.content = ref.edit.content;
        
        ref.edit.show_edit_flag = false;
        setTimeout(function(){
		    MathJax.Hub.Typeset();
		}, 10);
		//MathJax.Hub.Typeset();
	};
});

