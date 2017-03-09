package cz.kartrace.kartchamp.domain.rounds;

import cz.kartrace.kartchamp.domain.Kart;
import cz.kartrace.kartchamp.domain.ResultList;
import cz.kartrace.kartchamp.domain.Scoring;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

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
        public List<ResultList<Race.KartRide>> getRoundResultLists() {
            List<ResultList<Race.KartRide>> roundResultLists = new ArrayList<>();

            //Each ride of sprints generate separate result list
            getRides().forEach(ride -> {
                List<Race.KartRide> sortedKartRides = ride.getKartRides().stream()
                        .sorted()
                        .collect(toList());

                ResultList<Race.KartRide> resultList = new ResultList<>();
                for (int i = 0; i < sortedKartRides.size(); i++) {
                    int position = i + 1;
                    Race.KartRide kartRide = sortedKartRides.get(i);
                    int points = getScoring().getPointsForPosition(position);
                    resultList.addResult(new ResultList.Result<>(kartRide, position, points));
                }
                roundResultLists.add(resultList);
            });
            return roundResultLists;
        }

    }

}
