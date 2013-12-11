try {
    if (!window) {
        window = {};
        //exports.console = console;
    }
} catch (e) {
    window = {};
    exports.console = console;
}

var persistence = (window && window.persistence) ? window.persistence : {};

if (!persistence.store) {
    persistence.store = {};
}

persistence.store.sqloverhttp = {};

var PersistenceSemaphore = {
    value: 0,
    increase: function() {
        this.value++;
        this.evaluate();
    },
    decrease: function() {
        this.value--;
        this.evaluate();
    },
    evaluate: function() {
        if (this.value > 0) {
            $('#ajax-loader').show();
        } else {
            $('#ajax-loader').hide();
        }
    }
};

persistence.store.sqloverhttp.config = function (persistence, dbname, description, size) {

    /**
     * Create a transaction
     *
     * @param callback,
     *            the callback function to be invoked when the transaction
     *            starts, taking the transaction object as argument
     */
    persistence.transaction = function (callback) {
        var that = {};
        that.executeSql = function (query, args, successFn, errorFn) {
            if (persistence.debug) {
                console.log(query, args);
            }
            if (args) {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] == null) args[i] = undefined; //I hate Jquery serialization of arrays ...
                }
            }

            PersistenceSemaphore.increase();

            $.ajax({
                type: 'POST',
                url: '/api/executeQuery',
                dataType: 'json',
                data: $.param({query: query, param: args}),
                processData: false,
                success: function (result) {
                    PersistenceSemaphore.decrease();
                    console.log(result);

                    if (successFn) {
                        var results = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            results.push(result.rows.item[i]);
                        }
                        successFn(results);
                    }
                },
                error: function () {
                    PersistenceSemaphore.decrease();
                    errorFn();
                }
            });
        };
        callback(that);
    };

    ////////// Low-level database interface, abstracting from HTML5 and Gears databases \\\\
    persistence.db = persistence.db || {};

    /* persistence.db.implementation = "html5";
     persistence.db.conn = null;
     persistence.db.html5 = {};

     persistence.db.html5.connect = function (dbname, description, size) {
     var that = {};
     return that;
     };                 */


    persistence.db.connect = function (dbname, description, size) {

    };

    ///////////////////////// SQLite dialect

    persistence.store.sqloverhttp.sqliteDialect = {
        // columns is an array of arrays, e.g.
        // [["id", "VARCHAR(32)", "PRIMARY KEY"], ["name", "TEXT"]]
        createTable: function (tableName, columns) {
            var tm = persistence.typeMapper;
            var sql = "CREATE TABLE IF NOT EXISTS `" + tableName + "` (";
            var defs = [];
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                defs.push("`" + column[0] + "` " + tm.columnType(column[1]) + (column[2] ? " " + column[2] : ""));
            }
            sql += defs.join(", ");
            sql += ')';
            return sql;
        },

        // columns is array of column names, e.g.
        // ["id"]
        createIndex: function (tableName, columns, options) {
            options = options || {};
            return "CREATE " + (options.unique ? "UNIQUE " : "") + "INDEX IF NOT EXISTS `" + tableName + "__" + columns.join("_") +
                "` ON `" + tableName + "` (" +
                columns.map(function (col) {
                    return "`" + col + "`";
                }).join(", ") + ")";
        }
    };

    // Configure persistence for generic sql persistence, using sqliteDialect
    persistence.store.sql.config(persistence, persistence.store.sqloverhttp.sqliteDialect);

    // Make the connection
    persistence.db.connect(dbname, description, size);

};

try {
    exports.persistence = persistence;
} catch (e) {
}
