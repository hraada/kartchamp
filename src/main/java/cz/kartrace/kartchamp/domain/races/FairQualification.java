package cz.kartrace.kartchamp.domain.races;

import cz.kartrace.kartchamp.domain.Kart;
import cz.kartrace.kartchamp.domain.Results;
import cz.kartrace.kartchamp.domain.Scoring;
import cz.kartrace.kartchamp.domain.Team;
import cz.kartrace.kartchamp.domain.rounds.Qualification;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author hradecky
 */
public class FairQualification extends BaseRace<Qualification.Round> {

    public FairQualification(String name, Date date, int qualiRoundCount, int teamCount, int teamSize, int kartCount, String scoringFormat) {
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

    }

    @Override
    public void assignTeamsToKartRidesUsingOrder(List<Team> orderedTeams) {
        List<Kart> orderedKarts = getKarts();


        getRounds().forEach(round -> {
            round.getRides().forEach(ride -> {

                Map<Kart, Team> rideTeamKarts = new HashMap<>();
                for (int teamOrder = 0; teamOrder < orderedTeams.size(); teamOrder++) {
                    int teamKartOrder = (teamOrder + ride.getOrder() * (orderedTeams.size() - orderedKarts.size())) % orderedTeams.size();
                    if (teamKartOrder < orderedKarts.size()) {
                        rideTeamKarts.put(orderedKarts.get(teamKartOrder), orderedTeams.get(teamOrder));
                    }
                }



                ride.getKartRides().forEach(kartRide -> {
                    kartRide.resetResultAndAssignments();

                    Team team = rideTeamKarts.get(kartRide.getKart());
                    kartRide.setTeam(team);
                });
            });
        });

    }

    @Override
    public Results getResults() {
        Results results = new Results();
        getRounds().forEach(round -> results.addResults(round.getResults()));
        return results;
    }


}
