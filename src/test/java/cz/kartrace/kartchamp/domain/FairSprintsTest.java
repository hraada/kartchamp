package cz.kartrace.kartchamp.domain;

import org.junit.Test;

import java.util.NavigableSet;
import java.util.Optional;
import java.util.Set;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;


/**
 * @author hradecky
 */
public class FairSprintsTest {


    @Test
    public void fair_sprints_must_generate_same_ride_count_per_round_as_team_count() {
        FairSprints race = new FairSprints(1, TestData.TEAMS_10.size());
        race.assignTeamsToKartRides(TestData.TEAM_10_ORDER);

        AbstractRound round = race.getRoundByOrder(1);
        NavigableSet<AbstractRide> rides = round.getRides();

        assertThat(rides.size(), is(10));
        rides.forEach(ride -> {
            assertThat(ride.getName(), is(equalTo((ride.getOrder() + 1) + ".jízda")));
            assertThat(ride.getOrder(), is(equalTo(ride.getOrder() + 1)));
        });
    }

    @Test
    public void fair_sprints_must_assign_one_kart_to_one_team_in_each_round_in_team_order() {
        FairSprints race = new FairSprints(1, TestData.TEAMS_10.size());
        race.assignTeamsToKartRides(TestData.TEAM_10_ORDER);

        AbstractRound round = race.getRoundByOrder(1);
        NavigableSet<AbstractRide> rides = round.getRides();

        rides.forEach(ride -> {
            Set<AbstractKartRide> kartRides = ride.getKartRides();
            assertThat(kartRides.size(), is(equalTo(TestData.TEAMS_10.size())));
            for (Team team: TestData.TEAMS_10) {
                Optional<HeatRace.KartRide> teamKartRide = kartRides.stream()
                        .map(kartRide -> (HeatRace.KartRide) kartRide)
                        .filter(kartRide -> kartRide.getTeam() != null && kartRide.getTeam().equals(team))
                        .findFirst();

                assertThat(teamKartRide.isPresent(), is(true));



            }

        });

    }
}