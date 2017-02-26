package cz.kartrace.kartchamp.domain;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Kart {
    private String id = UUID.randomUUID().toString();
    private String number;
    private int order;

    public Kart(String number, int order) {
        this.number = number;
        this.order = order;
    }

    public Kart(int order) {
        this.number = String.valueOf(order);
        this.order = order;
    }

    public String getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public int getOrder() {
        return order;
    }
}
