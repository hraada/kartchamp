'use strict';

/**
 * Service that persists and retrieves rounds.
 */
service.factory('roundService', function (indexerService) {

    return {
        /**
         * Returns race round for given race and given roundIndexes
         * @param race
         * @param roundIndexes
         * @param callback when data are fetched with rounds list as parameter
         */
        getRaceRounds: function (race, roundIndexes, callback) {
            if (race) {
                var query = race.rounds;/*.filter('roundIndex', '=', roundIndexes[0]);
                angular.forEach(roundIndexes, function (roundIndex) {
                    query = query.or(new persistence.PropertyFilter('roundIndex', '=', roundIndex));
                });*/
                query.prefetch('driver').prefetch('race').prefetch('team').prefetch('kart').order('rideIndex', false).list(function (rounds) {
                    if (callback) {
                        var filteredRounds = [];
                        angular.forEach(rounds, function (round) {
                            if (round.race.id == race.id) {
                                filteredRounds.push(round);
                            }
                        })
                        callback(filteredRounds);
                    }
                });
            }
        },
        /**
         * Updates raceAssignments for given race
         * @param race race where race assignments should be updated
         * @param raceAssignments new race assignments
         * @param callback when data are flushed
         */
        updateRaceAssignments: function (race, raceAssignments, callback) {
            var self = this;
            var rounds = self.getRaceRounds(race, [0, 1, 2, 3], function (rounds) {
                var indexedRounds = indexerService.indexData(rounds, ["team.id", "driverIndex", "roundIndex"]);

                angular.forEach(raceAssignments, function (raceAssignment) {
                    for (var i = 0; i < 4; i++) {
                        indexedRounds[raceAssignment.team.id][0][i][0].driver = raceAssignment.driver;
                        indexedRounds[raceAssignment.team.id][0][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / 2) + (5 * i));
                        indexedRounds[raceAssignment.team.id][1][i][0].driver = raceAssignment.driver2;
                        indexedRounds[raceAssignment.team.id][1][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / 2) + (5 * i));
                        indexedRounds[raceAssignment.team.id][2][i][0].driver = raceAssignment.driver3;
                        indexedRounds[raceAssignment.team.id][2][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / 2) + (5 * i));
                    }
                });
                callback(indexedRounds);
            });
        }
    }
});