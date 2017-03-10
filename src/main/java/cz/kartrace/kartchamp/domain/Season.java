package cz.kartrace.kartchamp.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.UUID;

/**
 * @author hradecky
 */
public class Season {
    private String id = UUID.randomUUID().toString();
    private String name;
    private int year;

    public Season(String id, String name, Integer year) {
        this.id = id;
        this.name = name;
        this.year = year;
    }

    public Season(String name, int year) {
        this(UUID.randomUUID().toString(), name, year);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getYear() {
        return year;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setYear(int year) {
        this.year = year;
    }

    @Override
    public String toString() {
        return String.format("Season: { Id: %s, Name: %s}", getId(), getName());
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
