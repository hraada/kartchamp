'use strict';

/**
 * Controller for handling of assigning drivers to karts and rounds accrording to qualification results
 */
kartchamp.controller('DrawController',
    function DrawController($scope, $routeParams, raceService, raceAssignmentService, roundService, qualificationService, challengeService) {

        raceService.getRaceById($routeParams.raceId, function (race) {
            $scope.race = race;
            $scope.$$phase || $scope.$apply();
        });

        $scope.getResultButtonClass = function (resultId) {
            if ($scope.selectedResult == resultId) {
                return 'active';
            } else {
                return '';
            }
        }

        $scope.resultButtonClicked = function (resultId, race) {
            $scope.selectedResult = resultId;
            challengeService.getRaceRoundSchedule(race, resultId, function (raceRidesRounds) {
                $scope.raceRidesRounds = raceRidesRounds;
                $scope.$$phase || $scope.$apply();
            });
        }

        $scope.drawRace = function (qualificationRoundIndex, raceRoundIndex) {
            bootbox.confirm("<h3>Opravdu chcete provést rozlosování?</h3><p>Smažete tím všechny zadané výsledky odpovídajícího závodu a znovu rozlosujete motokáry.</p>", function (result) {
                if (result) {
                    qualificationService.getQualificationRoundResults($scope.race, qualificationRoundIndex, function (qualificationResults) {
                        challengeService.drawRace($scope.race, qualificationResults, raceRoundIndex, function() {
                            bootbox.alert("Rozlosování proběhlo úspěšně");
                        });
                        $scope.$$phase || $scope.$apply();
                    })
                }
            });


        }

        $scope.challengeRounds = [2, 3];
    }
);