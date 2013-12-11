'use strict';

/**
 * Controller for handling of nomination management for given race
 */
kartchamp.controller('NominationController',
    function NominationController($scope, $routeParams, raceService, raceAssignmentService, seasonAssignmentService) {

        raceService.getRaceById($routeParams.raceId, function (race) {
            $scope.race = race;
            raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
                $scope.raceAssignments = raceAssignments;
                $scope.$$phase || $scope.$apply();
            });
            seasonAssignmentService.getSeasonAssignments(race.season, function (seasonAssignments) {
                $scope.seasonAssignments = seasonAssignments;
                $scope.$$phase || $scope.$apply();
            });
        });

        /*$scope.$watch("raceAssignments", function(newVal, oldVal) {
         roundService.updateRaceAssignments($scope.race, newVal);
         persistenceService.flush();
         });*/

        $scope.loadTestData = function () {
            for (var i = 0; i < 10; i++) {
                $scope.raceAssignments[i].driver = $scope.seasonAssignments[$scope.raceAssignments[i].team.id][0].driver;
                $scope.raceAssignments[i].driver2 = $scope.seasonAssignments[$scope.raceAssignments[i].team.id][1].driver;
                $scope.raceAssignments[i].driver3 = $scope.seasonAssignments[$scope.raceAssignments[i].team.id][2].driver;
            }
        }
    });