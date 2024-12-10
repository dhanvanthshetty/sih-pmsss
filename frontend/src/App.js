// src/App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import HomePage from './pages/HomePage';
import LoginForm from './components/LoginForm';
import RegistrationPage from './pages/RegistrationPage';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import ApplyScholarship from './pages/ApplyScholarship';
import TrackStatus from './pages/TrackStatus'; // Import TrackStatus page
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import UploadDocuments from './pages/UploadDocuments'
import SageBureauLogin from './pages/SageBureauLogin'; // Import Sage Bureau Login
import FinanceBureauLogin from './pages/FinanceBureauLogin'; 
import SagDashboard from './pages/SagDashboard'; // Import Sage Bureau Dashboard
import FinDashboard from './pages/FinDashboard'; // Import Finance Bureau Dashboard


function App() {
  const location = useLocation(); // Use useLocation hook
  const showNavbar = ['/student-dashboard', '/profile', '/apply-scholarship', '/track-status'].includes(location.pathname);

  return (
    <AuthProvider>
      {showNavbar && <Navbar />} {/* Render Navbar conditionally */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sage-login" element={<SageBureauLogin />} />
        <Route path="/finance-login" element={<FinanceBureauLogin />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/student-dashboard" element={<ProtectedRoute element={StudentDashboard} />} />
        <Route path="/upload-documents" element = {<ProtectedRoute element= {UploadDocuments}/>}/>
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/apply-scholarship" element={<ProtectedRoute element={ApplyScholarship} />} />
        <Route path="/track-status" element={<ProtectedRoute element={TrackStatus} />} /> {/* Add TrackStatus route */}
        {/* Add Sage and Finance Bureau Dashboard routes */}
        <Route path="/sage-dashboard" element={<ProtectedRoute element={SagDashboard} />} />
        <Route path="/finance-dashboard" element={<ProtectedRoute element={FinDashboard} />} />

      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
