var model = {
    "name" : "성경",
    "level_label" :  [{ 
        "depth" : 0, 
        "name" : "신구약 구분", 
        "mark_type" : "BRPO"
    },{ 
        "depth" : 1, 
        "name" : "경서이름", 
        "mark_type" : "None"
    },{ 
        "depth" : 2, 
        "mark_type" : "None"
    }],

    "contents" : [{ 
        "order" : 0, 
        "name" : "구약성서",

        "sub_contents" : [{
            "order" : 0,
            "name" : "창세기",

            "sub_contents" : [{
                "order":0,
                "name":"제1장",
            },{
                "order":1,
                "name":"제2장",
            },{
                "order":2,
                "name":"제3장",
            }]
        },{
            "order" : 1,
            "name" : "출애굽기",
            "sub_contents" : [{
                "order":0,
                "name":"제1장",
            },{
                "order":1,
                "name":"제2장",
            }]
        }] 
    },{
        "order" : 1, 
        "name" : "신약성서",

        "sub_contents" : [{
            "order" : 0,
            "name" : "마태복음",
            "sub_contents" : [{
                "order":0,
                "name":"제1장",
            },{
                "order":1,
                "name":"제2장",
            }]
        },{
            "order" : 1,
            "name" : "마가복음",
            "sub_contents" : [{
                "order":0,
                "name":"제1장",
            },{
                "order":1,
                "name":"제2장",
            },{
                "order":2,
                "name":"제3장",
            },{
                "order":3,
                "name":"제4장",
            }]
        }] 
    }]
};
        
        

angular.module("makingCT")
.controller("MakingCTCtrl", function ($scope, $http){
                        
			$scope.ct = model;
            $scope.mark_types = mark_types;
            $scope.classifications = classifications;
            
			$scope.level_candidates = [1,2,3,4,5,6,7];
			//$scope.level_length = model.level_label.length;
            $scope.select_order = [];
            $scope.selected_contents = [];
            
            
            for(var i=0; i<model.level_label.length; i++){
                if(i==0){
                    var selected_one = model.contents;
                    $scope.select_order.push(0);
                    //selected_one = model.contents;
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
            
            $scope.change_ct_select = function (depth){
                if(depth < $scope.ct.level_label.length-1){
                    $scope.selected_contents[depth+1] = $scope.selected_contents[depth][Number($scope.select_order[depth])].sub_contents;
                    $scope.change_ct_select(depth+1);
                }
                
            }
            
            $scope.showModal = false;
            $scope.modal_title ="dummy";
            $scope.modal_warning_flag = false;
            $scope.submitModal = function(){
                console.log("submit");
            };
            $scope.modal_warning_msg="waring msg";
            
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
                    }
                    
                }
                if(depth < $scope.ct.level_label.length){
                    $scope.modal_title ="레벨 수를 "+ depth +"개로 줄이시겠습니까?";
                    $scope.modal_warning_msg = depth + "레벨 이상의 카테고리는 삭제됩니다.";
                    $scope.submit_btn_txt = "삭제";
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
                    }
                    
                    $scope.showModal = true;
                }
            }
            
            $scope.change_class = function(depth, type, text){
                console.log(depth, type, text);
                if(type == 'None'){
                    $scope.ct.level_label[depth].name = undefined;
                } else if(type == 'etc'){
                    $scope.modal_title ="분류 제목을 입력하십시오.";
                    $scope.submit_btn_txt = "확인";
                    $scope.modal_warning_flag = false;
                    $scope.changed_depth = depth;
                    //$scope.modal_input = "";
                    $("#modal_input").val(""); //fix me
                    
                    $scope.submitModal = function() {
                        $scope.ct.level_label[$scope.changed_depth].name = $("#modal_input").val(); //fix me
                        $scope.showModal = false;
                    }
                    $scope.showModal = true;
                    
                } else {
                    $scope.ct.level_label[depth].name = text;
                }
            }
            
            $scope.change_marktype = function (depth, mark_type) {
                $scope.ct.level_label[depth].mark_type = mark_type;
                
                if(mark_type == 'NOOR'){
                    $scope.modal_title ="기호를 입력하십시오.";
                    $scope.submit_btn_txt = "확인";
                    $scope.modal_warning_flag = false;
                    $scope.changed_depth = depth;
                    //$scope.modal_input = "";
                    $("#modal_input").val(""); //fix me
                    
                    $scope.submitModal = function() {
                        $scope.ct.level_label[$scope.changed_depth].mark_example = $("#modal_input").val(); //fix me
                        $scope.ct.level_label[$scope.changed_depth].mark_text = $("#modal_input").val(); //fix me
                        $scope.showModal = false;
                    }
                    $scope.showModal = true;
                } else {
                    for(var i=0; i<$scope.mark_types.length; i++) {
                        if($scope.mark_types[i].keyword == mark_type) {
                            $scope.ct.level_label[depth].mark_example = $scope.mark_types[i].example;
                            return;
                        }
                    }
                }
            }
            
            
		});