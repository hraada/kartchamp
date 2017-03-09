package cz.kartrace.kartchamp.domain;

import cz.kartrace.kartchamp.domain.races.BaseRace;
import cz.kartrace.kartchamp.domain.races.FairSprints;
import cz.kartrace.kartchamp.domain.rounds.Race;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.time.Duration;
import java.util.*;

import static java.util.Comparator.comparingInt;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;


/**
 * @author hradecky
 */
@RunWith(Parameterized.class)
public class ITFairSprintsTest {

    private Set<Team> teams;
    private Map<Team, List<Driver>> teamDriverMap;
    private List<Team> teamOrder;
    private FairSprints race;
    private int teamCount;
    private int teamSize;
    private int kartCount;

    public ITFairSprintsTest(String formatCode) {
        this.race = (FairSprints) BaseRace.getRaceByFormatCode(formatCode, "Test Sprints", new Date());
        this.teams = TestData.getTeams(race.getTeamCount());
        this.teamDriverMap = TestData.getDrivers(teams, race.getTeamSize());
        this.teamCount = race.getTeamCount();
        this.teamSize = race.getTeamSize();
        this.teamOrder = TestData.getTeamOrder(teams);
        this.kartCount = race.getKarts().size();
    }

    @Parameterized.Parameters(name = "{0} teams")
    public static Iterable<? extends Object> data() {
        return Arrays.asList("fair-sprints:roundCount=2,teamCount=10,teamSize=3,scoring=progressive 1-based",
                             "fair-sprints:roundCount=2,teamCount=12,teamSize=3,scoring=progressive 0-based");
    }

    @Test
    public void fair_sprints_must_generate_same_ride_count_per_round_as_team_count_with_proper_name() {
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        race.getRounds().forEach(round -> {
            List<Race.Ride> rides = round.getRides();

            assertThat(rides.size(), is(teamCount));
            rides.forEach(ride -> {
                assertThat(ride.getName(), is(equalTo((ride.getOrder() + 1) + ".jízda")));
                assertThat(ride.getOrder(), is(equalTo(ride.getOrder())));
                assertThat(ride.getKartRides().size(), is(equalTo(kartCount)));
            });
        });

    }

    @Test
    public void fair_sprints_must_assign_one_kart_to_one_team_in_each_round_in_team_order_with_shift_in_each_ride() {
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        race.getRounds().forEach(round -> {
            round.getRides().forEach(ride -> {
                List<Race.KartRide> kartRides = ride.getSortedKartRides(comparingInt(Race.KartRide::getStartPosition));
                assertThat(kartRides.size(), is(equalTo(teamCount)));

                for (int startPosition = 1; startPosition < kartRides.size(); startPosition++) {
                    assertThat(kartRides, hasItem(hasProperty("startPosition", equalTo(startPosition))));
                }

                kartRides.forEach(kartRide -> {
                    Team teamByStartPosition = teamOrder.get((kartRide.getStartPosition() - 1 + ride.getOrder()) % teamOrder.size());
                    assertThat(kartRide.getTeam(), is(equalTo(teamByStartPosition)));

                });
            });
        });
    }

    @Test
    public void fair_sprints_must_return_proper_team_and_driver_points_for_given_ride_results() {
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        //Generate kart ride results
        race.getRounds().forEach(round -> {
            round.getRides().forEach(ride -> {
                ride.getKartRides().forEach(kartRide -> {
                    int finishPosition = teamOrder.indexOf(kartRide.getTeam()) + 1;
                    kartRide.setBestTime(Duration.ofMinutes(1));
                    kartRide.setFinishPosition(finishPosition);
                    kartRide.setDriver(teamDriverMap.get(kartRide.getTeam()).get(ride.getOrder() % 3));
                });
            });
        });

        //Check overall team results
        race.getOverallRaceResults().forEachTeamResult((position, result) -> {
            assertThat(position, is(equalTo(teamOrder.indexOf(result.getEntity()) + 1)));
            assertThat(result.getEntity().getShortName(), containsString(String.valueOf(position - 1)));
            assertThat(result.getPoints(), is(equalTo(race.getScoring().getPointsForPosition(position) * teamCount * 2)));
        });

        //Check overall driver results
        race.getOverallRaceResults().forEachDriverResult((position, result) -> {
            int oddRideCount = teamCount % teamSize;
            int roundRideCount = teamCount / teamSize;
            Team team = null;
            for (Map.Entry<Team, List<Driver>> entry: teamDriverMap.entrySet()) {
                for (int driverOrder = 0; driverOrder < entry.getValue().size(); driverOrder++) {
                    if (entry.getValue().get(driverOrder).equals(result.getEntity())) {
                        roundRideCount = roundRideCount + (driverOrder < oddRideCount ? 1 : 0);
                        team = entry.getKey();
                    }
                }
            }
            assertThat(result.getPoints(), is(equalTo(race.getScoring().getPointsForPosition(teamOrder.indexOf(team) + 1) * roundRideCount * 2)));
        });


    }

}