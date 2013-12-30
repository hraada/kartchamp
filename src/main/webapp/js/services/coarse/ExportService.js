'use strict';

/**
 * Service that prepares exports of results to other systems
 */
service.factory('exportService', function (RaceTimeFilter, fairSprintsService) {

    return {
        getFairSprintsResultsAsHtml: function (results) {

            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' +
                '<TR>\n' +
                '    <TD class=tab_nadpis></TD>\n' +
                '    <TD class=tab_nadpis>Jezdec</TD>\n' +
                '    <TD class=tab_nadpis>Tým</TD>\n' +
                '    <TD class=tab_nadpis>Kára</TD>\n' +
                '    <TD class=tab_nadpis>Start. pozice</TD>\n' +
                '    <TD class=tab_nadpis>Nejlepší čas</TD>\n' +
                '    <TD class=tab_nadpis>Body</TD>\n' +
                '</TR>\n';

            var index = 1;
            var firstResult = null;
            angular.forEach(results, function (result) {
                var rowStyle = "";
                if (index == 1) {
                    firstResult = result;
                }
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }

                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + result.resultPosition + '.</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + (result.driver ? result.driver.name : 'N/A') + ' ' + (result.driver ? result.driver.surname : '') + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.team.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.kart.number + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.startPosition + '.</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + RaceTimeFilter.call(this, result.bestTime) + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + fairSprintsService.getPoints(result.resultPosition) + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },
        getChallengeResultsAsHtml: function (results) {

            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' +
                '<TR>\n' +
                '    <TD class=tab_nadpis></TD>\n' +
                '    <TD class=tab_nadpis>Jezdec</TD>\n' +
                '    <TD class=tab_nadpis>Tým</TD>\n' +
                '    <TD class=tab_nadpis>Kára</TD>\n' +
                '    <TD class=tab_nadpis>Nejlepší čas</TD>\n' +
                '    <TD class=tab_nadpis>Body</TD>\n' +
                '</TR>\n';

            var index = 1;
            var firstResult = null;
            angular.forEach(results, function (result) {
                var rowStyle = "";
                if (index == 1) {
                    firstResult = result;
                }
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }

                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.driver.name + ' ' + result.driver.surname + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.team.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.kart.number + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + RaceTimeFilter.call(this, result.bestTime) + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + (30 - index + 1) + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },
        getQualificationResultsAsHtml: function (results) {

            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' +
                '<TR>\n' +
                '    <TD class=tab_nadpis></TD>\n' +
                '    <TD class=tab_nadpis>Jezdec</TD>\n' +
                '    <TD class=tab_nadpis>Tým</TD>\n' +
                '    <TD class=tab_nadpis>Kára</TD>\n' +
                '    <TD class=tab_nadpis>Čas</TD>\n' +
                '    <TD class=tab_nadpis>Ztráta</TD>\n' +
                '    <TD class=tab_nadpis>Body</TD>\n' +
                '</TR>\n';

            var index = 1;
            var firstResult = null;
            angular.forEach(results, function (result) {
                var rowStyle = "";
                if (index == 1) {
                    firstResult = result;
                }
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }

                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.driver.name + ' ' + result.driver.surname + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.team.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + result.kart.number + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + RaceTimeFilter.call(this, result.resultTime) + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + RaceTimeFilter.call(this, result.resultTime - firstResult.resultTime, true) + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + (30 - index + 1) + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },
        getTeamHeaderByType: function (type) {
            var resultHeader = '';
            if (type == 'qualification') {
                return '<TR>\n' +
                    '    <TD class=tab_nadpis></TD>\n' +
                    '    <TD class=tab_nadpis>Tým</TD>\n' +
                    '    <TD class=tab_nadpis>Kvalifikace 1</TD>\n' +
                    '    <TD class=tab_nadpis>Kvalifikace 2</TD>\n' +
                    '    <TD class=tab_nadpis>Kvalifikace 3</TD>\n' +
                    '    <TD class=tab_nadpis>Kvalifikace 4</TD>\n' +
                    '    <TD class=tab_nadpis>Body celkem</TD>\n' +
                    '</TR>\n';
            }
            else if (type == 'fairsprints') {
                return '<TR>\n' +
                    '    <TD class=tab_nadpis></TD>\n' +
                    '    <TD class=tab_nadpis>Tým</TD>\n' +
                    '    <TD class=tab_nadpis>1. část</TD>\n' +
                    '    <TD class=tab_nadpis>2. část</TD>\n' +
                    '    <TD class=tab_nadpis>Body celkem</TD>\n' +
                    '</TR>\n';
            } else {
                return '<TR>\n' +
                    '    <TD class=tab_nadpis></TD>\n' +
                    '    <TD class=tab_nadpis>Tým</TD>\n' +
                    '    <TD class=tab_nadpis>Závod 1</TD>\n' +
                    '    <TD class=tab_nadpis>Závod 2</TD>\n' +
                    '    <TD class=tab_nadpis>Body celkem</TD>\n' +
                    '</TR>\n';
            }
        },
        getTeamQualificationResultsAsHtml: function (teamResults, type) {

            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' + this.getTeamHeaderByType(type);

            var index = 1;
            angular.forEach(teamResults, function (teamResult) {
                var rowStyle = "";
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }
                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + teamResult.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[0] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[1] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[2] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[3] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.totalTeamPoints + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },
        getTeamChallengeResultsAsHtml: function (teamResults, type) {

            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' + this.getTeamHeaderByType(type);

            var index = 1;
            angular.forEach(teamResults, function (teamResult) {
                var rowStyle = "";
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }
                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + teamResult.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[2] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[3] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.totalTeamPoints + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },
        getTeamFairSprintsResultsAsHtml: function (teamResults, type) {

            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' + this.getTeamHeaderByType(type);

            var index = 1;
            angular.forEach(teamResults, function (teamResult) {
                var rowStyle = "";
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }
                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + teamResult.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[0] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.roundTeamPoints[1] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + teamResult.totalTeamPoints + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },
        getDriverQualificationResultsAsHtml: function (driverResults) {
            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' +
                '<TR>\n' +
                '    <TD class=tab_nadpis></TD>\n' +
                '    <TD class=tab_nadpis>Jezdec</TD>\n' +
                '    <TD class=tab_nadpis>Tým</TD>\n' +
                '    <TD class=tab_nadpis>Kvalifikace 1</TD>\n' +
                '    <TD class=tab_nadpis>Kvalifikace 2</TD>\n' +
                '    <TD class=tab_nadpis>Body celkem</TD>\n' +
                '</TR>\n';

            var index = 1;
            angular.forEach(driverResults, function (driverResult) {
                var rowStyle = "";
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }
                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + driverResult.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + driverResult.teamName + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + driverResult.qualificationPoints[0] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + driverResult.qualificationPoints[1] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + driverResult.totalDriverPoints + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        },

        getDriverChallengeResultsAsHtml: function (driverResults) {
            var output = '<TABLE border=0 cellSpacing=2 cellPadding=0 width="95%">\n' +
                '<TBODY>\n' +
                '<TR>\n' +
                '    <TD class=tab_nadpis></TD>\n' +
                '    <TD class=tab_nadpis>Jezdec</TD>\n' +
                '    <TD class=tab_nadpis>Tým</TD>\n' +
                '    <TD class=tab_nadpis>Závod 1</TD>\n' +
                '    <TD class=tab_nadpis>Závod 2</TD>\n' +
                '    <TD class=tab_nadpis>Body celkem</TD>\n' +
                '</TR>\n';

            var index = 1;
            angular.forEach(driverResults, function (driverResult) {
                var rowStyle = "";
                if (index % 2 != 0) {
                    rowStyle = "tab_1";
                } else {
                    rowStyle = "tab_2";
                }
                output += '<TR>\n' +
                    '   <TD class=' + rowStyle + '>' + index + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + driverResult.name + '</TD>\n' +
                    '   <TD class=' + rowStyle + '>' + driverResult.teamName + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + driverResult.roundDriverPoints[2] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + driverResult.roundDriverPoints[3] + '</TD>\n' +
                    '   <TD class=' + rowStyle + 'c>' + driverResult.totalDriverPoints + '</TD>\n' +
                    '</TR>\n';
                index++;
            });

            output += '</TBODY></TABLE>\n';
            return output;
        }
    };
});