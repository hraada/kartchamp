'use strict';

/**
 * Service that persists and retrieves seasons.
 */
service.factory('seasonService', function (persistenceService) {

    return {
        /**
         * Retrieves list of all seasons
         * @param callback, with list of all seasons as param
         */
        getSeasons: function (callback) {
            Season.all().order('year', false).list(function (seasons) {
                callback(seasons);
            });
        },
        /**
         * Retrieves list of all races in given season
         * @param season
         * @param callback, with list of all season races as param
         */
        getSeasonRaces: function (season, callback) {
            season.races.list(function (seasonRaces) {
                callback(seasonRaces);
            });
        },
        /**
         * Saves given season into the database
         * @param season
         * @param callback, which is called when data are flushed
         */
        save: function (season, callback) {
            if (season.id != null) {
                Season.load(season.id, function (oldSeason) {
                    oldSeason.name = season.name;
                    oldSeason.year = season.year;
                    persistenceService.flush(function () {
                        if (callback) callback();
                    });
                });
            } else {
                persistenceService.add(new Season(season));
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            }
        },
        /**
         * Deletes given season from the database
         * @param season
         * @param callback, which is called when data are flushed
         */
        delete: function (season, callback) {
            Season.load(season.id, function (oldSeason) {
                persistenceService.remove(oldSeason);
                persistenceService.flush(function () {
                    if (callback) callback();
                });
            });
        }
    };
});