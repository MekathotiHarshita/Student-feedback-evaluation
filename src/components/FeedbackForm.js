import React, { useState } from 'react';
import '../styles/FeedbackForm.css';

const FeedbackForm = ({ form, onSubmit, onCancel }) => {
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < form.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const unansweredQuestions = form.questions.filter(q => {
      const resp = responses[q.id];
      return resp === undefined || resp === null || resp === '';
    });

    if (unansweredQuestions.length > 0) {
      alert('Please answer all questions before submitting your feedback.');
      return;
    }

    onSubmit(form.id, responses);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="rating-options">
            {question.options.map((option, index) => {
              const numeric = parseInt(option.charAt(0));
              const label = option.replace(/^\d+\s*-\s*/, '');
              return (
                <label key={index} className="rating-option">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={numeric}
                    checked={responses[question.id] === numeric}
                    onChange={() => handleResponseChange(question.id, numeric)}
                  />
                  <div className="rating-button">
                    <span className="rating-number">{numeric}</span>
                    <span className="rating-label">{label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        );
      
      case 'yesno':
        return (
          <div className="yesno-options">
            {question.options.map((option, index) => (
              <label key={index} className="yesno-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={() => handleResponseChange(question.id, option)}
                />
                <div className="yesno-button">
                  <span className="yesno-text">{option}</span>
                </div>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentQ = form.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / form.questions.length) * 100;

  return (
    <div className="feedback-form-container">
      <div className="feedback-form">
        <header className="form-header">
          <h1>{form.title}</h1>
          <p>Course: {form.course} | Instructor: {form.instructor}</p>
          
          <div className="progress-section">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {form.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </header>

        <main className="question-section">
          <div className="question-card">
            <h2>{currentQ.text}</h2>
            <div className="question-content">
              {renderQuestion(currentQ)}
            </div>
          </div>
        </main>

        <footer className="form-navigation">
          <button 
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
          
          <div className="nav-buttons">
            <button 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="nav-btn"
            >
              Previous
            </button>
            
            {currentQuestion === form.questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                className="submit-btn"
              >
                Submit Feedback
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="nav-btn"
              >
                Next
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FeedbackForm;