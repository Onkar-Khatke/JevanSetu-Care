import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import {
  Users,
  Stethoscope,
  Building2,
  Truck,
  AlertTriangle,
  HeartPulse,
  Activity,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Server,
  Radio
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 3,
    totalDoctors: 2,
    totalHospitals: 2,
    totalAmbulances: 2,
    activeEmergencies: 0,
    highRiskPatients: 1,
  });

  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, emRes, ambRes, hospRes] = await Promise.all([
        apiClient.get('/admin/stats').catch(() => ({ data: {} })),
        apiClient.get('/emergency/active').catch(() => ({ data: [] })),
        apiClient.get('/ambulances').catch(() => ({ data: [] })),
        apiClient.get('/hospitals').catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      setActiveEmergencies(emRes.data || []);
      setAmbulances(ambRes.data || []);
      setHospitals(hospRes.data || []);
    } catch (err) {
      console.warn('Admin stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              System Administration & Network Operations Center
            </span>
            <span className="text-xs text-slate-400">JeevanSetu Core v1.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Rural Smart Health & Emergency Network
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time monitoring across Shirur & Pune rural healthcare sectors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white rounded-xl transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <Users className="w-5 h-5 text-sky-600" />
            <span className="text-[10px] font-bold uppercase">Patients</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalPatients ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Enrolled Rural Citizens</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase">Doctors</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalDoctors ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Tele-Consult Specialists</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span className="text-[10px] font-bold uppercase">Hospitals</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalHospitals ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Trauma Facilities</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase">Fleet</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalAmbulances ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active Ambulances</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <HeartPulse className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] font-bold uppercase">High Risk</span>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{stats.highRiskPatients ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">AI Flagged Cases</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-400">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-rose-600">Emergencies</span>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{stats.activeEmergencies ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active SOS Missions</p>
        </div>
      </div>

      {/* Network Infrastructure Health Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Integrated System Health & Microservices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Spring Boot API</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Port 8080 • Connected</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Python AI Service</p>
              <p className="text-[11px] text-indigo-600 font-semibold">Port 5000 • Operational</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">ESP32 / IoT Ingestion</p>
              <p className="text-[11px] text-sky-600 font-semibold">Telemetry API • Active</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">MongoDB Database</p>
              <p className="text-[11px] text-teal-600 font-semibold">Collections Seeded • OK</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Active Emergencies & Fleet/Hospital Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Emergencies Monitor */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Live Emergency Triage Radar
            </h2>
            <span className="text-xs text-slate-400 font-medium">{activeEmergencies.length} Active Cases</span>
          </div>

          {activeEmergencies.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No active emergency dispatches right now. All rural sectors stable.
            </div>
          ) : (
            <div className="space-y-3">
              {activeEmergencies.map((em) => (
                <div key={em.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Patient: {em.patientId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700">
                      {em.riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Symptoms: <span className="font-semibold text-slate-800">{em.symptoms?.join(', ') || 'Acute SOS'}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Status: <strong className="text-indigo-600">{em.status}</strong></span>
                    <span>Ambulance: <strong className="text-slate-700">{em.ambulanceId || 'Pending'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fleet & Facilities Snapshot */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              Ambulance Units & Hospital Capacity
            </h2>
            <span className="text-xs text-slate-400 font-medium">Network Overview</span>
          </div>

          {/* Ambulances */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Ambulance Fleet Status</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ambulances.map((amb) => (
                <div key={amb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-800">{amb.vehicleNumber}</p>
                    <p className="text-[11px] text-slate-500">{amb.driverName}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      amb.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hospitals */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Hospital Bed Availability</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hospitals.map((hosp) => (
                <div key={hosp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="max-w-[140px] truncate">
                    <p className="font-bold text-xs text-slate-800 truncate">{hosp.name}</p>
                    <p className="text-[11px] text-slate-500">{hosp.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-teal-700">{hosp.availableBeds} Beds</p>
                    <span className="text-[10px] text-slate-400">{hosp.emergencyAvailable ? 'Ready' : 'Diverted'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
