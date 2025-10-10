import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [pendingForms, setPendingForms] = useState([
    {
      id: 1,
      title: "Mathematics Course Evaluation",
      description: "Share your thoughts about the calculus course and help us improve the learning experience.",
      duration: 10,
      date: "Oct 25, 2024",
      questions: [
        {
          id: 1,
          text: "How would you rate the course content?",
          type: "rating",
          options: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Very Good", "5 - Excellent"]
        },
        {
          id: 2,
          text: "What did you like most about this course?",
          type: "text"
        },
        {
          id: 3,
          text: "Any suggestions for improvement?",
          type: "text"
        }
      ]
    },
    {
      id: 2,
      title: "Computer Science Lab Feedback",
      description: "Evaluate the programming lab sessions and suggest improvements for hands-on learning.",
      duration: 5,
      date: "Oct 26, 2024",
      questions: [
        {
          id: 1,
          text: "How helpful were the lab sessions?",
          type: "rating",
          options: ["1 - Not helpful", "2", "3", "4", "5 - Very helpful"]
        },
        {
          id: 2,
          text: "Were the lab instructions clear?",
          type: "yesno",
          options: ["Yes", "No"]
        }
      ]
    }
  ]);
  
  const [completedForms, setCompletedForms] = useState([
    {
      id: 3,
      title: "Physics Course Survey",
      description: "Help us understand your learning experience in the physics course.",
      duration: 12,
      date: "Sep 30, 2024",
      status: "completed"
    }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStartFeedback = (form) => {
    setActiveForm(form);
  };

  const handleSubmitFeedback = (formId, responses) => {
    console.log(`Feedback submitted for form ${formId}:`, responses);
    
    const submittedForm = pendingForms.find(f => f.id === formId);
    setPendingForms(pendingForms.filter(f => f.id !== formId));
    setCompletedForms([...completedForms, { ...submittedForm, status: 'completed' }]);
    
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

      {showSuccess && (
        <div className="success-message">
          ✓ Feedback submitted successfully!
        </div>
      )}

      <main className="dashboard-content">
        <section className="forms-section">
          <h2>Complete your feedback forms</h2>
          <div className="forms-grid">
            {pendingForms.map(form => (
              <div key={form.id} className="form-card">
                <h3>{form.title}</h3>
                <p>{form.description}</p>
                <div className="form-meta">
                  <span>⏱ {form.duration} minutes</span>
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

        <section className="completed-section">
          <h2>Completed Forms</h2>
          <div className="forms-grid">
            {completedForms.map(form => (
              <div key={form.id} className="form-card completed">
                <h3>{form.title}</h3>
                <p>{form.description}</p>
                <div className="form-meta">
                  <span>⏱ {form.duration} minutes</span>
                  <span>✅ Completed: {form.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;