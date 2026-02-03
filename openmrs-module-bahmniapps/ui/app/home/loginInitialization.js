'use strict';

angular.module('bahmni.home')
    .factory('loginInitialization', ['$rootScope', '$q', 'locationService', 'spinner', 'messagingService',
        function ($rootScope, $q, locationService, spinner, messagingService) {
            var init = function () {
                var deferrable = $q.defer();
                locationService.getAllByTag("Login Location").then(
                    function (response) {
                        deferrable.resolve({locations: response.data.results || []});
                    },
                    function (response) {
                        // Resolve with empty locations so login page still shows (fixes blank page when OpenMRS not ready)
                        deferrable.resolve({locations: []});
                        if (response && response.status) {
                            if (response.status === 401) {
                                location.reload();
                            } else {
                                messagingService.showMessage('error', 'MESSAGE_START_OPENMRS');
                            }
                        }
                    }
                );

                return deferrable.promise;
            };

            return function () {
                return spinner.forPromise(init());
            };
        }
    ]);
