var Season = persistence.define('season', {
    name: 'TEXT',
    year: 'INT'
});

var Driver = persistence.define('driver', {
    name: 'TEXT',
    surname: 'TEXT'
});

var Team = persistence.define('team', {
    name: 'TEXT',
    shortName: 'TEXT',
    castOrder: 'INT'
});

var Race = persistence.define('race', {
    name: 'TEXT',
    raceDate: 'DATE',
    raceType: 'TEXT'
});

var Kart = persistence.define('kart', {
    kartIndex: 'INT',
    number: 'TEXT'  //In some cases, numbers can contain for exmple leading zero etc.
});

var Round = persistence.define('round', {
    type: 'TEXT',
    roundIndex: 'INT', // Race are usually separated into rounds. In general in each round every driver should participate and for each round, results should be possible to made (qualification 1, qualification 2, race 1, race 2)
    rideIndex: 'INT', // Because all drivers can not be at the same time on the track, race consist from set of rides
    driverIndex: 'INT', //Originally, this was driver order in ride, but it is not used now
    bestTime: 'INT', //Best time for challenge
    resultTime: 'INT', //Time for qualification
    startPosition: 'INT', //Starting position for challenge
    resultPosition: 'INT' //Result position for challenge and in case of same time driver order for qualification
});

var SeasonAssignment = persistence.define('season_assignment', {

});

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

