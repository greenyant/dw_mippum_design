// JavaScript Document
angular.module("quiz", [])
	.factory("quiz", function(){
		var quizData = {};
		
		return {
			getQuiz:function(){
				return quizData;
			}
		};
	});