package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.BiConsumer;

import static java.lang.String.format;
import static java.util.Comparator.comparing;

/**
 * @author hradecky
 */
public class OverallResults {
    private Map<Team, Result<Team>> teamResults = new HashMap<>();
    private Map<Driver, Result<Driver>> driverResults = new HashMap<>();

    public void mergeTeamResult(Result<Team> result) {
        mergeResult(result.getEntity(), teamResults, result);
    }

    public void mergeDriverResult(Result<Driver> result) {
        mergeResult(result.getEntity(), driverResults, result);
    }

    public void mergeOverAllResults(OverallResults results) {
        results.teamResults.forEach((team, result) -> mergeResult(team, teamResults, result));
        results.driverResults.forEach((driver, result) -> mergeResult(driver, driverResults, result));
    }


    public void forEachTeamResult(BiConsumer<Integer, Result<Team>> consumer) {
        AtomicInteger overAllPosition = new AtomicInteger();
        teamResults.entrySet().stream()
                .sorted(comparing(Map.Entry::getValue))
                .forEach(entry -> consumer.accept(overAllPosition.incrementAndGet(), entry.getValue()));

    }

    public void forEachDriverResult(BiConsumer<Integer, Result<Driver>> consumer) {
        AtomicInteger overAllPosition = new AtomicInteger();
        driverResults.entrySet().stream()
                .sorted(comparing(Map.Entry::getValue))
                .forEach(entry -> consumer.accept(overAllPosition.incrementAndGet(), entry.getValue()));
    }

    private String prettyPrintTeamResult() {
        StringBuffer sb = new StringBuffer();
        forEachTeamResult((position, result) -> {
            sb.append(format("%d %s %s\n", position, result.getEntity(), result));
        });
        return sb.toString();
    }

    private String prettyPrintDriverResult() {
        StringBuffer sb = new StringBuffer();
        forEachDriverResult((position, result) -> {
            Driver driver = result.getEntity();
            if (driver != null) {
                sb.append(format("%d %s %s %s\n", position, driver.getName(), driver.getSurname(), result));
            } else {
                sb.append(format("Driver not set %s\n", result));
            }
        });
        return sb.toString();
    }

    private static <T> void mergeResult(T t, Map<T, Result<T>> results, Result<T> result) {
        results.compute(t, (key, value) -> {
            if (value == null) value = new Result<>(t, 0);
            value.merge(result);
            return value;
        });

    }


    @Override
    public String toString() {
        return format("Results: {\nTeams:\n%s\nDrivers:\n%s}", prettyPrintTeamResult(), prettyPrintDriverResult());
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

    public static class Result<T> implements Comparable<Result<T>> {
        private T entity;
        private int points = 0;
        private Map<Integer, Integer> positionCounts = new HashMap<>();

        public Result(T entity, int points) {
            this.entity = entity;
            this.points = points;
        }

        public Result(T entity, int points, int position) {
            this(entity, points);
            this.positionCounts.put(position, 1);
        }

        public int getPoints() {
            return points;
        }

        public Map<Integer, Integer> getPositionCounts() {
            return positionCounts;
        }

        public T getEntity() {
            return entity;
        }

        public void merge(Result<T> result) {
            points += result.points;
            result.positionCounts.forEach((position, count) -> {
                positionCounts.compute(position, (key, value) -> {
                    if (value == null) value = 0;
                    value = value + count;
                    return value;
                });
            });
        }

        @Override
        public int compareTo(Result<T> o) {
            int pointsResults = o.points - points;

            //If points are the same, higher number of better positions wins
            int positionResult = 0;
            Set<Integer> relevantPositions = new TreeSet<>();
            relevantPositions.addAll(positionCounts.keySet());
            relevantPositions.addAll(o.positionCounts.keySet());
            for (int position : relevantPositions) {
                positionResult = o.positionCounts.getOrDefault(position, 0) - positionCounts.getOrDefault(position, 0);
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
