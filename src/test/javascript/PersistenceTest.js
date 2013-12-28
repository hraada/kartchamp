describe("Persistence tests", function () {
    it("initilize connection", function () {
    	var $injector = angular.injector([ 'service' ]);
        var raceService = $injector.get('raceService');
        
        var drivers = [];
        var teams = [];
        
        for (var i = 0; i < 30; i++) {
        	drivers[i] = new Driver({name: 'Generated', surname: 'Driver ' + i});
            persistence.add(drivers[i]);            	
        }
        
        for (var i = 0; i < 10; i++) {
        	teams[i] = new Team({name: 'Generated team ' + i, shortName: 'GT ' + i, castOrder: i + 1});
            persistence.add(teams[i]);            	
        }
        
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

        for (var i = 0; i < 10; i++) {
        	assignTeam(drivers[i], drivers[i + 10], drivers[i + 20], teams[i]);
        }
        
        persistence.flush(function () {
        	Team.all().list(function(teams) {
        		expect(teams.length).toBe(10);
        	});
        	Driver.all().list(function(drivers) {
        		expect(drivers.length).toBe(30);
        	});
        	SeasonAssignment.all().list(function(seasonAssignments) {
        		expect(seasonAssignments.length).toBe(30);
        	});
        	/*
            var race1 = {id: null, name: 'Qualification 1', season: season, raceType: 'qualification', raceDate: new Date()};
            var race2 = {id: null, name: 'Challenge 1', season: season, raceType: 'challenge', raceDate: new Date()};
            raceService.save(race1, function () {
                raceService.save(race2, function () {
                    persistence.flush();
                });
            });*/
        });

        
    	//expect(true).toBe(true);
    });
});