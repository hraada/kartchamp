'use strict';

/**
 * Service that persists and retrieves races.
 */
service.factory('raceService', function (persistenceService, seasonAssignmentService) {

    return {
        /**
         * Retrieves list of all races
         * @param season of the races to be listed (optional)
         * @param callback, with list of all drivers as param
         */
        getRaces: function (season, callback) {
        	if (season) {
                season.races.list(function (races) {
                    callback(races);
                });

        	} else {
                Race.all().list(function (races) {
                    callback(races);
                });
        	}
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
                    {id: 'qualification', label: 'Kvalifikace (10 týmů, 6 motokár)'},
                    {id: 'challenge', label: 'Challenge (10 týmů, 6 motokár)'},
                    {id: 'challenge3x10', label: 'Big Challenge 3x10 (10 týmů, 10 motokár)'},
                    {id: 'challenge3x12', label: 'Big Challenge 3x12 (12 týmů, 12 motokár)'},
                    {id: 'challenge2x10', label: 'Big Challenge 2x10 (10 týmů, 10 motokár)'},
                    {id: 'challenge2x12', label: 'Big Challenge 2x12 (12 týmů, 12 motokár)'},
                    {id: 'fairsprints', label: 'Spravedlivé sprinty (10 týmů, 10 motokár)'},
                    {id: 'fairsprints9', label: 'Spravedlivé sprinty (9 týmů, 9 motokár)'},
                    {id: 'fairsprints12', label: 'Spravedlivé sprinty (12 týmů, 12 motokár)'},
                    {id: 'fairqualification', label: 'Spravedlivá kvalifikace (10 týmů, 6 motokár)'},
                    {id: 'fairqualification12', label: 'Spravedlivá kvalifikace (12 týmů, 6 motokár)'},
                    {id: 'fairqualification12on9', label: 'Spravedlivá kvalifikace (12 týmů, 9 motokár)'},
                    {id: 'fairchallenge', label: 'Spravedlivý challenge (10 týmů, 6 motokár)'},
                    {id: 'fairchallenge12', label: 'Spravedlivý challenge (12 týmů, 6 motokár)'}
                ],
                idToLabel: {
                    qualification: 'Kvalifikace (10 týmů, 6 motokár)',
                    challenge: 'Challenge (10 týmů, 6 motokár)',
                    challenge3x10: 'Big Challenge 3x10 (10 týmů, 10 motokár)',
                    challenge3x12: 'Big Challenge 3x12 (12 týmů, 12 motokár)',
                    challenge2x10: 'Big Challenge 2x10 (10 týmů, 10 motokár)',
                    challenge2x12: 'Big Challenge 2x12 (12 týmů, 12 motokár)',
                    fairsprints: 'Spravedlivé sprinty (10 týmů, 10 motokár)',
                    fairsprints9: 'Spravedlivé sprinty (9 týmů, 9 motokár)' ,
                    fairsprints12: 'Spravedlivé sprinty (12 týmů, 12 motokár)' ,
                    fairqualification: 'Spravedlivá kvalifikace (10 týmů, 6 motokár)',
                    fairqualification12: 'Spravedlivá kvalifikace (12 týmů, 6 motokár)',
                    fairqualification12on9: 'Spravedlivá kvalifikace (12 týmů, 9 motokár)',
                    fairchallenge: 'Spravedlivý challenge (10 týmů, 6 motokár)',
                    fairchallenge12: 'Spravedlivý challenge (12 týmů, 6 motokár)'

                }
            }
        },
        /**
         * Returns true, if given race is qualification
         * @param race
         * @return {boolean} true if given race is qualification
         */
        isQualification: function (race) {
            if (race.raceType == 'qualification' || race.raceType == 'fairqualification' || race.raceType == 'fairqualification12') {
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
            if (race.raceType == 'challenge' || race.raceType == 'fairchallenge' || race.raceType == 'fairchallenge12') {
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
        isBigChallenge: function (race) {
            return this.isChallenge3x10(race) || this.isChallenge2x10(race) || this.isChallenge3x12(race) || this.isChallenge2x12(race);
        },
        /**
         * Returns true, if given race is challenge
         * @param race
         * @return {boolean} true if given race is challenge
         */
        isChallenge3x10: function (race) {
            if (race.raceType == 'challenge3x10') {
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
        isChallenge2x10: function (race) {
            if (race.raceType == 'challenge2x10') {
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
        isChallenge3x12: function (race) {
            if (race.raceType == 'challenge3x12') {
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
        isChallenge2x12: function (race) {
            if (race.raceType == 'challenge2x12') {
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
            if (race.raceType == 'fairsprints' || race.raceType == 'fairsprints9' || race.raceType == 'fairsprints12') {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Saves given race into the database (default data for race are created)
         * @param race
         * @param callback, which is called when data are flushed (entity is passed as param)
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
                        if (callback) callback(race);
                    });
                });
            } else {
                race = new Race(race);
                persistenceService.add(race);
                this._createDefaultRaceData(race, function () {
                    persistenceService.flush(function () {
                        if (callback) callback(race);
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

            function addTeamRounds(team, roundIndex, type, driverIndexStart, driverIndexEnd, writeRideIndex) {
                for (var driverIndex = driverIndexStart; driverIndex < driverIndexEnd; driverIndex++) {

                    var round = new Round({type: type, roundIndex: roundIndex, driverIndex: driverIndex, time: 0, startPosition: 0, resultPosition: 0});
                    if (writeRideIndex) {   //fair sprints know ride index without casting
                        round.rideIndex = driverIndex + 1;
                    }
                    round.race = race;
                    round.team = team;
                    round.driver = null;
                    round.kart = null;
                    persistenceService.add(round);
                }
            }

            function addTeamRaceRounds(race, team) {
                if (race.raceType == 'qualification' || race.raceType == 'fairqualification' || race.raceType == 'fairqualification12') {
                    for (var i = 0; i < 4; i++) {
                        addTeamRounds(team, i, 'qualification', 0, 3, false);
                    }
                } else if (race.raceType == 'fairqualification12on9') {
                  for (var i = 0; i < 3; i++) {
                      addTeamRounds(team, i, 'qualification', 0, 3, false);
                  }
                } else if (race.raceType == 'challenge' || race.raceType == 'fairchallenge' || race.raceType == 'fairchallenge12') {
                    addTeamRounds(team, 0, 'qualification', 0, 3, false);
                    addTeamRounds(team, 1, 'qualification', 0, 3, false);
                    addTeamRounds(team, 2, 'race', 0, 3, false);
                    addTeamRounds(team, 3, 'race', 0, 3, false);
                } else if (race.raceType == 'fairsprints') {
                    addTeamRounds(team, 0, 'race', 0, 10, true);
                    addTeamRounds(team, 1, 'race', 10, 20, true);
                } else if (race.raceType == 'fairsprints9') {
                    addTeamRounds(team, 0, 'race', 0, 9, true);
                    addTeamRounds(team, 1, 'race', 9, 18, true);
                } else if (race.raceType == 'fairsprints12') {
                    addTeamRounds(team, 0, 'race', 0, 12, true);
                    addTeamRounds(team, 1, 'race', 12, 24, true);
                } else if (race.raceType == 'challenge3x10' || race.raceType == 'challenge3x12') {
                    addTeamRounds(team, 0, 'qualification', 0, 3, false);
                    addTeamRounds(team, 1, 'qualification', 0, 3, false);
                    addTeamRounds(team, 2, 'qualification', 0, 3, false);
                    addTeamRounds(team, 3, 'race', 0, 3, false);
                    addTeamRounds(team, 4, 'race', 0, 3, false);
                    addTeamRounds(team, 5, 'race', 0, 3, false);
                } else if (race.raceType == 'challenge2x10' || race.raceType == 'challenge2x12') {
                    addTeamRounds(team, 0, 'qualification', 0, 3, false);
                    addTeamRounds(team, 1, 'qualification', 0, 3, false);
                    addTeamRounds(team, 2, 'race', 0, 3, false);
                    addTeamRounds(team, 3, 'race', 0, 3, false);
                }

            }

            function addRaceAssignment(race, team) {
                var raceAssignment = new RaceAssignment({driver: null, driver2: null, driver3: null, team: team, race: race});
                persistenceService.add(raceAssignment);
            }

            if (race.raceType == 'fairsprints12' || race.raceType == 'challenge3x12' || race.raceType == 'challenge2x12') {
                addKarts(12, race);
            } else if (race.raceType == 'fairsprints' || race.raceType == 'challenge3x10' || race.raceType == 'challenge2x10') {
                addKarts(10, race);
            } else if (race.raceType == 'fairsprints9') {
                addKarts(9, race);
            } else if (race.raceType == 'fairqualification12on9') {
                addKarts(9, race);
            } else {
                addKarts(6, race);
            }

            seasonAssignmentService.getSeasonAssignments(race.season, function (indexedSeasonAssignments) {
                var seasonAssignmentsCount = 0;
                angular.forEach(indexedSeasonAssignments, function (seasonAssignment) {
                    addTeamRaceRounds(race, seasonAssignment[0].team); //It doesnt matter which index...
                    addRaceAssignment(race, seasonAssignment[0].team);
                    seasonAssignmentsCount++;
                });
                if (seasonAssignmentsCount < 9) {
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
