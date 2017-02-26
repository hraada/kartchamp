package cz.kartrace.kartchamp.domain;

import java.util.*;

/**
 * @author hradecky
 */
public abstract class AbstractRace {
    private String id = UUID.randomUUID().toString();
    private String name;
    private Date date;
    private Set<Kart> karts = new HashSet<>();
    private NavigableSet<AbstractRound> rounds = new TreeSet<>(Comparator.comparingInt(AbstractRound::getOrder));

    protected void addKart(Kart kart) { karts.add(kart); }
    protected void addRound(AbstractRound round) {
        rounds.add(round);
    }

    public NavigableSet<AbstractRound> getRounds() {
        return rounds;
    }

    public AbstractRound getRoundByOrder(int order) {
        //TODO fix
        return rounds.iterator().next();
    }

    public abstract void assignTeamsToKartRides(List<Team> teamOrder);

    public Set<Kart> getKarts() {
        return karts;
    }
}
