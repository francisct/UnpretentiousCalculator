'use strict';


angular
    .module('UnpretentiousCalculator', ['angularCSS', 'cfp.hotkeys'])
    .directive('calculator', calculator)
    .controller('calculatorCtrl', calculatorCtrl);

calculatorCtrl.$inject = ['$scope', 'hotkeys'];


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
}

function calculatorCtrl($scope, hotkeys) {

    hotkeys.add({
        combo: 'enter',
        callback: function (event) {
            event.preventDefault();
            equal();
        }
    });

    //public attributes:
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
    $scope.invalidText = "Input invalid";
    //public functions
    $scope.appendToScreen = appendToScreen;
    $scope.clear = clear;
    $scope.addOperator = addOperator;
    $scope.equal = equal;

    //private attributes:
    var operationStack = [];
    //private functions:
    var printToScreen;
    var verifyStackValidity;
    var isolateLastInput;
    var compute;
    var handleNextStackEncounter;
    var linkStringOperatorToMathematicalOperator;
    var replaceParenthesisByItsValue;
    var getParenthesisContent;
    var enforceOrderOfOperations;
    var addOpeningParenthesisAfterPreviousOperator;
    var addClosingParenthesisBeforeNextOperator;
    var isHighOrderOperator;
    var isOperator;

    /////////////////////////////////////////////////

    //public
    function appendToScreen(value) {
        $scope.screen = $scope.screen + value;
    }

    function clear() {
        $scope.screen = "";
        operationStack = [];
    }

    function addOperator(operator) {

        var lastInput = isolateLastInput();
        if (lastInput) operationStack.push(lastInput);

        operationStack.push(operator);
        appendToScreen(operator);
    }

    function equal() {
        var lastInput = isolateLastInput();
        if (lastInput) operationStack.push(lastInput);

        if (verifyStackValidity(operationStack)) {
            operationStack = enforceOrderOfOperations(operationStack);
            var result = compute(null, $scope.invalidText, operationStack);
            printToScreen(result);
        } else printToScreen($scope.invalidText);
    }

    //private
    printToScreen = function (value) {
        clear();
        $scope.screen = $scope.screen + value;
    }

    verifyStackValidity = function(operationStack){
        for (var i = 0; i < operationStack.length -1; i++){
            var current = operationStack[i];
            var next = operationStack[i+1];
            switch (true){
                //** or ++ or -- or //
                case isOperator(current) && isOperator(next):
                    return false;
                //(+ or (* or (- or (/ or *) or +) or -) or /)
                case (current == $scope.parenthesisLeftValue && isOperator(next)) || next == $scope.parenthesisRightValue && isOperator(current):
                    return false;

            }
        }
        return true;
    }

    isolateLastInput = function () {

        var printBeforeLastNumber = operationStack.join("");
        var lastNumber = $scope.screen.replace(printBeforeLastNumber, "");

        return lastNumber;
    }

    compute = function (pendingOperator, result, operationStack) {
        //recursion end
        if (operationStack.length == 0) return result;
        else return handleNextStackEncounter(pendingOperator, result, operationStack);
    }

    handleNextStackEncounter = function(pendingOperator, result, operationStack){
        var current = operationStack[0];
        //remove current item to be able to use recursion
        operationStack.splice(0, 1);

        switch(true){
            case isOperator(current):
                //if two operators in a row
                if (pendingOperator) return $scope.invalidText;
                pendingOperator = current;
                return compute(pendingOperator, result, operationStack);
            //else if the operator found is a parenthesis, we need to evaluate what is inside
            case current == $scope.parenthesisLeftValue:
                operationStack = replaceParenthesisByItsValue(operationStack);
                //if no right parenthesis was found
                if (!operationStack) return ($scope.invalidText);
                //else a matching parenthesis was found and its value has been replaced inside the operationStack
                else return compute(pendingOperator, result, operationStack);
            //else it is a number
            case pendingOperator != null:
                var currentNumber = parseFloat(current);
                return linkStringOperatorToMathematicalOperator(currentNumber, pendingOperator, result, operationStack);
            //else this number is the first entered. This is the initial case. It will only happen once.
            default:
                var currentNumber = parseFloat(current);
                return compute(null, currentNumber, operationStack);
        }
    }

    linkStringOperatorToMathematicalOperator = function (currentNumber, pendingOperator, result, operationStack) {
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
                return ($scope.invalidText);
        }
    }


    replaceParenthesisByItsValue = function (operationStack) {

        var substack = getParenthesisContent(operationStack);

        if (substack) {
            var numberOfObjectsInsideParenthesis = substack.length;
            var valueInsideParenthesis = compute(null, 0, substack);
            //remove content between parenthesis
            operationStack.splice(0, numberOfObjectsInsideParenthesis);
            //replace right parenthesis by the value found
            operationStack[0] = valueInsideParenthesis;

            return operationStack;
        }
        //right parenthesis was not found
        else return null;

    }

    getParenthesisContent = function (operationStack) {
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
            else if (operationStack[i] == $scope.parenthesisLeftValue) {
                parenthesisEncounter++;
            }
        }
        return null;
    }

    //we can enforce order of operations by adding parenthesis
    enforceOrderOfOperations = function (operationStack) {
        var oldLength, newLength;

        for (var i = 0; i < operationStack.length; i++) {

            //if multiplication or division found, reiterate until previous operator, then add a parenthesis just after.
            if (isHighOrderOperator(operationStack[i])) {

                oldLength = operationStack.length;
                operationStack = addOpeningParenthesisAfterPreviousOperator(i, operationStack);
                newLength = operationStack.length;
                i += newLength - oldLength;

                operationStack = addClosingParenthesisBeforeNextOperator(i, operationStack);
            }
        }

        return operationStack;
    }


    addOpeningParenthesisAfterPreviousOperator = function (i, operationStack) {
        var parenthesisCtr = 0;
        for (var j = i - 1; j >= 0; j--) {

            if (isOperator(operationStack[j]) || j == 0) {
                //if we are at the beginning, push ( in front of the stack
                if (j == 0) {
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

    addClosingParenthesisBeforeNextOperator = function (i, operationStack) {
        var parenthesisCtr = 0;
        for (var j = i + 1; j < operationStack.length; j++) {
            if (isOperator(operationStack[j]) || j == operationStack.length - 1) {
                //if we are at the end,  push ( in the back of the stack
                if (j == operationStack.length - 1) {
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

    isHighOrderOperator = function (current) {
        return (current == $scope.multiplicationValue || current == $scope.divisionValue);
    }

    isOperator = function (current) {
        return (current == $scope.multiplicationValue || current == $scope.divisionValue || current == $scope.additionValue || current == $scope.minusValue);
    }


}

