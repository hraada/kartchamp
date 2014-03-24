'use strict';

/**
 * Service that computes, persists and retrieves qualification data.
 */
service.factory('qualificationService', function () {

    return {
        getQualificationRoundResults: function (race, roundIndex, callback) {
            race.rounds.filter('roundIndex', '=', roundIndex).order('resultTime', true).order('resultPosition', true).prefetch('team').prefetch('kart').prefetch('driver').list(function (results) {
                callback(results);
            });
        },
        getRaceRoundSchedule: function (race, round, callback) {
            //startposition is used to order drivers according to team cast for qualification
            race.rounds.filter('roundIndex', '==', round).order('roundIndex', true).order('rideIndex').order('startPosition').prefetch('kart').list(function (rounds) {
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
        getRaceAssignmentsRoundsKarts: function (rounds, raceAssignments, karts) {
            var upperKarts = karts.slice(0, 3);
            var lowerKarts = karts.slice(3, 6);

            var roundsTeamKarts = {};

            angular.forEach(raceAssignments, function (raceAssignment) {
                roundsTeamKarts[raceAssignment.id] = {};
                angular.forEach(rounds, function (round) {
                    var cast = raceAssignment.teamCast % 2;
                    if ((cast + round) % 2 == 0) {
                        roundsTeamKarts[raceAssignment.id][round] = lowerKarts;
                    } else {
                        roundsTeamKarts[raceAssignment.id][round] = upperKarts;
                    }
                });
            });
            return roundsTeamKarts;
        },
        getQualificationResults: function (race, callback) {
            race.rounds.order('roundIndex', true).order('resultTime', true).order('resultPosition', true).prefetch('team').prefetch('driver').list(function (results) {
                var roundTeamPoints = {};
                var totalTeamPoints = {};
                var roundDriverPoints = {};
                var totalDriverPoints = {};
                var teamPlaceCounts = {};
                
                var roundPoints = null;
                var roundPosition;
                var lastRoundIndex = -1;
                angular.forEach(results, function (result) {
                    if (lastRoundIndex != result.roundIndex) {
                        lastRoundIndex = result.roundIndex;
                        roundPoints = 30;
                    }
                    roundPosition = 30 - roundPoints + 1;
                    
                	//Team place counts (in case of same point sum)
                	if (teamPlaceCounts[result.team.id] && teamPlaceCounts[result.team.id][roundPosition]) {
                		teamPlaceCounts[result.team.id][roundPosition]++;
                    } else {
                    	if (teamPlaceCounts[result.team.id]) {
                        	teamPlaceCounts[result.team.id][roundPosition] = 1;
                    	} else {
                    		teamPlaceCounts[result.team.id] = [undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        	teamPlaceCounts[result.team.id][roundPosition] = 1;	
                    	}                    	
                    }
                	
                    //Team round points
                    if (roundTeamPoints[result.team.id]) {
                        if (roundTeamPoints[result.team.id][result.roundIndex]) {
                            roundTeamPoints[result.team.id][result.roundIndex] += roundPoints;
                        } else {
                            roundTeamPoints[result.team.id][result.roundIndex] = roundPoints;
                        }
                    } else {
                        roundTeamPoints[result.team.id] = {};
                        roundTeamPoints[result.team.id][result.roundIndex] = roundPoints;
                    }
                    //Team total points
                    if (totalTeamPoints[result.team.id]) {
                        totalTeamPoints[result.team.id] += roundPoints;
                    } else {
                        totalTeamPoints[result.team.id] = roundPoints;
                    }

                    //Driver round points
                    if (roundDriverPoints[result.driver.id]) {
                        roundDriverPoints[result.driver.id][result.roundIndex] = roundPoints;
                    } else {
                        roundDriverPoints[result.driver.id] = {};
                        roundDriverPoints[result.driver.id][result.roundIndex] = roundPoints;
                    }

                    //Driver total points
                    if (totalDriverPoints[result.driver.id]) {
                        totalDriverPoints[result.driver.id] += roundPoints;
                    } else {
                        totalDriverPoints[result.driver.id] = roundPoints;
                    }
                    roundPoints--;
                });

                var teams = [];
                var drivers = [];

                race.raceAssignments.list(function (raceAssignments) {
                    angular.forEach(raceAssignments, function (raceAssignment) {
                        teams.push({name: raceAssignment.team.name, roundTeamPoints: roundTeamPoints[raceAssignment.team.id], totalTeamPoints: totalTeamPoints[raceAssignment.team.id], teamPlaceCounts: teamPlaceCounts[raceAssignment.team.id]});
                        drivers.push({name: raceAssignment.driver.name + ' ' + raceAssignment.driver.surname, teamName: raceAssignment.team.name, roundDriverPoints: roundDriverPoints[raceAssignment.driver.id], totalDriverPoints: totalDriverPoints[raceAssignment.driver.id]});
                        drivers.push({name: raceAssignment.driver2.name + ' ' + raceAssignment.driver2.surname, teamName: raceAssignment.team.name, roundDriverPoints: roundDriverPoints[raceAssignment.driver2.id], totalDriverPoints: totalDriverPoints[raceAssignment.driver2.id]});
                        drivers.push({name: raceAssignment.driver3.name + ' ' + raceAssignment.driver3.surname, teamName: raceAssignment.team.name, roundDriverPoints: roundDriverPoints[raceAssignment.driver3.id], totalDriverPoints: totalDriverPoints[raceAssignment.driver3.id]});
                    });
                    drivers.sort(function (a, b) {
                        return b.roundDriverPoints[0] + b.roundDriverPoints[1] - a.roundDriverPoints[0] - a.roundDriverPoints[1];
                    });
                    for (var i = 0; i < drivers.length; i++) {
                        drivers[i].qualificationPoints = [];
                        drivers[i].qualificationPoints[0] = 30 - i;
                    }
                    drivers.sort(function (a, b) {
                        return b.roundDriverPoints[2] + b.roundDriverPoints[3] - a.roundDriverPoints[2] - a.roundDriverPoints[3];
                    });
                    for (var i = 0; i < drivers.length; i++) {
                        drivers[i].qualificationPoints[1] = 30 - i;
                    }
                    drivers.sort(function (a, b) {
                        return b.qualificationPoints[0] + b.qualificationPoints[1] - a.qualificationPoints[0] - a.qualificationPoints[1];
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