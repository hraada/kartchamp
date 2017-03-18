'use strict';

/**
 * Controller for handling of assigning drivers to karts for given race
 */
kartchamp.controller('DriverKartsController',
    function DriverKartsController($scope, $routeParams, raceService, raceAssignmentService, roundService, qualificationService, indexerService) {

        $scope.getTeamLabelForSelect = function (raceAssignment) {
            var teamName = raceAssignment.team.name;

            if ($scope.teamRounds && ($scope.race.raceType == 'challenge' || $scope.race.raceType == 'qualification' || $scope.race.raceType == 'challenge3x10')) {
                if ($scope.teamRounds[raceAssignment.team.id][0][0] && $scope.teamRounds[raceAssignment.team.id][0][0][0].kart) {
                    teamName = teamName + '*';
                }
                if ($scope.teamRounds[raceAssignment.team.id][0][2] && $scope.teamRounds[raceAssignment.team.id][0][2][0].kart) {
                    teamName = teamName + '*';
                }
            }
            if ($scope.teamRounds && ($scope.race.raceType == 'fairchallenge' || $scope.race.raceType == 'fairqualification' || race.raceType == 'fairchallenge12')) {
                if ($scope.teamRounds[raceAssignment.team.id][0][0] && $scope.teamRounds[raceAssignment.team.id][0][0][0].driver) {
                    teamName = teamName + '*';
                }
                if ($scope.teamRounds[raceAssignment.team.id][0][2] && $scope.teamRounds[raceAssignment.team.id][0][2][0].driver) {
                    teamName = teamName + '*';
                }
            }            
            return teamName;
        }

        $scope.printButtonClicked = function () {
            window.print();
        }

        $scope.getResultButtonClass = function (resultId) {
            if ($scope.selectedResult == resultId) {
                return 'active';
            } else {
                return '';
            }
        }

        $scope.resultButtonClicked = function (resultId, race) {
            $scope.selectedResult = resultId;
            qualificationService.getRaceRoundSchedule(race, resultId, function (raceRidesRounds) {
                $scope.raceRidesRounds = raceRidesRounds;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.$watch('raceAssignment', function(raceAssignment) {
            if (raceAssignment) {
                $scope.drivers = [raceAssignment.driver, raceAssignment.driver2, raceAssignment.driver3];
            }
        })

        raceService.getRaceById($routeParams.raceId, function (race) {
            $scope.race = race;
            if (raceService.isQualification($scope.race)) {
                $scope.qualificationRounds = [0, 1, 2, 3];
                $scope.isQualification = true;
            } else {
                if ($scope.race.raceType == 'challenge3x10') {
                    $scope.qualificationRounds = [0, 1, 2];
                    $scope.isChallenge = true;
                    $scope.is3x10Challenge = true;

                } else {
                    $scope.qualificationRounds = [0, 1];
                    $scope.isChallenge = true;
                }
            }
            raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
                $scope.raceAssignments = raceAssignments;
                $scope.raceAssignment = raceAssignments[0];

                raceService.getRaceKarts($scope.race, function (karts) {
                    if ($scope.is3x10Challenge) {
                        $scope.raceAssignmentsRoundsKarts = qualificationService.getRaceAssignmentsRoundsKartsChallenge3x10($scope.qualificationRounds, raceAssignments, karts);                        
                    } else {
                        $scope.raceAssignmentsRoundsKarts = qualificationService.getRaceAssignmentsRoundsKarts($scope.qualificationRounds, raceAssignments, karts);
                    }
                                        
                    $scope.$$phase || $scope.$apply();
                });


            });
            roundService.getRaceRounds(race, $scope.qualificationRounds, function (rounds) {
                $scope.rounds = rounds;
                $scope.teamRounds = indexerService.indexData(rounds, ["team.id", "driverIndex", "roundIndex"]);
                $scope.$$phase || $scope.$apply();
            });


            $scope.selectedResult = $scope.qualificationRounds[0];
            $scope.resultButtonClicked($scope.selectedResult, $scope.race);
        });


    });