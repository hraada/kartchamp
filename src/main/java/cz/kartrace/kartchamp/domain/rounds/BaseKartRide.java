package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.Driver;
import cz.kartrace.kartchamp.domain.Kart;
import cz.kartrace.kartchamp.domain.Team;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public abstract class BaseKartRide<T> implements Comparable<T> {
    private String id = UUID.randomUUID().toString();
    private Kart kart;
    private Team team;
    private Driver driver;


    public BaseKartRide(Kart kart) {
        this.kart = kart;
    }

    public String getId() {
        return id;
    }

    public Kart getKart() {
        return kart;
    }

    public Team getTeam() {
        return team;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public abstract void resetResultAndAssignments();

    @Override
    public String toString() {
        return String.format("KartRide: { id: %s, %s, %s, %s}", getId(), getKart(), getTeam(), getDriver());
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
