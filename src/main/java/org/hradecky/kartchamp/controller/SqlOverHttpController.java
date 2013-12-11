package org.hradecky.kartchamp.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hradecky.kartchamp.model.SqlResultSet;
import org.hradecky.kartchamp.model.SqlResultSetRowList;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Main controller with simple purpose. Forward sql queries from http interface to jdbc interface.
 * 
 * @author 
 */
@Controller
@RequestMapping(value = "/executeQuery")
public class SqlOverHttpController {

    private Log log = LogFactory.getLog(SqlOverHttpController.class);
    private Connection connection = null;

    public SqlOverHttpController() {
        //Load sqlite jdbc driver
        try {
            Class.forName("org.sqlite.JDBC");
            //connection = DriverManager.getConnection("jdbc:sqlite::resource:org/hradecky/kartchamp/db/kartchamp");
            connection = DriverManager.getConnection("jdbc:sqlite:data/kartchamp");
        } catch (ClassNotFoundException e) {
            log.error("Error during JDBC initialization", e);
        } catch (SQLException e) {
            log.error("Error during database file opening", e);
        }

    }

    /**
     * Calls given query and params on the sqllite database instance
     *
     * @param query       query to be executed
     * @param paramValues parameters to be binded into the query
     * @return SqlResultSet resultSet of the query
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public synchronized SqlResultSet executeQuery(@RequestParam("query") String query, @RequestParam(value = "param[]", required = false) String[] paramValues) {
        log.info("Executing query: " + query + " with params: " + paramValues);

        SqlResultSet sqlResultSet = new SqlResultSet();
        SqlResultSetRowList sqlResultSetRowList = new SqlResultSetRowList();

        try {


            PreparedStatement statement = connection.prepareStatement(query);

            if (paramValues != null) {
                for (int i = 0; i < paramValues.length; i++) {
                    statement.setString(i + 1, paramValues[i]);
                    log.debug("Setting parameter for prepared statement on index " + (i + 1) + " with value " + paramValues[i]);
                }
            }

            if (query.startsWith("SELECT")) {
                ResultSet rs = statement.executeQuery();

                while (rs.next()) {
                    Map<String, Object> row = new HashMap<String, Object>();
                    for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                        row.put(rs.getMetaData().getColumnName(i), rs.getObject(i));
                        log.trace("Adding column " + rs.getMetaData().getColumnName(i) + " with value " + rs.getObject(i));
                    }
                    sqlResultSetRowList.addRow(row);
                }
            } else if (query.startsWith("UPDATE")) {
                statement.executeUpdate();
            } else {
                statement.execute();
            }

            sqlResultSet.setRowsAffected(statement.getUpdateCount());

        } catch (SQLException e) {
            log.error("Error during SQL execution ", e);
        }
        sqlResultSet.setRows(sqlResultSetRowList);
        log.info("Returning result set: " + sqlResultSet);
        return sqlResultSet;
    }
}
