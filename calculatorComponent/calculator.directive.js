'use strict';

angular
    .module('UnpretentiousCalculator', ['angularCSS'])
    .directive('calculator', calculator);


function calculator() {
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

    function link($scope, element, attrs) {

        $scope.parenthesisLeftValue = '(';
        $scope.parenthesisRightValue = ')';
        $scope.clearValue = 'C';
        $scope.divisionValue = '/';
        $scope.multiplicationValue = 'x';
        $scope.minusValue = '-';
        $scope.additionValue = '+';
        $scope.dotValue = '.';
        $scope.equalValue = '=';
        $scope.zeroValue = '0';
        $scope.oneValue = '1';
        $scope.twoValue = '2';
        $scope.threeValue = '3';
        $scope.fourValue = '4';
        $scope.fiveValue = '5';
        $scope.sixValue = '6';
        $scope.sevenValue = '7';
        $scope.eightValue = '8';
        $scope.nineValue = '9';

        $scope.screen = "";
        $scope.operationStack = [];

        $scope.printToScreen = printToScreen;
        $scope.clear = clear;
        $scope.addOperator = addOperator;
        $scope.equal = equal;

        /////////////////////////////////////////////////

        //public
        function printToScreen(value) {
            $scope.screen = $scope.screen + value;
        }

        function clear() {
            $scope.screen = "";
            $scope.operationStack = [];
        }

        function addOperator(operator) {

            var lastNumber = isolateLastNumber();

            $scope.operationStack.push(lastNumber);
            $scope.operationStack.push(operator);
            printToScreen(operator);
        }

        function equal() {
            var lastNumber = isolateLastNumber();
            $scope.operationStack.push(lastNumber);

            var result = compute(null, 0);
            clear();
            printToScreen(result);
        }


        //private
        function isolateLastNumber() {

            var printBeforeLastNumber = $scope.operationStack.join("");
            var lastNumber = $scope.screen.replace(printBeforeLastNumber, "");

            return lastNumber;
        }

        function compute(pendingOperator, result) {

            if ($scope.operationStack.length == 0) {
                return result;
            }
            else {
                var currentNumber = parseFloat($scope.operationStack[0]);

                //if Nan, then it is an operator
                if (isNaN(currentNumber)) {
                    pendingOperator = $scope.operationStack[0];
                    //remove current item to be able to use recursion
                    $scope.operationStack.splice(0, 1);
                    return compute(pendingOperator, result)
                }
                else {
                    //remove current item to be able to use recursion
                    $scope.operationStack.splice(0, 1);

                    if (pendingOperator) {
                        switch (pendingOperator) {
                            case $scope.additionValue:
                                return compute(null, result + currentNumber);
                                break;
                            case $scope.minusValue:
                                return compute(null, result - currentNumber);
                                break;
                            case $scope.multiplicationValue:
                                return compute(null, result * currentNumber);
                                break;
                            case $scope.divisionValue:
                                return compute(null, result / currentNumber);
                                break;
                            default:
                                clear();
                                printToScreen("Input invalid");
                        }
                    }
                    //this is the initial case. It will only happen once.
                    else {
                        return compute(null, currentNumber);
                    }
                }
            }
        }


    }
}