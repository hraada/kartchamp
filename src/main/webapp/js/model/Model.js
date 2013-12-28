/**
 * PersistenceJS configuration
 * 
 * At first tables are defined, then associations are defined
 */


//Seasons table
var Season = persistence.define('season', {
    name: 'TEXT',
    year: 'INT'
});

//Drivers table
var Driver = persistence.define('driver', {
    name: 'TEXT',
    surname: 'TEXT'
});

//Teams table
var Team = persistence.define('team', {
    name: 'TEXT',
    shortName: 'TEXT',
    castOrder: 'INT'
});

//Race table (every season have several races)
var Race = persistence.define('race', {
    name: 'TEXT',
    raceDate: 'DATE',
    raceType: 'TEXT'
});

//Kart table
var Kart = persistence.define('kart', {
    kartIndex: 'INT',
    number: 'TEXT'  //In some cases, numbers can contain for exmple leading zero etc. (that's why text i data type is used)
});

//Round table (every race have several rounds)
var Round = persistence.define('round', {
    type: 'TEXT',
    roundIndex: 'INT', // Races are usually separated into rounds. In general in each round every driver should participate and for each round, results should be possible to made (qualification and challenge have 4 round, fairsprints have 2)
    rideIndex: 'INT', // Because all drivers can not be at the same time on the track, race consist from set of rides (usually 20 for all formats)
    driverIndex: 'INT', //Originally, this was driver order in ride, but it is not used now
    bestTime: 'INT', //Best time for challenge and fair sprints
    resultTime: 'INT', //Time for qualification
    startPosition: 'INT', //Starting position for challenge and fair sprints
    resultPosition: 'INT' //Result position for challenge and fair sprints and in case of same time driver order for qualification
});

//SeasonAssignment table (in every season, team may have several drivers)
var SeasonAssignment = persistence.define('season_assignment', {

});

//RaceAssignment table (for every race, team may choose 3 drivers to race)
var RaceAssignment = persistence.define('race_assignment', {
    teamCast: 'INT'
});



Team.hasMany('seasonAssignments', SeasonAssignment, 'team');
Driver.hasMany('seasonAssignments', SeasonAssignment, 'driver');
Season.hasMany('seasonAssignments', SeasonAssignment, 'season');
Season.hasMany('races', Race, 'season');

Team.hasMany('raceAssignments', RaceAssignment, 'team');
Team.hasMany('rounds', Round, 'team');

Driver.hasMany('raceAssignments', RaceAssignment, 'driver');
Driver.hasMany('raceAssignments', RaceAssignment, 'driver2');
Driver.hasMany('raceAssignments', RaceAssignment, 'driver3');
Driver.hasMany('rounds', Round, 'driver');

Race.hasMany('raceAssignments', RaceAssignment, 'race');
Race.hasMany('rounds', Round, 'race');
Race.hasMany('karts', Kart, 'race');

Round.hasOne('kart', Kart);

