describe("Persistence tests", function () {
    it("initilize connection", function () {
        persistence.store.websql.config(persistence, 'kartchamp', 'Database for kartchamp application', 20 * 1024 * 1024);

        var Driver = persistence.define('driver', {
            name: 'TEXT',
            surname: 'TEXT'
        });

        var Team = persistence.define('team', {
            name: 'TEXT'
        });

        var Race = persistence.define('race', {
            name: 'TEXT',
            raceDate: 'DATE',
            raceType: 'TEXT'
        });

        var Round = persistence.define('round', {
            type: 'TEXT',
            result_time: 'INT',
            result_position: 'INT'
        });

        var SeasonAssignment = persistence.define('season_assignment', {

        });

        var RaceAssignment = persistence.define('race_assignment', {

        });

        Team.hasMany('seasonAssignments', SeasonAssignment, 'team');
        Driver.hasMany('seasonAssignments', SeasonAssignment, 'driver');

        persistence.schemaSync();

        /*task.tags.add(tag);
         tasks.tags.remove(tag);
         tasks.tags.list(tx, function(allTags) { console.log(allTags); });        */

        /*var team = new Team({name: 'K.R.T. Racing'});
         persistence.add(team);
         persistence.flush(function() {

         });         */
        var team = new Team({name: 'K.R.T. Racing'});
        persistence.add(team);
        persistence.flush(function () {


            var teams = Team.all().filter('name', '=', 'K.R.T. Racing');
            teams.list(function (results) {
                results.forEach(function (team) {
                    console.log(team.name);
                    var driver = new Driver({name: 'Radim', surname: 'Hradecký'});
                    persistence.add(driver);
                    var driver2 = new Driver({name: 'Pavel', surname: 'Batik'});
                    persistence.add(driver2);
                    var driver3 = new Driver({name: 'Richard', surname: 'Tesar'});
                    persistence.add(driver3);


                    var seasonAssignment = new SeasonAssignment({});
                    var seasonAssignment2 = new SeasonAssignment({});
                    var seasonAssignment3 = new SeasonAssignment({});
                    persistence.add(seasonAssignment);
                    persistence.add(seasonAssignment2);
                    persistence.add(seasonAssignment3);

                    driver.seasonAssignments.add(seasonAssignment);
                    driver2.seasonAssignments.add(seasonAssignment2);
                    driver3.seasonAssignments.add(seasonAssignment3);


                    team.seasonAssignments.add(seasonAssignment);
                    team.seasonAssignments.add(seasonAssignment2);
                    team.seasonAssignments.add(seasonAssignment3);

                    persistence.flush(function () {

                    });
                });
            });
        });
    });
});