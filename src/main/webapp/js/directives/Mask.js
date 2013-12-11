/*
 Attaches jquery-ui input mask onto input element
 */
directive.directive('uiMask', [
    function () {
        return {
            require: 'ngModel',
            link: function ($scope, element, attrs, controller) {
                function strtimetoint(strtime) {
                    var min = strtime.slice(0, 1);
                    var sec = strtime.slice(1, 3);
                    var ms = strtime.slice(3, 6);
                    return parseInt(min * 60000) + parseInt(sec * 1000) + parseInt(ms);
                }

                function inttostrtime(inttime) {
                    if (inttime == 0) return '000000';
                    var min = window.Math.floor(inttime / 60000);
                    var sec = window.Math.floor((inttime % 60000) / 1000);
                    var ms = inttime % 1000;
                    return formatNumber(min, 1) + formatNumber(sec, 2) + formatNumber(ms, 3);
                }

                function formatNumber(num, length) {
                    var r = '' + num;
                    while (r.length < length) {
                        r = '0' + r;
                    }
                    return r;
                }


                /* We override the render method to run the jQuery mask plugin
                 */
                controller.$render = function () {
                    var value = controller.$viewValue || '';
                    value = inttostrtime(value);
                    element.val(value);
                    element.mask($scope.$eval(attrs.uiMask));
                };

                /* Add a parser that extracts the masked value into the model but only if the mask is valid
                 */
                controller.$parsers.push(function (value) {
                    //the second check (or) is only needed due to the fact that element.isMaskValid() will keep returning undefined
                    //until there was at least one key event
                    var isValid = element.isMaskValid() || angular.isUndefined(element.isMaskValid()) && element.val().length > 0;
                    controller.$setValidity('mask', isValid);
                    value = strtimetoint(value);
                    return isValid ? value : undefined;
                });

                /* When keyup, update the view value
                 */
                element.bind('keyup', function () {
                    $scope.$$phase || $scope.$apply(function () {
                        controller.$setViewValue(element.mask());
                    });
                });
            }
        };
    }
]);
