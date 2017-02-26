package cz.kartrace.kartchamp.domain;

import org.springframework.util.Assert;

import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

/**
 * @author hradecky
 */
public class SprintRace {


    public static class Round extends AbstractRound {

        public Round(int order, int teamCount, Set<Kart> karts) {
            super(order, "závod");
            Assert.isTrue(karts.size() == teamCount);
            int rideCount = teamCount;

            for (int i = 1; i <= rideCount; i++) {
                addRide(new HeatRace.Ride(i, karts));
            }
        }

        @Override
        public List<AbstractKartRide> getResults() {
            return getRides().stream()
                    .flatMap(ride -> ride.getKartRides().stream())
                    .collect(toList());
        }
    }

}
