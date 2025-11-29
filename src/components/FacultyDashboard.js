import React, { useState, useEffect } from 'react';
import dataManager from '../utils/dataManager';
import FormBuilder from './FormBuilder';
import ExportData from './ExportData';

const FacultyDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [createdForms, setCreatedForms] = useState([]);
  const [coursesData, setCoursesData] = useState({});
  const [courseNames, setCourseNames] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [showAllResponses, setShowAllResponses] = useState({});
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const data = dataManager.getData();
    setCoursesData(data.courses);
    setCourseNames(Object.keys(data.courses));
    setCreatedForms(data.pendingForms || []);
  }, [activeTab]);

  const handleCreateForm = (newForm) => {
    if (editingForm) {
      dataManager.updateForm(editingForm.id, newForm);
      setCreatedForms(prev => prev.map(f => f.id === editingForm.id ? newForm : f));
      setEditingForm(null);
    } else {
      dataManager.addForm(newForm);
      setCreatedForms(prev => [...prev, newForm]);
    }
    setActiveTab('forms');
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setActiveTab('create-form');
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dataManager.deleteForm(formId);
      setCreatedForms(prev => prev.filter(f => f.id !== formId));
    }
  };

  const toggleShowAllResponses = (questionIndex) => {
    setShowAllResponses(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const getFilteredCourses = () => {
    if (dateRange === 'all') return courseNames;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const filteredForms = createdForms.filter(form => {
      const formDate = new Date(form.date.replace('Due: ', '').replace('Completed: ', ''));
      if (dateRange === 'week') {
        return formDate >= oneWeekAgo;
      } else if (dateRange === 'month') {
        return formDate >= oneMonthAgo;
      }
      return true;
    });
    
    const coursesWithForms = [...new Set(filteredForms.map(form => form.title.split(' - ')[0]))];
    return courseNames.filter(course => coursesWithForms.includes(course));
  };



  const getOverallStats = () => {
    const totalCourses = courseNames.length;
    const totalResponses = Object.values(coursesData).reduce((sum, course) => 
      sum + course.reduce((courseSum, q) => courseSum + (q.responses?.length || 0), 0), 0);
    const avgRating = courseNames.length > 0 ? 
      Object.values(coursesData).reduce((sum, course) => 
        sum + course.reduce((courseSum, q) => courseSum + (q.average || 0), 0) / course.length, 0) / courseNames.length : 0;
    
    return { totalCourses, totalResponses, avgRating: avgRating.toFixed(1) };
  };

  const stats = getOverallStats();

  if (activeTab === 'create-form') {
    return (
      <FormBuilder 
        onSave={handleCreateForm}
        onCancel={() => {
          setActiveTab('forms');
          setEditingForm(null);
        }}
        editForm={editingForm}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
        color: 'white', 
        padding: '20px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '1.6rem', fontWeight: '700' }}>Faculty Dashboard</h1>
            <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>Welcome, {user.name}</p>
          </div>
          <button 
            onClick={onLogout}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.3)', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        background: 'white', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'analytics', label: 'Analytics' },
              { key: 'forms', label: 'Forms' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '15px 25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: activeTab === tab.key ? '#1e293b' : '#64748b',
                  borderBottom: activeTab === tab.key ? '3px solid #1e293b' : '3px solid transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '25px 30px' }}>
        {/* Dashboard Overview */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Dashboard Overview</h2>
            
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Courses</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>{stats.totalCourses}</div>
              </div>
              
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Responses</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981' }}>{stats.totalResponses}</div>
              </div>
              
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Average Rating</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b' }}>{stats.avgRating}/5</div>
              </div>
              
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Forms</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6' }}>{createdForms.length}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setActiveTab('forms')}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Create Form
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  View Analytics
                </button>
                <button 
                  onClick={() => setShowExport(true)}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Course Analytics</h2>



            {/* Filters and Controls */}
            <div style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              marginBottom: '30px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', marginBottom: '8px' }}>Course Filter</label>
                    <select 
                      value={selectedCourse} 
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      style={{ 
                        padding: '12px 16px', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '10px', 
                        fontSize: '14px', 
                        background: 'white',
                        color: '#1e293b',
                        cursor: 'pointer',
                        minWidth: '200px',
                        fontWeight: '500'
                      }}
                    >
                      <option value="">All Courses</option>
                      {courseNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', marginBottom: '8px' }}>Time Period</label>
                    <select 
                      value={dateRange} 
                      onChange={(e) => setDateRange(e.target.value)}
                      style={{ 
                        padding: '12px 16px', 
                        border: '2px solid #e5e7eb', 
                        borderRadius: '10px', 
                        fontSize: '14px', 
                        background: 'white',
                        color: '#1e293b',
                        cursor: 'pointer',
                        minWidth: '150px',
                        fontWeight: '500'
                      }}
                    >
                      <option value="all">All Time</option>
                      <option value="month">Last Month</option>
                      <option value="week">Last Week</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={() => setShowExport(true)}
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
                  📋 Export Report
                </button>
              </div>
            </div>

            {/* Course Results */}
            {selectedCourse ? (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#1565c0', fontSize: '1.5rem' }}>{selectedCourse} - Detailed Analytics</h2>
                
                {coursesData[selectedCourse]?.map((question, index) => (
                  <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px', border: '2px solid #e3f2fd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: '0', color: '#1565c0', fontSize: '1.1rem' }}>{question.question}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1976d2' }}>{question.average}/5</span>
                        <div style={{ width: '150px', height: '10px', background: '#e3f2fd', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${(question.average / 5) * 100}%`, 
                            height: '100%', 
                            background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                            transition: 'width 0.3s'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{question.responses?.length || 0} responses</span>
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h5 style={{ margin: '0', color: '#1976d2', fontSize: '0.95rem' }}>Student Responses:</h5>
                        {question.responses?.length > 6 && (
                          <button
                            onClick={() => toggleShowAllResponses(index)}
                            style={{
                              background: 'none',
                              border: '1px solid #1976d2',
                              color: '#1976d2',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            {showAllResponses[index] ? 'Show Less' : `Show All (${question.responses.length})`}
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
                        {(showAllResponses[index] ? question.responses : question.responses?.slice(0, 6))?.map((response, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', border: '1px solid #e3f2fd' }}>
                            "{response}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#1565c0' }}>All Courses Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {getFilteredCourses().map(courseName => {
                    const courseData = coursesData[courseName];
                    const avgRating = courseData.reduce((sum, q) => sum + (q.average || 0), 0) / courseData.length;
                    const totalResponses = courseData.reduce((sum, q) => sum + (q.responses?.length || 0), 0);
                    
                    return (
                      <div key={courseName} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px solid #e3f2fd' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#1565c0' }}>{courseName}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Rating</span>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#1976d2', marginTop: '5px' }}>{avgRating.toFixed(1)}/5</span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Responses</span>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#1976d2', marginTop: '5px' }}>{totalResponses}</span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Questions</span>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#1976d2', marginTop: '5px' }}>{courseData.length}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedCourse(courseName)}
                          style={{ 
                            background: 'linear-gradient(135deg, #1976d2, #1565c0)', 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            width: '100%',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'forms' && (
          <div>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.5rem' }}>Form Management</h2>
                  <p style={{ color: '#64748b', margin: '0' }}>Create, edit, and manage feedback forms for student evaluation</p>
                </div>
                <button 
                  onClick={() => setActiveTab('create-form')}
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '15px 30px', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  ➕ Create New Form
                </button>
              </div>
              
              {/* Form Statistics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>{createdForms.length}</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Active Forms</div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.totalResponses}</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Total Submissions</div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>85%</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Response Rate</div>
                </div>
              </div>
            </div>

            {/* Forms Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
              {createdForms.map(form => (
                <div key={form.id} style={{ 
                  background: 'white', 
                  padding: '25px', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #f1f5f9',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: '600' }}>{form.title}</h3>
                    <p style={{ color: '#64748b', margin: '0 0 15px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{form.description}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ 
                        background: '#eff6ff', 
                        color: '#1d4ed8', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '500'
                      }}>
                        {form.course}
                      </span>
                      <span style={{ 
                        background: '#f0fdf4', 
                        color: '#166534', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '500'
                      }}>
                        {form.questions.length} Questions
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {form.date}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEditForm(form)}
                      style={{ 
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 16px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        flex: '1'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteForm(form.id)}
                      style={{ 
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 16px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        flex: '1'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {createdForms.length === 0 && (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '60px 40px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>

                  <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>No Forms Created Yet</h3>
                  <p style={{ color: '#64748b', marginBottom: '25px' }}>Create your first feedback form to start collecting student responses</p>
                  <button 
                    onClick={() => setActiveTab('create-form')}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Create First Form
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {showExport && (
        <ExportData 
          coursesData={coursesData}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;