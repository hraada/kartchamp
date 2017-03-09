package cz.kartrace.kartchamp.domain;

import java.util.*;
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

    public static Map<Team, List<Driver>> getDrivers(Set<Team> teams, int teamSize) {
        Map<Team, List<Driver>> teamToDriverMap = new HashMap<>();

        for (Team team: teams) {
            List<Driver> drivers = new ArrayList<>();
            for (int i = 0; i < teamSize; i++) {
                Driver driver = new Driver("Franta", "Bednář " + i + " (" + team.getShortName() + ")");
                drivers.add(driver);
            }
            teamToDriverMap.put(team, drivers);
        }
        return teamToDriverMap;
    }


    public static List<Team> getTeamOrder(Set<Team> teams) {
        List<Team> teamOrder = teams.stream().collect(Collectors.toList());
        teamOrder.sort(comparingInt(Team::getCastOrder));
        //Collections.reverse(teamOrder);
        return teamOrder;
    }

}
