// JavaScript Document
angular.module("solve_quiz")
	.controller("jsonTextNabvarCtrl", function Ctrl($scope, quiz){
		$scope.name = "file";
	});
	
angular.module("solve_quiz")
	.controller("jsonTextCtrl", function Ctrl($scope, quiz){
		/*
		$scope.clickGetQuizJsonBtn = function(){
			
			//$http.get("quiz_ex_simple.json").success(function(data){
				//var jsonString = angular.toJson(data);
				//$scope.quiz = angular.fromJson(jsonString);
				
				quiz.quizData = $scope.quiz;
				
				$scope.quiz_json = JSON.stringify($scope.quiz, null, 4);
				$scope.err_msg_apply_quiz_json = "";
			//});
			//console.log($scope.quiz);
			
		};*/
		$scope.clickApplyQuizJsonBtn = function(){
			try { 
				$scope.quiz = JSON.parse($scope.quiz_json); 
				$scope.err_msg_apply_quiz_json = "";
				quiz.quizData = $scope.quiz;
				location.replace("#/solving");
			} 
			catch (e) { 
				console.log(e); 
				//test_dat =e;
				$scope.err_msg_apply_quiz_json = "Error!";
			}
		};
		
	});