package cz.kartrace.kartchamp.domain;

import org.springframework.util.Assert;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author hradecky
 */
public class FairChallenge extends AbstractRace {

    public FairChallenge(int qualiRoundCount, int teamCount, int kartCount) {
        Assert.isTrue(kartCount <= teamCount);
        Assert.isTrue(teamCount * Team.SIZE % kartCount == 0);

        Set<Kart> karts = new HashSet<>();
        for (int i = 0; i < kartCount; i++) {
            karts.add(new Kart(i));
        }

        int raceRoundCount = qualiRoundCount;

        for (int i = 0; i < qualiRoundCount; i++) {
            addRound(new Qualification.Round(i, teamCount, karts));
        }

        for (int i = 0; i < raceRoundCount; i++) {
            addRound(new HeatRace.Round(i, teamCount, karts));
        }
    }

    @Override
    public void assignTeamsToKartRides(List<Team> teamOrder) {

    }
}
