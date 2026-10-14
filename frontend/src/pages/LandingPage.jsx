import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  Stethoscope,
  Truck,
  Building2,
  ShieldCheck,
  ArrowRight,
  Radio,
  MessageSquare,
  Users,
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user, getDashboardRoute } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">JeevanSetu</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-1 hidden sm:block">Rural Smart Health & Emergency Network</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={getDashboardRoute(user?.role)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
              <span>Next-Gen Rural Emergency & Telemedicine Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Lifesaving Healthcare for <span className="text-sky-600">Every Village</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
              <strong>JeevanSetu AI (जीवनसेतू)</strong> bridges remote rural communities with instant triage, ESP32 IoT biometric telemetry, multilingual AI consultation, and emergency ambulance dispatch.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-600/20 transition flex items-center gap-2"
              >
                <span>Launch Demo Portals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm transition"
              >
                Register as Patient
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Complete End-to-End Coordination
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              From village biometric stations to district hospitals — 5 integrated subsystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: IoT */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">IoT Biometrics</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                ESP32 hardware & simulated sensor nodes record SpO2, Pulse, Blood Pressure, and Body Temperature with tamper-proof device verification.
              </p>
            </div>

            {/* Pillar 2: AI */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Safe AI Assistant</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Multilingual triage (English, Hindi, Marathi) with instant red-flag cardiac and stroke detection, follow-up questions, and strict clinical disclaimers.
              </p>
            </div>

            {/* Pillar 3: SOS */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-rose-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Emergency SOS</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                One-touch emergency alert with GPS waypoint tracking, auto-ambulance allocation, and instant notification to attending doctors and trauma bays.
              </p>
            </div>

            {/* Pillar 4: Tele-Consultation */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Clinical Network</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Doctors review real-time Recharts vital trends, prescribe medications, and manage patient rosters with hospital bed availability tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personas Showcase */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-300 border border-white/10">
                Pre-Configured Demo Personas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
                Experience JeevanSetu AI Instantly
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Click any 1-Click login button on the login screen to test the experience for rural patients, doctors, ambulance operators, hospitals, or system admins.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center">
                <HeartPulse className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
                <p className="font-bold text-xs">Patient</p>
                <p className="text-[10px] text-slate-400">Ramesh Patil</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center">
                <Stethoscope className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <p className="font-bold text-xs">Doctor</p>
                <p className="text-[10px] text-slate-400">Dr. Aarav Sharma</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center">
                <Truck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                <p className="font-bold text-xs">Ambulance</p>
                <p className="text-[10px] text-slate-400">Suresh Yadav</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center">
                <Building2 className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
                <p className="font-bold text-xs">Hospital</p>
                <p className="text-[10px] text-slate-400">Shirur Trauma</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <ShieldCheck className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                <p className="font-bold text-xs">Admin</p>
                <p className="text-[10px] text-slate-400">Operations</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Default Demo Password: <code className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">Patient@123 / Doctor@123 / Driver@123</code>
              </p>
              <Link
                to="/login"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Disclaimer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs text-slate-600 font-semibold">
            JeevanSetu AI — Rural Smart Health & Emergency Network
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 max-w-3xl mx-auto text-[11px] text-amber-900 leading-normal">
            <strong>Clinical Disclaimer:</strong> AI assistance provided by JeevanSetu AI is for preliminary guidance, educational information, and triage coordination. It does not constitute a certified medical diagnosis and does not replace in-person professional clinical evaluation.
          </div>
          <p className="text-[10px] text-slate-400">
            © 2026 JeevanSetu AI Project • Built with Spring Boot 3.x, React 18, Vite, and MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
