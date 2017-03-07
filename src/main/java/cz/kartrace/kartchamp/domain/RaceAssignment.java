package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class RaceAssignment {
    private String id = UUID.randomUUID().toString();
    private Team team;
    private Driver driver;
    private int order;

    public String getId() {
        return id;
    }

    public Team getTeam() {
        return team;
    }

    public Driver getDriver() {
        return driver;
    }

    public int getOrder() {
        return order;
    }

    public void assign(Team team, Driver driver, int order) {
        this.team = team;
        this.driver = driver;
        this.order = order;
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
