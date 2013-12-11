'use strict';

/**
 * Qualification application module
 *
 * @type {angular.Module}
 */
var uiConfig = angular.module('ui.config', []).value('ui.config', {});
var kartchamp = angular.module('kartchamp', ['service', 'directive', 'filter', 'ui.config'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/dashboard', {templateUrl: '/html/partials/dashboard.html', controller: 'DashboardController'}).
            when('/race/:raceId/nomination', {templateUrl: '/html/partials/shared/nomination.html', controller: 'NominationController'}).
            when('/race/:raceId/karts', {templateUrl: '/html/partials/shared/karts.html', controller: 'KartController'}).
            when('/race/:raceId/teamcasts', {templateUrl: '/html/partials/shared/teamcasts.html', controller: 'TeamCastsController'}).
            when('/race/:raceId/teamstartorder', {templateUrl: '/html/partials/fairsprints/teamstartorder.html', controller: 'TeamStartOrderController'}).
            when('/race/:raceId/driverkarts', {templateUrl: '/html/partials/shared/driverkarts.html', controller: 'DriverKartsController'}).
            when('/race/:raceId/rideassignments', {templateUrl: '/html/partials/fairsprints/rideassignments.html', controller: 'RideAssignmentsController'}).
            when('/race/:raceId/draw', {templateUrl: '/html/partials/challenge/draw.html', controller: 'DrawController'}).
            when('/race/:raceId/qualification/:qualificationId', {templateUrl: '/html/partials/qualification/qualification.html', controller: 'QualificationController'}).
            when('/race/:raceId/challenge/:challengeId', {templateUrl: '/html/partials/challenge/challenge.html', controller: 'ChallengeController'}).
            when('/race/:raceId/fairsprints/:fairSprintsId', {templateUrl: '/html/partials/fairsprints/fairsprints.html', controller: 'FairSprintsController'}).
            when('/race/:raceId/qualificationresults', {templateUrl: '/html/partials/qualification/qualificationresults.html', controller: 'QualificationResultsController'}).
            when('/race/:raceId/challengeresults', {templateUrl: '/html/partials/challenge/challengeresults.html', controller: 'ChallengeResultsController'}).
            when('/race/:raceId/fairsprintsresults', {templateUrl: '/html/partials/fairsprints/fairsprintsresults.html', controller: 'FairSprintsResultsController'}).

            when('/management', {redirectTo: '/management/season'}).
            when('/management/season', {templateUrl: '/html/partials/management/season.html', controller: 'SeasonController'}).
            when('/management/team', {templateUrl: '/html/partials/management/team.html', controller: 'TeamController'}).
            when('/management/driver', {templateUrl: '/html/partials/management/driver.html', controller: 'DriverController'}).

            otherwise({redirectTo: '/dashboard'});
    }]);