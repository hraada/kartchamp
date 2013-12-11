'use strict';

/**
 * Directive for marking active links in menu.
 */
directive.directive('activeLink', ['$location', function (location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {
                var path = attrs.href;
                path = path.substring(1); //hack because path does bot return including hashbang
                if (newPath.indexOf(path) >= 0) {
                    element.parent().addClass(clazz);
                } else {
                    element.parent().removeClass(clazz);
                }
            });
        }

    };

}]);
