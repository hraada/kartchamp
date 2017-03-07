package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import java.time.Duration;
import java.util.List;

import static java.util.Comparator.comparingInt;

/**
 * @author hradecky
 */
public class Race {


    public static class Round extends BaseRound<Ride, KartRide> {

        public Round(int order, int teamCount, List<Kart> karts, Scoring scoring) {
            super(order, "závod", scoring);
            Assert.isTrue(karts.size() <= teamCount);
            Assert.isTrue(teamCount * Team.SIZE % karts.size() == 0);
            int rideCount = teamCount * Team.SIZE / karts.size();

            for (int i = 0; i < rideCount; i++) {
                addRide(new Race.Ride(i, karts));
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


        @Override
        public String toString() {
            return String.format("Ride: { id: %s, name: %s \n%s}", getId(), getName(), StringUtils.join(getSortedKartRides(comparingInt(KartRide::getStartPosition)), "\n"));
        }


    }

    public static class KartRide extends BaseKartRide<KartRide> {
        private int startPosition;
        private int finishPosition;
        private Duration bestTime;

        public KartRide(Kart kart) {
            super(kart);
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

        public void setStartPosition(int startPosition) {
            this.startPosition = startPosition;
        }

        public void setFinishPosition(int finishPosition) {
            this.finishPosition = finishPosition;
        }

        public void setBestTime(Duration bestTime) {
            this.bestTime = bestTime;
        }

        @Override
        public void resetResultAndAssignments() {
            setDriver(null);
            setTeam(null);
            setStartPosition(0);
            setFinishPosition(0);
            setBestTime(Duration.ZERO);
        }

        @Override
        public int compareTo(KartRide o) {
            return finishPosition - o.finishPosition;
        }

        @Override
        public String toString() {
            return String.format("KartRide: { id: %s, %s, %s, %s, sp: %d, fp: %d, bl: %s}", getId(), getKart(), getTeam(), getDriver(), getStartPosition(), getFinishPosition(), getBestTime());
        }

    }
}