import React, { useState } from 'react';

const FormBuilder = ({ onSave, onCancel, editForm }) => {
  const [form, setForm] = useState(editForm || {
    title: '',
    description: '',
    course: '',
    instructor: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'rating'
  });

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) return;
    
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, { 
        ...currentQuestion, 
        id: Date.now() 
      }]
    }));
    
    setCurrentQuestion({ text: '', type: 'rating' });
  };

  const removeQuestion = (index) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.course.trim() || form.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }
    
    onSave({
      ...form,
      id: Date.now(),
      date: `Due: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📝
            </div>
            <div>
              <h2 style={{ margin: '0', color: '#1e293b', fontSize: '1.6rem', fontWeight: '700' }}>
                {editForm ? 'Edit Feedback Form' : 'Create New Feedback Form'}
              </h2>
              <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '1rem' }}>
                Design comprehensive feedback forms for student evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.2rem', fontWeight: '600' }}>Form Information</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>Form Title *</label>
            <input
              type="text"
              placeholder="e.g., Mathematics - Calculus I Feedback"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '15px 20px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                fontSize: '1rem', 
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>Description</label>
            <textarea
              placeholder="Provide a brief description of this feedback form..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '15px 20px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                fontSize: '1rem', 
                height: '100px', 
                resize: 'vertical', 
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>Course Code *</label>
              <input
                type="text"
                placeholder="e.g., MATH101, CS202"
                value={form.course}
                onChange={(e) => setForm(prev => ({ ...prev, course: e.target.value }))}
                style={{ 
                  width: '100%',
                  padding: '15px 20px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px', 
                  fontSize: '1rem', 
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>Instructor Name</label>
              <input
                type="text"
                placeholder="e.g., Dr. Smith"
                value={form.instructor}
                onChange={(e) => setForm(prev => ({ ...prev, instructor: e.target.value }))}
                style={{ 
                  width: '100%',
                  padding: '15px 20px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px', 
                  fontSize: '1rem', 
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Builder */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>

          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.2rem', fontWeight: '600' }}>Question Builder</h3>
          <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e5e7eb' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>Question Text *</label>
              <input
                type="text"
                placeholder="e.g., Rate the overall teaching quality"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '15px 20px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '10px', 
                  fontSize: '1rem', 
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem', marginBottom: '8px' }}>Question Type</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '15px 20px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '10px', 
                  fontSize: '1rem', 
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="rating">⭐ Rating Scale (1-5)</option>
                <option value="yesno">✅ Yes/No Question</option>
              </select>
            </div>
            <button 
              onClick={addQuestion}
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                color: 'white', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Add Question
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: '0', color: '#1e293b', fontSize: '1.1rem', fontWeight: '600' }}>Added Questions ({form.questions.length})</h4>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {form.questions.map((q, index) => (
              <div key={q.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '15px 20px', 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '10px', 
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{index + 1}. {q.text}</span>
                  <div style={{ 
                    display: 'inline-block',
                    marginLeft: '10px',
                    padding: '2px 8px',
                    background: q.type === 'rating' ? '#eff6ff' : '#f0fdf4',
                    color: q.type === 'rating' ? '#1d4ed8' : '#166534',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {q.type === 'rating' ? '⭐ Rating' : '✅ Yes/No'}
                  </div>
                </div>
                <button 
                  onClick={() => removeQuestion(index)}
                  style={{ 
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                    color: 'white', 
                    border: 'none', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          background: 'white', 
          padding: '25px 30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onCancel}
            style={{ 
              background: '#6b7280', 
              color: 'white', 
              border: 'none', 
              padding: '15px 30px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '0.95rem'
            }}
          >
            ❌ Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: 'white', 
              border: 'none', 
              padding: '15px 30px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            {editForm ? '✅ Update Form' : '✨ Create Form'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;