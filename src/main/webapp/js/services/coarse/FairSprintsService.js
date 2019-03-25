'use strict';

/**
 * Service that computes, persists and retrieves challenge data.
 */
service.factory('fairSprintsService', function (persistenceService) {

    return {
        //First index is resultPosition == 0, that's when result was not set
        fairSprintsPoints: [0, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
        fairSprintsPoints9: [0, 10, 8, 6, 5, 4, 3, 2, 1, 0],
        fairSprintsPoints12: [0, 15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0],

        getFairSprintsRoundResults: function (race, roundIndex, callback) {
            race.rounds.filter('roundIndex', '=', roundIndex).order('rideIndex', true).order('resultPosition', true).list(function (results) {
                callback(results);
            });
        },
        getRaceRoundSchedule: function (race, round, callback) {
            race.rounds.filter('roundIndex', '==', round).order('roundIndex', true).order('rideIndex').order('startPosition').prefetch('kart').prefetch('driver').prefetch('team').list(function (rounds) {
                var indexedRounds = {};

                //Grouping
                angular.forEach(rounds, function (round) {
                    if (indexedRounds[round.rideIndex]) {
                        indexedRounds[round.rideIndex].rounds.push(round);
                    } else {
                        indexedRounds[round.rideIndex] = {rideIndex: round.rideIndex, rounds: [round]};
                    }
                });

                //Back to array, otherwise sorting doesn't work.. (10 < 6)
                var arrRounds = [];
                angular.forEach(indexedRounds, function (indexedRound) {
                    arrRounds.push(indexedRound);
                });
                callback(arrRounds);
            });
        },
        addRaceRound: function (race, team, driver, kart, roundIndex, rideIndex, startPosition) {
            var round = new Round({type: 'race', roundIndex: roundIndex, rideIndex: rideIndex, startPosition: startPosition});
            round.race = race;
            round.team = team;
            round.driver = driver;
            round.kart = kart;
            persistenceService.add(round);
        },
        getPoints: function(position, raceType) {
            if (raceType == 'fairsprints') {
                return this.fairSprintsPoints[position];
            } else if (raceType == 'fairsprints9') {
                return this.fairSprintsPoints9[position];
            } else if (raceType == 'fairsprints12') {
                return this.fairSprintsPoints12[position];
            }            
        },
        getFairSprintsResults: function (race, callback) {
            var self = this;
            race.rounds.filter('type', '=', 'race').order('rideIndex', true).order('resultPosition', true).prefetch('team').prefetch('driver').list(function (results) {
                var rideTeamPoints = {};
                var roundTeamPoints = {};
                var totalTeamPoints = {};
                var totalDriverPoints = {};
                var roundDriverPoints = {};
                var teamPlaceCounts = {};
                
                angular.forEach(results, function (result) {
                	//Team place counts (in case of same point sum)
                	if (teamPlaceCounts[result.team.id] && teamPlaceCounts[result.team.id][result.resultPosition]) {
                		teamPlaceCounts[result.team.id][result.resultPosition]++;
                    } else {
                    	if (teamPlaceCounts[result.team.id]) {
                        	teamPlaceCounts[result.team.id][result.resultPosition] = 1;
                    	} else {
                            if (race.raceType == 'fairsprints') {
                    		    teamPlaceCounts[result.team.id] = [undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            } else if (race.raceType == 'fairsprints9') {
                                teamPlaceCounts[result.team.id] = [undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            } else if (race.raceType == 'fairsprints12') {
                                teamPlaceCounts[result.team.id] = [undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            }
                        	teamPlaceCounts[result.team.id][result.resultPosition] = 1;	
                    	}                    	
                    }
                	
                    //Team ride points (1-20)
                    if (rideTeamPoints[result.team.id]) {
                        rideTeamPoints[result.team.id][result.rideIndex] = self.getPoints(result.resultPosition, race.raceType);
                    } else {
                        rideTeamPoints[result.team.id] = {};
                        rideTeamPoints[result.team.id][result.rideIndex] = self.getPoints(result.resultPosition, race.raceType);
                    }

                    //Team round points (0,1)
                    if (roundTeamPoints[result.team.id]) {
                        if (roundTeamPoints[result.team.id][result.roundIndex]) {
                            roundTeamPoints[result.team.id][result.roundIndex] += self.getPoints(result.resultPosition, race.raceType);
                        } else {
                            roundTeamPoints[result.team.id][result.roundIndex] = self.getPoints(result.resultPosition, race.raceType);
                        }
                    } else {
                        roundTeamPoints[result.team.id] = {};
                        roundTeamPoints[result.team.id][result.roundIndex] = self.getPoints(result.resultPosition, race.raceType);
                    }

                    //Team total points
                    if (totalTeamPoints[result.team.id]) {
                        totalTeamPoints[result.team.id] += self.getPoints(result.resultPosition, race.raceType);
                    } else {
                        totalTeamPoints[result.team.id] = self.getPoints(result.resultPosition, race.raceType);
                    }

                    if (roundDriverPoints[result.driver.id]) {
                        if (roundDriverPoints[result.driver.id][result.roundIndex]) {
                            roundDriverPoints[result.driver.id][result.roundIndex] += self.getPoints(result.resultPosition, race.raceType);
                        } else {
                            roundDriverPoints[result.driver.id][result.roundIndex] = self.getPoints(result.resultPosition, race.raceType);
                        }
                    } else {
                        roundDriverPoints[result.driver.id] = {};
                        roundDriverPoints[result.driver.id][result.roundIndex] = self.getPoints(result.resultPosition, race.raceType);
                    }

                    //Driver total points
                    if (totalDriverPoints[result.driver.id]) {
                        totalDriverPoints[result.driver.id] += self.getPoints(result.resultPosition, race.raceType);
                    } else {
                        totalDriverPoints[result.driver.id] = self.getPoints(result.resultPosition, race.raceType);
                    }
                });

                var teams = [];
                var drivers = [];

                race.raceAssignments.list(function (raceAssignments) {
                    angular.forEach(raceAssignments, function (raceAssignment) {
                        teams.push({name: raceAssignment.team.name, roundTeamPoints: roundTeamPoints[raceAssignment.team.id], rideTeamPoints: rideTeamPoints[raceAssignment.team.id], totalTeamPoints: totalTeamPoints[raceAssignment.team.id], teamPlaceCounts: teamPlaceCounts[raceAssignment.team.id]});
                        drivers.push({name: raceAssignment.driver.name + ' ' + raceAssignment.driver.surname, teamName: raceAssignment.team.name, roundDriverPoints: roundDriverPoints[raceAssignment.driver.id], totalDriverPoints: totalDriverPoints[raceAssignment.driver.id]});
                        drivers.push({name: raceAssignment.driver2.name + ' ' + raceAssignment.driver2.surname, teamName: raceAssignment.team.name, roundDriverPoints: roundDriverPoints[raceAssignment.driver2.id], totalDriverPoints: totalDriverPoints[raceAssignment.driver2.id]});
                        drivers.push({name: raceAssignment.driver3.name + ' ' + raceAssignment.driver3.surname, teamName: raceAssignment.team.name, roundDriverPoints: roundDriverPoints[raceAssignment.driver3.id], totalDriverPoints: totalDriverPoints[raceAssignment.driver3.id]});
                    });
                    drivers.sort(function (a, b) {
                        return b.totalDriverPoints - a.totalDriverPoints;
                    });                    
                    teams.sort(function (a, b) {
                    	if (b.totalTeamPoints != a.totalTeamPoints) {
                    		return b.totalTeamPoints - a.totalTeamPoints;	
                    	} else {
                    		for (var i = 1; i <= 10; i++) {
                    			if (b.teamPlaceCounts[i] != a.teamPlaceCounts[i]) {
                    				return b.teamPlaceCounts[i] - a.teamPlaceCounts[i];
                    			}                    			
                    		}
                    		return 0;
                    	}
                        
                    });
                    callback({teams: teams, drivers: drivers});
                });
                callback(results);
            });
        }
    };
});