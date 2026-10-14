import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  HeartPulse,
  Activity,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  FileText,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [vital, setVital] = useState({
    heartRate: 78,
    spo2: 97,
    temperature: 98.4,
    systolic: 118,
    diastolic: 76,
    source: 'ESP32',
    timestamp: new Date().toISOString()
  });

  const [risk, setRisk] = useState({
    riskLevel: 'LOW',
    riskScore: 12,
    indicators: ['Normal sinus heart rate (78 bpm)', 'Optimal oxygen saturation (97%)'],
    recommendation: 'Stable vitals within normal acceptable limits.'
  });

  const [loading, setLoading] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch latest vital
      const vitalRes = await apiClient.get(`/vitals/latest/${patientId}`).catch(() => null);
      if (vitalRes && vitalRes.data) {
        setVital(vitalRes.data);
      }

      // Fetch latest risk
      const riskRes = await apiClient.get(`/risk/patient/${patientId}`).catch(() => null);
      if (riskRes && riskRes.data) {
        setRisk(riskRes.data);
      }

      // Check active emergency
      const emergRes = await apiClient.get(`/emergency/patient/${patientId}`).catch(() => null);
      if (emergRes && emergRes.data && emergRes.data.length > 0) {
        const ongoing = emergRes.data.find((e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED');
        setActiveEmergency(ongoing || null);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 6000);
    return () => clearInterval(interval);
  }, [patientId]);

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'bg-rose-50 border-rose-300 text-rose-800';
      case 'MEDIUM':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      default:
        return 'bg-emerald-50 border-emerald-300 text-emerald-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur">
              Patient Rural Health Hub
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-100">
              <Radio className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              <span>IoT Telemetry Online</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {user?.name || 'Ramesh Patil'}
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time biometric monitoring connected to Shirur Primary Health Center & Emergency Fleets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-2 backdrop-blur transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Vitals</span>
          </button>

          <Link
            to="/patient/emergency"
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-900/20 flex items-center gap-2 transition-all hover:scale-105 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency SOS</span>
          </Link>
        </div>
      </div>

      {/* Active Emergency Alert Banner if ongoing */}
      {activeEmergency && (
        <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <div>
              <p className="font-bold text-sm">Emergency SOS Active: Status - {activeEmergency.status}</p>
              <p className="text-xs text-rose-100">Medical emergency dispatch team has been notified.</p>
            </div>
          </div>
          <Link
            to="/patient/emergency"
            className="px-3 py-1.5 bg-white text-rose-700 text-xs font-bold rounded-lg shadow hover:bg-rose-50"
          >
            View Live Tracker
          </Link>
        </div>
      )}

      {/* AI Preliminary Risk Card */}
      <div className={`p-5 rounded-2xl border ${getRiskColor(risk.riskLevel)} transition-all`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white shadow-sm mt-0.5">
              <Sparkles className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">AI Preliminary Risk Assessment</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-white shadow-xs">
                  {risk.riskLevel} RISK ({risk.riskScore}%)
                </span>
              </div>
              <p className="text-xs font-medium mt-1 leading-relaxed">
                {risk.recommendation}
              </p>
              {risk.indicators && risk.indicators.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {risk.indicators.map((ind, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-white/80 font-medium">
                      • {ind}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            to="/patient/ai-assistant"
            className="self-start sm:self-center px-4 py-2 bg-white text-slate-800 text-xs font-semibold rounded-xl shadow-xs border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
            <span>Consult AI Assistant</span>
          </Link>
        </div>
        <p className="text-[10px] text-slate-500 mt-3 italic border-t border-slate-200/50 pt-2">
          Disclaimer: AI-assisted preliminary risk assessment for rural triage. Never claim it is a medical diagnosis.
        </p>
      </div>

      {/* Primary Vitals 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <HeartPulse className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{vital.heartRate || 78}</span>
            <span className="text-xs text-slate-500 font-medium">BPM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Source: {vital.source || 'ESP32'}</span>
          </p>
        </div>

        {/* SpO2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Oxygen (SpO2)</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{vital.spo2 || 97}</span>
            <span className="text-xs text-slate-500 font-medium">%</span>
          </div>
          <span className={`inline-block px-2 py-0.5 mt-2 rounded text-[10px] font-semibold ${
            (vital.spo2 || 97) >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {(vital.spo2 || 97) >= 95 ? 'Optimal Saturation' : 'Hypoxemia Alert'}
          </span>
        </div>

        {/* Temperature */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Body Temp</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{vital.temperature || 98.4}</span>
            <span className="text-xs text-slate-500 font-medium">°F</span>
          </div>
          <span className="inline-block px-2 py-0.5 mt-2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
            MLX90614 Infrared
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">
              {vital.systolic || 118}/{vital.diastolic || 76}
            </span>
            <span className="text-xs text-slate-500 font-medium">mmHg</span>
          </div>
          <span className={`inline-block px-2 py-0.5 mt-2 rounded text-[10px] font-semibold ${
            (vital.systolic || 118) < 130 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {(vital.systolic || 118) < 130 ? 'Normal Range' : 'Elevated'}
          </span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/patient/vitals"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-slate-900">Record New Reading</p>
            <p className="text-xs text-slate-500 mt-0.5">Test IoT simulator or manual vital log</p>
          </div>
          <Activity className="w-5 h-5 text-sky-600" />
        </Link>

        <Link
          to="/patient/history"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-slate-900">Vital Trends & History</p>
            <p className="text-xs text-slate-500 mt-0.5">View Recharts graphs and past logs</p>
          </div>
          <FileText className="w-5 h-5 text-teal-600" />
        </Link>

        <Link
          to="/patient/consultation"
          className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-slate-900">Doctor Prescriptions</p>
            <p className="text-xs text-slate-500 mt-0.5">Rural Medical Officer clinical notes</p>
          </div>
          <HeartPulse className="w-5 h-5 text-rose-600" />
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
