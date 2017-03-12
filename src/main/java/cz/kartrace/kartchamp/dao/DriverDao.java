package cz.kartrace.kartchamp.dao;

import cz.kartrace.kartchamp.domain.Driver;
import cz.kartrace.kartchamp.domain.Season;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author hradecky
 */
@Mapper
public interface DriverDao {


    @Select("SELECT * FROM drivers ORDER BY name, surname")
    List<Driver> getDrivers();

    @Select("SELECT * FROM drivers WHERE id = #{id}")
    Driver getDriverById(@Param("id") String id);

    @Insert("MERGE INTO drivers (id, name, surname) KEY(id) VALUES (#{driver.id}, #{driver.name}, #{driver.surname})")
    void mergeDriver(@Param("driver") Driver driver);

}
