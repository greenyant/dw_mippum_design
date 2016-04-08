// JavaScript Document
window.params = function(){
    var params = {};
    if(window.location.href.indexOf('?') == -1){
        return params;
    }
    var param_array = window.location.href.split('?')[1].split('&');
    for(var i in param_array){
        x = param_array[i].split('=');
        params[x[0]] = x[1];
    }
    return params;
}();

angular.module("solve_quiz")
	.controller("mpqzFileNabvarCtrl", function Ctrl($scope, quiz){
		$scope.name = const_str_mpqzfile.input_text;
	});
angular.module("solve_quiz")
	.controller("mpqzFileCtrl", function Ctrl($scope, $http, quiz){
		//ex : uri=dat_files/sample_M3.mpqz
		if(window.params.uri != undefined){
			$http.get(window.params.uri).success(function(data){
				
				//console.log(data);
				$scope.quiz  = data;
				$scope.err_msg_apply_quiz_json = "";
				quiz.quizData = $scope.quiz;
				location.replace("#/solving");
			});
		}
		
		$scope.clickApplyQuizJsonBtn = function(){
			try { 
				
				$scope.quiz = JSON.parse($scope.quiz_json); 
				$scope.err_msg_apply_quiz_json = "";
				quiz.quizData = $scope.quiz;
				location.replace("#/solving");
			} 
			catch (e) { 
				console.log(e); 
				$scope.err_msg_apply_quiz_json = "Error!";
			}
		};
		
	});