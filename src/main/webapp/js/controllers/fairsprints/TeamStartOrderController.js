'use strict';

/**
 */
kartchamp.controller('TeamStartOrderController',
    function TeamStartOrderController($scope, $routeParams, raceService, raceAssignmentService, roundService, indexerService) {
        $scope.dialogName = $routeParams.dialogName;

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

            roundService.getRaceRounds(race, [0, 1], function (rounds) {
                $scope.rounds = rounds;
                $scope.teamRounds = indexerService.indexData(rounds, ["team.id", "roundIndex", "rideIndex"]);
                $scope.$$phase || $scope.$apply();
            });
        });

        $scope.saveButtonClicked = function () {
            roundService.updateRaceAssignments($scope.race, $scope.raceAssignments, function () {
                raceAssignmentService.save();
            });
        }

        $scope.updateStartOrder = function() {
            angular.forEach($scope.raceAssignments, function(raceAssignment) {
                var teamId = raceAssignment.team.id;

                for (var i = 0; i < 10; i++) {
                    $scope.teamRounds[teamId][0][i].startPosition = (raceAssignment.teamCast + i) % 10;
                    $scope.teamRounds[teamId][1][i].startPosition = (raceAssignment.teamCast + i) % 10;
                }

            });

        }

        $scope.loadTestData = function () {
            for (var i = 0; i < 10; i++) {
                $scope.raceAssignments[i].teamCast = i + 1;
            }
        }
    });