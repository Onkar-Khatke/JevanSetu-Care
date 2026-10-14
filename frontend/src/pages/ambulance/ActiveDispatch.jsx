import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  Truck,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Phone,
  Building2,
  User,
  HeartPulse,
  Navigation,
  Clock,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const ActiveDispatch = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeEmergency, setActiveEmergency] = useState(null);
  const [patient, setPatient] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [latestVital, setLatestVital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ambulance, setAmbulance] = useState(null);

  const fetchDispatchData = async () => {
    try {
      setLoading(true);
      const [ambRes, emRes] = await Promise.all([
        apiClient.get('/ambulances').catch(() => ({ data: [] })),
        apiClient.get('/emergency/active').catch(() => ({ data: [] })),
      ]);

      const ambulances = ambRes.data || [];
      const currentAmb = ambulances.find((a) => a.userId === user?.id || a.id === user?.entityId) || ambulances[0];
      setAmbulance(currentAmb);

      const emergencies = emRes.data || [];
      // Pick emergency linked to this ambulance, or the first active one
      const assigned = emergencies.find((e) => e.ambulanceId === currentAmb?.id) || emergencies[0];
      setActiveEmergency(assigned || null);

      if (assigned) {
        // Fetch patient details
        if (assigned.patientId) {
          apiClient.get(`/patients/${assigned.patientId}`).then((r) => setPatient(r.data)).catch(() => {});
          apiClient.get(`/vitals/latest/${assigned.patientId}`).then((r) => setLatestVital(r.data)).catch(() => {});
        }
        // Fetch hospital details
        if (assigned.hospitalId) {
          apiClient.get(`/hospitals/${assigned.hospitalId}`).then((r) => setHospital(r.data)).catch(() => {});
        }
        // Fetch doctor details
        if (assigned.doctorId) {
          apiClient.get(`/doctors/${assigned.doctorId}`).then((r) => setDoctor(r.data)).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Dispatch fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchData();
    const interval = setInterval(fetchDispatchData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const updateEmergencyStatus = async (newStatus) => {
    if (!activeEmergency?.id) return;
    try {
      setUpdating(true);
      await apiClient.put(`/emergency/${activeEmergency.id}/status`, {
        status: newStatus,
        notes: `Ambulance status updated to ${newStatus} by ${user?.name || 'Driver'}`
      });

      // Also ensure ambulance status is aligned
      if (ambulance?.id) {
        let ambStatus = 'ASSIGNED';
        if (newStatus === 'AMBULANCE_ON_ROUTE') ambStatus = 'ON_ROUTE';
        else if (newStatus === 'PATIENT_ARRIVED') ambStatus = 'ARRIVED';
        else if (newStatus === 'COMPLETED') ambStatus = 'AVAILABLE';

        await apiClient.put(`/ambulances/${ambulance.id}/status`, { status: ambStatus }).catch(() => {});
      }

      await fetchDispatchData();
    } catch (err) {
      alert('Failed to update emergency status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStep = () => {
    if (!activeEmergency) return 0;
    switch (activeEmergency.status) {
      case 'CREATED':
      case 'DOCTOR_ALERTED':
        return 1;
      case 'AMBULANCE_ASSIGNED':
        return 2;
      case 'AMBULANCE_ON_ROUTE':
        return 3;
      case 'HOSPITAL_NOTIFIED':
        return 4;
      case 'PATIENT_ARRIVED':
        return 5;
      case 'COMPLETED':
        return 6;
      default:
        return 1;
    }
  };

  const step = getStatusStep();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/ambulance/dashboard')}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-7 h-7 text-rose-600 animate-pulse" />
              Active Emergency Dispatch
            </h1>
            <p className="text-xs text-slate-500">
              Unit: {ambulance?.vehicleNumber || 'MH-12-RN-4401'} • Driver: {user?.name || ambulance?.driverName || 'Suresh Yadav'}
            </p>
          </div>
        </div>

        <button
          onClick={fetchDispatchData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {!activeEmergency ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No Dispatches in Progress</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Your ambulance unit is currently on standby. As soon as a rural SOS alert is received and assigned to your unit, full dispatch routing will appear here.
          </p>
          <button
            onClick={() => navigate('/ambulance/dashboard')}
            className="mt-6 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dispatch Progress Tracker */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dispatch Stage Tracker</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 animate-pulse">
                {activeEmergency.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3.5 rounded-2xl border text-center transition ${step >= 2 ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase block">Stage 1</span>
                <span className="text-xs font-bold">Ambulance Assigned</span>
                {step >= 2 && <CheckCircle className="w-4 h-4 text-sky-600 mx-auto mt-1" />}
              </div>

              <div className={`p-3.5 rounded-2xl border text-center transition ${step >= 3 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase block">Stage 2</span>
                <span className="text-xs font-bold">On Route to Patient</span>
                {step >= 3 && <CheckCircle className="w-4 h-4 text-amber-600 mx-auto mt-1" />}
              </div>

              <div className={`p-3.5 rounded-2xl border text-center transition ${step >= 5 ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase block">Stage 3</span>
                <span className="text-xs font-bold">Arrived / Hospital Handover</span>
                {step >= 5 && <CheckCircle className="w-4 h-4 text-indigo-600 mx-auto mt-1" />}
              </div>

              <div className={`p-3.5 rounded-2xl border text-center transition ${step >= 6 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase block">Stage 4</span>
                <span className="text-xs font-bold">Emergency Resolved</span>
                {step >= 6 && <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mt-1" />}
              </div>
            </div>

            {/* Quick Action Progression Controls */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Driver Action:</span>

              {activeEmergency.status === 'CREATED' || activeEmergency.status === 'DOCTOR_ALERTED' ? (
                <button
                  onClick={() => updateEmergencyStatus('AMBULANCE_ASSIGNED')}
                  disabled={updating}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept Emergency Dispatch
                </button>
              ) : null}

              {activeEmergency.status === 'AMBULANCE_ASSIGNED' ? (
                <button
                  onClick={() => updateEmergencyStatus('AMBULANCE_ON_ROUTE')}
                  disabled={updating}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Start Journey (Ambulance On Route)
                </button>
              ) : null}

              {activeEmergency.status === 'AMBULANCE_ON_ROUTE' || activeEmergency.status === 'HOSPITAL_NOTIFIED' ? (
                <button
                  onClick={() => updateEmergencyStatus('PATIENT_ARRIVED')}
                  disabled={updating}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Arrived at Destination (Hospital / Patient)
                </button>
              ) : null}

              {activeEmergency.status === 'PATIENT_ARRIVED' ? (
                <button
                  onClick={() => updateEmergencyStatus('COMPLETED')}
                  disabled={updating}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Handover & Free Ambulance
                </button>
              ) : null}

              {activeEmergency.status === 'COMPLETED' ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Dispatch mission concluded successfully.
                </span>
              ) : null}
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient & Location Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-600" />
                  Patient Pickup Details
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-rose-100 text-rose-700">
                  {activeEmergency.riskLevel} RISK
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">{patient?.name || 'Ramesh Patil'}</span>
                  <span className="text-xs text-slate-500">{patient?.age || '62'} Yrs • {patient?.gender || 'Male'}</span>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{patient?.address || 'Near Gram Panchayat Office, Village Koregaon Bhima, Shirur, Pune'}</span>
                </p>
                <p className="text-xs text-slate-500">
                  GPS: <span className="font-mono text-slate-700">{activeEmergency.latitude?.toFixed(4)}, {activeEmergency.longitude?.toFixed(4)}</span>
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${patient?.phone || '9876543210'}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl border border-sky-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Patient ({patient?.phone || '9876543210'})
                  </a>
                  <a
                    href={`tel:${patient?.emergencyContact || '9876543219'}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs rounded-xl border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Relative: {patient?.emergencyContact || '9876543219'}
                  </a>
                </div>
              </div>

              {/* Reported Symptoms & Vitals */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                <span className="text-[11px] font-bold text-rose-800 uppercase block mb-1">Critical Symptoms Reported:</span>
                <p className="text-xs text-rose-900 font-semibold">
                  {activeEmergency.symptoms?.join(', ') || 'Chest pain, shortness of breath, sudden diaphoresis'}
                </p>
              </div>

              {/* Latest Biometric Feed if available */}
              {latestVital && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                      Live Streamed Vitals (Source: {latestVital.source})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(latestVital.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-1">
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-300 block">HR</span>
                      <span className="text-sm font-black text-rose-400">{latestVital.heartRate} bpm</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-300 block">SpO2</span>
                      <span className="text-sm font-black text-amber-400">{latestVital.spo2}%</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-300 block">BP</span>
                      <span className="text-sm font-black text-sky-400">{latestVital.systolic}/{latestVital.diastolic}</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-300 block">Temp</span>
                      <span className="text-sm font-black text-emerald-400">{latestVital.temperature}°F</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Target Hospital & Navigation Route Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Target Hospital Facility
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                  {hospital?.availableBeds ? `${hospital.availableBeds} Beds Ready` : 'Emergency Ready'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">
                    {hospital?.name || 'Rural Sub-District Hospital Shirur'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>{hospital?.address || 'Main Road, Shirur, Pune District, Maharashtra 412210'}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Hospital Hotline: <span className="font-semibold text-slate-700">{hospital?.phone || '02138-222100'}</span>
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${hospital?.phone || '02138-222100'}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs rounded-xl border border-teal-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Alert Hospital Desk
                  </a>
                </div>
              </div>

              {/* Navigation Telemetry Simulation */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-amber-400">
                    <Navigation className="w-4 h-4" />
                    Live Route Trajectory
                  </span>
                  <span className="text-slate-400 font-mono">ETA: ~12 Mins (8.4 km)</span>
                </div>

                {/* Simulated GPS Waypoint Track */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-slate-800" />
                    <p className="text-xs font-bold text-slate-200">Ambulance Base (Koregaon Sector)</p>
                    <p className="text-[11px] text-slate-400">Departed: 18.8200° N, 74.3700° E</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-slate-800 animate-ping" />
                    <p className="text-xs font-bold text-amber-300">Patient Residence (Pickup Point)</p>
                    <p className="text-[11px] text-slate-400">Waypoint: 18.5204° N, 73.8567° E</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-slate-800" />
                    <p className="text-xs font-bold text-sky-300">{hospital?.name || 'Shirur Sub-District Hospital'}</p>
                    <p className="text-[11px] text-slate-400">Destination: Emergency Trauma Bay 1</p>
                  </div>
                </div>
              </div>

              {/* Assigned Doctor note */}
              {doctor && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Monitoring Physician:</span>
                  <span className="font-bold text-slate-800">
                    Dr. {doctor.name} ({doctor.specialization || 'Emergency Medicine'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDispatch;
