package cz.kartrace.kartchamp.domain;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Team {
    public static final int SIZE = 3;

    private String id = UUID.randomUUID().toString();
    private String name;
    private String shortName;
    private int castOrder;

    public Team(String name, String shortName, int castOrder) {
        this.name = name;
        this.shortName = shortName;
        this.castOrder = castOrder;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getShortName() {
        return shortName;
    }

    public int getCastOrder() {
        return castOrder;
    }
}
