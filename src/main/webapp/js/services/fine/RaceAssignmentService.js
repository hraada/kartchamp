'use strict';

/**
 * Service that persists and retrieves race assignments.
 */
service.factory('raceAssignmentService', function (persistenceService) {

    return {
        /**
         * Returns list of race assignments for given race
         * @param race
         * @param callback,which is called, when data are fetched
         */
        getRaceAssignments: function (race, callback) {
            race.raceAssignments.prefetch('team').prefetch('driver').prefetch('driver2').prefetch('driver3').list(function (raceAssignments) {
                callback(raceAssignments);
            });
        }
    };
});