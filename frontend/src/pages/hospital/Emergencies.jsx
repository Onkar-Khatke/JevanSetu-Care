import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Truck,
  HeartPulse,
  User,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

const HospitalEmergencies = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/hospitals/emergencies');
      setEmergencies(res.data || []);
    } catch (err) {
      console.warn('Emergencies fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (emId, newStatus) => {
    try {
      setActionLoading(true);
      await apiClient.put(`/emergency/${emId}/status`, {
        status: newStatus,
        notes: `Emergency updated to ${newStatus} by Hospital Command`
      });
      await fetchEmergencies();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = emergencies.filter((em) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && em.status !== 'COMPLETED' && em.status !== 'CANCELLED') ||
      (filterStatus === 'ARRIVED' && em.status === 'PATIENT_ARRIVED') ||
      (filterStatus === 'COMPLETED' && em.status === 'COMPLETED');

    const matchesSearch =
      !searchQuery ||
      em.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.symptoms?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-teal-600" />
            Hospital Emergency Triage & Reception
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time emergency reception, patient intake verification, and ICU/ward admission
          </p>
        </div>

        <button
          onClick={fetchEmergencies}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient ID or symptom..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {['ALL', 'ACTIVE', 'ARRIVED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Emergencies Cards List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Matching Emergency Records</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no emergencies matching your selected search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((em) => (
            <div
              key={em.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm transition ${
                em.status === 'PATIENT_ARRIVED'
                  ? 'border-indigo-300 bg-indigo-50/10'
                  : em.status === 'COMPLETED'
                  ? 'border-slate-200 opacity-80'
                  : 'border-rose-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-2xl ${
                      em.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">Case #{em.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          em.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {em.riskLevel} RISK
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Patient ID: <span className="font-bold text-slate-800">{em.patientId}</span> • Logged: {new Date(em.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      em.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : em.status === 'PATIENT_ARRIVED'
                        ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}
                  >
                    ● {em.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Emergency Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Symptoms Reported</span>
                  <p className="font-semibold text-rose-800">
                    {em.symptoms?.join(', ') || 'Acute clinical distress'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Ambulance</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-500" />
                    <span>{em.ambulanceId ? `Unit: ${em.ambulanceId}` : 'Dispatch in progress'}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Location Coordinates</span>
                  <p className="font-mono text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{em.latitude?.toFixed(4)}, {em.longitude?.toFixed(4)}</span>
                  </p>
                </div>
              </div>

              {/* Hospital Action Progression */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500 italic">
                  {em.notes || 'Automated rural network coordination'}
                </p>

                <div className="flex items-center gap-2">
                  {em.status !== 'PATIENT_ARRIVED' && em.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(em.id, 'PATIENT_ARRIVED')}
                      disabled={actionLoading}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Confirm Patient Reception
                    </button>
                  )}

                  {em.status === 'PATIENT_ARRIVED' && (
                    <button
                      onClick={() => handleUpdateStatus(em.id, 'COMPLETED')}
                      disabled={actionLoading}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete Admission & Discharge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalEmergencies;
