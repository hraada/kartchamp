package org.hradecky.kartchamp.model;


public class SqlResultSet {

    private long insertId;
    private long rowsAffected;
    private SqlResultSetRowList rows;

    public SqlResultSet() {

    }

    public SqlResultSet(long insertId, long rowsAffected, SqlResultSetRowList rows) {
        this.insertId = insertId;
        this.rowsAffected = rowsAffected;
        this.rows = rows;
    }

    public SqlResultSetRowList getRows() {
        return rows;
    }

    public void setRows(SqlResultSetRowList rows) {
        this.rows = rows;
    }

    public long getRowsAffected() {
        return rowsAffected;
    }

    public void setRowsAffected(long rowsAffected) {
        this.rowsAffected = rowsAffected;
    }

    public long getInsertId() {
        return insertId;
    }

    public void setInsertId(long insertId) {
        this.insertId = insertId;
    }

    @Override
    public String toString() {
        return "SqlResultSet{" +
                "insertId=" + insertId +
                ", rowsAffected=" + rowsAffected +
                ", rows=" + rows +
                '}';
    }
}
