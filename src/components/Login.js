import React, { useState } from 'react';
import Captcha from './Captcha';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const validateCredentials = () => {
    setError('');

    if (userType === 'student') {
      // Require a valid email for student login
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userId)) {
        setError('Please enter a valid student email');
        return false;
      }

      if (!password.trim()) {
        setError('Please enter your password');
        return false;
      }
    } else {
      if (!userId.trim() || !password.trim()) {
        setError('Please enter both Faculty ID and Password.');
        return false;
      }
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!isCaptchaVerified) {
      setError('Please verify the captcha first.');
      return;
    }

    if (!validateCredentials()) {
      return;
    }

    if (userType === 'student') {
      onLogin({ 
        id: userId, 
        name: `Student ${userId}`, 
        type: 'student' 
      });
    } else {
      onLogin({ 
        id: userId, 
        name: `Faculty ${userId}`, 
        type: 'faculty' 
      });
    }
  };

  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
    if (verified) setError('');
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Student Feedback System</h1>
        <p className="subtitle">Choose your login type to continue</p>
        
        <div className="user-type-selector">
          <button 
            className={`type-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => {
              setUserType('student');
              setError('');
              setUserId('');
              setPassword('');
            }}
          >
            Student Login
          </button>
          <button 
            className={`type-btn ${userType === 'faculty' ? 'active' : ''}`}
            onClick={() => {
              setUserType('faculty');
              setError('');
              setUserId('');
              setPassword('');
            }}
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
            <label>{userType === 'student' ? 'Student Email' : 'Faculty ID'}</label>
            <input
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              placeholder={userType === 'student' ? 'Enter your student email' : 'Enter your Faculty ID'}
              required
            />
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="captcha-section">
            <label>Captcha Verification</label>
            <Captcha onVerify={handleCaptchaVerify} />
          </div>

          {error && error !== 'Invalid User ID' && (
            <div className="error-message">{error}</div>
          )}

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