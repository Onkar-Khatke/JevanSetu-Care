import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Building2, Truck, Stethoscope } from 'lucide-react';

const Register = () => {
  const { register, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: 35,
    gender: 'Male',
    village: 'Koregaon',
    district: 'Pune',
    address: 'Near Gram Panchayat',
    emergencyContact: '+91-9876543210',
    medicalHistory: 'None',
    specialization: 'General Medicine',
    qualification: 'MBBS',
    vehicleNumber: 'MH-12-JS-101',
    availableBeds: 15,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = { ...formData, role };
      const user = await register(payload);
      navigate(getDashboardRoute(user.role));
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-teal-50/40 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 items-center justify-center text-white shadow-lg shadow-sky-500/25 mb-2">
          <HeartPulse className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Join JeevanSetu AI Network</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting remote rural healthcare providers and patients</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-6 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
            {[
              { id: 'PATIENT', label: 'Patient', icon: User },
              { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope },
              { id: 'AMBULANCE_DRIVER', label: 'Ambulance', icon: Truck },
              { id: 'HOSPITAL', label: 'Hospital', icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = role === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRole(tab.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[11px] truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Facility</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@jeevansetu.org"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Role Dynamic Inputs */}
            {role === 'PATIENT' && (
              <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 space-y-3">
                <span className="text-xs font-bold text-sky-800">Patient Rural Profile</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Village</label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Prior Medical History</label>
                  <input
                    type="text"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    placeholder="e.g. Hypertension, Diabetes, Asthma"
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            )}

            {role === 'DOCTOR' && (
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Qualifications</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            )}

            {role === 'AMBULANCE_DRIVER' && (
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Vehicle Plate Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g. MH-12-RN-4401"
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            )}

            {role === 'HOSPITAL' && (
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Available Emergency Beds</label>
                <input
                  type="number"
                  name="availableBeds"
                  value={formData.availableBeds}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create {role.replace('_', ' ')} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
