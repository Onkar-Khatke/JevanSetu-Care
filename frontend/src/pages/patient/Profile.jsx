import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import { User, Phone, Mail, MapPin, ShieldAlert, HeartPulse, Save, CheckCircle } from 'lucide-react';

const PatientProfile = () => {
  const { user } = useAuth();
  const patientId = user?.entityId || 'P1001';

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    village: '',
    district: '',
    address: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/patients/${patientId}`);
        if (res && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiClient.put(`/patients/${patientId}`, profile);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-xs text-slate-500">
        Loading patient profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rural Patient Health ID & Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Patient ID: <span className="font-mono font-bold text-sky-700">{patientId}</span> • Verified Rural Health Node
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <input
              type="text"
              name="gender"
              value={profile.gender || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Village</label>
            <input
              type="text"
              name="village"
              value={profile.village || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={profile.district || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact (Kin)</label>
            <input
              type="text"
              name="emergencyContact"
              value={profile.emergencyContact || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Residential Address</label>
          <input
            type="text"
            name="address"
            value={profile.address || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Known Medical History & Chronic Conditions</label>
          <textarea
            name="medicalHistory"
            rows="3"
            value={profile.medicalHistory || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
