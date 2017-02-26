package cz.kartrace.kartchamp.domain;

import org.springframework.util.Assert;

import java.time.Duration;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

/**
 * @author hradecky
 */
public class HeatRace {


    public static class Round extends AbstractRound {

        public Round(int order, int teamCount, Set<Kart> karts) {
            super(order, "závod");
            Assert.isTrue(karts.size() <= teamCount);
            Assert.isTrue(teamCount * Team.SIZE % karts.size() == 0);
            int rideCount = teamCount * Team.SIZE / karts.size();

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


    public static class Ride extends AbstractRide {

        public Ride(int order, Set<Kart> karts) {
            super(order);
            karts.forEach(kart -> addResult(new KartRide(null, null, kart, 0, 0, Duration.ZERO)));
        }
    }

    public static class KartRide extends AbstractKartRide {
        private int startPosition;
        private int finishPosition;
        private Duration bestTime;

        public KartRide(Team team, Driver driver, Kart kart, int startPosition, int finishPosition, Duration bestTime) {
            super(kart, team, driver);
            this.startPosition = startPosition;
            this.finishPosition = finishPosition;
            this.bestTime = bestTime;
        }

        public int getStartPosition() {
            return startPosition;
        }

        public int getFinishPosition() {
            return finishPosition;
        }

        public Duration getBestTime() {
            return bestTime;
        }

        @Override
        public int compareTo(AbstractKartRide o) {
            if (!(o instanceof KartRide)) throw new RuntimeException(o.getClass().getName() + " is being compared to HeatRaceKartRide");
            KartRide other = (KartRide) o;
            return finishPosition - other.finishPosition;
        }
    }
}
