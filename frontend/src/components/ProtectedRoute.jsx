import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, getDashboardRoute } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600">Loading JeevanSetu Network...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoleNorm = user?.role ? user.role.replace('ROLE_', '') : '';
  const allowedNorm = allowedRoles.map((r) => r.replace('ROLE_', ''));

  if (allowedNorm.length > 0 && !allowedNorm.includes(userRoleNorm)) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
