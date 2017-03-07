package cz.kartrace.kartchamp.domain;

import cz.kartrace.kartchamp.domain.races.FairQualification;
import cz.kartrace.kartchamp.domain.rounds.Qualification;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 * @author hradecky
 */
@RunWith(Parameterized.class)
public class ITFairQualification6KartTest {
    private static final int TEAM_SIZE = 3;
    private static final int KART_COUNT = 6;

    private Set<Team> teams;
    private List<Team> teamOrder;
    private String scoringFormat;

    public ITFairQualification6KartTest(int teamCount, String scoringFormat) {
        this.teams = TestData.getTeams(teamCount);
        this.teamOrder = TestData.getReverseTeamOrder(teams);
        this.scoringFormat = scoringFormat;
    }


    @Parameterized.Parameters(name = "{0} teams")
    public static Iterable<? extends Object[]> data() {
        return Arrays.asList(new Object[] {10, "incremental:count=30,1-based"}, new Object[] {12, "incremental:count=36,1-based"});
    }

    @Test
    public void fair_qualification_must_generate_same_ride_count_per_round_as_driver_count_divided_by_kart_count() {
        FairQualification race = new FairQualification("Some Qualification", new Date(), 1, teams.size(), TEAM_SIZE, KART_COUNT, scoringFormat);
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        Qualification.Round round = race.getRounds().get(0);
        List<Qualification.Ride> rides = round.getRides();

        assertThat(rides.size(), is(teams.size() * TEAM_SIZE / KART_COUNT));
        rides.forEach(ride -> {
            assertThat(ride.getName(), is(equalTo((ride.getOrder() + 1) + ".jízda")));
            assertThat(ride.getOrder(), is(equalTo(ride.getOrder())));
        });
    }

    @Test
    public void test() {

        FairQualification race = new FairQualification("Some Qualification", new Date(), 1, teams.size(), TEAM_SIZE, KART_COUNT, scoringFormat);
        race.assignTeamsToKartRidesUsingOrder(teamOrder);

        System.out.println(race.getRounds());
    }
}
