import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  Building2,
  Bed,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  RefreshCw,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Activity
} from 'lucide-react';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const hospitalId = user?.entityId || 'hosp1';

  const [hospital, setHospital] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingBeds, setUpdatingBeds] = useState(false);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      const [hospListRes, emRes] = await Promise.all([
        apiClient.get('/hospitals').catch(() => ({ data: [] })),
        apiClient.get('/hospitals/emergencies').catch(() => ({ data: [] })),
      ]);

      const list = hospListRes.data || [];
      const current = list.find((h) => h.userId === user?.id || h.id === hospitalId) || list[0];
      setHospital(current);

      const emList = emRes.data || [];
      setEmergencies(emList);
    } catch (err) {
      console.warn('Hospital fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
    const interval = setInterval(fetchHospitalData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleBedChange = async (delta) => {
    if (!hospital) return;
    const newBeds = Math.max(0, (hospital.availableBeds || 0) + delta);
    updateAvailability(hospital.emergencyAvailable, newBeds);
  };

  const handleToggleEmergency = async () => {
    if (!hospital) return;
    updateAvailability(!hospital.emergencyAvailable, hospital.availableBeds || 0);
  };

  const updateAvailability = async (isAvailable, beds) => {
    try {
      setUpdatingBeds(true);
      const res = await apiClient.put(`/hospitals/${hospital.id}/availability`, {
        emergencyAvailable: isAvailable,
        availableBeds: beds,
      });
      if (res && res.data) {
        setHospital(res.data);
      }
    } catch (err) {
      alert('Failed to update hospital status: ' + (err.message || 'Server error'));
    } finally {
      setUpdatingBeds(false);
    }
  };

  const handleUpdateEmergencyStatus = async (emId, status) => {
    try {
      await apiClient.put(`/emergency/${emId}/status`, {
        status,
        notes: `Updated by Hospital Admin (${user?.name || 'Staff'})`
      });
      fetchHospitalData();
    } catch (err) {
      alert('Failed to update emergency status.');
    }
  };

  const incomingCount = emergencies.filter(
    (e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Rural Healthcare Facility Command
            </span>
            <span className="text-xs text-slate-400">ID: {hospital?.id || 'HOSP-01'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {hospital?.name || 'Rural Sub-District Hospital Shirur'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{hospital?.address || 'Main Road, Shirur, Pune District, Maharashtra 412210'}</span>
          </p>
        </div>

        <button
          onClick={fetchHospitalData}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards & Bed Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bed Availability Control Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
              <Bed className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Bed Capacity</span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{hospital?.availableBeds ?? 14}</span>
              <span className="text-xs font-semibold text-slate-500">Available Beds</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">General Trauma & Critical Care Ward</p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleBedChange(-1)}
              disabled={updatingBeds || (hospital?.availableBeds || 0) <= 0}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl disabled:opacity-40"
              title="Decrease available bed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBedChange(1)}
              disabled={updatingBeds}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl disabled:opacity-40"
              title="Increase available bed"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500 ml-auto">Adjust capacity</span>
          </div>
        </div>

        {/* Emergency Readiness Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Intake</span>
          </div>

          <div className="my-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                hospital?.emergencyAvailable
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {hospital?.emergencyAvailable ? 'ACCEPTING EMERGENCIES' : 'ON DIVERSION / FULL'}
            </span>
            <p className="text-[11px] text-slate-500 mt-2">
              {hospital?.emergencyAvailable
                ? 'Facility is actively paired for automatic rural SOS dispatch routing.'
                : 'Facility is temporarily marked as diverted for new emergency cases.'}
            </p>
          </div>

          <button
            onClick={handleToggleEmergency}
            disabled={updatingBeds}
            className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition ${
              hospital?.emergencyAvailable
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {hospital?.emergencyAvailable ? 'Pause Emergency Intake' : 'Enable Emergency Intake'}
          </button>
        </div>

        {/* Active Emergency Queue Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Queue</span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{incomingCount}</span>
              <span className="text-xs font-semibold text-slate-500">Active Cases</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">In transit, arrived or awaiting triage</p>
          </div>

          <Link
            to="/hospital/emergencies"
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5"
          >
            <span>Open Triage Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Incoming Critical Cases Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Hospital Emergency Reception Feed</h2>
          </div>
          <Link
            to="/hospital/emergencies"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {emergencies.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No active emergencies currently routed to this hospital facility.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Patient ID</th>
                  <th className="py-3 px-4">Triage Risk</th>
                  <th className="py-3 px-4">Reported Symptoms</th>
                  <th className="py-3 px-4">Transit Status</th>
                  <th className="py-3 px-4">Ambulance Unit</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emergencies.slice(0, 5).map((em) => (
                  <tr key={em.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {em.patientId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          em.riskLevel === 'HIGH'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {em.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                      {em.symptoms?.join(', ') || 'Acute Emergency'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {em.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {em.ambulanceId || 'Auto-assigning'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {em.status !== 'PATIENT_ARRIVED' && em.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateEmergencyStatus(em.id, 'PATIENT_ARRIVED')}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg shadow-sm"
                        >
                          Confirm Arrived
                        </button>
                      )}
                      {em.status === 'PATIENT_ARRIVED' && (
                        <button
                          onClick={() => handleUpdateEmergencyStatus(em.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm"
                        >
                          Discharge / Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
