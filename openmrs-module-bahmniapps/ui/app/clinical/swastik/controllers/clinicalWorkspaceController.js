'use strict';

/**
 * Patient Clinical Workspace Controller
 * Manages the 3-panel layout: Patient Summary (left), Tabs (center), Actions (right)
 */
angular.module('bahmni.clinical.swastik')
    .controller('SwastikClinicalWorkspaceController', ['$scope', '$state', '$stateParams', 'swastikMockDataService',
        function ($scope, $state, $stateParams, swastikMockDataService) {
            var patientUuid = $stateParams.patientUuid;

            // Load patient details
            $scope.patient = swastikMockDataService.getPatientDetails(patientUuid);
            if (!$scope.patient) {
                $state.go('swastik.landing');
                return;
            }

            // Active tab
            $scope.activeTab = 'consultation';

            $scope.tabs = [
                { id: 'consultation', label: 'Consultation (OPD)', icon: 'fa-user-md' },
                { id: 'ipd', label: 'IPD Management', icon: 'fa-bed' },
                { id: 'orders', label: 'Orders', icon: 'fa-clipboard' },
                { id: 'rehab', label: 'Rehab & Therapy', icon: 'fa-heartbeat' },
                { id: 'documents', label: 'Clinical Documents', icon: 'fa-file-text-o' },
                { id: 'discharge', label: 'Discharge Summary', icon: 'fa-sign-out' }
            ];

            $scope.setActiveTab = function (tabId) {
                $scope.activeTab = tabId;
            };

            // Mock data for tabs
            $scope.vitals = swastikMockDataService.getVitals(patientUuid);
            $scope.consultationData = swastikMockDataService.getConsultationData(patientUuid);
            $scope.orders = swastikMockDataService.getPatientOrders(patientUuid);

            // Right panel actions
            $scope.printPrescription = function () { alert('Print prescription - to be implemented'); };
            $scope.sendWhatsApp = function () { alert('Send via WhatsApp - to be implemented'); };
            $scope.sendEmail = function () { alert('Send via Email - to be implemented'); };

            // Critical alerts (mock)
            $scope.alerts = [{ type: 'allergy', text: 'Penicillin allergy' }];

            // Billing summary (mock)
            $scope.billingSummary = { total: 2500, paid: 1500, pending: 1000 };

            // Expose $state for template
            $scope.$state = $state;
        }]);
