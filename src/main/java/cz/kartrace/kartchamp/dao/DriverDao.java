package cz.kartrace.kartchamp.dao;

import cz.kartrace.kartchamp.domain.Driver;
import org.apache.ibatis.annotations.*;

/**
 * @author hradecky
 */
@Mapper
public interface DriverDao {

    @Select("SELECT * FROM drivers WHERE id = #{id}")
    Driver getDriverById(@Param("id") String id);

    @Insert("INSERT INTO drivers (id, name, surname) VALUES (#{driver.id}, #{driver.name}, #{driver.surname})")
    void insertDriver(@Param("driver") Driver driver);

    @Update("UPDATE drivers SET name=#{driver.name}, surname=#{driver.surname} WHERE id = #{driver.id}")
    void updateDriver(@Param("driver") Driver driver);
}
