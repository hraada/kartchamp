package cz.kartrace.kartchamp.domain.races;

import cz.kartrace.kartchamp.domain.Kart;
import cz.kartrace.kartchamp.domain.OverallResults;
import cz.kartrace.kartchamp.domain.Scoring;
import cz.kartrace.kartchamp.domain.Team;
import cz.kartrace.kartchamp.domain.rounds.Sprint;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author hradecky
 */
public class FairSprints extends BaseRace<Sprint.Round> {

    public FairSprints(String name, Date date, int roundCount, int teamCount, int teamSize, Scoring scoring) {
        super(name, date, teamCount, teamSize, scoring);

        Assert.isTrue(roundCount > 0);

        int kartCount = teamCount;
        for (int i = 0; i < kartCount; i++) {
            addKart(new Kart(i, "K" + String.valueOf(i), getId()));
        }

        Assert.isTrue(scoring.getCount() == teamCount);
        for (int i = 0; i < roundCount; i++) {
            addRound(new Sprint.Round(i, teamCount, getKarts(), getScoring()));
        }
    }

    @Override
    public void assignTeamsToKartRidesUsingOrder(List<Team> teamOrder) {
        Map<Kart, Integer> kartPositions = getKarts().stream().collect(Collectors.toMap(k -> k, k -> k.getOrder() + 1));


        getRounds().forEach(round -> {
            round.getRides().forEach(ride -> {
                Map<Integer, Team> teamPositionsInRide = getTeamPositionsForRide(teamOrder, ride.getOrder());

                ride.getKartRides().forEach(kartRide -> {
                    kartRide.resetResultAndAssignments();

                    int startPosition = kartPositions.get(kartRide.getKart());

                    kartRide.setStartPosition(startPosition);
                    kartRide.setTeam(teamPositionsInRide.get(startPosition));
                });
            });
        });
    }

    private Map<Integer, Team> getTeamPositionsForRide(List<Team> teamOrder, int rideOrder) {
        Map<Integer, Team> teamPositionsInRide = new HashMap<>();
        for (int i = 0; i < teamOrder.size(); i++) {
            teamPositionsInRide.put(i + 1, teamOrder.get((i + rideOrder) % teamOrder.size()));
        }
        return teamPositionsInRide;
    }

    @Override
    public String toString() {
        return String.format("FairSprints: { Id: %s, Name: %s \n%s}", getId(), getName(), StringUtils.join(getRounds(), "\n"));
    }
}
