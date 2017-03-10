package cz.kartrace.katchamp.dao;

import cz.kartrace.kartchamp.Application;
import cz.kartrace.kartchamp.dao.DriverDao;
import cz.kartrace.kartchamp.domain.Driver;
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
public class ITDriverDaoTest {

    @Autowired
    private DriverDao driverDao;

    @Test
    public void when_driver_is_inserted_and_retrieved_by_id_values_must_match() {
        Driver driver = new Driver("Franta", "Bednar");
        driverDao.insertDriver(driver);

        Driver fetchedDriver = driverDao.getDriverById(driver.getId());

        assertThat(driver, is(equalTo(fetchedDriver)));
    }

    @Test
    public void when_driver_is_updated_and_retrieved_by_id_values_must_match() {
        Driver driver = new Driver("Franta 2", "Bednar 2");
        driverDao.insertDriver(driver);
        driver.setName("Franta 3");
        driver.setSurname("Bednar 3");
        driverDao.updateDriver(driver);

        Driver fetchedDriver = driverDao.getDriverById(driver.getId());

        assertThat(driver, is(equalTo(fetchedDriver)));
    }

}
