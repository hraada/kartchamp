'use strict';

/**
 * Service that persists and retrieves race assignments.
 */
service.factory('seasonAssignmentService', function (persistenceService, indexerService) {

    return {
        /**
         * Returns season assignments indexed by team (including drivers) for given season
         * @param season season, where to search for assignments
         * @param callback returns season assigments (indexing: team.id -> [seasonAssignments])
         */
        getSeasonAssignments: function (season, callback) {
            season.seasonAssignments.prefetch('driver').prefetch('team').list(function (seasonAssignments) {
                callback(indexerService.indexData(seasonAssignments, ["team.id"]));
            });
        },
        /**
         * Returns seasson assignments indexed by year for given team
         * @param team
         * @param callback returns season assigments (indexing: season.year -> [seasonAssignments])
         */
        getTeamSeasonAssignments: function (team, callback) {
            team.seasonAssignments.prefetch('driver').prefetch('team').prefetch('season').list(function (seasonAssignments) {
                callback(indexerService.indexData(seasonAssignments, ["season.year"]));
            });
        },
        /**
         * Saves given season assignment into the database
         * @param seasonAssignment
         * @param callback, which is called when data are flushed
         */
        save: function (seasonAssignment, callback) {
            if (seasonAssignment.id != null) {
                SeasonAssignment.load(seasonAssignment.id, function (oldSeasonAssignment) {
                    oldSeasonAssignment.driver = seasonAssignment.driver;
                    oldSeasonAssignment.season = seasonAssignment.season;
                    oldSeasonAssignment.team = seasonAssignment.team;
                    persistenceService.flush(function () {
                        if (callback) callback();
                    });
                });
            } else {
                persistenceService.add(new SeasonAssignment(seasonAssignment));
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            }
        },
        /**
         * Deletes given season assignment from the database
         * @param seasonAssignment
         * @param callback, which is called when data are flushed
         */
        delete: function (seasonAssignment, callback) {
            SeasonAssignment.load(seasonAssignment.id, function (oldSeasonAssignment) {
                persistenceService.remove(oldSeasonAssignment);
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            });
        }
    };
});