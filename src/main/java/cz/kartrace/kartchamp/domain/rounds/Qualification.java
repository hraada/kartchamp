package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.Kart;
import cz.kartrace.kartchamp.domain.Results;
import cz.kartrace.kartchamp.domain.Scoring;
import cz.kartrace.kartchamp.domain.Team;
import org.springframework.util.Assert;

import java.time.Duration;
import java.util.List;

/**
 * @author hradecky
 */
public class Qualification {

    public static class Round extends BaseRound<Ride, KartRide> {

        public Round(int order, int teamCount, List<Kart> karts, Scoring scoring) {
            super(order, "kvalifikace", scoring);

            Assert.isTrue(karts.size() <= teamCount);
            Assert.isTrue(teamCount * Team.SIZE % karts.size() == 0);
            int rideCount = teamCount * Team.SIZE / karts.size();

            for (int i = 0; i < rideCount; i++) {
                addRide(new Qualification.Ride(i, karts));
            }
        }

        @Override
        public Results getResults() {
            return new Results();
        }

    }


    public static class Ride extends BaseRide<KartRide> {

        public Ride(int order, List<Kart> karts) {
            super(order);
            karts.forEach(kart -> {
                addKartRide(new KartRide(kart));
            });
        }
    }


    public static class KartRide extends BaseKartRide<KartRide> {
        private Duration bestTime;
        private int order;              // Order to sort same bestTime. If bestTime is the same, lower lap is better, if lap is same, next best lap is taken (therefore order instead of bestLapTime is needed)

        public KartRide(Kart kart) {
            super(kart);
        }

        public Duration getBestTime() {
            return bestTime;
        }

        public int getOrder() {
            return order;
        }

        public void setBestTime(Duration bestTime) {
            this.bestTime = bestTime;
        }

        public void setOrder(int order) {
            this.order = order;
        }

        @Override
        public void resetResultAndAssignments() {
            setDriver(null);
            setTeam(null);
            setBestTime(Duration.ZERO);
            setOrder(0);
        }

        @Override
        public int compareTo(KartRide o) {
            int bestTimeResult = bestTime.compareTo(o.bestTime);
            int orderResult = order - o.order;
            return bestTimeResult != 0 ? bestTimeResult : orderResult;
        }
    }
}
