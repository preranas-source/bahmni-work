'use strict';

angular.module('bahmni.home')
    .controller('DashboardController', ['$scope', '$state', 'appService', 'locationService', 'spinner', '$bahmniCookieStore', '$window', '$q', 'sessionService', '$translate',
        function ($scope, $state, appService, locationService, spinner, $bahmniCookieStore, $window, $q, sessionService, $translate) {
            $scope.appExtensions = appService.getAppDescriptor().getExtensions($state.current.data.extensionPointId, "link") || [];
            $scope.selectedLocationUuid = {};

            // Icon map for dashboard module cards (matches reference: person, stethoscope, chart, flask, etc.)
            $scope.dashboardIconMap = {
                'bahmni.registration': 'fa fa-user',
                'bahmni.clinical': 'fa fa-stethoscope',
                'bahmni.reports': 'fa fa-bar-chart',
                'implementer.interface': 'fa fa-pencil-square-o',
                'bahmni.lab': 'fa fa-flask',
                'bahmni.admin': 'fa fa-cogs',
                'bahmni.documentUpload': 'fa fa-paperclip',
                'bahmni.appointments': 'fa fa-calendar'
            };
            $scope.dashboardIconByLabel = {
                'Registration': 'fa fa-user',
                'Clinical': 'fa fa-stethoscope',
                'Reports': 'fa fa-bar-chart',
                'Implementer Interface': 'fa fa-pencil-square-o',
                'Lab entry': 'fa fa-flask',
                'Admin': 'fa fa-cogs',
                'Patient Documents': 'fa fa-paperclip',
                'Appointment Scheduling': 'fa fa-calendar'
            };
            $scope.getDashboardIcon = function (extn) {
                if (!extn) return 'fa fa-circle';
                if (extn.id && $scope.dashboardIconMap[extn.id]) {
                    return $scope.dashboardIconMap[extn.id];
                }
                var label = extn.translationKey ? $translate.instant(extn.translationKey) : (extn.label || extn.title || '');
                if (label && $scope.dashboardIconByLabel[label]) {
                    return $scope.dashboardIconByLabel[label];
                }
                if (extn.icon) {
                    return extn.icon.indexOf('fa') === 0 ? extn.icon : 'fa ' + extn.icon;
                }
                return 'fa fa-circle';
            };

            var isOnline = function () {
                return $window.navigator.onLine;
            };

            $scope.isVisibleExtension = function (extension) {
                return extension.exclusiveOnlineModule ? isOnline() : extension.exclusiveOfflineModule ? !isOnline() : true;
            };

            var getCurrentLocation = function () {
                return $bahmniCookieStore.get(Bahmni.Common.Constants.locationCookieName) ? $bahmniCookieStore.get(Bahmni.Common.Constants.locationCookieName) : null;
            };

            var setCurrentLoginLocationForUser = function () {
                const currentLoginLocation = getCurrentLocation();
                if (currentLoginLocation) {
                    $scope.selectedLocationUuid = getCurrentLocation().uuid;
                } else {
                    $scope.selectedLocationUuid = null;
                }
            };

            var init = function () {
                const loginLocations = localStorage.getItem("loginLocations");
                if (loginLocations) {
                    $scope.locations = JSON.parse(loginLocations);
                    setCurrentLoginLocationForUser();
                    return;
                }
                return locationService.getAllByTag("Login Location").then(function (response) {
                    $scope.locations = response.data.results;
                    setCurrentLoginLocationForUser();
                });
            };

            var getLocationFor = function (uuid) {
                return _.find($scope.locations, function (location) {
                    return location.uuid === uuid;
                });
            };

            $scope.isCurrentLocation = function (location) {
                const currentLocation = getCurrentLocation();
                if (currentLocation) {
                    return getCurrentLocation().uuid === location.uuid;
                } else {
                    return false;
                }
            };

            $scope.onLocationChange = function () {
                var selectedLocation = getLocationFor($scope.selectedLocationUuid);
                sessionService.updateSession({ name: selectedLocation.display, uuid: selectedLocation.uuid }, null).then(function () {
                    $window.location.reload();
                });
            };

            $scope.changePassword = function () {
                $state.go('changePassword');
            };

            return spinner.forPromise($q.all(init()));
        }]);
