'use strict';

/**
 */
kartchamp.controller('TeamCastsController',
    function TeamCastsController($scope, $routeParams, raceService, raceAssignmentService, roundService) {
        raceService.getRaceById($routeParams.raceId, function (race) {
            $scope.race = race;
            raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
                //Sort teams according to their team cast order
                raceAssignments.sort(function (a, b) {
                    return a.team.castOrder - b.team.castOrder;
                });
                $scope.raceAssignments = raceAssignments;
                $scope.$$phase || $scope.$apply();
            });
        });

        $scope.saveButtonClicked = function () {
            roundService.updateRaceAssignments($scope.race, $scope.raceAssignments, function () {
                raceAssignmentService.save();
            });
        }

        $scope.loadTestData = function () {
            for (var i = 0; i < 10; i++) {
                $scope.raceAssignments[i].teamCast = i + 1;
            }
        }
    });