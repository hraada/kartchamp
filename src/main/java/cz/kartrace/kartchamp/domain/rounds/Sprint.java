package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.Kart;
import cz.kartrace.kartchamp.domain.Results;
import cz.kartrace.kartchamp.domain.Scoring;
import org.springframework.util.Assert;

import java.util.List;

/**
 * @author hradecky
 */
public class Sprint {


    public static class Round extends BaseRound<Race.Ride, Race.KartRide> {

        public Round(int order, int teamCount, List<Kart> karts, Scoring scoring) {
            super(order, "závod", scoring);
            Assert.isTrue(karts.size() == teamCount);
            int rideCount = teamCount;

            for (int i = 0; i < rideCount; i++) {
                addRide(new Race.Ride(i, karts));
            }
        }

        @Override
        public Results getResults() {
            Results results = new Results();
            getRides().forEach(ride -> {
                ride.getKartRides().forEach(kartRide -> {
                    int position = kartRide.getFinishPosition();
                    int points = getScoring().getPointsForPosition(position);
                    results.addPointsAndPositions(kartRide.getDriver(), kartRide.getTeam(), new Results.PointsAndPositions(points, position));
                });
            });
            return results;
        }

    }

}
