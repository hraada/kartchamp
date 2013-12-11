'use strict';

/**
 * Controller for import/export of database data.
 */
kartchamp.controller('ImportExportController',
    function ImportExportController($scope, $routeParams, persistenceService) {
        $scope.databaseDump = '';

        $scope.saveExportClicked = function () {
            document.location = "data:application/txt;charset=utf-8," + encodeURIComponent($scope.databaseDump);
        }

        $scope.exportButtonClicked = function () {
            persistenceService.dumpToJson(function (dump) {
                $scope.databaseDump = dump;

                var date = new Date();
                $scope.databaseDumpFileName = 'kartchamp-dump-' + date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate() + '.txt'
                $scope.databaseDumpEncoded = encodeURIComponent(dump);

                $scope.$$phase || $scope.$apply();
            })
        }

    });