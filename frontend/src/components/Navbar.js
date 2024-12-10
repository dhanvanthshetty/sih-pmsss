// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Import the CSS file

function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item"><Link to="/student-dashboard" className="nav-link">Dashboard</Link></li>
        <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>
        <li className="nav-item"><Link to="/upload-documents" className="nav-link">Apply for Scholarship</Link></li>
        <li className="nav-item"><button onClick={logout} className="nav-btn">Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
