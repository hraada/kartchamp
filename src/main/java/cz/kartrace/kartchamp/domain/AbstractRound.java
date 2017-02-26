package cz.kartrace.kartchamp.domain;

import java.util.*;

/**
 * @author hradecky
 */
public abstract class AbstractRound {
    private String id = UUID.randomUUID().toString();
    private int order;
    private String name;
    private NavigableSet<AbstractRide> rides = new TreeSet<>(Comparator.comparingInt(AbstractRide::getOrder));

    public AbstractRound(int order, String name) {
        this.order = order;
        this.name = order + "." + name;
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

    public AbstractRide getRideByOrder(int order) {
        //TODO fix
        return rides.first();
    }

    protected void addRide(AbstractRide ride) {
        rides.add(ride);
    }

    protected NavigableSet<AbstractRide> getRides() {
        return rides;
    }

    public abstract List<AbstractKartRide> getResults();
}
