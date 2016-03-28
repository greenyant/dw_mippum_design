angular.module("makingQZ")
.controller("MakingQZCtrl", function ($scope){
    $scope.const_str = const_str;
    
    
    $scope.open_mpqz_file = function(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            // Entire file
            $scope.qz = angular.fromJson(this.result);
            
            
            
            $scope.$apply();
        };
        reader.readAsText(file);
    }
    
     $scope.open_mpct_file = function(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            // Entire file
            $scope.ct = angular.fromJson(this.result);
            /*
            $scope.select_order = [];
            $scope.selected_contents = [];
            
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
            */
            $scope.$apply();
        };
        reader.readAsText(file);
    }
});