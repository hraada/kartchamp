package cz.kartrace.kartchamp.domain.races;

import cz.kartrace.kartchamp.domain.*;
import cz.kartrace.kartchamp.domain.rounds.BaseRound;
import cz.kartrace.kartchamp.domain.rounds.Race;
import cz.kartrace.kartchamp.domain.rounds.Qualification;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.List;

import static java.util.stream.Collectors.toList;

/**
 * @author hradecky
 */
public class FairChallenge extends BaseRace<BaseRound> {

    public FairChallenge(String name, Date date, int qualiRoundCount, int teamCount, int teamSize, int kartCount, String scoringFormat) {
        super(name, date, teamCount, teamSize);
        Assert.isTrue(kartCount <= teamCount);
        Assert.isTrue(teamCount * Team.SIZE % kartCount == 0);

        for (int i = 0; i < kartCount; i++) {
            addKart(new Kart(i, "K" + String.valueOf(i)));
        }

        Scoring scoring = Scoring.getScoring(scoringFormat);
        Assert.isTrue(scoring.getCount() == (teamSize * teamCount));

        for (int i = 0; i < qualiRoundCount; i++) {
            addRound(new Qualification.Round(i, teamCount, getKarts(), scoring));
        }

        int raceRoundCount = qualiRoundCount;
        for (int i = 0; i < raceRoundCount; i++) {
            addRound(new Race.Round(i, teamCount, getKarts(), scoring));
        }


    }

    public List<Qualification.Round> getQualificationRounds() {
        return filterByType(Qualification.Round.class, getRounds());
    }

    public List<Race.Round> getRaceRounds() {
        return filterByType(Race.Round.class, getRounds());
    }

    private <T extends BaseRound> List<T> filterByType(Class<T> clazz, List<BaseRound> rounds) {
        return rounds.stream()
                .filter(round -> round.getClass().isAssignableFrom(clazz))
                .map(round -> (T)round)
                .collect(toList());
    }

    @Override
    public void assignTeamsToKartRidesUsingOrder(List<Team> teamOrder) {

    }

    @Override
    public Results getResults() {
        Results results = new Results();
        getRounds().forEach(round -> results.addResults(round.getResults()));
        return results;
    }


}
