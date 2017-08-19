'use strict';

/**
 * Service that computes, persists and retrieves challenge data.
 */
service.factory('challengeService', function (persistenceService) {

    return {
        getChallengeRoundResults: function (race, roundIndex, callback) {
            race.rounds.filter('roundIndex', '=', roundIndex).order('rideIndex', true).order('resultPosition', true).prefetch('kart').list(function (results) {
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
        shuffleArray: function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },
        drawRace: function (race, qualificationResults, raceRoundIndex, callback) {
            var self = this;
            race.rounds.filter('roundIndex', '=', raceRoundIndex).list(function (results) {
                angular.forEach(results, function (result) {
                    persistenceService.remove(result);
                });
            });

            var rideCount = 5;
            if (race.raceType == 'fairchallenge12') {
                rideCount = 6;
            }
            persistenceService.flush(function () {
                race.karts.list(function (karts) {

                    if (race.raceType != 'challenge3x10' && race.raceType != 'challenge2x10' && race.raceType != 'challenge3x12' && race.raceType != 'challenge2x12') {
                        for (var i = 0; i < rideCount; i++) {
                            var randomKarts = self.shuffleArray(karts);
                            for (var j = 0; j < 6; j++) {
                                var result = qualificationResults[i * 6 + j];
                                self.addRaceRound(race, result.team, result.driver, randomKarts[j], raceRoundIndex, raceRoundIndex * rideCount + i + 1, j + 1);
                            }
                        }
                    } else {
                        var kartCount = 10;
                        if (race.raceType == 'challenge3x12' || race.raceType == 'challenge2x12') {
                            kartCount = 12;
                        }
                        for (var i = 0; i < 3; i++) {
                            var randomKarts = self.shuffleArray(karts);
                            for (var j = 0; j < kartCount; j++) {
                                var result = qualificationResults[i * kartCount + j];
                                self.addRaceRound(race, result.team, result.driver, randomKarts[j], raceRoundIndex, raceRoundIndex * 3 + i + 1, j + 1);
                            }
                        }                        
                    }
                    persistenceService.flush(function () {
                        callback();
                    });
                });
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
        getChallengeResults: function (race, callback) {
            race.rounds.filter('type', '=', 'race').order('rideIndex', true).order('resultPosition', true).prefetch('team').prefetch('driver').list(function (results) {
                var roundTeamPoints = {};
                var totalTeamPoints = {};
                var roundDriverPoints = {};
                var totalDriverPoints = {};
                var teamPlaceCounts = {};
                
                var roundPoints = null;
                var roundPosition;
                var lastRoundIndex = -1;
                var maxPoints = 30;
                if (race.raceType == 'fairchallenge12' || race.raceType == 'challenge3x12' || race.raceType == 'challenge2x12') {
                    maxPoints = 36;
                }                   
                angular.forEach(results, function (result) {
                    if (lastRoundIndex != result.roundIndex) {
                        lastRoundIndex = result.roundIndex;
                        roundPoints = maxPoints;
                    }

                    roundPosition = maxPoints - roundPoints + 1;
                    
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

                    //Driver round points

                    //Team total points
                    if (totalTeamPoints[result.team.id]) {
                        totalTeamPoints[result.team.id] += roundPoints;
                    } else {
                        totalTeamPoints[result.team.id] = roundPoints;
                    }


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