'use strict';

describe('UnpretentiousCalculator.calculator module', function() {
  beforeEach(angular.mock.module('UnpretentiousCalculator'));

    var el, $scope, scope, compile;

    var validHTML = '<calculator test="salut"></calculator>';

  beforeEach(angular.mock.module('calculatorComponent/calculator.html'));

    beforeEach(inject(function($rootScope, $compile) {

        $scope = $rootScope.$new();
        compile = $compile;
    }));

    function create(){
        var elem;
        elem = angular.element(validHTML);
        $scope.screen = "salut";
        compile(elem)($scope);
        $scope.$digest();
        return elem;
    }


      it('should do the addition for the boundary values entered', function () {
          el = create();
          scope = el.isolateScope();
          scope.appendToScreen(scope.zeroValue);
          scope.addOperator(scope.additionValue);
          scope.appendToScreen(scope.zeroValue);
          scope.equal();

          expect(scope.screen).toEqual((0 + 0).toString());

          el = create();
          scope = el.isolateScope();
          scope.appendToScreen('1000');
          scope.addOperator(scope.additionValue);
          scope.appendToScreen('1000');
          scope.equal();

          expect(scope.screen).toEqual((1000 + 1000).toString());
      });

    it('should do the multiplication for the boundary values entered', function () {
        el = create();
        scope = el.isolateScope();
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.multiplicationValue);
        scope.appendToScreen(scope.zeroValue);
        scope.equal();

        expect(scope.screen).toEqual((0 * 0).toString());

        el = create();
        scope = el.isolateScope();
        scope.appendToScreen('1000');
        scope.addOperator(scope.multiplicationValue);
        scope.appendToScreen('1000');
        scope.equal();

        expect(scope.screen).toEqual((1000 * 1000).toString());
    });

    it('should do the division for the boundary values entered', function () {
        el = create();
        scope = el.isolateScope();
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.divisionValue);
        scope.appendToScreen(scope.zeroValue);
        scope.equal();

        expect(scope.screen).toEqual((0/0).toString());

        el = create();
        scope = el.isolateScope();
        scope.appendToScreen('1000');
        scope.addOperator(scope.divisionValue);
        scope.appendToScreen('1000');
        scope.equal();

        expect(scope.screen).toEqual((1000 / 1000).toString());
    });

    it('should do the substraction for the boundary values entered', function () {
        el = create();
        scope = el.isolateScope();
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.minusValue);
        scope.appendToScreen(scope.zeroValue);
        scope.equal();

        expect(scope.screen).toEqual((0 - 0).toString());

        el = create();
        scope = el.isolateScope();
        scope.appendToScreen('1000');
        scope.addOperator(scope.minusValue);
        scope.appendToScreen('1000');
        scope.equal();

        expect(scope.screen).toEqual((1000 - 1000).toString());
    });

    it('should handle parenthesis', function () {
        el = create();
        scope = el.isolateScope();
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.multiplicationValue);
        scope.addOperator(scope.parenthesisLeftValue);
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.additionValue);
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.parenthesisRightValue);
        scope.equal();

        expect(scope.screen).toEqual((0 * (0 + 0)).toString());

        el = create();
        scope = el.isolateScope();
        scope.appendToScreen('1000');
        scope.addOperator(scope.multiplicationValue);
        scope.addOperator(scope.parenthesisLeftValue);
        scope.appendToScreen('1000');
        scope.addOperator(scope.additionValue);
        scope.appendToScreen('1000');
        scope.addOperator(scope.parenthesisRightValue);
        scope.equal();

        expect(scope.screen).toEqual((1000 * (1000 + 1000)).toString());
    });

    it('should handle embedded parenthesis', function () {
        el = create();
        scope = el.isolateScope();
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.multiplicationValue);
        scope.addOperator(scope.parenthesisLeftValue);
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.additionValue);
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.multiplicationValue);
        scope.addOperator(scope.parenthesisLeftValue);
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.additionValue);
        scope.appendToScreen(scope.zeroValue);
        scope.addOperator(scope.parenthesisRightValue);
        scope.addOperator(scope.parenthesisRightValue);
        scope.equal();

        expect(scope.screen).toEqual((0 * (0 + 0 * (0 + 0))).toString());

        el = create();
        scope = el.isolateScope();
        scope.appendToScreen('1000');
        scope.addOperator(scope.multiplicationValue);
        scope.addOperator(scope.parenthesisLeftValue);
        scope.appendToScreen('1000');
        scope.addOperator(scope.additionValue);
        scope.appendToScreen('1000');
        scope.addOperator(scope.multiplicationValue);
        scope.addOperator(scope.parenthesisLeftValue);
        scope.appendToScreen('1000');
        scope.addOperator(scope.additionValue);
        scope.appendToScreen('1000');
        scope.addOperator(scope.parenthesisRightValue);
        scope.addOperator(scope.parenthesisRightValue);
        scope.equal();

        expect(scope.screen).toEqual((1000 * (1000 + 1000 * (1000 + 1000))).toString());
    });
});