import React, { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import { verifyEmailOtp } from '../services/authService';
import '../styles/RegistrationForm.css';





function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userDetails, setUserDetails] = useState({});

  const nextStep = (details) => {
    if (currentStep === 1) {
      setUserDetails(details);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      verifyOtp(details);
    }
  };

  const verifyOtp = async ({ email, otp }) => {
    try {
      const response = await verifyEmailOtp(email, otp);
      console.log(response); // Debugging output
      setCurrentStep(3); // Proceed to completion step
    } catch (error) {
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={nextStep} />;
      case 2:
        return <StepTwo onNext={nextStep} userDetails={userDetails} />;
      case 3:
        return <h2>Registration Complete!</h2>;
      default:
        return <StepOne onNext={nextStep} />;
    }
  };

  return (
    <div id="registration-form" className="registration-container">
      <div className="progress-bar">
        <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      </div>
      <div className="form-box">
        {renderStep()}
      </div>
    </div>
  );
}

export default RegistrationForm;
