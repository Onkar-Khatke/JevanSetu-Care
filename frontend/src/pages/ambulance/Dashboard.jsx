import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { Truck, AlertTriangle, CheckCircle, MapPin, Phone, ArrowRight, RefreshCw, Radio } from 'lucide-react';

const AmbulanceDashboard = () => {
  const { user } = useAuth();
  const ambulanceId = user?.entityId || 'amb1';

  const [ambulance, setAmbulance] = useState(null);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAmbulanceData = async () => {
    try {
      setLoading(true);
      const [ambRes, emRes] = await Promise.all([
        apiClient.get('/ambulances').catch(() => ({ data: [] })),
        apiClient.get('/emergency/active').catch(() => ({ data: [] })),
      ]);

      const list = ambRes.data || [];
      const current = list.find((a) => a.userId === user?.id || a.id === ambulanceId) || list[0];
      setAmbulance(current);

      const emergencies = emRes.data || [];
      setActiveEmergency(emergencies.length > 0 ? emergencies[0] : null);
    } catch (err) {
      console.warn('Ambulance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulanceData();
    const interval = setInterval(fetchAmbulanceData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!ambulance?.id) return;
    try {
      await apiClient.put(`/ambulances/${ambulance.id}/status`, { status: newStatus });
      fetchAmbulanceData();
    } catch (err) {
      alert('Failed to update ambulance status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Driver Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Rural Rapid Ambulance Dispatch
            </span>
            <span className="text-xs text-slate-400">Unit: {ambulance?.vehicleNumber || 'MH-12-RN-4401'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Driver: {user?.name || ambulance?.driverName || 'Suresh Yadav'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Stationed: Shirur Sector Rural Hub • GPS: 18.8200° N, 74.3700° E
          </p>
        </div>

        {/* Current Status Badge & Switch */}
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur border border-white/10 flex flex-col items-start gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Fleet Unit Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              ambulance?.status === 'AVAILABLE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
            }`}
          >
            ● {ambulance?.status || 'AVAILABLE'}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <button
              onClick={() => handleUpdateStatus('AVAILABLE')}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 text-[10px] font-semibold rounded text-white"
            >
              Set Available
            </button>
            <button
              onClick={() => handleUpdateStatus('ON_ROUTE')}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 text-[10px] font-semibold rounded text-white"
            >
              Set On Route
            </button>
          </div>
        </div>
      </div>

      {/* Active Dispatch Banner Card */}
      {activeEmergency ? (
        <div className="bg-white rounded-3xl border-2 border-rose-300 p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <Truck className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 uppercase">
                  Active Emergency Assigned
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Urgent Patient Transport: {activeEmergency.patientId}
                </h2>
                <p className="text-xs text-slate-500">
                  Current Status: <span className="font-semibold text-rose-600">{activeEmergency.status}</span>
                </p>
              </div>
            </div>

            <Link
              to="/ambulance/active"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <span>Manage Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Pickup Coordinates</span>
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{activeEmergency.latitude?.toFixed(4)}, {activeEmergency.longitude?.toFixed(4)}</span>
              </p>
              <p className="text-slate-500 text-[11px] mt-1">Koregaon Bhima Rural Sector</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Target Facility</span>
              <p className="font-bold text-slate-900">Shirur Sub-District Hospital</p>
              <p className="text-slate-500 text-[11px] mt-1">Emergency Trauma Unit Prepared</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Reported Symptoms</span>
              <p className="font-bold text-rose-700">{activeEmergency.symptoms?.join(', ') || 'Acute distress'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800">No Emergency Dispatch Active</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You are in standby mode. Keep your GPS locator active. The network will automatically sound an alert when an emergency SOS is assigned.
          </p>
        </div>
      )}
    </div>
  );
};

export default AmbulanceDashboard;
