package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.springframework.util.Assert;

import static java.lang.String.format;

/**
 * @author hradecky
 */
public class Scoring {

    private Integer[] pointsForPositions;// = new Integer[] {null, 15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0};

    public Scoring(Integer[] pointsForPositions) {
        this.pointsForPositions = pointsForPositions;
    }

    public int getPointsForPosition(int position) {
        Assert.isTrue(position > 0, format("Position %d must be > 0", position));
        Assert.isTrue(position < pointsForPositions.length, format("Position %d must be < %d", position, pointsForPositions.length));
        return pointsForPositions[position];
    }

    public int getCount() {
        return pointsForPositions.length - 1;
    }

    public static Scoring getScoring(String scoringFormat) {
        switch (scoringFormat) {
            case "progressive:count=12,0-based":
                return new Scoring(new Integer[] {null, 15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0});
            case "progressive:count=10,1-based":
                return new Scoring(new Integer[] {null, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1});

            case "incremental:count=24,1-based":
                return new Scoring(new Integer[] {null, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1});
            case "incremental:count=30,1-based":
                return new Scoring(new Integer[] {null, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1});
            case "incremental:count=36,1-based":
                return new Scoring(new Integer[] {null, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1});

            default:
                throw new RuntimeException("Unknown scoring format: " + scoringFormat);
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
