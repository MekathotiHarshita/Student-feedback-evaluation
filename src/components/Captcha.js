import React, { useState, useEffect } from 'react';
import '../styles/Captcha.css';

const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
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
    const value = e.target.value.toUpperCase();
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
    <div className="captcha-container">
      <label className="captcha-label">Security Verification</label>
      <div className="captcha-box">
        <div className="captcha-display">
          <span className="captcha-text">{captchaText}</span>
          <button 
            type="button" 
            className="refresh-btn"
            onClick={generateCaptcha}
            title="Refresh Captcha"
          >
            ↻
          </button>
        </div>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter captcha"
          className={`captcha-input ${isVerified ? 'verified' : ''}`}
          maxLength={6}
        />
      </div>
      {isVerified && (
        <div className="verification-success">
          ✓ Verified
        </div>
      )}
    </div>
  );
};

export default Captcha;