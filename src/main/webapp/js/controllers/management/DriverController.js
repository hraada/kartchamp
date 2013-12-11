'use strict';

/**
 */
kartchamp.controller('DriverController',
    function DriverController($scope, $routeParams, driverService, persistenceService) {
        $scope.showDriverEdit = false;
        $scope.editedDriver = {};
        $scope.selectedDriver = null;


        $scope.loadDrivers = function () {
            driverService.getDrivers(function (drivers) {
                $scope.drivers = drivers;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.addDriverClicked = function () {
            $scope.editedDriver = {id: null, name: '', surname: ''};
            $scope.showDriverEdit = true;
        }

        $scope.editDriverClicked = function (driver) {
            $scope.editedDriver = {id: driver.id, name: driver.name, surname: driver.surname};
            $scope.showDriverEdit = true;
        }

        $scope.saveDriverClicked = function () {
            driverService.save($scope.editedDriver, function () {
                $scope.showDriverEdit = false;
                $scope.loadDrivers();
            });
        }

        $scope.deleteDriverClicked = function () {
            $scope.showDriverEdit = false;
            driverService.delete($scope.editedDriver, function () {
                $scope.loadDrivers();
            });
        }

        $scope.cancelDriverEditClicked = function () {
            $scope.showDriverEdit = false;
        }

        $scope.loadDrivers();
    });