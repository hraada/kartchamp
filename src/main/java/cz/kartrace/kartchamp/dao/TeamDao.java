package cz.kartrace.kartchamp.dao;

import cz.kartrace.kartchamp.domain.Team;
import org.apache.ibatis.annotations.*;

/**
 * @author hradecky
 */
@Mapper
public interface TeamDao {

    @Select("SELECT * FROM teams WHERE id = #{id}")
    Team getTeamById(@Param("id") String id);

    @Insert("INSERT INTO teams (id, name, short_name, cast_order) VALUES (#{team.id}, #{team.name}, #{team.shortName}, #{team.castOrder})")
    void insertTeam(@Param("team") Team team);

    @Update("UPDATE teams SET name=#{team.name}, short_name=#{team.shortName}, cast_order=#{team.castOrder} WHERE id = #{team.id}")
    void updateTeam(@Param("team") Team team);

}
