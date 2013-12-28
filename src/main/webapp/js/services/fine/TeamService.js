'use strict';

/**
 * Service that persists and retrieves teams.
 */
service.factory('teamService', function (persistenceService) {

    return {
        /**
         * Retrieves list of all teams
         * @param callback, with list of all teams as param
         */
        getTeams: function (callback) {
            Team.all().list(function (teams) {
                callback(teams);
            });
        },
        /**
         * Saves given team into the database
         * @param team
         * @param callback, which is called when data are flushed
         */
        save: function (team, callback) {
            if (team.id != null) {
                Team.load(team.id, function (oldTeam) {
                    oldTeam.name = team.name;
                    oldTeam.shortName = team.shortName;
                    oldTeam.castOrder = team.castOrder;
                    persistenceService.flush(function () {
                        if (callback) callback();
                    });
                });
            } else {
                persistenceService.add(new Team(team));
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            }
        },
        /**
         * Deletes given team from the database
         * @param team
         * @param callback, which is called when data are flushed
         */
        delete: function (team, callback) {
            Season.load(team.id, function (oldTeam) {
                persistenceService.remove(oldTeam);
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            });
        }

    };
});