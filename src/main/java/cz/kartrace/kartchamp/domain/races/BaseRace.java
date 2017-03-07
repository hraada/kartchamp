package cz.kartrace.kartchamp.domain.races;

import cz.kartrace.kartchamp.domain.*;
import cz.kartrace.kartchamp.domain.rounds.BaseRound;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.*;

import static java.util.Comparator.comparingInt;
import static java.util.stream.Collectors.toList;

/**
 * @author hradecky
 */
public abstract class BaseRace<ROUND extends BaseRound> {
    private String id = UUID.randomUUID().toString();
    private String name;
    private Date date;
    private List<Kart> karts = new ArrayList<>();
    private List<ROUND> rounds = new ArrayList<>();
    private List<RaceAssignment> raceAssignments = new ArrayList<>();

    public BaseRace(String name, Date date, int teamCount, int teamSize) {
        this.name = name;
        this.date = date;
        for (int i = 0; i < teamCount * teamSize; i++) {
            raceAssignments.add(new RaceAssignment());
        }
    }

    public List<Driver> getTeamRaceAssignments(Team team) {
        return raceAssignments.stream()
                .filter(raceAssignment -> raceAssignment.getTeam().equals(team))
                .sorted(comparingInt(RaceAssignment::getOrder))
                .map(RaceAssignment::getDriver)
                .collect(toList());
    }

    public abstract void assignTeamsToKartRidesUsingOrder(List<Team> teamOrder);

    public abstract Results getResults();

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Date getDate() {
        return date;
    }

    protected void addKart(Kart kart) {
        karts.add(kart);
        karts.sort(comparingInt(Kart::getOrder));
    }

    protected void addRound(ROUND round) {
        rounds.add(round);
        rounds.sort(comparingInt(BaseRound::getOrder));
    }

    public List<ROUND> getRounds() {
        return Collections.unmodifiableList(rounds);
    }

    public List<Kart> getKarts() {
        return karts;
    }

    public static BaseRace getRaceByFormatCode(String formatCode, String name, Date date) {
        switch (formatCode) {
            case "fair-qualification:qualiRoundCount=2,teamCount=10,teamSize=3,kartCount=6,scoring=incremental 1-based":        // Fair Qualification (10 teams, 6 karts)
                return new FairQualification(name, date, 4, 10, 3, 6, "incremental:count=30;1-based");
            case "fair-qualification:qualiRoundCount=2,teamCount=10,teamSize=3,kartCount=10,scoring=incremental 1-based":       // Fair Big Qualification (10 teams)
                return new FairQualification(name, date, 4, 10, 3, 10, "incremental:count=30;1-based");
            case "fair-qualification:qualiRoundCount=2,teamCount=12,teamSize=3,kartCount=6,scoring=incremental 1-based":        // Fair Qualification (12 teams, 6 karts)
                return new FairQualification(name, date, 4, 12, 3, 6, "incremental:count=36;1-based");
            case "fair-qualification:qualiRoundCount=2,teamCount=12,teamSize=3,kartCount=12,scoring=incremental 1-based":        // Fair Big Qualification (12 teams, 12 karts)
                return new FairQualification(name, date, 4, 12, 3, 12, "incremental:count=36;1-based");

            case "fair-challenge:qualiRoundCount=2,teamCount=10,teamSize=3,kartCount=6,scoring=incremental 1-based":
                return new FairChallenge(name, date, 2, 10, 3, 6, "incremental:count=30;1-based");
            case "fair-challenge:qualiRoundCount=2,teamCount=10,teamSize=3,kartCount=10,scoring=incremental 1-based":
                return new FairChallenge(name, date, 2, 10, 3, 10, "incremental:count=30;1-based");
            case "fair-challenge:qualiRoundCount=2,teamCount=12,teamSize=3,kartCount=6,scoring=incremental 1-based":
                return new FairChallenge(name, date, 2, 12, 3, 6, "incremental:count=36;1-based");
            case "fair-challenge:qualiRoundCount=2,teamCount=12,teamSize=3,kartCount=12,scoring=incremental 1-based":
                return new FairChallenge(name, date, 2, 12, 3, 12, "incremental:count=36;1-based");

            case "fair-sprints:roundCount=2,teamCount=10,teamSize=3,scoring=progressive 1-based":
                return new FairSprints(name, date, 2, 10, 3, "progressive:count=10;1-based");
            case "fair-sprints:roundCount=2,teamCount=12,teamSize=3,scoring=progressive 0-based":
                return new FairSprints(name, date, 2, 12, 3, "progressive:count=10;0-based");

            default:
                throw new RuntimeException("Unknown race format code: " + formatCode);
        }
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }
}
