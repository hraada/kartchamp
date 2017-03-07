package cz.kartrace.kartchamp.domain;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Comparator.comparingInt;

/**
 * @author hradecky
 */
public class TestData {


    public static Set<Team> getTeams(int teamCount) {
        Set<Team> teams = new HashSet<>();
        for (int i = 0; i < teamCount; i++) {
            Team team = new Team("Kart Racing Team " + i, "K.R.T. " + i, i);
            teams.add(team);
        }
        return teams;
    }

    public static Set<Driver> getDrivers(int teamCount, int teamSize) {
        Set<Driver> drivers = new HashSet<>();
        for (int i = 0; i < teamCount * teamSize; i++) {
            Driver driver = new Driver("Franta", "Bednář " + i);
            drivers.add(driver);
        }
        return drivers;
    }


    public static List<Team> getReverseTeamOrder(Set<Team> teams) {
        List<Team> teamOrder = teams.stream().collect(Collectors.toList());
        teamOrder.sort(comparingInt(Team::getCastOrder));
        //Collections.reverse(teamOrder);
        return teamOrder;
    }

}
