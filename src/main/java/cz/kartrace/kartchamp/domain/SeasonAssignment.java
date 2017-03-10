package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class SeasonAssignment {
    private String id;
    private Season season;
    private Team team;
    private Driver driver;

    public SeasonAssignment(String id, Season season, Team team, Driver driver) {
        this.id = id;
        this.season = season;
        this.team = team;
        this.driver = driver;
    }

    public SeasonAssignment(Season season, Team team, Driver driver) {
        this(UUID.randomUUID().toString(), season, team, driver);
    }

    public String getId() {
        return id;
    }

    public Season getSeason() {
        return season;
    }

    public Team getTeam() {
        return team;
    }

    public Driver getDriver() {
        return driver;
    }

    public void assign(Season season, Team team, Driver driver) {
        this.season = season;
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
