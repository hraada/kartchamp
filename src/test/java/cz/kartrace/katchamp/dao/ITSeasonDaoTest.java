package cz.kartrace.katchamp.dao;

import cz.kartrace.kartchamp.Application;
import cz.kartrace.kartchamp.dao.SeasonDao;
import cz.kartrace.kartchamp.domain.Season;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

/**
 * @author hradecky
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class ITSeasonDaoTest {

    @Autowired
    private SeasonDao seasonDao;

    @Test
    public void when_season_is_inserted_and_retrieved_by_id_values_must_match() {
        Season season = new Season("Season 2016", 2016);
        seasonDao.mergeSeason(season);

        Season fetchedTeam = seasonDao.getSeasonById(season.getId());

        assertThat(season, is(equalTo(fetchedTeam)));
    }

    @Test
    public void when_season_is_updated_and_retrieved_by_id_values_must_match() {
        Season season = new Season("Season 2017", 2017);
        seasonDao.mergeSeason(season);
        season.setName("Season 2018");
        season.setYear(2018);
        seasonDao.mergeSeason(season);

        Season fetchedSeason = seasonDao.getSeasonById(season.getId());

        assertThat(season, is(equalTo(fetchedSeason)));
    }

}
