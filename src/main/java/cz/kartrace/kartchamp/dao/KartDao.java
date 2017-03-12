package cz.kartrace.kartchamp.dao;

import cz.kartrace.kartchamp.domain.Kart;
import org.apache.ibatis.annotations.*;

/**
 * @author hradecky
 */
@Mapper
public interface KartDao {

    @Select("SELECT * FROM race_karts WHERE id = #{id}")
    Kart getKartById(@Param("id") String id);

    @Insert("MERGE INTO race_karts (id, number, kart_order) KEY(id) VALUES (#{kart.id}, #{kart.number}, #{kart.order})")
    void mergeKart(@Param("kart") Kart kart);

}
