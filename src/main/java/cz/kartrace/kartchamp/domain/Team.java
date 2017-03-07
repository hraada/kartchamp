package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Team {
    public static final int SIZE = 3;

    private String id = UUID.randomUUID().toString();
    private String name;
    private String shortName;
    private int castOrder;      // 0-based order, which is used only as information in which order should team cast (on race types, where it's used)

    public Team(String name, String shortName, int castOrder) {
        this.name = name;
        this.shortName = shortName;
        this.castOrder = castOrder;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getShortName() {
        return shortName;
    }

    public int getCastOrder() {
        return castOrder;
    }

    @Override
    public String toString() {
        return String.format("Team: { Id: %s, Name: %s}", getId(), getShortName());
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
