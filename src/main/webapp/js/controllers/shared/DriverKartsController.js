'use strict';

/**
 * Controller for handling of assigning drivers to karts for given race
 */
kartchamp.controller('DriverKartsController',
    function DriverKartsController($scope, $routeParams, raceService, raceAssignmentService, roundService, qualificationService, indexerService) {

        $scope.getTeamLabelForSelect = function (raceAssignment) {
            var teamName = raceAssignment.team.name;

            if ($scope.teamRounds && ($scope.race.raceType == 'challenge' || $scope.race.raceType == 'qualification' || $scope.race.raceType == 'challenge3x10' || $scope.race.raceType == 'challenge2x10' || $scope.race.raceType == 'challenge3x12' || $scope.race.raceType == 'challenge2x12')) {
                if ($scope.teamRounds[raceAssignment.team.id][0][0] && $scope.teamRounds[raceAssignment.team.id][0][0][0].kart) {
                    teamName = teamName + '*';
                }
                if ($scope.teamRounds[raceAssignment.team.id][0][2] && $scope.teamRounds[raceAssignment.team.id][0][2][0].kart) {
                    teamName = teamName + '*';
                }
            }
            if ($scope.teamRounds && ($scope.race.raceType == 'fairchallenge9' || $scope.race.raceType == 'fairchallenge12' || $scope.race.raceType == 'fairchallenge' || $scope.race.raceType == 'fairqualification' || $scope.race.raceType == 'fairqualification12'  || $scope.race.raceType == 'fairqualification12on9')) {
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
            if ($scope.race.raceType == 'fairqualification12on9') {
              $scope.qualificationRounds = [0, 1, 2];
              $scope.isFairQualification12on9 = true;
            } else if (raceService.isQualification($scope.race)) {
                $scope.qualificationRounds = [0, 1, 2, 3];
                $scope.isQualification = true;
            } else {
                if ($scope.race.raceType == 'challenge3x10' || $scope.race.raceType == 'challenge3x12') {
                    $scope.qualificationRounds = [0, 1, 2];
                    $scope.isChallenge = true;
                    if ($scope.race.raceType == 'challenge3x10') {
                        $scope.is3x10Challenge = true;
                    } else {
                        $scope.is3x12Challenge = true;
                    }

                } else {
                    if ($scope.race.raceType == 'challenge2x10') $scope.is2x10Challenge = true;
                    if ($scope.race.raceType == 'challenge2x12') $scope.is2x12Challenge = true;
                    $scope.qualificationRounds = [0, 1];
                    $scope.isChallenge = true;
                }
            }
            raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
                $scope.raceAssignments = raceAssignments;
                $scope.raceAssignment = raceAssignments[0];

                raceService.getRaceKarts($scope.race, function (karts) {
                    if ($scope.is3x10Challenge || $scope.is2x10Challenge) {
                        $scope.raceAssignmentsRoundsKarts = qualificationService.getRaceAssignmentsRoundsKartsPerKartCount($scope.qualificationRounds, raceAssignments, karts, 10);
                    } else if ($scope.is3x12Challenge || $scope.is2x12Challenge) {
                        $scope.raceAssignmentsRoundsKarts = qualificationService.getRaceAssignmentsRoundsKartsPerKartCount($scope.qualificationRounds, raceAssignments, karts, 12);
                    } else if ($scope.race.raceType == 'fairchallenge9'){
                        $scope.raceAssignmentsRoundsKarts = qualificationService.getRaceAssignmentsRoundsKarts($scope.qualificationRounds, raceAssignments, karts, 6);
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
