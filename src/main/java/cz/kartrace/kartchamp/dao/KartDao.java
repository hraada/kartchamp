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

    @Insert("INSERT INTO race_karts (id, number, kart_order) VALUES (#{kart.id}, #{kart.number}, #{kart.order})")
    void insertKart(@Param("kart") Kart kart);

    @Update("UPDATE race_karts SET number=#{kart.number}, kart_order=#{kart.order} WHERE id = #{kart.id}")
    void updateKart(@Param("kart") Kart kart);
}
