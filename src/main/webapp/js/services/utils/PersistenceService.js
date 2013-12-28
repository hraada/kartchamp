'use strict';

/**
 * Service that provides persistence interface (eg. wrapper around persistence js).
 */
service.factory('persistenceService', function () {
    if (persistence.store.sqloverhttp) {
    	persistence.store.sqloverhttp.config(persistence, 'kartchamp', 'Database for kartchamp application', 20 * 1024 * 1024);	
    } else {
    	persistence.store.memory.config(persistence, 'kartchamp', 'Database for kartchamp application', 20 * 1024 * 1024);
    }
    persistence.schemaSync();


    return persistence;
});