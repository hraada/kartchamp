'use strict';

/**
 * Service that persists and retrieves rounds.
 */
service.factory('roundService', function (indexerService, raceService) {

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
                            if (round.race.id == race.id && roundIndexes.indexOf(round.roundIndex) >= 0) {
                                filteredRounds.push(round);
                            }
                        });
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
            var qualRounds = []; 
            if (race.raceType == "challenge3x10") {
                qualRounds = [0, 1, 2];
            } if (race.raceType == "challenge2x10") {
                qualRounds = [0, 1];
            } else if (race.raceType == "qualification" || race.raceType == "fairqualification" || race.raceType == "fairqualification12") {
                qualRounds = [0, 1, 2, 3];
            } else {
                qualRounds = [0, 1];
            }
            self.getRaceRounds(race, qualRounds, function (rounds) {
            raceService.getRaceKarts(race, function (karts) {
                var indexedRounds = indexerService.indexData(rounds, ["team.id", "driverIndex", "roundIndex"]);

                angular.forEach(raceAssignments, function (raceAssignment) {
                    for (var i = 0; i < qualRounds.length; i++) {
                        
                        if (race.raceType == "challenge3x10" || race.raceType == "challenge2x10") {
                            indexedRounds[raceAssignment.team.id][0][i][0].rideIndex = 1 + 3 * i;
                            indexedRounds[raceAssignment.team.id][0][i][0].startPosition = raceAssignment.teamCast;
                            indexedRounds[raceAssignment.team.id][0][i][0].kart = karts[(raceAssignment.teamCast + (i * 3) - 1) % 10];

                            indexedRounds[raceAssignment.team.id][1][i][0].rideIndex = 2 + (3 * i);
                            indexedRounds[raceAssignment.team.id][1][i][0].startPosition = raceAssignment.teamCast;
                            indexedRounds[raceAssignment.team.id][1][i][0].kart = karts[(raceAssignment.teamCast + 1 + (i * 3) - 1) % 10];
                            
                            indexedRounds[raceAssignment.team.id][2][i][0].rideIndex = 3 + (3 * i); 
                            indexedRounds[raceAssignment.team.id][2][i][0].startPosition = raceAssignment.teamCast;
                            indexedRounds[raceAssignment.team.id][2][i][0].kart = karts[(raceAssignment.teamCast + 2 + (i * 3) - 1) % 10];

                        }

                        if (race.raceType == "qualification" || race.raceType == "challenge") {
                            indexedRounds[raceAssignment.team.id][0][i][0].driver = raceAssignment.driver;
                            indexedRounds[raceAssignment.team.id][0][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / 2) + (5 * i));
                            indexedRounds[raceAssignment.team.id][1][i][0].driver = raceAssignment.driver2;
                            indexedRounds[raceAssignment.team.id][1][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / 2) + (5 * i));
                            indexedRounds[raceAssignment.team.id][2][i][0].driver = raceAssignment.driver3;
                            indexedRounds[raceAssignment.team.id][2][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / 2) + (5 * i));
                        } 
                        if (race.raceType == "fairqualification" || race.raceType == "fairchallenge") {
                            var kartCount = 6;
                            var teamCount = raceAssignments.length; //race assignments are already indexed
                            var roundRideCount = 3 * teamCount / kartCount;

                            //indexedRounds[raceAssignment.team.id][0][i][0].driver = raceAssignment.driver;
                            indexedRounds[raceAssignment.team.id][0][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / kartCount) + (roundRideCount * i));
                            indexedRounds[raceAssignment.team.id][0][i][0].startPosition = (raceAssignment.teamCast - 1) % kartCount + 1;
                            indexedRounds[raceAssignment.team.id][0][i][0].kart = karts[(raceAssignment.teamCast - 1 + (i % 2) * roundRideCount) % kartCount];

                            //indexedRounds[raceAssignment.team.id][1][i][0].driver = raceAssignment.driver2;                            
                            indexedRounds[raceAssignment.team.id][1][i][0].rideIndex = (window.Math.ceil((teamCount + raceAssignment.teamCast) / kartCount) + (roundRideCount * i));
                            indexedRounds[raceAssignment.team.id][1][i][0].startPosition = (teamCount + raceAssignment.teamCast - 1) % kartCount + 1;
                            indexedRounds[raceAssignment.team.id][1][i][0].kart = karts[(teamCount + raceAssignment.teamCast - 1 + (i % 2) * roundRideCount) % kartCount];
                            
                            //indexedRounds[raceAssignment.team.id][2][i][0].driver = raceAssignment.driver3;
                            indexedRounds[raceAssignment.team.id][2][i][0].rideIndex = (window.Math.ceil((2 * teamCount + raceAssignment.teamCast) / kartCount) + (roundRideCount * i)); 
                            indexedRounds[raceAssignment.team.id][2][i][0].startPosition = (2 * teamCount + raceAssignment.teamCast - 1) % kartCount + 1;
                            indexedRounds[raceAssignment.team.id][2][i][0].kart = karts[(2 * teamCount + raceAssignment.teamCast - 1 + (i % 2) * roundRideCount) % kartCount];
                        }

                        if (race.raceType == "fairqualification12" || race.raceType == "fairchallenge12") {
                            var kartCount = 6;
                            var teamCount = raceAssignments.length; //race assignments are already indexed
                            var roundRideCount = 3 * teamCount / kartCount;

                            //indexedRounds[raceAssignment.team.id][0][i][0].driver = raceAssignment.driver;
                            indexedRounds[raceAssignment.team.id][0][i][0].rideIndex = (window.Math.ceil(raceAssignment.teamCast / kartCount) + (roundRideCount * i));
                            indexedRounds[raceAssignment.team.id][0][i][0].startPosition = (raceAssignment.teamCast - 1) % kartCount + 1;
                            indexedRounds[raceAssignment.team.id][0][i][0].kart = karts[(raceAssignment.teamCast - 1 + 3 * i) % kartCount];

                            //indexedRounds[raceAssignment.team.id][1][i][0].driver = raceAssignment.driver2;                            
                            indexedRounds[raceAssignment.team.id][1][i][0].rideIndex = (window.Math.ceil((teamCount + raceAssignment.teamCast) / kartCount) + (roundRideCount * i));
                            indexedRounds[raceAssignment.team.id][1][i][0].startPosition = (teamCount + raceAssignment.teamCast - 1) % kartCount + 1;
                            indexedRounds[raceAssignment.team.id][1][i][0].kart = karts[(raceAssignment.teamCast - 1 + 1 + 3 * i) % kartCount];
                            
                            //indexedRounds[raceAssignment.team.id][2][i][0].driver = raceAssignment.driver3;
                            indexedRounds[raceAssignment.team.id][2][i][0].rideIndex = (window.Math.ceil((2 * teamCount + raceAssignment.teamCast) / kartCount) + (roundRideCount * i)); 
                            indexedRounds[raceAssignment.team.id][2][i][0].startPosition = (2 * teamCount + raceAssignment.teamCast - 1) % kartCount + 1;
                            indexedRounds[raceAssignment.team.id][2][i][0].kart = karts[(raceAssignment.teamCast - 1 + 2 + 3 * i) % kartCount];
                        }
                    }
                });
                callback(indexedRounds);
            });
            });
        }
    }
});