import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('student');
  const [credentials, setCredentials] = useState({ email: '', id: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Student Feedback System</h1>
            <p>Educational Analytics Platform</p>
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
              <label>{loginType === 'student' ? 'Email' : 'Faculty ID'}</label>
              <input
                type={loginType === 'student' ? 'email' : 'text'}
                value={loginType === 'student' ? credentials.email : credentials.id}
                onChange={(e) => setCredentials(prev => ({ 
                  ...prev, 
                  [loginType === 'student' ? 'email' : 'id']: e.target.value 
                }))}
                placeholder={loginType === 'student' ? 'Enter email' : 'Enter faculty ID'}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;