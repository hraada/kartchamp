package org.hradecky.kartchamp.model;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SqlResultSetRowList {

    List<Map<String, Object>> itemList;

    public SqlResultSetRowList() {
        itemList = new ArrayList<Map<String, Object>>();
    }

    public void addRow(Map<String, Object> rowMap) {
        itemList.add(rowMap);
    }

    public long getLength() {
        return itemList.size();
    }

    public List<Map<String, Object>> getItem() {
        return itemList;
    }

    @Override
    public String toString() {
        return "SqlResultSetRowList{" +
                "itemList=" + itemList +
                '}';
    }
}
