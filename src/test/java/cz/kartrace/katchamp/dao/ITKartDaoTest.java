package cz.kartrace.katchamp.dao;

import cz.kartrace.kartchamp.Application;
import cz.kartrace.kartchamp.dao.KartDao;
import cz.kartrace.kartchamp.domain.Kart;
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
public class ITKartDaoTest {

    @Autowired
    private KartDao kartDao;

    @Test
    public void when_kart_is_inserted_and_retrieved_by_id_values_must_match() {
        Kart kart = new Kart(1, "01", null);
        kartDao.mergeKart(kart);

        Kart fetchedKart = kartDao.getKartById(kart.getId());

        assertThat(kart, is(equalTo(fetchedKart)));
    }

    @Test
    public void when_kart_is_updated_and_retrieved_by_id_values_must_match() {
        Kart kart = new Kart(2, "02", null);
        kartDao.mergeKart(kart);
        kart.setNumber("03");
        kart.setOrder(3);
        kartDao.mergeKart(kart);

        Kart fetchedKart = kartDao.getKartById(kart.getId());

        assertThat(kart, is(equalTo(fetchedKart)));
    }

}
