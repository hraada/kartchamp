package cz.kartrace.kartchamp.dao;

import cz.kartrace.kartchamp.domain.Season;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author hradecky
 */
@Mapper
public interface SeasonDao {

    @Select("SELECT * FROM seasons ORDER BY year")
    List<Season> getSeasons();

    @Select("SELECT * FROM seasons WHERE id = #{id}")
    Season getSeasonById(@Param("id") String id);

    @Insert("MERGE INTO seasons (id, name, year) KEY(id) VALUES (#{season.id}, #{season.name}, #{season.year})")
    void mergeSeason(@Param("season") Season season);

}
