package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Driver {
    private String id = UUID.randomUUID().toString();
    private String name;
    private String surname;

    public Driver(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    @Override
    public String toString() {
        return String.format("Driver: { Id: %s, Name: %s, Surname: %s}", getId(), getName(), getSurname());
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