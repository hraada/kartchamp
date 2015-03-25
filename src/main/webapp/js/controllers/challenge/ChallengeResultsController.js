'use strict';

/**
 */
kartchamp.controller('ChallengeResultsController', function ChallengeResultsController($scope, $routeParams, challengeService, raceService, exportService) {
    $scope.showExport = false;

    $scope.printButtonClicked = function () {
        window.print();
    }

    $scope.exportButtonClicked = function () {
        $scope.teamResultsExport = exportService.getTeamChallengeResultsAsHtml($scope.results.teams, $scope.race.raceType);
        $scope.driverResultsExport = exportService.getDriverChallengeResultsAsHtml($scope.results.drivers, $scope.race.raceType);
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
        challengeService.getChallengeResults(race, function (results) {
            $scope.results = results;
            $scope.$$phase || $scope.$apply();
        });
    });

});