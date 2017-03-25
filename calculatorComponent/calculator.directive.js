'use strict';

var invalidText = "Input invalid";

angular
    .module('UnpretentiousCalculator', ['angularCSS'])
    .directive('calculator', calculator);


function calculator() {
    var directive = {
        restrict: 'E',
        scope: {
            test: "="
        },
        templateUrl: "calculatorComponent/calculator.html",
        css: "calculatorComponent/calculator.css",
        controller: calculatorCtrl
    };

    return directive;

    ///////////////////////////////////////////

    function calculatorCtrl($scope){
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

            $scope.operationStack = enforceOrderOfOperations($scope.operationStack);
            var result = compute(null, invalidText, $scope.operationStack);
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
                        if (!operationStack) return (invalidText);
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
                    return (invalidText);
            }
        }


        function replaceParenthesisByItsValue(operationStack) {

            var substack = findMatchingParenthesis(operationStack);

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

        function findMatchingParenthesis(operationStack) {
            //the purpose of parenthesisEncounter variable is to find the matching parenthesis and not just any right parenthesis
            var parenthesisEncounter = 0;
            for (var i = 0; i < operationStack.length; i++) {
                if (operationStack[i] == $scope.parenthesisRightValue) {
                    //it means that it was an empty parenthesis : ()
                    if (i == 0) {
                        return null;
                    }
                    else {
                        if (parenthesisEncounter == 0) {
                            var substack = operationStack.slice(0, i);
                            return substack;
                        }
                        else parenthesisEncounter--;
                    }
                }
                //if we encounter another left parenthesis
                else if (operationStack[i] == $scope.parenthesisLeftValue){
                    parenthesisEncounter++;
                }
            }
            return null;
        }

        function enforceOrderOfOperations(operationStack){
            var oldLength, newLength;
               //we can enforce order of operations by adding parenthesis
            for (var i = 0; i < operationStack.length; i++){

                //if multiplication or division found, reiterate until previous operator, then add a parenthesis just after.
                if (isHighOrderOperator(operationStack[i])){

                    oldLength = operationStack.length;
                    operationStack = addOpeningParenthesisAfterPreviousOperator(i, operationStack);
                    newLength = operationStack.length;
                    i += newLength - oldLength;

                    operationStack = addClosingParenthesisAfterNextNumber(i, operationStack);
                }
            }

            return operationStack;
        }


        function addOpeningParenthesisAfterPreviousOperator(i, operationStack){
            var parenthesisCtr = 0;
            for (var j = i-1; j >= 0; j--){

                if (isOperator(operationStack[j]) || j == 0){
                    //if we are at the beginning, push ( in front of the stack
                    if (j == 0){
                         operationStack.unshift($scope.parenthesisLeftValue);
                         break;
                    }
                    else if (parenthesisCtr == 0) {
                        operationStack.splice(j + 1, 0, $scope.parenthesisLeftValue);
                        break;
                    }
                }
                else if (operationStack[j] == $scope.parenthesisRightValue) parenthesisCtr++;
                else if (operationStack[j] == $scope.parenthesisLeftValue) parenthesisCtr--;
            }

            return operationStack;
        }

        function addClosingParenthesisAfterNextNumber(i, operationStack){
            var parenthesisCtr = 0;
            for (var j = i+1; j < operationStack.length; j++){
                if (isOperator(operationStack[j]) || j == operationStack.length-1){
                    //if we are at the end,  push ( in the back of the stack
                    if (j == operationStack.length-1) {
                        operationStack.push($scope.parenthesisRightValue);
                        break;
                    }
                    else if (parenthesisCtr == 0) {
                        operationStack.splice(j - 1, 0, $scope.parenthesisRightValue);
                        break;
                    }
                }
                else if (operationStack[j] == $scope.parenthesisLeftValue) parenthesisCtr++;
                else if (operationStack[j] == $scope.parenthesisRightValue) parenthesisCtr--;
            }

            return operationStack;
        }

        function isHighOrderOperator(current){
            return (current == $scope.multiplicationValue || current == $scope.divisionValue);
        }

        function isOperator(current){
            return (current == $scope.multiplicationValue || current == $scope.divisionValue || current == $scope.additionValue || current == $scope.minusValue);
        }


    }
    }

