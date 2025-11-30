import React, { useState } from 'react';
import Captcha from './Captcha';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('student');
  const [credentials, setCredentials] = useState({ email: '', id: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (loginType === 'student') {
      if (!credentials.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(credentials.email)) newErrors.email = 'Invalid email format';
    } else {
      if (!credentials.id) newErrors.id = 'Faculty ID is required';
      else if (credentials.id.length < 3) newErrors.id = 'Faculty ID must be at least 3 characters';
    }
    
    if (!credentials.password) newErrors.password = 'Password is required';
    else if (credentials.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!captchaVerified) newErrors.captcha = 'Please complete the captcha verification';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const userData = {
        type: loginType,
        ...(loginType === 'student' 
          ? { email: credentials.email, name: credentials.email.split('@')[0] }
          : { id: credentials.id, name: credentials.id }
        )
      };
      onLogin(userData);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div className="logo-text">
                <h1>Student Feedback Evaluation System</h1>
                <p>Advanced Educational Analytics Platform</p>
              </div>
            </div>
          </div>

          <div className="login-tabs">
            <button
              className={`tab ${loginType === 'student' ? 'active' : ''}`}
              onClick={() => setLoginType('student')}
            >
              Student
            </button>
            <button
              className={`tab ${loginType === 'faculty' ? 'active' : ''}`}
              onClick={() => setLoginType('faculty')}
            >
              Faculty
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{loginType === 'student' ? 'Email Address' : 'Faculty ID'}</label>
              <div className="input-wrapper">
                <input
                  type={loginType === 'student' ? 'email' : 'text'}
                  value={loginType === 'student' ? credentials.email : credentials.id}
                  onChange={(e) => {
                    setCredentials(prev => ({ 
                      ...prev, 
                      [loginType === 'student' ? 'email' : 'id']: e.target.value 
                    }));
                    if (errors.email || errors.id) setErrors(prev => ({ ...prev, email: '', id: '' }));
                  }}
                  placeholder={loginType === 'student' ? 'Enter your email address' : 'Enter your faculty ID'}
                  className={errors.email || errors.id ? 'error' : ''}
                />
              </div>
              {(errors.email || errors.id) && (
                <span className="error-message">{errors.email || errors.id}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <Captcha onVerify={setCaptchaVerified} />
            {errors.captcha && (
              <span className="error-message">{errors.captcha}</span>
            )}

            <button type="submit" className="login-btn" disabled={isLoading || !captchaVerified}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Authenticating...
                </>
              ) : (
                'Sign In Securely'
              )}
            </button>
            
            <div className="login-footer">
              <p>Secure authentication powered by advanced encryption</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;