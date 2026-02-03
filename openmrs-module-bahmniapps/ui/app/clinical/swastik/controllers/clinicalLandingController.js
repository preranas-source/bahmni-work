'use strict';

/**
 * Clinical Landing Page Controller
 * Handles patient search, OPD queue display, and filters
 */
angular.module('bahmni.clinical.swastik')
    .controller('SwastikClinicalLandingController', ['$scope', '$state', 'swastikMockDataService',
        function ($scope, $state, swastikMockDataService) {
            $scope.searchQuery = '';
            $scope.searchResults = [];
            $scope.queue = [];
            $scope.doctors = swastikMockDataService.doctors;

            // Filters
            $scope.filters = {
                type: 'OPD',        // OPD | IPD | Rehab
                doctor: null,
                dateRange: 'today'  // today | previous
            };

            // Refresh queue when filters change
            function refreshQueue() {
                $scope.queue = swastikMockDataService.getQueue($scope.filters);
            }

            // Search patients
            $scope.searchPatients = function () {
                if (!$scope.searchQuery || $scope.searchQuery.length < 1) {
                    $scope.searchResults = swastikMockDataService.patients.slice(0, 10);
                } else {
                    $scope.searchResults = swastikMockDataService.searchPatients($scope.searchQuery, $scope.filters);
                }
            };

            // Navigate to patient workspace
            $scope.openPatient = function (patient) {
                $state.go('swastik.workspace', { patientUuid: patient.uuid });
            };

            // Filter change handlers
            $scope.onFilterChange = function () {
                refreshQueue();
            };

            // Initialize
            $scope.searchPatients();
            refreshQueue();
        }]);
