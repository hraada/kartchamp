package cz.kartrace.kartchamp.domain;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Driver {
    private String id = UUID.randomUUID().toString();
    private String name;
    private String surname;

}
