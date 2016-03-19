// JavaScript Document
angular.module("solve_quiz")
	.controller("mpqzFileNabvarCtrl", function Ctrl($scope, quiz){
		$scope.name = const_str_mpqzfile.input_text;
	});
	
angular.module("solve_quiz")
	.controller("mpqzFileCtrl", function Ctrl($scope, quiz){
		
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