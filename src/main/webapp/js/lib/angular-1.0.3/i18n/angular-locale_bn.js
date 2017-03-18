angular.module("ngLocale", [], ["$provide", function ($provide) {
    var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
    $provide.value("$locale", {"DATETIME_FORMATS": {"MONTH": ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"], "SHORTMONTH": ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"], "DAY": ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহষ্পতিবার", "শুক্রবার", "শনিবার"], "SHORTDAY": ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"], "AMPMS": ["am", "pm"], "medium": "d MMM, y h:mm:ss a", "short": "d/M/yy h:mm a", "fullDate": "EEEE, d MMMM, y", "longDate": "d MMMM, y", "mediumDate": "d MMM, y", "shortDate": "d/M/yy", "mediumTime": "h:mm:ss a", "shortTime": "h:mm a"}, "NUMBER_FORMATS": {"DECIMAL_SEP": ".", "GROUP_SEP": ",", "PATTERNS": [
        {"minInt": 1, "minFrac": 0, "macFrac": 0, "posPre": "", "posSuf": "", "negPre": "-", "negSuf": "", "gSize": 2, "lgSize": 3, "maxFrac": 3},
        {"minInt": 1, "minFrac": 2, "macFrac": 0, "posPre": "", "posSuf": "\u00A4", "negPre": "(", "negSuf": "\u00A4)", "gSize": 2, "lgSize": 3, "maxFrac": 2}
    ], "CURRENCY_SYM": "৳"}, "pluralCat": function (n) {
        if (n == 1) {
            return PLURAL_CATEGORY.ONE;
        }
        return PLURAL_CATEGORY.OTHER;
    }, "id": "bn"});
}]);