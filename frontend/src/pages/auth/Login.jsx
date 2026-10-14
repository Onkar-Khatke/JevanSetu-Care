import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'Patient', email: 'patient1@jeevansetu.org', pass: 'Patient@123', label: 'Ramesh Patil (Rural Patient)' },
    { role: 'Doctor', email: 'doctor1@jeevansetu.org', pass: 'Doctor@123', label: 'Dr. Aarav Sharma (Medical Officer)' },
    { role: 'Ambulance', email: 'ambulance1@jeevansetu.org', pass: 'Driver@123', label: 'Suresh Yadav (Driver Fleet 1)' },
    { role: 'Hospital', email: 'hospital1@jeevansetu.org', pass: 'Hospital@123', label: 'Shirur Sub-District Hospital' },
    { role: 'Admin', email: 'admin@jeevansetu.org', pass: 'Admin@123', label: 'System Administrator' },
  ];

  const handleFillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email, password);
      navigate(getDashboardRoute(loggedUser.role));
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials or backend availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-teal-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 items-center justify-center text-white shadow-lg shadow-sky-500/25 mb-3">
          <HeartPulse className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          JeevanSetu AI
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Rural Smart Health & Emergency Coordination Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@jeevansetu.org"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Network</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credential Fill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold mb-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>1-Click Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {demoAccounts.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleFillDemo(d)}
                  className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 transition-all text-[11px]"
                >
                  <p className="font-semibold text-slate-800">{d.role}</p>
                  <p className="text-[10px] text-slate-500 truncate">{d.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              New village clinic or patient?{' '}
              <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
                Register profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
