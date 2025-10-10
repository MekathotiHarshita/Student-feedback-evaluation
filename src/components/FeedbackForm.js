import React, { useState } from 'react';

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
    if (window.confirm('Are you sure you want to submit this feedback?')) {
      onSubmit(form.id, responses);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="rating-options">
            {question.options.map((option, index) => (
              <label key={index} className="rating-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={() => handleResponseChange(question.id, option)}
                />
                <span>{option}</span>
              </label>
            ))}
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
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your response here..."
            rows={4}
          />
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
          <h2>{form.title}</h2>
          <p>{form.description}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="question-counter">
            Question {currentQuestion + 1} of {form.questions.length}
          </div>
        </header>

        <div className="question-section">
          <h3>{currentQ.text}</h3>
          {renderQuestion(currentQ)}
        </div>

        <div className="form-navigation">
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
                className="nav-btn next"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;