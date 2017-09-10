'use strict';

/**
*/
kartchamp.controller('ChallengeController', function ChallengeController($scope, $routeParams, raceService, raceAssignmentService, roundService, challengeService, persistenceService, exportService, indexerService) {
    $scope.showExport = false;

    $scope.exportButtonClicked = function () {
        $scope.challengeResultsExport = exportService.getChallengeResultsAsHtml($scope.results);
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    $scope.resultButtonClicked = function (resultId, race) {
        $scope.selectedResult = resultId;
        challengeService.getChallengeRoundResults(race, resultId, function (results) {
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

    var getRideFilterList = function (lowerRideId, upperRideId, challengeId, teamCount) {
        var rideFilterList = [];
        for (var i = lowerRideId + ((challengeId - 1) * teamCount); i < upperRideId + ((challengeId - 1) * teamCount); i++) {
            rideFilterList.push({id: i + 1, label: i + 1 + '. jízda'});
        }
        return rideFilterList;
    }

    $scope.printButtonClicked = function () {
        window.print();
    }



    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
        $scope.challengeId = $routeParams.challengeId;
        if ($scope.race.raceType != 'challenge3x10' && $scope.race.raceType != 'challenge3x12') {
            $scope.challengeRounds = [2, 3];
        } else {
            $scope.challengeRounds = [3, 4, 5];
        }       

        $scope.selectedResult = $scope.challengeRounds[0];
        $scope.selectedRide = 1 + (($scope.challengeId - 1) * 10);        
        $scope.maxPoints = 30;
        if ($scope.race.raceType != 'challenge3x10' && $scope.race.raceType != 'challenge2x10' && $scope.race.raceType != 'challenge3x12' && $scope.race.raceType != 'challenge2x12') {
            if ($scope.race.raceType != 'fairchallenge12') {
                $scope.rideFilterList = getRideFilterList(0, 5, $scope.challengeId, 10);
                $scope.rideFilterList2 = getRideFilterList(5, 10, $scope.challengeId, 10);
            } else {
                $scope.maxPoints = 36;
                $scope.selectedRide = 1 + (($scope.challengeId - 1) * 12);        
                $scope.rideFilterList = getRideFilterList(0, 6, $scope.challengeId, 12);
                $scope.rideFilterList2 = getRideFilterList(6, 12, $scope.challengeId, 12);
            }
        } else {
            if ($scope.race.raceType == 'challenge3x12') {
                $scope.maxPoints = 36;
                $scope.rideFilterList = getRideFilterList(-3, 0, $scope.challengeId, 12);
                $scope.rideFilterList2 = getRideFilterList(0, 3, $scope.challengeId, 12);
                $scope.rideFilterList3 = getRideFilterList(3, 6, $scope.challengeId, 12);

            } else if ($scope.race.raceType == 'challenge2x12') {
                $scope.maxPoints = 36;
                $scope.rideFilterList = getRideFilterList(-6, -3, 2, 12);
                $scope.rideFilterList2 = getRideFilterList(-3, 0, 2, 12);

            } else if ($scope.race.raceType == 'challenge3x10') {
                $scope.rideFilterList = getRideFilterList(-1, 2, $scope.challengeId, 10);
                $scope.rideFilterList2 = getRideFilterList(2, 5, $scope.challengeId, 10);
                $scope.rideFilterList3 = getRideFilterList(5, 8, $scope.challengeId, 10);
            } else {
                $scope.rideFilterList = getRideFilterList(-4, -1, 2, 10);
                $scope.rideFilterList2 = getRideFilterList(-1, 2, 2, 10);

            }
        }        
        raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
            $scope.raceAssignments = raceAssignments;
            $scope.$$phase || $scope.$apply();
        });
        roundService.getRaceRounds(race, $scope.challengeRounds, function (rounds) {
            $scope.rounds = rounds;
            $scope.rideRounds = indexerService.indexData(rounds, ["rideIndex"]);
            $scope.$$phase || $scope.$apply();
        });
        $scope.resultButtonClicked($scope.selectedResult, race);
    });

});