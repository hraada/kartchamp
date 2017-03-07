package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Kart {
    private String id = UUID.randomUUID().toString();
    private String number;
    private int order;      // 0-based, ordering of the kart (useful mainly for predictable order in fair sprints and fair qualification)

    public Kart(int order, String number) {
        this.order = order;
        this.number = number;
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

    @Override
    public String toString() {
        return String.format("Kart: { Id: %s, Order: %d, Number: %s}", getId(), getOrder(), getNumber());
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
