package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class RaceAssignment {
    private String id;
    private Team team;
    private Driver driver;
    private int teamOrder;

    public RaceAssignment(String id, Team team, Driver driver, int teamOrder) {
        this.id = id;
        this.team = team;
        this.driver = driver;
        this.teamOrder = teamOrder;
    }

    public RaceAssignment(Team team, Driver driver, int teamOrder) {
        this(UUID.randomUUID().toString(), team, driver, teamOrder);
    }

    public String getId() {
        return id;
    }

    public Team getTeam() {
        return team;
    }

    public Driver getDriver() {
        return driver;
    }

    public int getTeamOrder() {
        return teamOrder;
    }

    public void assign(Team team, Driver driver) {
        this.team = team;
        this.driver = driver;
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
