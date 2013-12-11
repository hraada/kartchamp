'use strict';

/**
 * Directive for validation of duplicate lap times in results. scope.$parent must be called because of ng-repeats. Indexed
 * list of directive controllers and elements had to be created to correctly mark both side of collision.
 */
directive.directive('duplicateTime', function (roundService) {
    var ctrls = {};
    var elms = {};
    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ctrl) {
            if (!ctrl)
                return;
            var round = scope.$eval(attr.duplicateTime);
            ctrls[round.id] = ctrl;
            elms[round.id] = elm;

            var testForDuplicates = function (viewValue) {
                var data = scope.$parent.$parent;

                for (var i = 0; i < data.rounds.length; i++) {
                    var round = data.rounds[i];

                    if (scope.driverRide[0].id != round.id && scope.driverRide[0].roundIndex == round.roundIndex && viewValue == round.resultTime && scope.driverRide[0].resultPosition == round.resultPosition) {
                        ctrl.$setValidity('duplicateTime', false);
                        if (ctrls[round.id] && elms[round.id]) {
                            ctrls[round.id].$setValidity('duplicateTime', false);
                            elms[round.id].attr('title', 'Kolize s časem v ' + scope.driverRide[0].rideIndex + '. jízdě (' + scope.driverRide[0].driver.name + ' ' + scope.driverRide[0].driver.surname + ')');
                        }
                        elm.attr('title', 'Kolize s časem v ' + round.rideIndex + '. jízdě (' + round.driver.name + ' ' + round.driver.surname + ')');
                        return viewValue;
                    }
                }
                elm.attr('title', '');
                ctrl.$setValidity('duplicateTime', true);
                return viewValue;
            }
            ctrl.$formatters.unshift(testForDuplicates);
            ctrl.$parsers.unshift(testForDuplicates);
        }
    };
});