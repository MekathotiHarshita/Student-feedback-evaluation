import React, { useState } from 'react';
import Captcha from './Captcha';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!isCaptchaVerified) {
      setError('Please verify the captcha first.');
      return;
    }

    // Accept ANY credentials
    if (userType === 'student') {
      if (userId.trim() && password.trim()) {
        onLogin({ 
          id: userId, 
          name: `Student ${userId}`, 
          type: 'student' 
        });
      } else {
        setError('Please enter both Student ID and Password.');
      }
    } else {
      if (userId.trim() && password.trim()) {
        onLogin({ 
          id: userId, 
          name: `Faculty ${userId}`, 
          type: 'faculty' 
        });
      } else {
        setError('Please enter both Faculty ID and Password.');
      }
    }
  };

  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
    if (verified) setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Student Feedback System</h1>
        <p className="subtitle">Choose your login type to continue</p>
        
        <div className="user-type-selector">
          <button 
            className={`type-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => setUserType('student')}
          >
            Student Login
          </button>
          <button 
            className={`type-btn ${userType === 'faculty' ? 'active' : ''}`}
            onClick={() => setUserType('faculty')}
          >
            Faculty Login
          </button>
        </div>

        <p className="login-description">
          {userType === 'student' 
            ? 'Access your feedback forms and submit responses.' 
            : 'View and analyze student feedback data.'}
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>{userType === 'student' ? 'Student ID' : 'Faculty ID'}</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={`Enter your ${userType} ID`}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="captcha-section">
            <label>Captcha Verification</label>
            <Captcha onVerify={handleCaptchaVerify} />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-btn"
            disabled={!isCaptchaVerified}
          >
            Login as {userType === 'student' ? 'Student' : 'Faculty'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;