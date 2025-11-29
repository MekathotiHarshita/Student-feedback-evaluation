import React, { useState } from 'react';

const FeedbackForm = ({ form, onSubmit, onCancel }) => {
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState('');

  const handleResponseChange = (questionId, value) => {
    setError('');
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const currentResp = responses[form.questions[currentQuestion].id];
    if (currentResp === undefined || currentResp === null || currentResp === '') {
      setError('Please answer this question before proceeding.');
      return;
    }
    
    setError('');
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
    const currentResp = responses[form.questions[currentQuestion].id];
    if (currentResp === undefined || currentResp === null || currentResp === '') {
      setError('Please answer this question before submitting.');
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = form.questions.filter(q => {
      const resp = responses[q.id];
      return resp === undefined || resp === null || resp === '';
    });

    if (unansweredQuestions.length > 0) {
      setError(`Please complete all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    setError('');
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
            {[1, 2, 3, 4, 5].map(rating => (
              <label key={rating} className="rating-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={rating}
                  checked={responses[question.id] === rating}
                  onChange={() => handleResponseChange(question.id, rating)}
                />
                <span className="rating-number">{rating}</span>
                <span className="rating-text">
                  {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'yesno':
        return (
          <div className="yesno-options">
            {['Yes', 'No'].map(option => (
              <label key={option} className="yesno-option">
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
          <div className="rating-options">
            {[1, 2, 3, 4, 5].map(rating => (
              <label key={rating} className="rating-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={rating}
                  checked={responses[question.id] === rating}
                  onChange={() => handleResponseChange(question.id, rating)}
                />
                <span className="rating-number">{rating}</span>
                <span className="rating-text">
                  {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
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
          {error && <div className="error-message">{error}</div>}
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