import React, { useState, useEffect } from 'react';

const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(result);
    setIsVerified(false);
    setUserInput('');
  };

  const handleVerify = () => {
    if (userInput === captchaText) {
      setIsVerified(true);
      onVerify(true);
    } else {
      alert('Captcha verification failed. Please try again.');
      generateCaptcha();
    }
  };

  return (
    <div className="captcha-container">
      <div className="captcha-display">
        <span className="captcha-text">{captchaText}</span>
        <button type="button" onClick={generateCaptcha} className="refresh-btn">
          ↻
        </button>
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter captcha"
        className="captcha-input"
      />
      <button type="button" onClick={handleVerify} className="verify-btn">
        Verify Captcha
      </button>
      {isVerified && <span className="verified">✓ Verified</span>}
    </div>
  );
};

export default Captcha;