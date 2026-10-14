import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { AlertTriangle, Clock, MapPin, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

const DoctorEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/emergency/active');
      if (res && res.data) {
        setEmergencies(res.data);
      }
    } catch (err) {
      console.warn('Failed to load emergencies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Emergency Cases Triage Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time critical distress alarms from patient wearables and village clinics
          </p>
        </div>

        <button
          onClick={fetchEmergencies}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      <div className="space-y-4">
        {emergencies.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No active emergency alerts at this moment</p>
            <p className="text-xs text-slate-400 mt-1">All monitored patients in the rural cluster are currently stable.</p>
          </div>
        ) : (
          emergencies.map((em) => (
            <div
              key={em.id}
              className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-rose-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider">
                    {em.riskLevel} CRITICAL RISK
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                    Status: {em.status}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900">
                  Patient ID: <span className="text-sky-700 font-mono">{em.patientId}</span>
                </h2>

                <p className="text-xs text-slate-600">
                  <strong>Reported Distress:</strong> {em.symptoms?.join(', ') || 'Acute cardiac distress'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    GPS: {em.latitude?.toFixed(4)}, {em.longitude?.toFixed(4)} (Shirur Region)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Triggered: {new Date(em.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/doctor/patients/${em.patientId}`}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                >
                  <span>Open Triage Chart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorEmergencies;
