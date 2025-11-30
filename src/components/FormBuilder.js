import React, { useState } from 'react';
import '../styles/FormBuilder.css';

const FormBuilder = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'rating',
    options: [],
    required: true
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  const questionTypes = [
    { value: 'rating', label: '⭐ Rating Scale (1-5)', defaultOptions: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
    { value: 'yesno', label: '✓ Yes/No Question', defaultOptions: ['Yes', 'No'] },
    { value: 'text', label: '📝 Multiple Choice', defaultOptions: ['Option 1', 'Option 2', 'Option 3'] }
  ];

  const courses = ['Mathematics', 'Computer Science', 'Physics', 'English', 'Chemistry', 'Biology', 'History'];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'type' && { options: questionTypes.find(t => t.value === value)?.defaultOptions || [] })
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, `Option ${prev.options.length + 1}`]
    }));
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert('Please enter a question text');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now()
    };

    if (isEditing) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[editingIndex] = newQuestion;
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
      setIsEditing(false);
      setEditingIndex(-1);
    } else {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }

    resetCurrentQuestion();
  };

  const editQuestion = (index) => {
    setCurrentQuestion(formData.questions[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const deleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      text: '',
      type: 'rating',
      options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'],
      required: true
    });
  };

  const saveForm = () => {
    if (!formData.title.trim()) {
      alert('Please enter a form title');
      return;
    }
    if (!formData.course) {
      alert('Please select a course');
      return;
    }
    if (formData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Save to localStorage (in a real app, this would be an API call)
    const savedForms = JSON.parse(localStorage.getItem('customForms') || '[]');
    const newForm = {
      ...formData,
      id: `form-${Date.now()}`,
      created: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    
    savedForms.push(newForm);
    localStorage.setItem('customForms', JSON.stringify(savedForms));

    alert('Form saved successfully!');
    onBack();
  };

  const previewForm = () => {
    if (formData.questions.length === 0) {
      alert('Please add at least one question to preview');
      return;
    }
    setShowPreview(true);
  };

  return (
    <div className="form-builder-container">
      <div className="form-builder">
        {/* Header */}
        <header className="builder-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={onBack} className="back-btn">
                <span className="back-icon">←</span>
                Back to Forms
              </button>
              <div className="header-title">
                <h1>Form Builder</h1>
                <p>Create custom feedback forms with advanced question types</p>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={previewForm} className="preview-btn">
                <span className="btn-icon">👁️</span>
                Preview
              </button>
              <button onClick={saveForm} className="save-btn">
                <span className="btn-icon">💾</span>
                Save Form
              </button>
            </div>
          </div>
        </header>

        <div className="builder-content">
          {/* Form Settings */}
          <section className="form-settings">
            <div className="settings-card">
              <h2>Form Settings</h2>
              <div className="settings-grid">
                <div className="form-group">
                  <label htmlFor="title">Form Title *</label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="e.g., Mid-Semester Course Evaluation"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="course">Course *</label>
                  <select
                    id="course"
                    value={formData.course}
                    onChange={(e) => handleFormChange('course', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Brief description of this evaluation form"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleFormChange('dueDate', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Question Builder */}
          <section className="question-builder">
            <div className="builder-card">
              <h2>
                {isEditing ? 'Edit Question' : 'Add New Question'}
                <span className="question-count">({formData.questions.length} questions added)</span>
              </h2>
              
              <div className="question-form">
                <div className="form-group">
                  <label htmlFor="questionText">Question Text *</label>
                  <textarea
                    id="questionText"
                    value={currentQuestion.text}
                    onChange={(e) => handleQuestionChange('text', e.target.value)}
                    placeholder="Enter your question here..."
                    className="form-textarea"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="questionType">Question Type</label>
                  <select
                    id="questionType"
                    value={currentQuestion.type}
                    onChange={(e) => handleQuestionChange('type', e.target.value)}
                    className="form-select"
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Options Editor */}
                <div className="form-group">
                  <label>Answer Options</label>
                  <div className="options-editor">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="option-row">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="option-input"
                          placeholder={`Option ${index + 1}`}
                        />
                        {currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="remove-option-btn"
                          >
                            ✗
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {currentQuestion.type === 'text' && currentQuestion.options.length < 6 && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="add-option-btn"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingIndex(-1);
                        resetCurrentQuestion();
                      }}
                      className="cancel-edit-btn"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="add-question-btn"
                  >
                    <span className="btn-icon">{isEditing ? '✓' : '+'}</span>
                    {isEditing ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Questions List */}
          {formData.questions.length > 0 && (
            <section className="questions-list">
              <div className="list-card">
                <h2>Form Questions</h2>
                <div className="questions-container">
                  {formData.questions.map((question, index) => (
                    <div key={question.id} className="question-item">
                      <div className="question-header">
                        <div className="question-number">Q{index + 1}</div>
                        <div className="question-content">
                          <h4>{question.text}</h4>
                          <div className="question-meta">
                            <span className="question-type-badge">
                              {questionTypes.find(t => t.value === question.type)?.label}
                            </span>
                            <span className="options-count">
                              {question.options.length} options
                            </span>
                          </div>
                        </div>
                        <div className="question-actions">
                          <button
                            onClick={() => editQuestion(index)}
                            className="edit-btn"
                            title="Edit Question"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteQuestion(index)}
                            className="delete-btn"
                            title="Delete Question"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="question-preview">
                        <div className="preview-options">
                          {question.options.slice(0, 3).map((option, optIndex) => (
                            <span key={optIndex} className="preview-option">
                              {option}
                            </span>
                          ))}
                          {question.options.length > 3 && (
                            <span className="more-options">
                              +{question.options.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-modal">
            <div className="preview-header">
              <h2>Form Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="close-preview-btn"
              >
                ✗
              </button>
            </div>
            
            <div className="preview-content">
              <div className="preview-form">
                <div className="preview-form-header">
                  <h3>{formData.title || 'Untitled Form'}</h3>
                  {formData.description && <p>{formData.description}</p>}
                  <div className="preview-meta">
                    <span>Course: {formData.course || 'Not selected'}</span>
                    {formData.dueDate && <span>Due: {formData.dueDate}</span>}
                  </div>
                </div>
                
                <div className="preview-questions">
                  {formData.questions.map((question, index) => (
                    <div key={question.id} className="preview-question">
                      <h4>
                        <span className="preview-q-number">Q{index + 1}</span>
                        {question.text}
                      </h4>
                      <div className="preview-question-options">
                        {question.type === 'rating' && (
                          <div className="preview-rating">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="preview-rating-option">
                                <span className="rating-num">{optIndex + 1}</span>
                                <span className="rating-label">{option.replace(/^\d+\s*-\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'yesno' && (
                          <div className="preview-yesno">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="preview-yesno-option">
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'text' && (
                          <div className="preview-mcq">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="preview-mcq-option">
                                <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;