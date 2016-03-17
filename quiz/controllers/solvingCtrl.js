// JavaScript Document
angular.module("solve_quiz")
	.controller("solvingNabvarCtrl", function Ctrl($scope, quiz){
		//console.log(quiz.quizData);
		if(quiz.quizData != undefined){
			$scope.name = quiz.quizData.name;
		}
	});
angular.module("solve_quiz")
	.controller("solvingCtrl", function Ctrl($scope, $sce, $http, quiz){
		if(quiz.quizData == undefined){
			location.replace("#");
			return;
		}
		$scope.quiz = quiz.quizData;
		if($scope.quiz.usr_index == undefined) {
			$scope.quiz.usr_index = 0;
		}
		
		$scope.const_str = const_str_solving;
		
		function reset(){
			$scope.response = "";
			
			//$scope.quiz.items[$scope.quiz.usr_index].response
			//if($scope.quiz.items[$scope.quiz.usr_index].response == undefined){
			//	$scope.response_flag = false;
			//} else {
			//	$scope.response_flag = true;
			//}
			
			if ($scope.quiz.items[$scope.quiz.usr_index].complete_flag == undefined){
				$scope.quiz.items[$scope.quiz.usr_index].complete_flag =false;
			}
			
			$scope.ans_show_flag = false;
			$scope.ans_btn_show_str = $scope.const_str.btn_show_str[0];
			$scope.sol_show_flag = false;
			$scope.sol_btn_show_str = $scope.const_str.btn_show_str[0];
		};
		reset();
		
		$scope.makePointStr = function(point){
			return $scope.const_str.point_str.replace('{p}', point);
		};
		$scope.trustAsHtml = $sce.trustAsHtml;
		
		
		/*
		$http.get("quiz_ex_simple.json").success(function(data){
			var jsonString = angular.toJson(data);
			$scope.quiz = angular.fromJson(jsonString);
		});*/
		
		$scope.selectResponse = function(choice_order) {
			$scope.response = choice_order;
			$scope.quiz.items[$scope.quiz.usr_index].response = choice_order;
		};
		$scope.clickSubmit = function(){
			//$scope.response_flag = true;
			$scope.quiz.items[$scope.quiz.usr_index].complete_flag = true;
		};
		$scope.clickShowAns = function(){
			$scope.ans_show_flag = !$scope.ans_show_flag;
			if($scope.ans_show_flag){
				$scope.ans_btn_show_str = $scope.const_str.btn_show_str[1];
			} else {
				$scope.ans_btn_show_str = $scope.const_str.btn_show_str[0];
			}
		};
		$scope.clickShowSol = function(){
			$scope.sol_show_flag = !$scope.sol_show_flag;
			if($scope.sol_show_flag){
				$scope.sol_btn_show_str = $scope.const_str.btn_show_str[1];
			} else {
				$scope.sol_btn_show_str = $scope.const_str.btn_show_str[0];
			}
		};
		$scope.clickNextBtn = function(){
			$scope.quiz.usr_index += 1;
			reset();
		};
		$scope.clickPrevBtn = function(){
			$scope.quiz.usr_index -= 1;
			reset();
		};
	});