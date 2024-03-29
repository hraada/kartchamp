'use strict';

/**
 */
kartchamp.controller('FairSprintsController', function FairSprintsController($scope, $routeParams, raceService, raceAssignmentService, roundService, fairSprintsService, persistenceService, exportService, indexerService) {
    $scope.showExport = false;

    $scope.exportButtonClicked = function () {
        $scope.fairSprintsResultsExport = "";
        angular.forEach($scope.results, function(rideResults) {
                $scope.fairSprintsResultsExport += "<h3>" + rideResults[0].rideIndex + ". rozjížďka</h3>\n";
                $scope.fairSprintsResultsExport += exportService.getFairSprintsResultsAsHtml(rideResults);
        });
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    $scope.resultButtonClicked = function (roundIndex, race) {
        $scope.fairSprintRound = roundIndex;
        fairSprintsService.getFairSprintsRoundResults(race, roundIndex, function (results) {
            var indexedResults = indexerService.indexData(results, ["rideIndex"]);

            //TODO This is stupid, but necessary - object properties are iterated like strings - 1 10 2 3 4...
            var arrResults = [];
            angular.forEach(indexedResults, function(result) {                
                arrResults.push(result);
            });
            $scope.results = arrResults;
            $scope.$$phase || $scope.$apply();
        });
    }

    $scope.rideButtonClicked = function (rideId) {
        $scope.selectedRide = rideId;
    };

    $scope.getResultButtonClass = function (resultId) {
        if ($scope.fairSprintRound == resultId) {
            return 'active';
        } else {
            return '';
        }
    }
    $scope.getPoints = function(position) {
        return fairSprintsService.getPoints(position, $scope.race.raceType);
    }

    $scope.getRideButtonClass = function (rideId) {
        if ($scope.selectedRide == rideId) {
            return 'active';
        } else {
            return '';
        }
    }
    $scope._getRideFilterList = function (lowerRideId, upperRideId, fairSprintRound, teamCount) {
        var rideFilterList = [];
        for (var i = lowerRideId + ((fairSprintRound - 1) * teamCount); i < upperRideId + ((fairSprintRound - 1) * teamCount); i++) {
            rideFilterList.push({id: i + 1, label: i + 1 + '. jízda'});
        }
        return rideFilterList;
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

    $scope.fairSprintsId = $routeParams.fairSprintsId;
    $scope.fairSprintsRounds = [0, 1];
    $scope.fairSprintRound = $routeParams.fairSprintsId - 1;


    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;

        var teamCount = 10;
        if ($scope.race.raceType == 'fairsprints12') {
            teamCount = 12;
        }
        if ($scope.race.raceType == 'fairsprints9') {
            teamCount = 9;
        }
        $scope.rideFilterList = $scope._getRideFilterList(0, Math.ceil(teamCount / 2), $scope.fairSprintsId, teamCount);
        $scope.rideFilterList2 = $scope._getRideFilterList(Math.ceil(teamCount / 2), teamCount, $scope.fairSprintsId, teamCount);
        $scope.selectedRide = 1 + (($scope.fairSprintsId - 1) * teamCount);

        raceAssignmentService.getRaceAssignments(race, function (raceAssignments) {
            $scope.raceAssignments = raceAssignments;
            $scope.$$phase || $scope.$apply();
        });
        roundService.getRaceRounds(race, $scope.fairSprintsRounds, function (rounds) {
            $scope.rounds = rounds;
            $scope.rideRounds = indexerService.indexData(rounds, ["roundIndex", "rideIndex"]);
            $scope.$$phase || $scope.$apply();
        });
        $scope.resultButtonClicked($scope.fairSprintRound, race);
    });

});