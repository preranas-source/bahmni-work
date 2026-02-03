'use strict';

/**
 * Mock Data Service for Swastik Hospital Clinical Module
 * Provides dummy data for development and demo - no backend integration
 */
angular.module('bahmni.clinical.swastik')
    .service('swastikMockDataService', [function () {
        var self = this;

        // Mock doctors list
        self.doctors = [
            { id: 'doc1', name: 'Dr. Rajesh Kumar', specialty: 'General Medicine' },
            { id: 'doc2', name: 'Dr. Priya Sharma', specialty: 'Pediatrics' },
            { id: 'doc3', name: 'Dr. Amit Patel', specialty: 'Orthopedics' },
            { id: 'doc4', name: 'Dr. Sunita Reddy', specialty: 'Cardiology' }
        ];

        // Mock today's OPD queue
        self.todaysQueue = [
            { patientUuid: 'p001', name: 'Ramesh Gupta', token: 'T001', status: 'Waiting', doctor: 'Dr. Rajesh Kumar', type: 'OPD' },
            { patientUuid: 'p002', name: 'Sita Devi', token: 'T002', status: 'In Consultation', doctor: 'Dr. Priya Sharma', type: 'OPD' },
            { patientUuid: 'p003', name: 'Mohan Singh', token: 'T003', status: 'Completed', doctor: 'Dr. Amit Patel', type: 'OPD' },
            { patientUuid: 'p004', name: 'Anita Rao', token: 'T004', status: 'Waiting', doctor: 'Dr. Rajesh Kumar', type: 'OPD' },
            { patientUuid: 'p005', name: 'Vikram Mehta', token: 'T005', status: 'Waiting', doctor: 'Dr. Sunita Reddy', type: 'OPD' },
            { patientUuid: 'p006', name: 'Kavita Nair', token: 'T006', status: 'In Consultation', doctor: 'Dr. Priya Sharma', type: 'OPD' },
            { patientUuid: 'p007', name: 'Deepak Joshi', token: 'T007', status: 'Completed', doctor: 'Dr. Amit Patel', type: 'OPD' }
        ];

        // Mock IPD queue
        self.ipdPatients = [
            { patientUuid: 'p008', name: 'Ravi Verma', bedNo: '101', ward: 'General Ward', doctor: 'Dr. Rajesh Kumar', admissionDate: '2025-01-28' },
            { patientUuid: 'p009', name: 'Lakshmi Iyer', bedNo: '205', ward: 'ICU', doctor: 'Dr. Sunita Reddy', admissionDate: '2025-01-30' }
        ];

        // Mock Rehab queue
        self.rehabPatients = [
            { patientUuid: 'p010', name: 'Suresh Yadav', session: 'Physiotherapy', therapist: 'Dr. Meera Singh', time: '10:00 AM' }
        ];

        // Mock patient list (for search results)
        self.patients = [
            { uuid: 'p001', identifier: 'SWASTIK-001', name: 'Ramesh Gupta', gender: 'M', age: 45, mobile: '9876543210', type: 'OPD', lastVisit: '2025-02-02' },
            { uuid: 'p002', identifier: 'SWASTIK-002', name: 'Sita Devi', gender: 'F', age: 32, mobile: '9876543211', type: 'OPD', lastVisit: '2025-02-02' },
            { uuid: 'p003', identifier: 'SWASTIK-003', name: 'Mohan Singh', gender: 'M', age: 58, mobile: '9876543212', type: 'OPD', lastVisit: '2025-02-01' },
            { uuid: 'p004', identifier: 'SWASTIK-004', name: 'Anita Rao', gender: 'F', age: 28, mobile: '9876543213', type: 'OPD', lastVisit: '2025-02-02' },
            { uuid: 'p005', identifier: 'SWASTIK-005', name: 'Vikram Mehta', gender: 'M', age: 52, mobile: '9876543214', type: 'OPD', lastVisit: '2025-01-30' },
            { uuid: 'p006', identifier: 'SWASTIK-006', name: 'Kavita Nair', gender: 'F', age: 38, mobile: '9876543215', type: 'OPD', lastVisit: '2025-02-02' },
            { uuid: 'p007', identifier: 'SWASTIK-007', name: 'Deepak Joshi', gender: 'M', age: 41, mobile: '9876543216', type: 'OPD', lastVisit: '2025-02-02' },
            { uuid: 'p008', identifier: 'SWASTIK-008', name: 'Ravi Verma', gender: 'M', age: 65, mobile: '9876543217', type: 'IPD', lastVisit: '2025-01-28' },
            { uuid: 'p009', identifier: 'SWASTIK-009', name: 'Lakshmi Iyer', gender: 'F', age: 55, mobile: '9876543218', type: 'IPD', lastVisit: '2025-01-30' },
            { uuid: 'p010', identifier: 'SWASTIK-010', name: 'Suresh Yadav', gender: 'M', age: 48, mobile: '9876543219', type: 'Rehab', lastVisit: '2025-02-02' }
        ];

        // Get full patient details (for workspace)
        self.getPatientDetails = function (patientUuid) {
            var base = _.find(self.patients, { uuid: patientUuid });
            if (!base) return null;
            return {
                uuid: base.uuid,
                identifier: base.identifier,
                name: base.name,
                gender: base.gender,
                age: base.age,
                birthDate: '1980-01-15',
                mobile: base.mobile,
                type: base.type || 'OPD',
                allergies: ['Penicillin', 'Sulfa drugs'],
                lastVisit: base.lastVisit,
                bloodGroup: 'B+',
                address: '123, Hospital Road, City'
            };
        };

        // Search patients by UHID, Name, Mobile, Token
        self.searchPatients = function (query, filters) {
            if (!query || query.length < 2) {
                return self.patients.slice(0, 10);
            }
            var q = query.toLowerCase();
            return self.patients.filter(function (p) {
                return (p.identifier && p.identifier.toLowerCase().indexOf(q) >= 0) ||
                    (p.name && p.name.toLowerCase().indexOf(q) >= 0) ||
                    (p.mobile && p.mobile.indexOf(q) >= 0);
            });
        };

        // Get queue based on filters
        self.getQueue = function (filters) {
            filters = filters || {};
            var queue = [];
            if (!filters.type || filters.type === 'OPD') queue = queue.concat(self.todaysQueue);
            if (filters.type === 'IPD') queue = self.ipdPatients;
            if (filters.type === 'Rehab') queue = self.rehabPatients;
            if (filters.doctor) {
                queue = queue.filter(function (p) { return p.doctor === filters.doctor; });
            }
            return queue;
        };

        // Mock orders for patient
        self.getPatientOrders = function (patientUuid) {
            return [
                { id: 1, type: 'Lab', name: 'Complete Blood Count', status: 'Completed', date: '2025-02-01' },
                { id: 2, type: 'Lab', name: 'Blood Sugar Fasting', status: 'Pending', date: '2025-02-02' },
                { id: 3, type: 'Radiology', name: 'X-Ray Chest', status: 'Completed', date: '2025-01-30' },
                { id: 4, type: 'Procedure', name: 'ECG', status: 'Pending', date: '2025-02-02' }
            ];
        };

        // Mock vitals
        self.getVitals = function (patientUuid) {
            return { bp: '120/80', pulse: 72, temp: 98.6, rr: 16, weight: 70, height: 170 };
        };

        // Mock consultation data
        self.getConsultationData = function (patientUuid) {
            return {
                chiefComplaint: 'Fever and cough for 3 days',
                clinicalNotes: { subjective: 'Patient reports...', objective: 'Vitals stable...', assessment: 'Upper respiratory infection', plan: 'Rest and medication' },
                diagnosis: ['Acute Upper Respiratory Tract Infection'],
                prescriptions: [
                    { drug: 'Paracetamol 500mg', dose: '1-0-1', duration: '5 days' },
                    { drug: 'Cetirizine 10mg', dose: '0-0-1', duration: '5 days' }
                ],
                followUpDate: '2025-02-09'
            };
        };

        return self;
    }]);
