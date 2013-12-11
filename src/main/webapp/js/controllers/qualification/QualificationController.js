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

    $scope._getRideFilterList = function (lowerRideId, upperRideId, qualificationId) {
        var rideFilterList = [];
        for (var i = lowerRideId + ((qualificationId - 1) * 10); i < upperRideId + ((qualificationId - 1) * 10); i++) {
            rideFilterList.push({id: i + 1, label: i + 1 + '. jízda'});
        }
        return rideFilterList;
    }

    $scope.printButtonClicked = function () {
        window.print();
    }

    $scope.qualificationId = $routeParams.qualificationId;
    if ($scope.qualificationId == 1) {
        $scope.qualificationRounds = [0, 1];
    } else {
        $scope.qualificationRounds = [2, 3];
    }
    $scope.selectedResult = $scope.qualificationRounds[0];
    $scope.rideFilterList = $scope._getRideFilterList(0, 5, $scope.qualificationId);
    $scope.rideFilterList2 = $scope._getRideFilterList(5, 10, $scope.qualificationId);
    $scope.selectedRide = 1 + (($scope.qualificationId - 1) * 10);

    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
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