package cz.kartrace.kartchamp.domain;

import java.util.UUID;

/**
 * @author hradecky
 */
public abstract class AbstractKartRide implements Comparable<AbstractKartRide> {
    private String id = UUID.randomUUID().toString();
    private Kart kart;
    private Team team;
    private Driver driver;


    public AbstractKartRide(Kart kart, Team team, Driver driver) {
        this.kart = kart;
        this.team = team;
        this.driver = driver;
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
}
