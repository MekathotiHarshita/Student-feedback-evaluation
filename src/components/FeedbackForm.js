import React, { useState } from 'react';

const FeedbackForm = ({ form, onSubmit, onCancel }) => {
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showReview, setShowReview] = useState(false);

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
    // Validate that required questions have responses
    const unansweredIndex = form.questions.findIndex(q => {
      const resp = responses[q.id];
      if (q.type === 'text') return !resp || !resp.toString().trim();
      return resp === undefined || resp === null || resp === '';
    });

    if (unansweredIndex !== -1) {
      setCurrentQuestion(unansweredIndex);
      window.alert('Please answer all questions before submitting the feedback.');
      return;
    }

    // show review overlay first
    setShowReview(true);
  };

  const confirmSubmit = () => {
    setShowReview(false);
    onSubmit(form.id, responses);
  };

  const cancelReview = () => {
    setShowReview(false);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="rating-options">
            {question.options.map((option, index) => {
              // try to derive a numeric value from the option (e.g., "1 - Poor")
              const numeric = (option + '').trim().charAt(0);
              const valueToStore = !isNaN(Number(numeric)) ? Number(numeric) : option;
              return (
                <label key={index} className="rating-option">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={valueToStore}
                    checked={responses[question.id] === valueToStore}
                    onChange={() => handleResponseChange(question.id, valueToStore)}
                  />
                  <span className="rating-badge">{valueToStore}</span>
                  <span className="rating-label">{option.replace(/^\d+\s*-\s*/,'')}</span>
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
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'text':
        // convert text questions into MCQ-style choices so all questions are multiple-choice
        // prefer explicit options when provided, otherwise fall back to a 5-point scale
        const choices = (question.options && question.options.length) ? question.options : [
          '1 - Strongly disagree',
          '2 - Disagree',
          '3 - Neutral',
          '4 - Agree',
          '5 - Strongly agree'
        ];
        return (
          <div className="mcq-options">
            {choices.map((option, idx) => {
              const valueToStore = (idx < 5 && !isNaN(Number((option + '').trim().charAt(0)))) ? Number((option + '').trim().charAt(0)) : option;
              return (
                <label key={idx} className="mcq-option">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={valueToStore}
                    checked={responses[question.id] === valueToStore}
                    onChange={() => handleResponseChange(question.id, valueToStore)}
                  />
                  <span className="mcq-label">{option}</span>
                </label>
              );
            })}
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
                Review & Submit
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
      {showReview && (
        <div className="review-overlay">
          <div className="review-box">
            <h3>Review your responses</h3>
            <div className="review-list">
              {form.questions.map(q => (
                <div key={q.id} className="review-row">
                  <strong>{q.text}</strong>
                  <div className="review-answer">{(responses[q.id] !== undefined && responses[q.id] !== null) ? String(responses[q.id]) : '—'}</div>
                </div>
              ))}
            </div>
            <div className="review-actions">
              <button className="cancel-btn" onClick={cancelReview}>Back</button>
              <button className="submit-btn" onClick={confirmSubmit}>Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;