'use strict';

/**
*/
kartchamp.controller('QualificationController', function QualificationController($scope, $routeParams, raceService, raceAssignmentService, roundService, qualificationService, persistenceService, exportService, indexerService) {
    $scope.showExport = false;

    $scope.exportButtonClicked = function () {
        $scope.qualificationResultsExport = exportService.getQualificationResultsAsHtml($scope.results);
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    $scope.resultButtonClicked = function (resultId, race) {
        $scope.selectedResult = resultId;
        qualificationService.getQualificationRoundResults(race, resultId, function (results) {
            $scope.results = results;
            $scope.$$phase || $scope.$apply();
        });
    }

    $scope.rideButtonClicked = function (rideId) {
        $scope.selectedRide = rideId;
    };

    $scope.getResultButtonClass = function (resultId) {
        if ($scope.selectedResult == resultId) {
            return 'active';
        } else {
            return '';
        }
    }

    $scope.getRideButtonClass = function (rideId) {
        if ($scope.selectedRide == rideId) {
            return 'active';
        } else {
            return '';
        }
    }

    var getRideFilterList = function (lowerRideId, upperRideId, qualificationId, teamCount) {
        var rideFilterList = [];
        for (var i = lowerRideId + ((qualificationId - 1) * teamCount); i < upperRideId + ((qualificationId - 1) * teamCount); i++) {
            rideFilterList.push({id: i + 1, label: i + 1 + '. jízda'});
        }
        return rideFilterList;
    }

    $scope.printButtonClicked = function () {
        window.print();
    }


    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;

        $scope.qualificationId = $routeParams.qualificationId;
        if ($scope.qualificationId == 1) {
            if ($scope.race.raceType != 'challenge3x10' && $scope.race.raceType != 'challenge3x12' && $scope.race.raceType != 'fairqualification12on9') {
                $scope.qualificationRounds = [0, 1];
            } else {
                $scope.qualificationRounds = [0, 1, 2];
            }
        } else {
            $scope.qualificationRounds = [2, 3];
        }
        $scope.selectedResult = $scope.qualificationRounds[0];
        $scope.maxPoints = 30;
        if ($scope.race.raceType != 'challenge3x10' && $scope.race.raceType != 'challenge2x10' && $scope.race.raceType != 'challenge3x12' && $scope.race.raceType != 'challenge2x12') {
            if ($scope.race.raceType != 'fairchallenge12' && $scope.race.raceType != 'fairqualification12' && $scope.race.raceType != 'fairqualification12on9') {
                $scope.rideFilterList = getRideFilterList(0, 5, $scope.qualificationId, 10);
                $scope.rideFilterList2 = getRideFilterList(5, 10, $scope.qualificationId, 10);
            } else {
                $scope.maxPoints = 36;
                if ($scope.race.raceType == 'fairchallenge12' || $scope.race.raceType == 'fairqualification12') {
                  $scope.rideFilterList = getRideFilterList(0, 6, $scope.qualificationId, 12);
                  $scope.rideFilterList2 = getRideFilterList(6, 12, $scope.qualificationId, 12);
                }
                if ($scope.race.raceType == 'fairqualification12on9') {
                  $scope.rideFilterList = getRideFilterList(0, 4, $scope.qualificationId, 12);
                  $scope.rideFilterList2 = getRideFilterList(4, 8, $scope.qualificationId, 12);
                  $scope.rideFilterList3 = getRideFilterList(8, 12, $scope.qualificationId, 12);

                }
            }
        } else {
            if ($scope.race.raceType == 'challenge3x12' || $scope.race.raceType == 'challenge2x12') {
                $scope.maxPoints = 36;
                $scope.rideFilterList = getRideFilterList(0, 3, $scope.qualificationId, 12);
                $scope.rideFilterList2 = getRideFilterList(3, 6, $scope.qualificationId, 12);
                if ($scope.race.raceType == 'challenge3x12') {
                    $scope.rideFilterList3 = getRideFilterList(6, 9, $scope.qualificationId, 12);
                }

            } else {
                $scope.rideFilterList = getRideFilterList(0, 3, $scope.qualificationId, 10);
                $scope.rideFilterList2 = getRideFilterList(3, 6, $scope.qualificationId, 10);
                if ($scope.race.raceType == 'challenge3x10') {
                    $scope.rideFilterList3 = getRideFilterList(6, 9, $scope.qualificationId, 10);
                }
            }
        }
        $scope.selectedRide = 1 + (($scope.qualificationId - 1) * 12);

        raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
            $scope.raceAssignments = raceAssignments;
            $scope.$$phase || $scope.$apply();
        });
        roundService.getRaceRounds(race, $scope.qualificationRounds, function (rounds) {
            $scope.rounds = rounds;
            $scope.rideRounds = indexerService.indexData(rounds, ["rideIndex", "team.id", "driverIndex"]);
            $scope.$$phase || $scope.$apply();
        });
        $scope.resultButtonClicked($scope.selectedResult, race);
    });

});
