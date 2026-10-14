import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  MessageSquare,
  FileText,
  User,
  LogOut,
  Bell,
  CheckCircle,
  Truck,
  Building2,
  Users,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get(`/notifications/${user.id}`);
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      // Background silent poll
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNavLinks = () => {
    if (!user) return [];
    const norm = user.role ? user.role.replace('ROLE_', '') : '';
    switch (norm) {
      case 'PATIENT':
        return [
          { to: '/patient/dashboard', label: 'Dashboard', icon: HeartPulse },
          { to: '/patient/vitals', label: 'Vitals', icon: Activity },
          { to: '/patient/history', label: 'History', icon: FileText },
          { to: '/patient/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
          { to: '/patient/consultation', label: 'Prescriptions', icon: FileText },
          { to: '/patient/emergency', label: 'Emergency SOS', icon: AlertTriangle, urgent: true },
          { to: '/patient/profile', label: 'Profile', icon: User },
        ];
      case 'DOCTOR':
      case 'HEALTHCARE_WORKER':
        return [
          { to: '/doctor/dashboard', label: 'Dashboard', icon: HeartPulse },
          { to: '/doctor/patients', label: 'Patients', icon: Users },
          { to: '/doctor/emergencies', label: 'Emergencies', icon: AlertTriangle, urgent: true },
          { to: '/doctor/consultations', label: 'Consultations', icon: FileText },
        ];
      case 'AMBULANCE':
      case 'AMBULANCE_DRIVER':
        return [
          { to: '/ambulance/dashboard', label: 'Dashboard', icon: Truck },
          { to: '/ambulance/active', label: 'Active Dispatch', icon: AlertTriangle, urgent: true },
        ];
      case 'HOSPITAL':
        return [
          { to: '/hospital/dashboard', label: 'Dashboard', icon: Building2 },
          { to: '/hospital/emergencies', label: 'Triage Emergencies', icon: AlertTriangle, urgent: true },
        ];
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Admin KPIs', icon: Activity },
          { to: '/admin/users', label: 'User Directory', icon: Users },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">JeevanSetu</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-700">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-1 hidden sm:block">Rural Smart Health & Emergency Network</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    link.urgent
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold'
                      : isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.urgent ? 'text-rose-600 animate-bounce' : ''}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Menu: Notifications & User */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-800">Alerts & In-App Messages</span>
                    <span className="text-[11px] text-slate-500">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs flex gap-2.5 transition-colors ${
                            !n.read ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type?.includes('ALERT') ? (
                              <AlertTriangle className="w-4 h-4 text-rose-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-teal-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">{n.title}</p>
                            <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="text-[10px] text-sky-600 hover:text-sky-800 font-medium self-start"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Pill */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  link.urgent
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
