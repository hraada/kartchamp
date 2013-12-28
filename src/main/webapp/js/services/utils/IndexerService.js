'use strict';

/**
 * Service for data indexing
 */
service.factory('indexerService', function () {

    return {
        /**
         * Index given data structure into associative array in order of given indexed
         * @param data array of data
         * @param indexes list of string expression to get index value from given data row item
         * @return {{}}
         */
        indexData: function (data, indexes) {
            var indexedData = {};
            var currentIndex = null;
            for (var i = 0; i < data.length; i++) {

                currentIndex = indexedData;
                for (var j = 0; j < indexes.length; j++) {
                    var dataRow = data[i];
                    var index = indexes[j];

                    var key = this._getProperty(dataRow, index);
                    if (currentIndex[key]) {
                        if (j == indexes.length - 1) {
                            currentIndex[key].push(dataRow);
                        }
                    } else {
                        if (j < indexes.length - 1) {
                            currentIndex[key] = {};
                        } else {
                            currentIndex[key] = [dataRow];
                        }
                    }
                    currentIndex = currentIndex[key];
                }
            }
            return indexedData;
        },
        /**
         * Helper function for obtaining value of given string expression on given object
         * @param o evaluated object
         * @param s expression
         * @return {*}
         * @private
         */
        _getProperty: function (o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            while (a.length) {
                var n = a.shift();
                if (n in o) {
                    o = o[n];
                } else {
                    return;
                }
            }
            return o;
        }

    };
})
;