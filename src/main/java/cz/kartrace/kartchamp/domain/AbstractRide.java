package cz.kartrace.kartchamp.domain;

import java.util.*;

/**
 * @author hradecky
 */
public abstract class AbstractRide {
    private String id = UUID.randomUUID().toString();
    private int order;
    private String name;
    private Set<AbstractKartRide> kartRides;

    public AbstractRide(int order) {
        this.order = order;
        this.name = order + ".jízda";
        kartRides = new HashSet<>();
    }

    public String getId() {
        return id;
    }

    public int getOrder() {
        return order;
    }

    public String getName() {
        return name;
    }

    public void addResult(AbstractKartRide result) {
        kartRides.add(result);
    }

    public Set<AbstractKartRide> getKartRides() {
        return kartRides;
    }

    private Optional<AbstractKartRide> getKartRideByKart(Kart kart) {
        return kartRides.stream()
                .filter(kartRide -> kart.equals(kartRide.getKart()))
                .findFirst();
    }

    public void setKartRide(Kart kart, AbstractKartRide result) {
        getKartRideByKart(kart).ifPresent(kartRide -> {

        });
    }

    public void assignDriverToKartRide(Kart kart, Driver driver) {

    }

}
