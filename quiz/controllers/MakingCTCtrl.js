angular.module("makingCT")
.controller("MakingCTCtrl", function ($scope, $http){
    $scope.const_str = const_str;
    $scope.mark_types = mark_types;

    $scope.classifications = classifications;
    $scope.level_candidates = [1,2,3,4,5,6,7];
    
    $scope.ct = {
        "name":"",
        "level_label":[{
            "depth":0,
            "name":"",
            "mark_type":"None",
            "mark_example":"없음"
        }],
        "contents":[]
    };
            
    $scope.select_order = [];
    $scope.selected_contents = [];
    
            
    
    $scope.open_mpct_file = function(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            // Entire file
            $scope.ct = angular.fromJson(this.result);
            
            $scope.select_order = [];
            $scope.selected_contents = [];
            
            //$scope.download_flag = true;
            //var text = 'helo';
            //$scope.down_dat = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify($scope.ct, null, 4));

            for(var i=0; i<$scope.ct.level_label.length; i++){
                if(i==0){
                    var selected_one = $scope.ct.contents;
                    $scope.select_order.push(0);
                    $scope.selected_contents.push(selected_one);
                } else {
                    var selected_one = selected_one[$scope.select_order[i-1]].sub_contents;
                    $scope.select_order.push(0);
                    $scope.selected_contents.push(selected_one);
                }
                for(var j=0; j<$scope.mark_types.length; j++){
                    if($scope.mark_types[j].keyword == $scope.ct.level_label[i].mark_type){
                        $scope.ct.level_label[i].mark_example = $scope.mark_types[j].example;
                    }
                }
            }
            $scope.$apply();
        };
        reader.readAsText(file);
    };
    $scope.down_mpct_file = function(){
    	if($scope.ct.name.length == 0) {
    		download($scope.down_dat = angular.toJson($scope.ct, true),"empty.mpct", "text/plain");
    	} else {
    		download($scope.down_dat = angular.toJson($scope.ct, true),$scope.ct.name+".mpct", "text/plain");
    	}
        
    };
    
    $scope.showModal = false;
    $scope.modal_title ="dummy";
    $scope.modal_warning_flag = false;
    $scope.submitModal = function(){
        console.log("submit");
    };
    $scope.modal_warning_msg="waring msg";

    $scope.change_ct_select = function (depth){
        //test_dat = $scope.select_order;
        for(var i=depth+1; i<$scope.select_order.length; i++){
            $scope.select_order[i] = 0;
        }
        //test_dat = $scope.select_order[depth];
        //console.log($scope.selected_contents[depth][$scope.select_order[depth]]);
        if($scope.selected_contents[depth][$scope.select_order[depth]].sub_contents == undefined) {
            for(var i=depth+1;i<$scope.ct.level_label.length; i++){
                $scope.selected_contents[i] = [];
            }
        }else if(depth < $scope.ct.level_label.length-1){
            $scope.selected_contents[depth+1] = $scope.selected_contents[depth][$scope.select_order[depth]].sub_contents;
            $scope.change_ct_select(depth+1);
        }

    };
    
    function make_selected_contents_from_select_order () { 
    	$scope.selected_contents = [];
    	var selected_one = $scope.ct.contents;
    	for(var i=0; i<$scope.select_order.length; i++){
            if(i==0){
                //var selected_one = $scope.ct.contents;
                $scope.selected_contents.push(selected_one);
            } else {
            	if(selected_one[$scope.select_order[i-1]] != undefined){
            		selected_one = selected_one[$scope.select_order[i-1]].sub_contents;
                	$scope.selected_contents.push(selected_one);
            	}
            }
        }
    }
    function add_ct_by_depth(depth, ct) {
    	//console.log($scope.selected_contents[depth]);
    	if(depth > 0 && $scope.selected_contents[depth-1][$scope.select_order[depth-1]].sub_contents === undefined){
            $scope.selected_contents[depth-1][$scope.select_order[depth-1]].sub_contents = [];
            $scope.selected_contents[depth] = $scope.selected_contents[depth-1][$scope.select_order[depth-1]].sub_contents;
            ct.order = $scope.selected_contents[depth].length;
            $scope.selected_contents[depth].push(ct);
        } else if(depth == 0 && $scope.selected_contents[depth] == undefined){
        	//console.log("low");
            $scope.selected_contents[depth] = [];
            ct.order = $scope.selected_contents[depth].length;
            $scope.ct.contents.push(ct);
            $scope.selected_contents[depth] = $scope.ct.contents;
        } else if(depth == 0) {
        	ct.order = $scope.selected_contents[depth].length;
            $scope.ct.contents.push(ct);
            $scope.selected_contents[depth] = $scope.ct.contents;
        } else {
        	ct.order = $scope.selected_contents[depth].length;
            $scope.selected_contents[depth].push(ct);
        }
        $scope.select_order[depth] = ct.order;
        //make_selected_contents_from_select_order();
    }
    $scope.add_ct_select = function (depth) {
        $scope.modal_title = const_str.add_ct_modal_title;
        $scope.submit_btn_txt = const_str.okay;
        $scope.modal_warning_flag = false;
        $scope.changed_depth = depth;
        $scope.modal_input = "";

        $scope.submitModal = function() {
        	var new_ct = {
                "order":"",
                "name":$scope.modal_input
           	};
        	add_ct_by_depth($scope.changed_depth, new_ct);
            
            $scope.showModal = false;
        };
        $scope.showModal = true;
    };
    $scope.modify_ct_select = function(depth) {
        $scope.modal_title = const_str.modify_ct_modal_title;
        $scope.submit_btn_txt = const_str.okay;
        $scope.modal_warning_flag = false;
        $scope.changed_depth = depth;
        $scope.modal_input = "";
        $scope.submitModal = function() {
            $scope.selected_contents[$scope.changed_depth][$scope.select_order[$scope.changed_depth]].name = $scope.modal_input;

            $scope.showModal = false;
        };
        $scope.showModal = true;
    };

	function del_ct_by_depth(depth) {
		var deleted_ct = $scope.selected_contents[depth].splice($scope.select_order[depth], 1);

		if($scope.selected_contents[depth].length == 0 && depth > 0) {
			delete $scope.selected_contents[depth-1][$scope.select_order[depth-1]].sub_contents;
		}
        for(var i=$scope.select_order[depth]; i<$scope.selected_contents[depth].length;i++) {
            $scope.selected_contents[depth][i].order = i;
        }

        for(var i=depth; i<$scope.select_order.length; i++){
            $scope.select_order[i] = undefined;
            if (i != depth) $scope.selected_contents[i] = [];
        }
        return deleted_ct;
	}
	
    $scope.del_ct_select = function(depth){
        $scope.modal_title = const_str.del_ct_modal_title;
        $scope.modal_warning_msg = const_str.del_ct_warning_msg;
        $scope.submit_btn_txt = const_str.delete;
        $scope.modal_warning_flag = true;
        $scope.changed_depth = depth;

        $scope.submitModal = function() {
        	del_ct_by_depth($scope.changed_depth);
        	
            $scope.showModal = false;
        };
        $scope.showModal = true;
    };

    $scope.change_depth = function(depth){
        //roots = $scope.ct.contents;
        if(depth > $scope.ct.level_label.length){
            for(var i=$scope.ct.level_label.length; i<depth; i++){
                $scope.ct.level_label.push({
                    "depth":i, "name":"", 
                    "mark_type":mark_types[0].keyword, 
                    "mark_example":mark_types[0].example
                });
                $scope.select_order.push(0);
                $scope.selected_contents.push([]);

                //$scope.change_ct_select(0); //for update;
            }

        }
        //console.log(depth);
        //console.log($scope.ct.level_label.length);
        if(depth < $scope.ct.level_label.length){
            $scope.modal_title = const_str.change_depth_modal_title.replace('{d}',depth);
            $scope.modal_warning_msg = const_str.change_depth_warning_msg.replace('{d}',depth+1);
            $scope.submit_btn_txt = const_str.delete;
            $scope.modal_warning_flag = true;
            $scope.changed_depth = depth;

            $scope.submitModal = function() {
                var nodes = $scope.ct.contents;
                for(var i=0;i<$scope.changed_depth-1; i++ ){
                    var next_nodes = [];
                    for (var j=0; j<nodes.length; j++){
                        if(nodes[j].sub_contents != undefined){
                            //console.log(nodes[j].sub_contents);
                            for(var k=0; k<nodes[j].sub_contents.length;k++){
                                next_nodes.push(nodes[j].sub_contents[k]);
                            }
                        }
                    }
                    nodes = next_nodes;
                }
                //test_dat = nodes;
                for (var i=0; i<nodes.length; i++){
                    nodes[i].sub_contents = undefined;
                }

                $scope.ct.level_label = $scope.ct.level_label.slice(0,$scope.changed_depth);
                $scope.select_order = $scope.select_order.slice(0,$scope.changed_depth);

                $scope.showModal = false;
            };

            $scope.showModal = true;
        }
        //test_dat = $scope.selected_contents;
    };

    $scope.change_class = function(depth, type, text){
        //console.log(depth, type, text);
        if(type == 'None'){
            $scope.ct.level_label[depth].name = undefined;
        } else if(type == 'etc'){
            $scope.modal_title = const_str.change_class_modal_title;
            $scope.submit_btn_txt = const_str.okay;
            $scope.modal_warning_flag = false;
            $scope.changed_depth = depth;
            $scope.modal_input = "";



            $scope.submitModal = function() {

                $scope.ct.level_label[$scope.changed_depth].name = $scope.modal_input;
                $scope.showModal = false;
            };
            $scope.showModal = true;

        } else {
            $scope.ct.level_label[depth].name = text;
        }
    };

    $scope.change_marktype = function (depth, mark_type) {
        $scope.ct.level_label[depth].mark_type = mark_type;

        if(mark_type == 'NOOR'){
            $scope.modal_title = const_str.change_marktype_modal_title;
            $scope.submit_btn_txt = const_str.okay;
            $scope.modal_warning_flag = false;
            $scope.changed_depth = depth;
            $scope.modal_input = "";


            $scope.submitModal = function() {
                $scope.ct.level_label[$scope.changed_depth].mark_example = $scope.modal_input;
                $scope.ct.level_label[$scope.changed_depth].mark_text = $scope.modal_input;
                $scope.showModal = false;
            };
            $scope.showModal = true;
        } else {
            for(var i=0; i<$scope.mark_types.length; i++) {
                if($scope.mark_types[i].keyword == mark_type) {
                    $scope.ct.level_label[depth].mark_example = $scope.mark_types[i].example;
                    return;
                }
            }
        }
    };

    $scope.change_order_up = function(depth) {
        if($scope.select_order[depth] > 0 ){
            var tmp;
            var from = $scope.selected_contents[depth][$scope.select_order[depth]];
            var to = $scope.selected_contents[depth][$scope.select_order[depth]-1];

            tmp = from.name;
            from.name = to.name;
            to.name = tmp;

            tmp = from.sub_contents;
            from.sub_contents = to.sub_contents;
            to.sub_contents = tmp;

            $scope.select_order[depth] -= 1;
        }         
    };

    $scope.change_order_down = function(depth) {
        if($scope.select_order[depth] < $scope.selected_contents[depth].length-1 ){
            var tmp;
            var from = $scope.selected_contents[depth][$scope.select_order[depth]];
            var to = $scope.selected_contents[depth][$scope.select_order[depth]-1+2];

            tmp = from.name;
            from.name = to.name;
            to.name = tmp;

            tmp = from.sub_contents;
            from.sub_contents = to.sub_contents;
            to.sub_contents = tmp;

            $scope.select_order[depth] = $scope.select_order[depth]-1+2;
        }         
    };
    
    $scope.change_order_left = function(depth) {
    	//console.log(depth);
    	if(depth == 0) return;
    	var tmp = del_ct_by_depth(depth);
    	//console.log(tmp);
    	add_ct_by_depth(depth-1, tmp[0]);
    };
    
    $scope.change_order_right = function(depth) {
    	//console.log(depth);
    	//console.log($scope.ct.level_label.length);
    	var order = $scope.select_order[depth];
    	
    	if(depth == $scope.ct.level_label.length-1) return;
    	if(order <= 0) return;
    	var tmp = del_ct_by_depth(depth);
    	
    	order -= 1;
    	$scope.select_order[depth] = order;
    	add_ct_by_depth(depth+1, tmp[0]);
    };
});