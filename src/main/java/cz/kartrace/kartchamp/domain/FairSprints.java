package cz.kartrace.kartchamp.domain;

import org.springframework.util.Assert;

import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import static java.util.stream.Collectors.toSet;

/**
 * @author hradecky
 */
public class FairSprints extends AbstractRace {

    public FairSprints(int roundCount, int teamCount) {
        Assert.isTrue(roundCount > 0);

        int kartCount = teamCount;
        for (int i = 0; i < kartCount; i++) {
            addKart(new Kart(i));
        }

        for (int i = 0; i < roundCount; i++) {
            addRound(new SprintRace.Round(i, teamCount, getKarts()));
        }
    }

    @Override
    public void assignTeamsToKartRides(List<Team> teamOrder) {
        AtomicInteger index = new AtomicInteger();
        getRounds().forEach(round -> {
            round.getRides().forEach(ride -> {
                Set<HeatRace.KartRide> kartRides = ride.getKartRides().stream()
                        .map(kartRide -> (HeatRace.KartRide) kartRide)
                        .collect(toSet());

                
            });
        });
    }
}
