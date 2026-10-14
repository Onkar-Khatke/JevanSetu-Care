import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { Users, Search, ArrowRight, Activity, ShieldAlert } from 'lucide-react';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/patients');
        if (res && res.data) {
          setPatients(res.data);
        }
      } catch (err) {
        console.warn('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.village?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enrolled Rural Patients Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Village health center patient roster with biometric monitoring nodes
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, village..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Age / Gender</th>
                <th className="px-6 py-3">Village / District</th>
                <th className="px-6 py-3">Emergency Contact</th>
                <th className="px-6 py-3">Medical History</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    No matching patient profiles found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      {p.age} yrs • {p.gender}
                    </td>
                    <td className="px-6 py-3.5">
                      {p.village}, {p.district}
                    </td>
                    <td className="px-6 py-3.5 font-medium">{p.emergencyContact || p.phone}</td>
                    <td className="px-6 py-3.5 max-w-xs truncate text-slate-500">
                      {p.medicalHistory || 'None'}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/doctor/patients/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold rounded-lg text-xs transition-colors"
                      >
                        <span>Clinical Chart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
