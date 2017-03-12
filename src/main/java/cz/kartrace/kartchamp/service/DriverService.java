package cz.kartrace.kartchamp.service;

import cz.kartrace.kartchamp.dao.DriverDao;
import cz.kartrace.kartchamp.domain.Driver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author hradecky
 */
@Service
public class DriverService {

    private DriverDao driverDao;

    @Autowired
    public DriverService(DriverDao driverDao) {
        this.driverDao = driverDao;
    }

    public List<Driver> getDrivers() {
        return driverDao.getDrivers();
    }

    public Driver getDriverById(String driverId) {
        return driverDao.getDriverById(driverId);
    }

    public Driver save(Driver driver) {
        driverDao.mergeDriver(driver);
        return driver;
    }
}
