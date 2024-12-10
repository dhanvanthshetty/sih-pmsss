// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Component }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (!authState.token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
