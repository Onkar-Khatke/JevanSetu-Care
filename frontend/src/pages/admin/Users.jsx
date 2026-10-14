import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import {
  Users,
  Search,
  Filter,
  Shield,
  Stethoscope,
  Truck,
  Building2,
  HeartPulse,
  UserCheck,
  RefreshCw,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'PATIENT':
        return { bg: 'bg-sky-100 text-sky-800 border-sky-200', icon: HeartPulse, label: 'Patient' };
      case 'DOCTOR':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Stethoscope, label: 'Doctor' };
      case 'AMBULANCE_DRIVER':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Truck, label: 'Ambulance' };
      case 'HOSPITAL':
        return { bg: 'bg-teal-100 text-teal-800 border-teal-200', icon: Building2, label: 'Hospital' };
      case 'ADMIN':
        return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Shield, label: 'Admin' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-200', icon: Users, label: role };
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery) ||
      u.role?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            System User Directory & Credentials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered personnel, village patients, emergency fleet operators, and hospital admins
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Directory
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
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {['ALL', 'PATIENT', 'DOCTOR', 'AMBULANCE_DRIVER', 'HOSPITAL', 'ADMIN'].map((rf) => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                roleFilter === rf
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {rf === 'AMBULANCE_DRIVER' ? 'AMBULANCE' : rf}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">User Name</th>
                <th className="py-3.5 px-6">Email / Account</th>
                <th className="py-3.5 px-6">Assigned Role</th>
                <th className="py-3.5 px-6">Phone Number</th>
                <th className="py-3.5 px-6">Linked Entity ID</th>
                <th className="py-3.5 px-6 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const badge = getRoleBadge(u.role);
                const IconComponent = badge.icon;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        <IconComponent className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.phone || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                      {u.entityId || 'SYS-ADMIN'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <UserCheck className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
