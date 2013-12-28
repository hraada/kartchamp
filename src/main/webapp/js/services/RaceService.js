'use strict';

/**
 * Service that persists and retrieves races.
 */
service.factory('raceService', function (persistenceService, seasonAssignmentService) {

    return {
        /**
         * Retrieves list of all races
         * @param callback, with list of all drivers as param
         */
        getRaces: function (callback) {
            Race.all().list(function (races) {
                callback(races);
            });
        },
        /**
         * Retrieves race for give id
         * @param raceId
         * @param callback, with race as param
         */
        getRaceById: function (raceId, callback) {
            Race.load(raceId, function (race) {
                if (race) {
                    race.fetch('season', function () {
                        callback(race);
                    });
                }
            });
        },
        /**
         * Retrieves list of karts assigned to the race (ordered)
         * @param race
         * @param callback, with kart list as param
         */
        getRaceKarts: function (race, callback) {
            race.karts.order('kartIndex', true).list(function (karts) {
                callback(karts);
            });
        },
        /**
         * Retrieves object with description of available racing formats
         * @return {{formatList: Array, idToLabel: {qualification: string, challenge: string}}}
         */
        getRaceFormats: function () {
            return {
                formatList: [
                    {id: 'qualification', label: 'Kvalifikace'},
                    {id: 'challenge', label: 'Challenge'},
                    {id: 'fairsprints', label: 'Spravedlivé sprinty'}
                ],
                idToLabel: { qualification: 'Kvalifikace', challenge: 'Challenge', fairsprints: 'Spravedlivé sprinty' }
            }
        },
        /**
         * Returns true, if given race is qualification
         * @param race
         * @return {boolean} true if given race is qualification
         */
        isQualification: function (race) {
            if (race.raceType == 'qualification') {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Returns true, if given race is challenge
         * @param race
         * @return {boolean} true if given race is challenge
         */
        isChallenge: function (race) {
            if (race.raceType == 'challenge') {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Returns true, if given race is fair sprints
         * @param race
         * @return {boolean} true if given race is challenge
         */
        isFairSprints: function (race) {
            if (race.raceType == 'fairsprints') {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Saves given race into the database (default data for race are created)
         * @param race
         * @param callback, which is called when data are flushed
         * @param error callback to be called, when something goes wrong
         */
        save: function (race, callback, error) {
            if (race.id != null) {
                Race.load(race.id, function (oldRace) {
                    oldRace.name = race.name;
                    oldRace.raceType = race.raceType;
                    oldRace.raceDate = race.raceDate;
                    oldRace.season = race.season;
                    persistenceService.flush(function () {
                        if (callback) callback();
                    });
                });
            } else {
                race = new Race(race);
                persistenceService.add(race);
                this._createDefaultRaceData(race, function () {
                    persistenceService.flush(function () {
                        if (callback) callback();
                    });
                }, error);

            }
        },
        /**
         * Private method for create default data associated to race
         * @param race
         * @param callback, which is called when data are flushed
         * @param error callback to be called, when something goes wrong
         * @private
         */
        _createDefaultRaceData: function (race, callback, error) {

            function addKarts(count, race) {
                for (var i = 0; i < count; i++) {
                    var kart = new Kart({number: 'N/A', kartIndex: i});
                    kart.race = race;
                    persistenceService.add(kart);
                }
            }

            function addRounds(team, roundIndex, type, roundStart, roundCount, writeRideIndex) {
                for (var i = roundStart; i < roundCount; i++) {

                    var round = new Round({type: type, roundIndex: roundIndex, driverIndex: i, time: 0, startPosition: 0, resultPosition: 0});
                    if (writeRideIndex) {   //fair sprints know ride index without casting
                        round.rideIndex = i + 1;
                    }
                    round.race = race;
                    round.team = team;
                    round.driver = null;
                    round.kart = null;
                    persistenceService.add(round);
                }
            }

            function addRaceRounds(race, team) {
                if (race.raceType == 'qualification') {
                    for (var i = 0; i < 4; i++) {
                        addRounds(team, i, 'qualification', 0, 3, false);
                    }
                } else if (race.raceType == 'challenge') {
                    addRounds(team, 0, 'qualification', 0, 3, false);
                    addRounds(team, 1, 'qualification', 0, 3, false);
                    addRounds(team, 2, 'race', 0, 3, false);
                    addRounds(team, 3, 'race', 0, 3, false);
                } else if (race.raceType == 'fairsprints') {
                    addRounds(team, 0, 'race', 0, 10, true);
                    addRounds(team, 1, 'race', 10, 20, true);
                }

            }

            function addRaceAssignment(race, team) {
                var raceAssignment = new RaceAssignment({driver: null, driver2: null, driver3: null, team: team, race: race});
                persistenceService.add(raceAssignment);
            }

            if (race.raceType == 'fairsprints') {
                addKarts(10, race);
            } else {
                addKarts(6, race);
            }

            seasonAssignmentService.getSeasonAssignments(race.season, function (indexedSeasonAssignments) {
                var seasonAssignmentsCount = 0;
                angular.forEach(indexedSeasonAssignments, function (seasonAssignment) {
                    addRaceRounds(race, seasonAssignment[0].team); //It doesnt matter which index...
                    addRaceAssignment(race, seasonAssignment[0].team);
                    seasonAssignmentsCount++;
                });                    
                if (seasonAssignmentsCount < 10) {
                    error('Nepodařilo se založit data závodu. Pro založení závodu v sezóně je potřeba mít založené členy všech týmů pro sezónu.');
                } else {
                    callback();
                }                
            })


        },
        /**
         * Deletes given race and all associated data from the database
         * @param race to be deleted
         * @param callback, which is called when data are flushed
         */
        delete: function (race, callback) {
            Season.load(race.id, function (oldRace) {
                oldRace.karts.destroyAll();
                oldRace.raceAssignments.destroyAll();
                oldRace.rounds.destroyAll();

                persistenceService.remove(oldRace);
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            });
        }
    };
});