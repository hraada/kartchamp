package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.Kart;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.*;

import static java.util.Comparator.comparingInt;

/**
 * @author hradecky
 */
public abstract class BaseRide<KART_RIDE extends BaseKartRide> {
    private String id = UUID.randomUUID().toString();
    private int order;          // 0-based order of the ride in the round
    private String name;
    private Set<KART_RIDE> kartRides = new HashSet<>();

    public BaseRide(int order) {
        this.order = order;
        this.name = (order + 1) + ".jízda";
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

    public void addKartRide(KART_RIDE result) {
        kartRides.add(result);
    }

    public Set<KART_RIDE> getKartRides() {
        return kartRides;
    }

    public List<KART_RIDE> getSortedKartRides(Comparator<KART_RIDE> comparator) {
        List<KART_RIDE> kartRides = new ArrayList<>(getKartRides());
        kartRides.sort(comparator);
        return kartRides;
    }

    public Optional<KART_RIDE> getKartRideByKart(Kart kart) {
        return kartRides.stream()
                .filter(kartRide -> kart.equals(kartRide.getKart()))
                .findFirst();
    }

    @Override
    public String toString() {
        return String.format("Ride: { id: %s, name: %s \n%s}", getId(), getName(), StringUtils.join(getSortedKartRides(comparingInt(kartRide -> kartRide.getKart().getOrder())), "\n"));
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
