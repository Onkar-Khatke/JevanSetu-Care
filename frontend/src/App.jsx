import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientVitals from './pages/patient/Vitals';
import PatientHistory from './pages/patient/History';
import PatientAiAssistant from './pages/patient/AiAssistant';
import PatientConsultation from './pages/patient/Consultation';
import PatientEmergency from './pages/patient/Emergency';
import PatientProfile from './pages/patient/Profile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorPatientDetail from './pages/doctor/PatientDetail';
import DoctorEmergencies from './pages/doctor/Emergencies';
import DoctorConsultations from './pages/doctor/Consultations';

// Ambulance Pages
import AmbulanceDashboard from './pages/ambulance/Dashboard';
import ActiveDispatch from './pages/ambulance/ActiveDispatch';

// Hospital Pages
import HospitalDashboard from './pages/hospital/Dashboard';
import HospitalEmergencies from './pages/hospital/Emergencies';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';

import LandingPage from './pages/LandingPage';

// Layout with Header Navigation
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

// Fallback Redirect Component for unmatched routes
const HomeRedirect = () => {
  const { user, isAuthenticated, getDashboardRoute } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Layout with Navbar */}
      <Route element={<AppLayout />}>
        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/vitals" element={<PatientVitals />} />
          <Route path="/patient/history" element={<PatientHistory />} />
          <Route path="/patient/ai-assistant" element={<PatientAiAssistant />} />
          <Route path="/patient/consultation" element={<PatientConsultation />} />
          <Route path="/patient/emergency" element={<PatientEmergency />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
        </Route>

        {/* Doctor & Healthcare Worker Routes */}
        <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'HEALTHCARE_WORKER']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/patients/:id" element={<DoctorPatientDetail />} />
          <Route path="/doctor/emergencies" element={<DoctorEmergencies />} />
          <Route path="/doctor/consultations" element={<DoctorConsultations />} />
        </Route>

        {/* Ambulance Routes */}
        <Route element={<ProtectedRoute allowedRoles={['AMBULANCE_DRIVER', 'AMBULANCE']} />}>
          <Route path="/ambulance/dashboard" element={<AmbulanceDashboard />} />
          <Route path="/ambulance/active" element={<ActiveDispatch />} />
        </Route>

        {/* Hospital Routes */}
        <Route element={<ProtectedRoute allowedRoles={['HOSPITAL']} />}>
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital/emergencies" element={<HospitalEmergencies />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

export default App;
