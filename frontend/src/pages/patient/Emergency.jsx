import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  AlertTriangle,
  CheckCircle,
  Truck,
  Building2,
  Stethoscope,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  XCircle
} from 'lucide-react';

const STAGES = [
  { key: 'CREATED', label: 'Emergency Created' },
  { key: 'DOCTOR_ALERTED', label: 'Doctor Alerted' },
  { key: 'AMBULANCE_ASSIGNED', label: 'Ambulance Assigned' },
  { key: 'AMBULANCE_ON_ROUTE', label: 'Ambulance On Route' },
  { key: 'HOSPITAL_NOTIFIED', label: 'Hospital Notified' },
  { key: 'PATIENT_ARRIVED', label: 'Patient Arrived at Hospital' },
  { key: 'COMPLETED', label: 'Emergency Completed' },
];

const PatientEmergency = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [activeEmergency, setActiveEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [ambulanceInfo, setAmbulanceInfo] = useState(null);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);

  const fetchEmergencyStatus = async () => {
    try {
      const res = await apiClient.get(`/emergency/patient/${patientId}`);
      if (res && res.data && res.data.length > 0) {
        const ongoing = res.data.find((e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED');
        const em = ongoing || res.data[0];
        setActiveEmergency(em);

        // Fetch associated ambulance if present
        if (em.ambulanceId) {
          apiClient.get(`/ambulances`).then((r) => {
            const found = r.data?.find((a) => a.id === em.ambulanceId);
            if (found) setAmbulanceInfo(found);
          }).catch(() => {});
        }

        // Fetch associated hospital if present
        if (em.hospitalId) {
          apiClient.get(`/hospitals/${em.hospitalId}`).then((r) => {
            if (r.data) setHospitalInfo(r.data);
          }).catch(() => {});
        }

        // Fetch associated doctor if present
        if (em.doctorId) {
          apiClient.get(`/doctors/${em.doctorId}`).then((r) => {
            if (r.data) setDoctorInfo(r.data);
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Failed to fetch emergency status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyStatus();
    const interval = setInterval(fetchEmergencyStatus, 4000);
    return () => clearInterval(interval);
  }, [patientId]);

  const handleConfirmSOS = async () => {
    try {
      setTriggering(true);
      const payload = {
        patientId,
        riskLevel: 'HIGH',
        symptoms: ['Acute cardiac or respiratory emergency SOS triggered by patient'],
        latitude: 18.5204,
        longitude: 73.8567,
        notes: 'Emergency SOS activated from Patient Portal',
      };

      const res = await apiClient.post('/emergency', payload);
      if (res && res.data) {
        setActiveEmergency(res.data);
        setConfirmModalOpen(false);
        fetchEmergencyStatus();
      }
    } catch (err) {
      alert(err.message || 'Failed to dispatch SOS. Please try again.');
    } finally {
      setTriggering(false);
    }
  };

  const getStageStatus = (stageKey) => {
    if (!activeEmergency) return 'pending';
    const statusOrder = [
      'CREATED',
      'DOCTOR_ALERTED',
      'AMBULANCE_ASSIGNED',
      'AMBULANCE_ON_ROUTE',
      'HOSPITAL_NOTIFIED',
      'PATIENT_ARRIVED',
      'COMPLETED'
    ];

    const currentIdx = statusOrder.indexOf(activeEmergency.status);
    const stageIdx = statusOrder.indexOf(stageKey);

    if (currentIdx >= stageIdx) return 'done';
    if (currentIdx + 1 === stageIdx) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Emergency SOS Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time emergency dispatch connecting local primary health units, ambulances, and civil hospitals
          </p>
        </div>

        <button
          onClick={fetchEmergencyStatus}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Live Refresh</span>
        </button>
      </div>

      {/* Main SOS Trigger Button Card if no active emergency */}
      {(!activeEmergency || activeEmergency.status === 'COMPLETED' || activeEmergency.status === 'CANCELLED') ? (
        <div className="bg-gradient-to-b from-rose-50 to-white p-8 sm:p-12 rounded-3xl border border-rose-100 shadow-xl text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Rural 24/7 Rapid Response
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Medical Emergency? Tap to Mobilize
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pressing the SOS button alerts the rural emergency doctor on duty, reserves an emergency ambulance, and prepares the nearest sub-district trauma hospital with incoming vitals.
            </p>
          </div>

          {/* Huge Red SOS Button */}
          <div className="py-4">
            <button
              onClick={() => setConfirmModalOpen(true)}
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white font-extrabold text-2xl sm:text-3xl shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 mx-auto cursor-pointer border-8 border-rose-100 animate-pulse"
            >
              <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
              <span>SOS</span>
              <span className="text-[11px] font-semibold tracking-wider text-rose-100 uppercase">Emergency</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Current GPS Location: <span className="font-mono text-slate-600">18.5204° N, 73.8567° E (Shirur Rural)</span>
          </p>
        </div>
      ) : (
        /* Emergency Active Live Tracking Console */
        <div className="space-y-6">
          {/* Active Banner */}
          <div className="bg-rose-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold tracking-tight">Emergency Case Active</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-rose-700">
                    {activeEmergency.status}
                  </span>
                </div>
                <p className="text-xs text-rose-100 mt-0.5">
                  Emergency ID: <span className="font-mono">{activeEmergency.id}</span> • Triggered at{' '}
                  {new Date(activeEmergency.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-white/10 px-4 py-2 rounded-xl backdrop-blur">
              <span className="text-[11px] font-medium text-rose-100 block">Estimated Arrival (ETA)</span>
              <span className="text-xl font-black tracking-tight text-white">8 - 12 Mins</span>
            </div>
          </div>

          {/* 6-Stage Workflow Progress Stepper */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Live Emergency Dispatch Workflow</span>
            </h3>

            <div className="space-y-5">
              {STAGES.map((st, idx) => {
                const status = getStageStatus(st.key);
                return (
                  <div key={st.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          status === 'done'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : status === 'current'
                            ? 'bg-rose-500 text-white ring-4 ring-rose-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {status === 'done' ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                      </div>
                      {idx < STAGES.length - 1 && (
                        <div
                          className={`w-0.5 h-6 mt-1 ${
                            status === 'done' ? 'bg-emerald-400' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            status === 'done'
                              ? 'text-slate-900'
                              : status === 'current'
                              ? 'text-rose-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                            status === 'done'
                              ? 'bg-emerald-50 text-emerald-700'
                              : status === 'current'
                              ? 'bg-rose-50 text-rose-700 animate-pulse'
                              : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          {status === 'done' ? 'Completed' : status === 'current' ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Providers Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Doctor */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-bold">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <span>Assigned Medical Officer</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{doctorInfo?.name || 'Dr. Aarav Sharma'}</p>
              <p className="text-xs text-slate-500">{doctorInfo?.specialization || 'Rural Emergency Medicine'}</p>
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{doctorInfo?.phone || '+91-9822011001'}</span>
              </p>
            </div>

            {/* Ambulance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-bold">
                <Truck className="w-4 h-4 text-rose-600" />
                <span>Dispatched Ambulance</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{ambulanceInfo?.driverName || 'Suresh Yadav'}</p>
              <p className="text-xs font-mono font-bold text-slate-700">{ambulanceInfo?.vehicleNumber || 'MH-12-RN-4401'}</p>
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{ambulanceInfo?.phone || '+91-9850112233'}</span>
              </p>
            </div>

            {/* Hospital */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-bold">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Receiving Trauma Facility</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{hospitalInfo?.name || 'Shirur Sub-District Hospital'}</p>
              <p className="text-xs text-slate-500">{hospitalInfo?.address || 'Station Road, Shirur'}</p>
              <p className="text-xs text-emerald-700 mt-2 font-semibold">
                Available ICU Beds: {hospitalInfo?.availableBeds || 14}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Confirm Emergency SOS?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                This will immediately broadcast a critical distress order to the nearest available ambulance, alert the on-duty emergency physician, and reserve an ICU bed at the regional hospital.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSOS}
                disabled={triggering}
                className="py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                {triggering ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>YES, SEND SOS</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientEmergency;
