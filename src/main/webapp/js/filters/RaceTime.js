filter.filter('RaceTime', function () {
    return function (inttime, excludeMinute) {

        if (inttime == 0) {
            if (excludeMinute) {
                return '00.000';
            } else {
                return '0:00.000';
            }
        }

        var min = window.Math.floor(inttime / 60000);
        var sec = window.Math.floor((inttime % 60000) / 1000);
        var ms = inttime % 1000;

        if (ms < 100) ms = '0' + ms;
        if (ms < 10) ms = '0' + ms;

        if (sec < 10) sec = '0' + sec;
        if (excludeMinute) {
            return sec + '.' + ms;
        } else {
            return min + ':' + sec + '.' + ms;
        }
    }
});