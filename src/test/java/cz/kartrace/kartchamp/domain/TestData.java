package cz.kartrace.kartchamp.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author hradecky
 */
public class TestData {

    public static final List<Team> TEAM_10_ORDER = new ArrayList<>();
    public static final Set<Team> TEAMS_10 = new HashSet<>();


    static {
        for (int i = 0; i < 10; i++) {
            Team team = new Team("Kart Racing Team " + i, "K.R.T.", i + 1);
            TEAMS_10.add(team);
            TEAM_10_ORDER.add(team);
        }

    }
}
