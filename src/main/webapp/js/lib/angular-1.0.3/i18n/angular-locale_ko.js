angular.module("ngLocale", [], ["$provide", function ($provide) {
    var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
    $provide.value("$locale", {"DATETIME_FORMATS": {"MONTH": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], "SHORTMONTH": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], "DAY": ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], "SHORTDAY": ["일", "월", "화", "수", "목", "금", "토"], "AMPMS": ["오전", "오후"], "medium": "yyyy. M. d. a h:mm:ss", "short": "yy. M. d. a h:mm", "fullDate": "y년 M월 d일 EEEE", "longDate": "y년 M월 d일", "mediumDate": "yyyy. M. d.", "shortDate": "yy. M. d.", "mediumTime": "a h:mm:ss", "shortTime": "a h:mm"}, "NUMBER_FORMATS": {"DECIMAL_SEP": ".", "GROUP_SEP": ",", "PATTERNS": [
        {"minInt": 1, "minFrac": 0, "macFrac": 0, "posPre": "", "posSuf": "", "negPre": "-", "negSuf": "", "gSize": 3, "lgSize": 3, "maxFrac": 3},
        {"minInt": 1, "minFrac": 2, "macFrac": 0, "posPre": "\u00A4", "posSuf": "", "negPre": "\u00A4-", "negSuf": "", "gSize": 3, "lgSize": 3, "maxFrac": 2}
    ], "CURRENCY_SYM": "₩"}, "pluralCat": function (n) {
        return PLURAL_CATEGORY.OTHER;
    }, "id": "ko"});
}]);