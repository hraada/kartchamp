package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Kart {
    private String id;
    private String raceId;
    private String number;
    private int order;      // 0-based, ordering of the kart (useful mainly for predictable order in fair sprints and fair qualification)

    public Kart(String id, String number, Integer order, String raceId) {
        this.id = id;
        this.raceId = raceId;
        this.number = number;
        this.order = order;
    }

    public Kart(int order, String number, String raceId) {
        this(UUID.randomUUID().toString(), number, order, raceId);
    }

    public String getId() {
        return id;
    }

    public int getOrder() {
        return order;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    @Override
    public String toString() {
        return String.format("Kart: { Id: %s, Number: %s, Order: %d}", getId(), getNumber(), getOrder());
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
