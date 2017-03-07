package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.Results;
import cz.kartrace.kartchamp.domain.Scoring;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static java.util.Comparator.comparingInt;

/**
 * @author hradecky
 */
public abstract class BaseRound<RIDE extends BaseRide, U extends BaseKartRide> {
    private String id = UUID.randomUUID().toString();
    private int order;          // 0-based order of the round in the race
    private String name;
    private Scoring scoring;
    private List<RIDE> rides = new ArrayList<>();

    public BaseRound(int order, String name, Scoring scoring) {
        this.order = order;
        this.name = (order + 1) + "." + name;
        this.scoring = scoring;
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

    protected void addRide(RIDE ride) {
        rides.add(ride);
        rides.sort(comparingInt(BaseRide::getOrder));
    }

    public Scoring getScoring() {
        return scoring;
    }

    public List<RIDE> getRides() {
        return Collections.unmodifiableList(rides);
    }

    public abstract Results getResults();

    @Override
    public String toString() {
        return String.format("Round: { id: %s, name: %s \n%s}", getId(), getName(), StringUtils.join(getRides(), "\n"));
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
