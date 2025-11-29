import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setShowError(false);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }

    if (captchaInput.toUpperCase() !== captcha) {
      setError('Please enter the correct captcha code');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      generateCaptcha();
      return;
    }

    if (userType === 'student' && !email.includes('@')) {
      setError('Please enter a valid email address');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }

    onLogin({
      id: email,
      name: userType === 'student' ? `Student ${email.split('@')[0]}` : `Faculty ${email}`,
      type: userType,
      email: email
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        padding: '50px',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            margin: '0', 
            color: '#1e293b', 
            fontSize: '1.8rem', 
            fontWeight: '700',
            textAlign: 'center'
          }}>
            Student Feedback Evaluation System
          </h1>
        </div>
        
        {/* User Type Selector */}
        <div style={{ 
          display: 'flex', 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '4px',
          marginBottom: '30px'
        }}>
          <button 
            type="button"
            onClick={() => setUserType('student')}
            style={{
              flex: '1',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              background: userType === 'student' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
              color: userType === 'student' ? 'white' : '#64748b'
            }}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => setUserType('faculty')}
            style={{
              flex: '1',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              background: userType === 'faculty' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: userType === 'faculty' ? 'white' : '#64748b'
            }}
          >
            Faculty
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#1e293b',
              fontSize: '0.95rem'
            }}>
              {userType === 'student' ? 'Email Address' : 'Faculty ID'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'student' ? 'Enter your email' : 'Enter your ID'}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#1e293b',
              fontSize: '0.95rem'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#1e293b',
              fontSize: '0.95rem'
            }}>
              Security Verification
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                padding: '15px 20px',
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#374151',
                letterSpacing: '4px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                transform: 'skew(-5deg)',
                minWidth: '140px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                  pointerEvents: 'none'
                }}></div>
                <span style={{ position: 'relative', zIndex: 1 }}>{captcha}</span>
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter the code above"
              maxLength="6"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {showError && error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '16px 24px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.2s',
              background: userType === 'student' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Access {userType === 'student' ? 'Student' : 'Faculty'} Portal
          </button>
        </form>


      </div>
    </div>
  );
};

export default Login;