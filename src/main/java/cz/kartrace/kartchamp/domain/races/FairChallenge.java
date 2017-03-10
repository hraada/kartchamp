package cz.kartrace.kartchamp.domain.races;

import cz.kartrace.kartchamp.domain.*;
import cz.kartrace.kartchamp.domain.rounds.BaseRound;
import cz.kartrace.kartchamp.domain.rounds.Qualification;
import cz.kartrace.kartchamp.domain.rounds.Race;
import org.springframework.util.Assert;

import java.util.*;

import static java.util.stream.Collectors.toList;

/**
 * @author hradecky
 */
public class FairChallenge extends BaseRace<BaseRound> {

    public FairChallenge(String name, Date date, int qualiRoundCount, int teamCount, int teamSize, int kartCount, Scoring scoring) {
        super(name, date, teamCount, teamSize, scoring);
        Assert.isTrue(kartCount <= teamCount);
        Assert.isTrue(teamCount * Team.SIZE % kartCount == 0);

        for (int i = 0; i < kartCount; i++) {
            addKart(new Kart(i, "K" + String.valueOf(i), getId()));
        }

        Assert.isTrue(scoring.getCount() == (teamSize * teamCount));

        for (int i = 0; i < qualiRoundCount; i++) {
            addRound(new Qualification.Round(i, teamCount, getKarts(), getScoring()));
        }

        int raceRoundCount = qualiRoundCount;
        for (int i = 0; i < raceRoundCount; i++) {
            addRound(new Race.Round(i, teamCount, getKarts(), getScoring()));
        }


    }

    public void assignToKartRidesBasedOnQualification(Race.Round raceRound) {
        Qualification.Round qualification = getRaceRoundQualification(raceRound);
        ResultList<Qualification.KartRide> qualiResultList = qualification.getRoundResultLists().get(0);

        raceRound.getRides().forEach(raceRide -> {
            int kartRideCount = raceRide.getKartRides().size();
            List<Kart> availableKarts = new ArrayList<>(getKarts());
            qualiResultList.stream()
                    .filter(qualiResult -> (qualiResult.getPosition() - 1) / kartRideCount == raceRide.getOrder())
                    .forEach(sourceQualiResult -> {
                        Qualification.KartRide qualiRide = sourceQualiResult.getKartRide();
                        int qualiPosition = sourceQualiResult.getPosition();

                        Kart kart = castKart(availableKarts);
                        availableKarts.remove(kart);
                        Race.KartRide kartRide = raceRide.getKartRideByKart(kart).orElseThrow(() -> new RuntimeException("Kart not found in ride: " + kart.getId()));
                        kartRide.setDriver(qualiRide.getDriver());
                        kartRide.setTeam(qualiRide.getTeam());
                        kartRide.setStartPosition((qualiPosition - 1) % kartRideCount + 1);
                    });
        });

    }

    private Kart castKart(List<Kart> availableKarts) {
        return availableKarts.get((int) (Math.random() * (availableKarts.size())));
    }

    private Qualification.Round getRaceRoundQualification(Race.Round raceRound) {
        int raceIndex = getRaceRounds().indexOf(raceRound);
        return getQualificationRounds().get(raceIndex);
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
                .map(round -> (T) round)
                .collect(toList());
    }

    @Override
    public void assignTeamsToKartRidesUsingOrder(List<Team> orderedTeams) {
        List<Kart> orderedKarts = getKarts();

        getQualificationRounds().forEach(round -> {
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
    public OverallResults getOverallRaceResults() {
        OverallResults results = new OverallResults();
        getRaceRounds().forEach(round -> results.mergeOverAllResults(round.getOverallRoundResults()));
        return results;
    }


}
