package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.*;
import java.util.function.BiConsumer;

import static java.lang.String.format;
import static java.util.Comparator.comparing;

/**
 * @author hradecky
 */
public class Results {
    private Map<Team, PointsAndPositions> teamResults = new HashMap<>();
    private Map<Driver, PointsAndPositions> driverResults = new HashMap<>();

    public void addPointsAndPositions(Driver driver, Team team, PointsAndPositions pointsAndPositions) {
        addPointsAndPositions(driver, driverResults, pointsAndPositions);
        addPointsAndPositions(team, teamResults, pointsAndPositions);
    }

    public void addResults(Results results) {
        results.teamResults.forEach((team, pointsAndPositions) -> {
            addPointsAndPositions(team, teamResults, pointsAndPositions);
        });
        results.driverResults.forEach((driver, pointsAndPositions) -> {
            addPointsAndPositions(driver, driverResults, pointsAndPositions);
        });
    }

    public void forEachTeamPoints(BiConsumer<Team, PointsAndPositions> consumer) {
        List<Map.Entry<Team, PointsAndPositions>> sortedResults = new ArrayList<>();
        sortedResults.addAll(teamResults.entrySet());
        sortedResults.sort(comparing(Map.Entry::getValue));

        sortedResults.forEach(entry -> {
            consumer.accept(entry.getKey(), entry.getValue());
        });
    }

    public void forEachDriverPoints(BiConsumer<Driver, PointsAndPositions> consumer) {
        List<Map.Entry<Driver, PointsAndPositions>> sortedResults = new ArrayList<>();
        sortedResults.addAll(driverResults.entrySet());
        sortedResults.sort(comparing(Map.Entry::getValue));

        sortedResults.forEach(entry -> {
            consumer.accept(entry.getKey(), entry.getValue());
        });
    }

    public PointsAndPositions getPoints(Team team) {
        return teamResults.getOrDefault(team, new PointsAndPositions(0));
    }

    public PointsAndPositions getPoints(Driver driver) {
        return driverResults.getOrDefault(driver, new PointsAndPositions(0));
    }


    private String prettyPrintTeamPoints() {
        StringBuffer sb = new StringBuffer();
        forEachTeamPoints((team, points) -> {
            sb.append(format("%s %s\n", team.getShortName(), points));
        });
        return sb.toString();
    }

    private String prettyPrintDriverPoints() {
        StringBuffer sb = new StringBuffer();
        forEachDriverPoints((driver, pointsAndPositions) -> {
            if (driver != null){
                sb.append(format("%s %s %d\n", driver.getName(), driver.getSurname(), pointsAndPositions));
            } else {
                sb.append(format("Driver not set %s\n", pointsAndPositions));
            }
        });
        return sb.toString();
    }

    private static <T> void addPointsAndPositions(T t, Map<T, PointsAndPositions> results, PointsAndPositions pointsAndPositions) {
        results.compute(t, (key, value) -> {
            if (value == null) value = new PointsAndPositions(0);
            value.add(pointsAndPositions);
            return value;
        });

    }


    @Override
    public String toString() {
        return format("Results: {\nTeams:\n%s\nDrivers:\n%s}", prettyPrintTeamPoints(), prettyPrintDriverPoints());
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    public static class PointsAndPositions implements Comparable<PointsAndPositions> {
        private int points = 0;
        private Map<Integer, Integer> positionCounts = new HashMap<>();

        public PointsAndPositions(int points) {
            this.points = points;
        }

        public PointsAndPositions(int points, int position) {
            this(points);
            this.positionCounts.put(position, 1);
        }

        public void add(PointsAndPositions pointsAndPositions) {
            points += pointsAndPositions.points;
            pointsAndPositions.positionCounts.forEach((position, count) -> {
                positionCounts.compute(position, (key, value) -> {
                    if (value == null) value = 0;
                    value = value + count;
                    return value;
                });
            });
        }

        @Override
        public int compareTo(PointsAndPositions o) {
            int pointsResults = points - o.points;

            //If points are the same, higher number of better positions wins
            int positionResult = 0;
            Set<Integer> relevantPositions = new TreeSet<>();
            relevantPositions.addAll(positionCounts.keySet());
            relevantPositions.addAll(o.positionCounts.keySet());
            for (int position: relevantPositions) {
                positionResult = positionCounts.getOrDefault(position, 0) - o.positionCounts.getOrDefault(position, 0);
                if (positionResult != 0) break;
            }
            return pointsResults != 0 ? pointsResults : positionResult;
        }

        @Override
        public String toString() {
            return String.format("%d %s", points, positionCounts);
        }
    }
}
