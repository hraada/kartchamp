describe("Qualification service", function () {
	var race = null;
	
	beforeEach(function() {
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
        	
        	race = {name: 'Qualification 1', season: season, raceType: 'qualification', raceDate: new Date()};
        	raceService.save(race, function (raceEntity) {
                race = raceEntity;
            });
        	
        });
	});
	
    it("should return correct race round results", function () {
    	
    	
    	var $injector = angular.injector([ 'service' ]);    	    	 
    	var roundService = $injector.get('roundService');
    	roundService.getRaceRounds(race, [0], function(raceRounds) {
    		expect(raceRounds.length).toBe(30);
    		for (var i = 0; i < raceRounds.length; i++) {
    			var round = raceRounds[i];
    			round.resultTime = 30 - i;
    		}
    	});
    	
    	var qualificationService = $injector.get('qualificationService');                        
        

        
    	//expect(true).toBe(true);
    });
});