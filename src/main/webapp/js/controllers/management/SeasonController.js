'use strict';

/**
 */
kartchamp.controller('SeasonController',
    function SeasonController($scope, $routeParams, seasonService, persistenceService, raceService) {
        $scope.showSeasonEdit = false;
        $scope.editedSeason = {};

        $scope.showRaceEdit = false;
        $scope.editedRace = {};

        $scope.selectedSeason = null;
        $scope.raceFormats = raceService.getRaceFormats();

        $scope.loadSeasons = function () {
            seasonService.getSeasons(function (seasons) {
                $scope.seasons = seasons;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.addSeasonClicked = function () {
            $scope.editedSeason = {id: null, name: '', year: 2013};
            $scope.showSeasonEdit = true;
        }

        $scope.editSeasonClicked = function (season) {
            $scope.editedSeason = {id: season.id, name: season.name, year: season.year};
            $scope.showSeasonEdit = true;
        }

        $scope.saveSeasonClicked = function () {
            seasonService.save($scope.editedSeason, function () {
                $scope.showSeasonEdit = false;
                $scope.loadSeasons();
            });
        }

        $scope.deleteSeasonClicked = function () {
            $scope.showSeasonEdit = false;
            seasonService.delete($scope.editedSeason, function () {
                $scope.loadSeasons();
            }, function(message) {
                bootbox.alert(message);
                $scope.loadSeasons();
            });
        }

        $scope.cancelSeasonEditClicked = function () {
            $scope.showSeasonEdit = false;
        }


        $scope.seasonClicked = function (season) {
            $scope.selectedSeason = season;
            $scope.loadRaces($scope.selectedSeason);
        }

        $scope.loadRaces = function (season) {
            seasonService.getSeasonRaces(season, function (seasonRaces) {
                $scope.seasonRaces = seasonRaces;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.addRaceClicked = function () {
            $scope.editedRace = {id: null, name: '', season: $scope.selectedSeason, raceType: $scope.raceFormats.formatList[0], raceDate: null};
            $scope.showRaceEdit = true;
        }

        $scope.editRaceClicked = function (race) {
            $scope.editedRace = {id: race.id, name: race.name, season: $scope.selectedSeason, raceType: race.raceType, raceDate: race.raceDate};
            $scope.showRaceEdit = true;
        }

        $scope.saveRaceClicked = function () {
            raceService.save($scope.editedRace, function () {
                $scope.showRaceEdit = false;
                $scope.loadRaces($scope.selectedSeason);
            }, function(message) {
                bootbox.alert(message);
                $scope.loadRaces($scope.selectedSeason);
            });
        }

        $scope.deleteRaceClicked = function () {
            $scope.showRaceEdit = false;
            raceService.delete($scope.editedRace, function () {
                $scope.loadRaces($scope.selectedSeason);
            });
        }

        $scope.cancelRaceEditClicked = function () {
            $scope.showRaceEdit = false;
        }

        $scope.loadSeasons();
    });