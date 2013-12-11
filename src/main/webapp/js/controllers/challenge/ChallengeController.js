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

    $scope._getRideFilterList = function (lowerRideId, upperRideId, challengeId) {
        var rideFilterList = [];
        for (var i = lowerRideId + ((challengeId - 1) * 10); i < upperRideId + ((challengeId - 1) * 10); i++) {
            rideFilterList.push({id: i + 1, label: i + 1 + '. jízda'});
        }
        return rideFilterList;
    }

    $scope.printButtonClicked = function () {
        window.print();
    }

    $scope.challengeId = $routeParams.challengeId;
    $scope.challengeRounds = [2, 3];

    $scope.selectedResult = $scope.challengeRounds[0];
    $scope.rideFilterList = $scope._getRideFilterList(0, 5, $scope.challengeId);
    $scope.rideFilterList2 = $scope._getRideFilterList(5, 10, $scope.challengeId);
    $scope.selectedRide = 1 + (($scope.challengeId - 1) * 10);

    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
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