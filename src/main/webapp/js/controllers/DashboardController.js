'use strict';

/**
 */
kartchamp.controller('DashboardController', function DashboardController($scope, raceService, seasonService, $location) {

	$scope.$watch('selectedSeason', function(selectedSeason) {
		raceService.getRaces($scope.selectedSeason, function(races) {
            $scope.races = races;
            $scope.$$phase || $scope.$apply();
        });
	});
    seasonService.getSeasons(function(seasons) {
    	$scope.seasons = seasons;
    	$scope.selectedSeason = seasons[0];    	
    	$scope.$$phase || $scope.$apply();    	    	
    });
    $scope.raceFormats = raceService.getRaceFormats();
    $scope.editRaceButtonClicked = function (race) {
        document.location = '#/race/' + race.id + '/nomination';
    }

    $scope.loadAppTestData = function () {
        var driver1 = new Driver({name: 'Mikuláš', surname: 'Dula'});
        persistence.add(driver1);
        var driver2 = new Driver({name: 'Pavel', surname: 'Klouda'});
        persistence.add(driver2);
        var driver3 = new Driver({name: 'Ondřej', surname: 'Zaleš'});
        persistence.add(driver3);

        var driver4 = new Driver({name: 'Jiří', surname: 'Vostoupal'});
        persistence.add(driver4);
        var driver5 = new Driver({name: 'Pavel', surname: 'Matějíček'});
        persistence.add(driver5);
        var driver19 = new Driver({name: 'Petr', surname: 'Zoubek'});
        persistence.add(driver19);
        var driver14 = new Driver({name: 'Anton', surname: 'Cazanic'});
        persistence.add(driver14);

        var driver7 = new Driver({name: 'Ondrěj', surname: 'Suchomel'});
        persistence.add(driver7);
        var driver8 = new Driver({name: 'Bronislav', surname: 'Růžička'});
        persistence.add(driver8);
        var driver9 = new Driver({name: 'Jakub', surname: 'Chlubna'});
        persistence.add(driver9);

        var driver10 = new Driver({name: 'Radim', surname: 'Hradecký'});
        persistence.add(driver10);
        var driver11 = new Driver({name: 'Pavel', surname: 'Batík'});
        persistence.add(driver11);
        var driver12 = new Driver({name: 'Richard', surname: 'Tesař'});
        persistence.add(driver12);
        var driver16 = new Driver({name: 'Patrik', surname: 'Novotný'});
        persistence.add(driver16);

        var driver13 = new Driver({name: 'Michaela', surname: 'Veselá'});
        persistence.add(driver13);
        var driver15 = new Driver({name: 'David', surname: 'Matějů'});
        persistence.add(driver15);
        var driver31 = new Driver({name: 'František', surname: 'Urbánek'});
        persistence.add(driver31);

        var driver20 = new Driver({name: 'Robert', surname: 'Matuška'});
        persistence.add(driver20);
        var driver21 = new Driver({name: 'Petr', surname: 'Dolejš'});
        persistence.add(driver21);
        var driver6 = new Driver({name: 'Tomáš', surname: 'Málek'});
        persistence.add(driver6);

        var driver22 = new Driver({name: 'Michal', surname: 'Pavlát'});
        persistence.add(driver22);
        var driver23 = new Driver({name: 'Jaroslav', surname: 'Volák'});
        persistence.add(driver23);
        var driver32 = new Driver({name: 'David', surname: 'Leníček'});
        persistence.add(driver32);
        var driver33 = new Driver({name: 'Robert', surname: 'Leníček'});
        persistence.add(driver33);
        var driver34 = new Driver({name: 'Jan', surname: 'Ranný'});
        persistence.add(driver34);
        var driver24 = new Driver({name: 'Radim', surname: 'Valdauf'});
        persistence.add(driver24);

        var driver25 = new Driver({name: 'Jan', surname: 'Šula'});
        persistence.add(driver25);
        var driver26 = new Driver({name: 'Jan', surname: 'Tomšíček'});
        persistence.add(driver26);
        var driver27 = new Driver({name: 'Peter', surname: 'Helcmanovský'});
        persistence.add(driver27);

        var driver28 = new Driver({name: 'Bedřich', surname: 'Málek'});
        persistence.add(driver28);
        var driver29 = new Driver({name: 'Richard', surname: 'Kába'});
        persistence.add(driver29);
        var driver30 = new Driver({name: 'Michal', surname: 'Prudil'});
        persistence.add(driver30);

        var driver35 = new Driver({name: 'Petr', surname: 'Hošek'});
        persistence.add(driver35);
        var driver36 = new Driver({name: 'Martin', surname: 'Hošek'});
        persistence.add(driver36);
        var driver37 = new Driver({name: 'Radek', surname: 'Petera'});
        persistence.add(driver37);

        var driver38 = new Driver({name: 'Alex', surname: 'Jiránek'});
        persistence.add(driver38);

        var team1 = new Team({name: '3K Racing', shortName: '3K', castOrder: 1});
        persistence.add(team1);
        var team2 = new Team({name: 'Mishmash Motosport', shortName: 'Mishmash', castOrder: 2});
        persistence.add(team2);
        var team3 = new Team({name: 'Rebels Racing', shortName: 'Rebels', castOrder: 6});
        persistence.add(team3);
        var team4 = new Team({name: 'K.R.T. Racing', shortName: 'K.R.T.', castOrder: 3});
        persistence.add(team4);
        var team5 = new Team({name: 'KORODI', shortName: 'KORODI', castOrder: 4});
        persistence.add(team5);
        var team6 = new Team({name: 'Trakař Racing', shortName: 'Trakař', castOrder: 10});
        persistence.add(team6);
        var team7 = new Team({name: 'Top Grip Racing', shortName: 'Top Grip', castOrder: 5});
        persistence.add(team7);
        var team8 = new Team({name: 'Solid Curves Drive', shortName: 'Solid Curves', castOrder: 8});
        persistence.add(team8);
        var team9 = new Team({name: 'Redšneks', shortName: 'Redšneks', castOrder: 7});
        persistence.add(team9);
        var team10 = new Team({name: 'RS Racing', shortName: 'RS Racing', castOrder: 9});
        persistence.add(team10);


        var season = new Season({name: 'Sezóna 2013', year: 2013});
        persistence.add(season);

        function assignTeam(driver1, driver2, driver3, team) {
            var seasonAssignment = new SeasonAssignment({driver: driver1, season: season, team: team});
            persistence.add(seasonAssignment);
            var seasonAssignment2 = new SeasonAssignment({driver: driver2, season: season, team: team});
            persistence.add(seasonAssignment2);
            var seasonAssignment3 = new SeasonAssignment({driver: driver3, season: season, team: team});
            persistence.add(seasonAssignment3);
        }

        assignTeam(driver1, driver2, driver3, team1);
        assignTeam(driver4, driver5, driver6, team2);
        assignTeam(driver7, driver8, driver9, team3);
        assignTeam(driver10, driver11, driver12, team4);
        assignTeam(driver13, driver14, driver15, team5);
        assignTeam(driver16, driver31, driver32, team6);
        assignTeam(driver19, driver20, driver21, team7);
        assignTeam(driver22, driver23, driver24, team8);
        assignTeam(driver25, driver26, driver27, team9);
        assignTeam(driver28, driver29, driver30, team10);

        persistence.flush(function () {
            var race1 = {id: null, name: 'Qualification 1', season: season, raceType: 'qualification', raceDate: new Date()};
            var race2 = {id: null, name: 'Challenge 1', season: season, raceType: 'challenge', raceDate: new Date()};
            raceService.save(race1, function () {
                raceService.save(race2, function () {
                    persistence.flush();
                });
            });
        });
    }
});