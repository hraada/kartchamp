'use strict';

/**
 * Controller for handling of ride assignments for fair sprints
 */
kartchamp.controller('RideAssignmentsController',
    function RideAssignmentsController($scope, $routeParams, raceService, raceAssignmentService, roundService, fairSprintsService, indexerService) {

        $scope.getTeamLabelForSelect = function(raceAssignment) {
            var teamName = raceAssignment.team.name;

            if ($scope.teamRounds) {
                if ($scope.teamRounds[raceAssignment.team.id][0][1][0].driver) {
                    teamName = teamName + '*';
                }
                if ($scope.teamRounds[raceAssignment.team.id][1][11][0].driver) {
                    teamName = teamName + '*';
                }
            }
            return teamName;
        }

        $scope.printButtonClicked = function () {
            window.print();
        }

        $scope.getPrintPageBreakClass = function($rideIndex) {
            if ($rideIndex % 3 == 0) {
                return 'page-break';
            } else {
                return '';
            }
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
            fairSprintsService.getRaceRoundSchedule(race, resultId, function (raceRidesRounds) {
                $scope.raceRidesRounds = raceRidesRounds;
                $scope.$$phase || $scope.$apply();
            });
        }

        raceService.getRaceById($routeParams.raceId, function (race) {
            $scope.race = race;
            $scope.teamCount = 10;
            if (race.raceType == 'fairsprints12') {
                $scope.teamCount = 12;
            }

            $scope.fairSprintsRounds = [0, 1];
            raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
                $scope.raceAssignments = raceAssignments;
                $scope.raceAssignment = raceAssignments[0];
                $scope.$$phase || $scope.$apply();
            });
            roundService.getRaceRounds(race, $scope.fairSprintsRounds, function (rounds) {
                $scope.rounds = rounds;
                $scope.teamRounds = indexerService.indexData(rounds, ["team.id", "roundIndex", "rideIndex"]);
                $scope.$$phase || $scope.$apply();
            });



        });

        $scope.loadTestData = function () {
            angular.forEach($scope.raceAssignments, function(raceAssignment) {
                for (var i = 1; i <= 10; i++) {
                    var rand = Math.floor(Math.random()*3) + 1;
                    var rand2 = Math.floor(Math.random()*3) + 1;
                    if (rand == 1) rand = "";
                    if (rand2 == 1) rand2 = "";
                    console.log(rand);
                    console.log(rand2);
                    $scope.teamRounds[raceAssignment.team.id][0][i][0].driver = raceAssignment["driver" + rand];
                    $scope.teamRounds[raceAssignment.team.id][1][10 + i][0].driver = raceAssignment["driver" + rand2];
                }
            });
        }
    });