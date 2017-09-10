'use strict';

/**
 */
kartchamp.controller('QualificationResultsController', function QualificationResultsController($scope, $routeParams, qualificationService, raceService, exportService) {
    $scope.showExport = false;

    $scope.printButtonClicked = function () {
        window.print();
    }

    $scope.exportButtonClicked = function () {
        $scope.teamResultsExport = exportService.getTeamQualificationResultsAsHtml($scope.results.teams, $scope.race.raceType);
        $scope.driverResultsExport = exportService.getDriverQualificationResultsAsHtml($scope.results.drivers, $scope.race.raceType);
        $scope.showExport = true;
    }

    $scope.exportCancelButtonClicked = function () {
        $scope.showExport = false;
    }

    raceService.getRaceById($routeParams.raceId, function (race) {
        $scope.race = race;
        $scope.isFairQualification12on9 = race.raceType == 'fairqualification12on9';
        qualificationService.getQualificationResults(race, function (results) {
            $scope.results = results;
            $scope.$$phase || $scope.$apply();
        });
    });

});
