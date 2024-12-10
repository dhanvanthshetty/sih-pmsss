import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="welcome-portal-container">
        <h1>Welcome to the PMSSS Portal</h1>
        <div className="home-options-container">
          <Link to="/login" className="btn">Student Login</Link>
          <div className="bureau-login-options-container">
            <Link to="/sage-login" className="btn">Sage Bureau Login</Link>
            <Link to="/finance-login" className="btn">Finance Bureau Login</Link>
          </div>
        </div>
      </div>
      
      {/* Flowchart Section */}
      <div className="flowchart-container-custom">
        <div className="flowchart-box-custom">
          <h3>Step 1</h3>
          <p>Register your account by providing basic information.</p>
        </div>
        <div className="flowchart-arrow-custom">→</div>
        <div className="flowchart-box-custom">
          <h3>Step 2</h3>
          <p>Upload necessary documents for verification.</p>
        </div>
        <div className="flowchart-arrow-custom">→</div>
        <div className="flowchart-box-custom">
          <h3>Step 3</h3>
          <p>Get approval from the concerned bureau.</p>
        </div>
        <div className="flowchart-arrow-custom">→</div>
        <div className="flowchart-box-custom">
          <h3>Step 4</h3>
          <p>Track your application status in real-time.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
