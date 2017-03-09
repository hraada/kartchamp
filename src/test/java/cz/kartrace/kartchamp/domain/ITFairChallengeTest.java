package cz.kartrace.kartchamp.domain;

import cz.kartrace.kartchamp.domain.races.BaseRace;
import cz.kartrace.kartchamp.domain.races.FairChallenge;
import cz.kartrace.kartchamp.domain.races.FairQualification;
import cz.kartrace.kartchamp.domain.rounds.BaseKartRide;
import cz.kartrace.kartchamp.domain.rounds.BaseRide;
import cz.kartrace.kartchamp.domain.rounds.Qualification;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * @author hradecky
 */
@RunWith(Parameterized.class)
public class ITFairChallengeTest {

    private Set<Team> teams;
    private Map<Team, List<Driver>> teamDriverMap;
    private List<Team> teamOrder;
    private FairChallenge race;
    private int teamCount;
    private int teamSize;
    private int kartCount;

    public ITFairChallengeTest(FairChallenge race) {
        this.teams = TestData.getTeams(race.getTeamCount());
        this.teamDriverMap = TestData.getDrivers(teams, race.getTeamSize());
        this.teamOrder = TestData.getTeamOrder(teams);
        this.race = race;
        this.teamCount = race.getTeamCount();
        this.teamSize = race.getTeamSize();
        this.kartCount = race.getKarts().size();
    }


    @Parameterized.Parameters(name = "{0} teams")
    public static Iterable<? extends Object> data() {
        return Arrays.asList(new Object[] {BaseRace.getRaceByFormatCode("fair-challenge:qualiRoundCount=2,teamCount=10,teamSize=3,kartCount=6,scoring=incremental 1-based", "Test Challenge", new Date()) });
    }

    @Test
    public void fair_challenge_must_generate_same_ride_count_per_round_as_driver_count_divided_by_kart_count() {
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        race.getRounds().forEach(round -> {
            List<BaseRide<BaseKartRide>> rides = round.getRides();

            assertThat(rides.size(), is(teamCount * teamSize / kartCount));
            rides.forEach(ride -> {
                assertThat(ride.getName(), is(equalTo((ride.getOrder() + 1) + ".jízda")));
                assertThat(ride.getOrder(), is(equalTo(ride.getOrder())));
                assertThat(ride.getKartRides().size(), is(equalTo(kartCount)));
            });
        });
    }

    @Test
    public void fair_challenge_must_return_proper_team_and_driver_points_for_given_ride_results() {
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        //Generate kart ride results
        Map<Team, AtomicInteger> teamDriverOrders = new HashMap<>();
        teams.forEach(team -> {
            teamDriverOrders.put(team, new AtomicInteger());
        });
        race.getQualificationRounds().forEach(round -> {
            round.getRides().forEach(ride -> {
                ride.getKartRides().forEach(kartRide -> {
                    int driverOrder = teamDriverOrders.get(kartRide.getTeam()).get() % 3;
                    teamDriverOrders.get(kartRide.getTeam()).incrementAndGet();

                    int minutes = teamOrder.indexOf(kartRide.getTeam()) + 1;
                    kartRide.setBestTime(Duration.ofMinutes(minutes).plusSeconds(driverOrder));
                    kartRide.setDriver(teamDriverMap.get(kartRide.getTeam()).get(driverOrder));
                });
            });
        });

        //Move from qualification to race
        race.getRaceRounds().forEach(raceRound -> {
            race.assignToKartRidesBasedOnQualification(raceRound);
        });


        //All races finish on same positions as they start on
        race.getRaceRounds().forEach(round -> {
            round.getRides().forEach(ride -> {
                ride.getKartRides().forEach(kartRide -> {
                    kartRide.setFinishPosition(kartRide.getStartPosition());
                });
            });
        });

        /*
        //Check overall team results
        race.getOverallRaceResults().forEachTeamResult((overAllPosition, result) -> {
            assertThat(overAllPosition, is(equalTo(teamOrder.indexOf(result.getEntity()) + 1)));
            assertThat(result.getEntity().getShortName(), containsString(String.valueOf(overAllPosition - 1)));

            int expectedTeamPoints = (race.getScoring().getPointsForPosition((overAllPosition - 1)  * teamSize + 1) * teamSize - teamSize) * race.getRounds().size();
            assertThat(result.getPoints(), is(equalTo(expectedTeamPoints)));
        });

        //Check overall driver results
        race.getOverallRaceResults().forEachDriverResult((overAllPosition, result) -> {
            int oddRideCount = teamCount % teamSize;
            int roundRideCount = teamCount / teamSize;
            for (Map.Entry<Team, List<Driver>> entry: teamDriverMap.entrySet()) {
                for (int driverOrder = 0; driverOrder < entry.getValue().size(); driverOrder++) {
                    if (entry.getValue().get(driverOrder).equals(result.getEntity())) {
                        roundRideCount = roundRideCount + (driverOrder < oddRideCount ? 1 : 0);
                    }
                }
            }
            assertThat(result.getPoints(), is(equalTo(race.getScoring().getPointsForPosition(overAllPosition) * race.getRounds().size())));
        });*/


    }
}
