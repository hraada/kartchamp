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

    @Insert("MERGE INTO teams (id, name, short_name, cast_order) KEY(id) VALUES (#{team.id}, #{team.name}, #{team.shortName}, #{team.castOrder})")
    void mergeTeam(@Param("team") Team team);


}
