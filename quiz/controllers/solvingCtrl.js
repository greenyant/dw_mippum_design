// JavaScript Document
angular.module("solve_quiz")
	.config( [
	    '$compileProvider',
	    function( $compileProvider )
	    {   
	        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/);
	        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
	    }
	])
	.controller("solvingNabvarCtrl", function Ctrl($scope, quiz){
		//console.log(quiz.quizData);
		if(quiz.quizData != undefined){
			$scope.name = quiz.quizData.name;
		}
		$scope.download_flag = true;
		//var text = 'helo';
		$scope.down_dat = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(quiz.quizData, null, 4));
		
		
	});
angular.module("solve_quiz")
	.controller("solvingCtrl", function Ctrl($scope, $sce, $http, quiz){
		if(quiz.quizData == undefined){
			location.replace("#");
			return;
		}
		$scope.quiz = quiz.quizData;

		
		
		if($scope.quiz.using_math_flag){
			var script = document.createElement('script');
			var head = document.getElementsByTagName("head")[0], script;
			script = document.createElement("script");
			script.type = "text/x-mathjax-config";
			script[(window.opera ? "innerHTML" : "text")] =
				'MathJax.Hub.Config({'+
				'	jax: ["input/TeX", "output/SVG"],'+
				'	tex2jax: {'+
				"		inlineMath: [['$','$']],"+
				"		displayMath: [ ['$$','$$']],"+
				'		processEscapes: true,'+
				'		processEnvironments: true,'+
				'		ignoreClass: "no-mathjax",'+
				'		processClass: "mathjax",'+
				'		preview: "TeX"'+
				'	},'+
				'	"HTML-CSS": { '+
				'		availableFonts: ["STIX", "TeX"],'+
				'		webFont: null '+
				'	},'+
				'	"SVG": {'+
				'		availableFonts: ["TeX"],'+
				'		blacker: 0,'+
				'		scale: 90'+
				'	},'+
				'	showMathMenu: false'+
				'});';
			head.appendChild(script);
			script = document.createElement("script");
			script.type = "text/javascript";
			script.src = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG-full';
			
			//script.onload = function (){
			//	console.log((window.unsafeWindow == null ? window : unsafeWindow).MathJax);
			//}
			
			head.appendChild(script);
			
			//Mathjax = (window.unsafeWindow == null ? window : unsafeWindow).MathJax;
			//console.log((window.unsafeWindow == null ? window : unsafeWindow).MathJax);
			//console.log(Mathjax);
		}		
		
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
			
			if(typeof(MathJax)!== 'undefined' && $scope.quiz.using_math_flag) setTimeout(function(){ MathJax.Hub.Typeset();}, 10);
			//if(typeof(MathJax)!== 'undefined') console.log(MathJax);
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
			var item = $scope.quiz.items[$scope.quiz.usr_index];
			if(item.answerType=='choiceMulti'){
				if(item.choices[choice_order].response == undefined)
					item.choices[choice_order].response = false;
				item.choices[choice_order].response = !item.choices[choice_order].response; 
				//console.log(item.choices[choice_order]);
				item.response = [];
				for(var i=0; i<item.choices.length;i++){
					if(item.choices[i].response) item.response.push(i);
				}
				if(JSON.stringify(item.answer) == JSON.stringify(item.response))
					item.response = item.answer;
			} else {
				$scope.response = choice_order;
				item.response = choice_order;
			}
		};
		$scope.clickSubmit = function(){
			var item = $scope.quiz.items[$scope.quiz.usr_index];
			//$scope.response_flag = true;
			item.complete_flag = true;
			
			if(item.answerType=='choiceMulti'){
				item.answerText = "";
				for(var i=0; i<item.answer.length;i++){
					item.answerText += item.choices[item.answer[i]].value;
					if(i != item.answer.length -1) {
						if(item.numOfChoicesEachRow == 1) item.answerText += '<br />';
						else item.answerText += ', ';
					}
				}
			} else if(item.answerType=='choiceOne'){
				item.answerText = item.choices[item.answer].value;
			}
			if(typeof(MathJax)!== 'undefined' && $scope.quiz.using_math_flag) {
				setTimeout(function(){ MathJax.Hub.Typeset();}, 10);
			}
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
		//console.log($scope.quiz);
		//if($scope.quiz.using_math_flag) setTimeout(function(){ MathJax.Hub.Typeset();}, 10);
		
	});