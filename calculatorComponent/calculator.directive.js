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
        $scope.appendToScreen = appendToScreen;
        $scope.clear = clear;
        $scope.addOperator = addOperator;
        $scope.equal = equal;

        /////////////////////////////////////////////////

        //public
        function printToScreen(value) {
            clear();
            $scope.screen = $scope.screen + value;
        }

        function appendToScreen(value) {
            $scope.screen = $scope.screen + value;
        }

        function clear() {
            $scope.screen = "";
            $scope.operationStack = [];
        }

        function addOperator(operator) {

            var lastInput = isolateLastInput();
            if (lastInput) $scope.operationStack.push(lastInput);

            $scope.operationStack.push(operator);
            appendToScreen(operator);
        }

        function equal() {
            var lastInput = isolateLastInput();
            if (lastInput) $scope.operationStack.push(lastInput);

            var result = compute(null, 0, $scope.operationStack);
            printToScreen(result);
        }


        //private
        function isolateLastInput() {

            var printBeforeLastNumber = $scope.operationStack.join("");
            var lastNumber = $scope.screen.replace(printBeforeLastNumber, "");

            return lastNumber;
        }

        function compute(pendingOperator, result, operationStack) {

            if (operationStack.length == 0) {
                return result;
            }
            else {
                var currentNumberOrOperator = operationStack[0];
                var currentNumber = parseFloat(currentNumberOrOperator);
                //remove current item to be able to use recursion
                operationStack.splice(0, 1);

                //if Nan, then it is an operator
                if (isNaN(currentNumber)) {

                    //if the operator found is a parenthesis, we need to evaluate what is inside
                    if (currentNumberOrOperator == $scope.parenthesisLeftValue) {
                        operationStack = replaceParenthesisByItsValue(operationStack);
                        //if no right parenthesis was found
                        if (!operationStack) return ("Input invalid");
                        //else a matching parenthesis was found and its value has been replaced inside the operationStack
                        else return compute(pendingOperator, result, operationStack);
                    }
                    else {
                        pendingOperator = currentNumberOrOperator;
                        return compute(pendingOperator, result, operationStack)
                    }
                }
                //else it is a number
                else if (pendingOperator) {
                    return linkStringOperatorToMathematicalOperator(currentNumber, pendingOperator, result, operationStack);
                }
                //else this number is the first entered. This is the initial case. It will only happen once.
                else {
                    return compute(null, currentNumber, operationStack);
                }

            }
        }

        function linkStringOperatorToMathematicalOperator(currentNumber, pendingOperator, result, operationStack) {
            switch (pendingOperator) {
                case $scope.additionValue:
                    return compute(null, result + currentNumber, operationStack);
                    break;
                case $scope.minusValue:
                    return compute(null, result - currentNumber, operationStack);
                    break;
                case $scope.multiplicationValue:
                    return compute(null, result * currentNumber, operationStack);
                    break;
                case $scope.divisionValue:
                    return compute(null, result / currentNumber, operationStack);
                    break;
                default:
                    clear();
                    return ("Input invalid");
            }
        }


        function replaceParenthesisByItsValue(operationStack) {

            var substack = findNextParenthesis(operationStack);

            if (substack) {
                var numberOfObjectsInsideParenthesis = substack.length;
                var valueInsideParenthesis = compute(null, 0, substack);
                //remove content between parenthesis
                operationStack.splice(0, numberOfObjectsInsideParenthesis);
                //replace right parenthesis by the value found
                operationStack[0] = valueInsideParenthesis;
            }
            //right parenthesis was not found
            else {
                return null;
            }
            return operationStack
        }

        function findNextParenthesis(operationStack) {
            for (var i = 0; i < operationStack.length; i++) {
                if (operationStack[i] == $scope.parenthesisRightValue) {
                    //it means that it was an empty parenthesis : ()
                    if (i == 0) {
                        return null;
                    }
                    else {
                        var substack = operationStack.slice(0, i);
                        return substack;
                    }
                }
            }
            return null;
        }

    }
}