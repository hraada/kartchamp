package cz.kartrace.kartchamp.domain;

import org.springframework.util.Assert;

import java.time.Duration;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

/**
 * @author hradecky
 */
public class Qualification {

    public static class Round extends AbstractRound {

        public Round(int order, int teamCount, Set<Kart> karts) {
            super(order, "kvalifikace");

            Assert.isTrue(karts.size() <= teamCount);
            Assert.isTrue(teamCount * Team.SIZE % karts.size() == 0);
            int rideCount = teamCount * Team.SIZE / karts.size();

            for (int i = 1; i <= rideCount; i++) {
                addRide(new Qualification.Ride(i, karts));
            }
        }

        @Override
        public List<AbstractKartRide> getResults() {
            return getRides().stream()
                    .flatMap(ride -> ride.getKartRides().stream())
                    .sorted()
                    .collect(toList());
        }
    }


    public static class Ride extends AbstractRide {

        public Ride(int order, Set<Kart> karts) {
            super(order);
            karts.forEach(kart -> addResult(new KartRide(null, null, kart, Duration.ZERO, 0)));
        }
    }




    public static class KartRide extends AbstractKartRide {
        private Duration bestTime;
        private int bestTimeLap;

        public KartRide(Team team, Driver driver, Kart kart, Duration bestTime, int bestTimeLap) {
            super(kart, team, driver);
            this.bestTime = bestTime;
            this.bestTimeLap = bestTimeLap;
        }

        public Duration getBestTime() {
            return bestTime;
        }

        public int getBestTimeLap() {
            return bestTimeLap;
        }

        @Override
        public int compareTo(AbstractKartRide o) {
            if (!(o instanceof KartRide)) throw new RuntimeException(o.getClass().getName() + " is being compared to QualificationKartRide");
            KartRide other = (KartRide) o;
            int bestTimeResult = bestTime.compareTo(other.bestTime);
            int bestTimeLapResult = bestTimeLap - other.bestTimeLap;
            return bestTimeResult != 0 ? bestTimeResult : bestTimeLapResult;
        }
    }
}
