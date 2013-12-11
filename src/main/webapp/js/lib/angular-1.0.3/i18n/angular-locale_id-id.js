angular.module("ngLocale", [], ["$provide", function ($provide) {
    var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
    $provide.value("$locale", {"NUMBER_FORMATS": {"DECIMAL_SEP": ",", "GROUP_SEP": ".", "PATTERNS": [
        {"minInt": 1, "minFrac": 0, "macFrac": 0, "posPre": "", "posSuf": "", "negPre": "-", "negSuf": "", "gSize": 3, "lgSize": 3, "maxFrac": 3},
        {"minInt": 1, "minFrac": 2, "macFrac": 0, "posPre": "\u00A4", "posSuf": "", "negPre": "\u00A4-", "negSuf": "", "gSize": 3, "lgSize": 3, "maxFrac": 2}
    ], "CURRENCY_SYM": "Rp"}, "pluralCat": function (n) {
        return PLURAL_CATEGORY.OTHER;
    }, "DATETIME_FORMATS": {"MONTH": ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], "SHORTMONTH": ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"], "DAY": ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], "SHORTDAY": ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], "AMPMS": ["pagi", "malam"], "medium": "d MMM yyyy HH:mm:ss", "short": "dd/MM/yy HH:mm", "fullDate": "EEEE, dd MMMM yyyy", "longDate": "d MMMM yyyy", "mediumDate": "d MMM yyyy", "shortDate": "dd/MM/yy", "mediumTime": "HH:mm:ss", "shortTime": "HH:mm"}, "id": "id-id"});
}]);