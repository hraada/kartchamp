'use strict';

/**
 */
kartchamp.controller('MenuController',
    function MenuController($scope, $routeParams, raceAssignmentService, roundService, raceService, persistenceService, indexerService) {
        $scope.raceId = $routeParams.raceId;

        if ($scope.raceId) {
            raceService.getRaceById($routeParams.raceId, function (race) {
                $scope.race = race;
                $scope.isQualification = raceService.isQualification($scope.race);
                $scope.isChallenge = raceService.isChallenge($scope.race);
                $scope.isChallenge3x10 = raceService.isChallenge3x10($scope.race);
                $scope.isChallenge2x10 = raceService.isChallenge2x10($scope.race);
                $scope.isFairSprints = raceService.isFairSprints($scope.race);                
                $scope.$$phase || $scope.$apply();
            });
        }

        //TODO needs refactoring
        $scope.completePreparationClicked = function () {
            if ($scope.isFairSprints) {
                persistenceService.flush(function () {
                    raceAssignmentService.getRaceAssignments($scope.race, function (raceAssignments) {
                        roundService.getRaceRounds($scope.race, [0, 1], function (rounds) {
                            $scope.race.karts.order("kartIndex", true).list(function(karts) {
                                var teamCount = karts.length;
                                var teamRounds = indexerService.indexData(rounds, ["team.id", "roundIndex", "rideIndex"]);

                                angular.forEach(raceAssignments, function(raceAssignment) {
                                    var teamId = raceAssignment.team.id;

                                    for (var i = 0; i < teamCount; i++) {
                                        var position = ((raceAssignment.teamCast - 1) + i) % teamCount + 1;
                                        teamRounds[teamId][0][i + 1][0].startPosition = position;
                                        teamRounds[teamId][1][i + teamCount + 1][0].startPosition = position;
                                        teamRounds[teamId][0][i + 1][0].kart = karts[position - 1];
                                        teamRounds[teamId][1][i + teamCount + 1][0].kart = karts[position - 1];
                                    }
                                });

                                persistenceService.flush(function() {
                                    $scope.$$phase || $scope.$apply();
                                });
                            });
                        });

                    });

                });


            } else {
                persistenceService.flush(function () {
                    raceAssignmentService.getRaceAssignments($scope.race, function (raceAssignments) {
                        roundService.updateRaceAssignments($scope.race, raceAssignments, function () {
                            persistenceService.flush(function() {
                                $scope.$$phase || $scope.$apply();
                            });
                        });
                    });

                });
            }
        }

        $scope.menuClicked = function () {
            persistenceService.flush();
        }


    });