package cz.kartrace.kartchamp.dao;

import cz.kartrace.kartchamp.domain.Season;
import org.apache.ibatis.annotations.*;

/**
 * @author hradecky
 */
@Mapper
public interface SeasonDao {

    @Select("SELECT * FROM seasons WHERE id = #{id}")
    Season getSeasonById(@Param("id") String id);

    @Insert("INSERT INTO seasons (id, name, year) VALUES (#{season.id}, #{season.name}, #{season.year})")
    void insertSeason(@Param("season") Season season);

    @Update("UPDATE seasons SET name=#{season.name}, year=#{season.year} WHERE id = #{season.id}")
    void updateSeason(@Param("season") Season season);
}
