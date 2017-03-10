package cz.kartrace.katchamp.dao;

import cz.kartrace.kartchamp.Application;
import cz.kartrace.kartchamp.dao.TeamDao;
import cz.kartrace.kartchamp.domain.Team;
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
public class ITTeamDaoTest {

    @Autowired
    private TeamDao teamDao;

    @Test
    public void when_team_is_inserted_and_retrieved_by_id_values_must_match() {
        Team team = new Team("K.R.T. Racing", "K.R.T.", 1);
        teamDao.insertTeam(team);

        Team fetchedTeam = teamDao.getTeamById(team.getId());

        assertThat(team, is(equalTo(fetchedTeam)));
    }

    @Test
    public void when_team_is_updated_and_retrieved_by_id_values_must_match() {
        Team team = new Team("K.R.T. Racing", "K.R.T.", 1);
        teamDao.insertTeam(team);
        team.setName("K.R.T. Racing 2");
        team.setShortName("K.R.T. 2");
        team.setCastOrder(2);
        teamDao.updateTeam(team);

        Team fetchedTeam = teamDao.getTeamById(team.getId());

        assertThat(team, is(equalTo(fetchedTeam)));
    }

}
