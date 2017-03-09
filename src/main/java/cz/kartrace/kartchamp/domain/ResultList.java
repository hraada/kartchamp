package cz.kartrace.kartchamp.domain;

import cz.kartrace.kartchamp.domain.rounds.BaseKartRide;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

/**
 * @author hradecky
 */
public class ResultList<T extends BaseKartRide> {

    private List<Result<T>> roundResults = new ArrayList<>();

    public void addResult(Result<T> result) {
        roundResults.add(result);
    }

    public Stream<ResultList.Result<T>> stream() {
        return roundResults.stream();
    }


    public static class Result<U extends BaseKartRide> {
        private U kartRide;
        private int position;
        private int points;

        public Result(U kartRide, int position, int points) {
            this.kartRide = kartRide;
            this.position = position;
            this.points = points;
        }

        public U getKartRide() {
            return kartRide;
        }

        public int getPosition() {
            return position;
        }

        public int getPoints() {
            return points;
        }
    }
}
