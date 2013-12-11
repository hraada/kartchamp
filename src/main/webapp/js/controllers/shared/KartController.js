'use strict';

/**
 * Controller for handling kart assignments for given race.
 */
kartchamp.controller('KartController',
    function KartController($scope, $routeParams, raceService) {

        raceService.getRaceById($routeParams.raceId, function (race) {
            $scope.race = race;
            raceService.getRaceKarts(race, function (karts) {
                $scope.karts = karts;
                $scope.$$phase || $scope.$apply();
            });
        });

        $scope.loadTestData = function () {
            for (var i = 0; i < $scope.karts.length; i++) {
                $scope.karts[i].number = '' + (i + 2);
            }
        }
    });