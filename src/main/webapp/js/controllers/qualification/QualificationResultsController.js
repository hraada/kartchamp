'use strict';

/**
 */
kartchamp.controller('QualificationResultsController', function QualificationResultsController($scope, $routeParams, qualificationService, raceService, exportService) {
    $scope.showExport = false;

    $scope.printButtonClicked = function () {
        window.print();
    }

    $scope.exportButtonClicked = function () {
        $scope.teamResultsExport = exportService.getTeamQualificationResultsAsHtml($scope.results.teams, 'qualification');
        $scope.driverResultsExport = exportService.getDriverQualificationResultsAsHtml($scope.results.drivers, 'qualification');
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
        qualificationService.getQualificationResults(race, function (results) {
            $scope.results = results;
            $scope.$$phase || $scope.$apply();
        });
    });

});