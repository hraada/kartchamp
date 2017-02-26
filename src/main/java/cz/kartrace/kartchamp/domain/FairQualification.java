package cz.kartrace.kartchamp.domain;

import org.springframework.util.Assert;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author hradecky
 */
public class FairQualification extends AbstractRace {

    public FairQualification(int qualiRoundCount, int teamCount, int kartCount) {
        Assert.isTrue(kartCount <= teamCount);
        Assert.isTrue(teamCount * Team.SIZE % kartCount == 0);

        Set<Kart> karts = new HashSet<>();
        for (int i = 0; i < kartCount; i++) {
            addKart(new Kart(i));
        }

        for (int i = 0; i < qualiRoundCount; i++) {
            addRound(new Qualification.Round(i, teamCount, karts));
        }

    }

    @Override
    public void assignTeamsToKartRides(List<Team> teamOrder) {

    }
}
