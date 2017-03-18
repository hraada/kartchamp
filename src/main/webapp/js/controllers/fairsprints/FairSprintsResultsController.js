'use strict';

/**
 */
kartchamp.controller('FairSprintsResultsController', function FairSprintsResultsController($scope, $routeParams, fairSprintsService, raceService, exportService) {
    $scope.showExport = false;

    $scope.printButtonClicked = function () {
        window.print();
    }

    $scope.exportButtonClicked = function () {
        $scope.teamResultsExport = exportService.getTeamFairSprintsResultsAsHtml($scope.results.teams, 'fairsprints');
        $scope.driverResultsExport = exportService.getDriverFairSprintsResultsAsHtml($scope.results.drivers, 'fairsprints');
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
        fairSprintsService.getFairSprintsResults(race, function (results) {
            $scope.results = results;
            $scope.$$phase || $scope.$apply();
        });
    });

});