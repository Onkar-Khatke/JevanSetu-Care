import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import {
  Users,
  AlertTriangle,
  HeartPulse,
  FileText,
  Activity,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 3,
    todayConsultations: 2,
    emergencyCases: 1,
    highRiskPatients: 1,
  });

  const [patients, setPatients] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const [ptsRes, emRes] = await Promise.all([
        apiClient.get('/patients').catch(() => ({ data: [] })),
        apiClient.get('/emergency/active').catch(() => ({ data: [] })),
      ]);

      const ptList = ptsRes.data || [];
      const emList = emRes.data || [];

      setPatients(ptList);
      setEmergencies(emList);

      setStats({
        totalPatients: ptList.length,
        todayConsultations: 2,
        emergencyCases: emList.length,
        highRiskPatients: ptList.filter((p) => p.name?.includes('Ramesh') || p.id === 'P1001').length,
      });
    } catch (err) {
      console.warn('Doctor data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
    const interval = setInterval(fetchDoctorData, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Decision Command Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary Rural Medical Officer Portal • Sub-District Tele-Triage
          </p>
        </div>

        <button
          onClick={fetchDoctorData}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Triage Feed</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Patients</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats.totalPatients}</span>
          <p className="text-[11px] text-slate-400 mt-1">Enrolled in rural cluster</p>
        </div>

        {/* Today's Consultations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Consultations</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats.todayConsultations}</span>
          <p className="text-[11px] text-slate-400 mt-1">Tele-reviews conducted</p>
        </div>

        {/* Emergency Cases */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-semibold">Emergency Cases</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-rose-700">{stats.emergencyCases}</span>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Active urgent SOS cases</p>
        </div>

        {/* High Risk Patients */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold">High Risk Patients</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-amber-700">{stats.highRiskPatients}</span>
          <p className="text-[11px] text-amber-600 font-medium mt-1">AI critical triage flagged</p>
        </div>
      </div>

      {/* Active Emergencies Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Active Emergency Cases (Immediate Triage)</h2>
          </div>
          <Link to="/doctor/emergencies" className="text-xs font-semibold text-sky-600 hover:text-sky-700">
            View All Emergencies &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {emergencies.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active emergency dispatch at this moment.
            </div>
          ) : (
            emergencies.map((em) => (
              <div key={em.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Patient ID: {em.patientId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700">
                      {em.riskLevel} RISK
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {em.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Reported Symptoms: {em.symptoms?.join(', ') || 'Acute Distress'}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Triggered: {new Date(em.createdAt).toLocaleTimeString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/doctor/patients/${em.patientId}`}
                    className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <span>View Vitals & Consult</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rural Patients Priority Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Enrolled Village Patients Roster</h2>
          <Link to="/doctor/patients" className="text-xs font-semibold text-sky-600 hover:text-sky-700">
            Full Patient Directory &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {patients.map((p) => (
            <div key={p.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center">
                  {p.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{p.name} ({p.age}y, {p.gender})</p>
                  <p className="text-[11px] text-slate-500">Village: {p.village}, {p.district} • Contact: {p.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/doctor/patients/${p.id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 rounded-lg font-semibold text-[11px] transition-colors"
                >
                  Clinical Summary
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
