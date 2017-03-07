package cz.kartrace.kartchamp.domain;

import cz.kartrace.kartchamp.domain.races.FairSprints;
import cz.kartrace.kartchamp.domain.rounds.Race;
import cz.kartrace.kartchamp.domain.rounds.Sprint;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.time.Duration;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static java.util.Comparator.comparingInt;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasProperty;


/**
 * @author hradecky
 */
@RunWith(Parameterized.class)
public class ITFairSprintsTest {
    private static final int TEAM_SIZE = 3;

    private Set<Team> teams;
    private List<Team> teamOrder;
    private String scoringFormat;

    public ITFairSprintsTest(int teamCount, String scoringFormat) {
        this.teams = TestData.getTeams(teamCount);
        this.teamOrder = TestData.getReverseTeamOrder(teams);
        this.scoringFormat = scoringFormat;
    }

    @Parameterized.Parameters(name = "{0} teams")
    public static Iterable<? extends Object[]> data() {
        return Arrays.asList(new Object[] {10, "progressive:count=10,1-based"}, new Object[] {12, "progressive:count=12,0-based"});
    }

    @Test
    public void fair_sprints_must_generate_same_ride_count_per_round_as_team_count_with_proper_name() {

        FairSprints race = new FairSprints("Some Sprint", new Date(), 1, teams.size(), TEAM_SIZE, scoringFormat);
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        Sprint.Round round = race.getRounds().get(0);
        List<Race.Ride> rides = round.getRides();

        assertThat(rides.size(), is(teams.size()));
        rides.forEach(ride -> {
            assertThat(ride.getName(), is(equalTo((ride.getOrder() + 1) + ".jízda")));
            assertThat(ride.getOrder(), is(equalTo(ride.getOrder())));
        });
    }

    @Test
    public void fair_sprints_must_assign_one_kart_to_one_team_in_each_round_in_team_order_with_shift_in_each_ride() {
        FairSprints race = new FairSprints("Some Sprint", new Date(), 1, teams.size(), TEAM_SIZE, scoringFormat);
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        Sprint.Round round = race.getRounds().get(0);
        List<Race.Ride> rides = round.getRides();

        rides.forEach(ride -> {
            List<Race.KartRide> kartRides = ride.getSortedKartRides(comparingInt(Race.KartRide::getStartPosition));
            assertThat(kartRides.size(), is(equalTo(teams.size())));

            for (int startPosition = 1; startPosition < kartRides.size(); startPosition++) {
                assertThat(kartRides, hasItem(hasProperty("startPosition", equalTo(startPosition))));
            }

            kartRides.forEach(kartRide -> {
                Team teamByStartPosition = teamOrder.get((kartRide.getStartPosition() - 1 + ride.getOrder()) % teamOrder.size());
                assertThat(kartRide.getTeam(), is(equalTo(teamByStartPosition)));

            });
        });
    }


    @Test
    public void fair_sprints_must_return_proper_results_for_given_ride_results() {
        FairSprints race = new FairSprints("Some Sprint", new Date(), 1, teams.size(), TEAM_SIZE, scoringFormat);
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        Sprint.Round round = race.getRounds().get(0);
        List<Race.Ride> rides = round.getRides();

        rides.forEach(ride -> {
            ride.getKartRides().forEach(kartRide -> {
                int finishPosition = teamOrder.size() - kartRide.getStartPosition() + 1;
                kartRide.setBestTime(Duration.ofMinutes(1));
                kartRide.setFinishPosition(finishPosition);
            });
        });


        System.out.println(round.getResults());
    }

}