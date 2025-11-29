import React, { useState, useEffect } from 'react';
import FeedbackForm from './FeedbackForm';
import dataManager from '../utils/dataManager';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [pendingForms, setPendingForms] = useState([]);
  const [completedForms, setCompletedForms] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const data = dataManager.getData();
    setPendingForms(data.pendingForms);
    setCompletedForms(data.completedForms);
  }, []);

  const handleStartFeedback = (form) => {
    setActiveForm(form);
  };

  const handleSubmitFeedback = (formId, responses) => {
    dataManager.submitFeedback(formId, responses);
    
    // Refresh data
    const data = dataManager.getData();
    setPendingForms(data.pendingForms);
    setCompletedForms(data.completedForms);
    
    setActiveForm(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelFeedback = () => {
    setActiveForm(null);
  };

  if (activeForm) {
    return (
      <FeedbackForm 
        form={activeForm} 
        onSubmit={handleSubmitFeedback}
        onCancel={handleCancelFeedback}
      />
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-content">
        {showSuccess && (
          <div className="success-message">
            ✓ Feedback submitted successfully!
          </div>
        )}

        <section>
          <h2 className="section-title">
            Pending Feedback 
            <span className="badge">{pendingForms.length}</span>
          </h2>
          <div className="forms-grid">
            {pendingForms.map(form => (
              <div key={form.id} className="form-card">
                <h3>{form.title}</h3>
                <span className="course-code">{form.course}</span>
                <p className="instructor">Instructor: {form.instructor}</p>
                <p className="description">{form.description}</p>
                <div className="form-meta">
                  <span>📅 {form.date}</span>
                </div>
                <button 
                  onClick={() => handleStartFeedback(form)}
                  className="start-btn"
                >
                  Start Feedback
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2 className="section-title">Completed Feedback</h2>
          <div className="forms-grid">
            {completedForms.map(form => (
              <div key={form.id} className="form-card">
                <h3>{form.title}</h3>
                <span className="course-code">{form.course}</span>
                <p className="instructor">Instructor: {form.instructor}</p>
                <p className="description">{form.description}</p>
                <div className="form-meta">
                  <span>✅ {form.date}</span>
                </div>
                <div className="completed-badge">Submitted</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;