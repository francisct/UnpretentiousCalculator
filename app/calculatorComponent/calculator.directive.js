'use strict';

angular
    .module('UnpretentiousCalculator', ['angularCSS'])
    .directive('calculator', calculator);


function calculator(){
    var directive = {
        restrict: 'E',
        scope: {
            options: '=',
            controls: '=',
            allowScrolling: '='
        },
        templateUrl: "calculatorComponent/calculator.html",
        css: "calculatorComponent/calculator.css",
        link: link
    };

    return directive;

    ///////////////////////////////////////////

    function link($scope, element, attrs){

    }
}