import React, { useState, useEffect } from 'react';

const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (value === captchaText) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600', 
        color: '#1e293b',
        fontSize: '0.95rem'
      }}>
        Security Verification
      </label>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{
          background: '#f3f4f6',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
          fontFamily: 'monospace',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          letterSpacing: '3px',
          color: '#374151',
          textDecoration: 'line-through',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          {captchaText}
        </div>
        
        <button
          type="button"
          onClick={generateCaptcha}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Refresh
        </button>
      </div>
      
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the text above"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `2px solid ${isVerified ? '#10b981' : '#e5e7eb'}`,
          borderRadius: '8px',
          fontSize: '1rem',
          boxSizing: 'border-box',
          backgroundColor: isVerified ? '#f0fdf4' : 'white'
        }}
      />
      
      {isVerified && (
        <div style={{
          color: '#10b981',
          fontSize: '0.85rem',
          marginTop: '5px',
          fontWeight: '500'
        }}>
          ✓ Verification successful
        </div>
      )}
    </div>
  );
};

export default Captcha;