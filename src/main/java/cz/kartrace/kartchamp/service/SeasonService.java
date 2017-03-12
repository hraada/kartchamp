package cz.kartrace.kartchamp.service;

import cz.kartrace.kartchamp.dao.SeasonDao;
import cz.kartrace.kartchamp.domain.Season;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author hradecky
 */
@Service
public class SeasonService {

    private SeasonDao seasonDao;

    @Autowired
    public SeasonService(SeasonDao seasonDao) {
        this.seasonDao = seasonDao;
    }

    public List<Season> getSeasons() {
        return seasonDao.getSeasons();
    }

    public Season getSeasonById(String seasonId) {
        return seasonDao.getSeasonById(seasonId);
    }
}
