'use strict';

/**
 */
kartchamp.controller('TeamController',
    function TeamController($scope, $routeParams, teamService, persistenceService, seasonService, seasonAssignmentService, driverService) {
        $scope.showTeamEdit = false;
        $scope.editedTeam = {};

        /*$scope.showDriverEdit = false;
         $scope.editedDriver = {};*/

        $scope.selectedTeam = null;


        $scope.loadTeams = function () {
            teamService.getTeams(function (teams) {
                $scope.teams = teams;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.loadSeasons = function () {
            seasonService.getSeasons(function (seasons) {
                $scope.seasons = seasons;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.loadDrivers = function () {
            driverService.getDrivers(function (drivers) {
                $scope.drivers = drivers;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.addTeamClicked = function () {
            $scope.editedTeam = {id: null, name: '', shortName: '', castOrder: 0};
            $scope.showTeamEdit = true;
        }

        $scope.editTeamClicked = function (team) {
            $scope.editedTeam = {id: team.id, name: team.name, shortName: team.shortName, castOrder: team.castOrder};
            $scope.showTeamEdit = true;
        }

        $scope.saveTeamClicked = function () {
            teamService.save($scope.editedTeam, function () {
                $scope.showTeamEdit = false;
                $scope.loadTeams();
            });
        }

        $scope.deleteTeamClicked = function () {
            $scope.showTeamEdit = false;
            teamService.delete($scope.editedTeam, function () {
                $scope.loadTeams();
            });
        }

        $scope.cancelTeamEditClicked = function () {
            $scope.showTeamEdit = false;
        }


        $scope.teamClicked = function (team) {
            $scope.selectedTeam = team;
            $scope.loadSeasonAssignments($scope.selectedTeam);
        }

        $scope.loadSeasonAssignments = function (team) {
            seasonAssignmentService.getTeamSeasonAssignments(team, function (seasonAssignments) {
                $scope.seasonAssignments = seasonAssignments;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.addSeasonAssignmentClicked = function (season) {
            $scope.newSeasonAssignment = {id: null, season: season, team: $scope.selectedTeam};
            $scope.showAddSeasonAssignment = true;
        }

        $scope.saveAddSeasonAssignmentClicked = function () {

            seasonAssignmentService.save($scope.newSeasonAssignment, function () {
                $scope.showAddSeasonAssignment = false;
                $scope.loadSeasonAssignments($scope.selectedTeam);
            });
        }

        $scope.deleteSeasonAssignmentClicked = function (seasonAssignment) {
            seasonAssignmentService.delete(seasonAssignment, function () {
                $scope.loadSeasonAssignments($scope.selectedTeam);
            });
        }

        $scope.cancelAddSeasonAssignmentClicked = function () {
            $scope.showAddSeasonAssignment = false;
        }

        $scope.loadTeams();
        $scope.loadSeasons();
        $scope.loadDrivers();
    });