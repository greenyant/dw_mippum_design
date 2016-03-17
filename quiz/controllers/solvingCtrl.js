// JavaScript Document
angular.module("solve_quiz")
	.controller("solvingCtrl", function Ctrl($scope, $sce, $http, quiz){
		$scope.quiz = quiz.quizData;
		
		function reset(){
			$scope.response = "";
			$scope.response_flag = false;
			$scope.ans_show_flag = false;
			$scope.ans_btn_show_str = $scope.const_str.btn_show_str[0];
			$scope.sol_show_flag = false;
			$scope.sol_btn_show_str = $scope.const_str.btn_show_str[0];
		};
		
		$scope.const_str = const_str;
		reset();
		$scope.makePointStr = function(point){
			return $scope.const_str.point_str.replace('{p}', point);
		}
		$scope.trustAsHtml = $sce.trustAsHtml;
		
		$scope.index = 5;
		/*
		$http.get("quiz_ex_simple.json").success(function(data){
			var jsonString = angular.toJson(data);
			$scope.quiz = angular.fromJson(jsonString);
		});*/
		
		$scope.selectResponse = function(choice_order) {
			$scope.response = choice_order;
		}
		$scope.clickSubmit = function(){
			$scope.response_flag = true;
		}
		$scope.clickShowAns = function(){
			$scope.ans_show_flag = !$scope.ans_show_flag;
			if($scope.ans_show_flag){
				$scope.ans_btn_show_str = $scope.const_str.btn_show_str[1];
			} else {
				$scope.ans_btn_show_str = $scope.const_str.btn_show_str[0];
			}
		}
		$scope.clickShowSol = function(){
			$scope.sol_show_flag = !$scope.sol_show_flag;
			if($scope.sol_show_flag){
				$scope.sol_btn_show_str = $scope.const_str.btn_show_str[1];
			} else {
				$scope.sol_btn_show_str = $scope.const_str.btn_show_str[0];
			}
		}
		$scope.clickNextBtn = function(){
			$scope.index += 1;
			reset();
		}
		$scope.clickPrevBtn = function(){
			$scope.index -= 1;
			reset();
		}
	});