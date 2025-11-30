import React, { useState, useEffect } from 'react';
import FormBuilder from './FormBuilder';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({});
  const [courses, setCourses] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = () => {
    const coursesData = [
      {
        id: 'math-101',
        name: 'Mathematics',
        students: 45,
        responses: 38,
        avgRating: 4.2
      },
      {
        id: 'cs-201',
        name: 'Computer Science',
        students: 52,
        responses: 41,
        avgRating: 4.5
      },
      {
        id: 'phys-101',
        name: 'Physics',
        students: 38,
        responses: 35,
        avgRating: 4.1
      }
    ];

    const formsData = [
      {
        id: 'form-1',
        title: 'Mid-Semester Evaluation',
        course: 'Mathematics',
        status: 'Active',
        responses: 38,
        created: '2025-01-10',
        dueDate: '2025-01-25'
      },
      {
        id: 'form-2',
        title: 'Course Content Feedback',
        course: 'Computer Science',
        status: 'Active',
        responses: 41,
        created: '2025-01-12',
        dueDate: '2025-01-28'
      }
    ];

    setCourses(coursesData);
    setForms(formsData);

    const totalStudents = coursesData.reduce((sum, course) => sum + course.students, 0);
    const totalResponses = coursesData.reduce((sum, course) => sum + course.responses, 0);
    const avgRating = coursesData.reduce((sum, course) => sum + course.avgRating, 0) / coursesData.length;

    setAnalyticsData({
      totalStudents,
      totalResponses,
      avgRating: avgRating.toFixed(1),
      activeForms: formsData.filter(f => f.status === 'Active').length
    });
  };

  return (
    <div className="faculty-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Faculty Dashboard</h2>
          <div className="admin-info">
            <div className="admin-name">{user.name}</div>
            <div className="admin-role">Faculty</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`nav-item ${activeView === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveView('courses')}
          >
            Courses
          </button>
          <button 
            className={`nav-item ${activeView === 'forms' ? 'active' : ''}`}
            onClick={() => setActiveView('forms')}
          >
            Forms
          </button>
          <button 
            className={`nav-item ${activeView === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveView('builder')}
          >
            Form Builder
          </button>
        </nav>


      </div>

      <main className="main-content">
        <header className="content-header">
          <h1>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </header>

        <div className="content-area">
          {activeView === 'overview' && (
            <div className="overview-content">
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>{analyticsData.totalStudents}</h3>
                  <p>Total Students</p>
                </div>
                <div className="metric-card">
                  <h3>{analyticsData.totalResponses}</h3>
                  <p>Total Responses</p>
                </div>
                <div className="metric-card">
                  <h3>{analyticsData.avgRating}</h3>
                  <p>Average Rating</p>
                </div>
                <div className="metric-card">
                  <h3>{analyticsData.activeForms}</h3>
                  <p>Active Forms</p>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <h4>New feedback received for Mathematics</h4>
                    <p>5 new responses submitted</p>
                  </div>
                  <div className="activity-item">
                    <h4>Form deadline approaching</h4>
                    <p>Computer Science evaluation due in 3 days</p>
                  </div>
                  <div className="activity-item">
                    <h4>High rating achieved</h4>
                    <p>Physics course received 4.8/5 average rating</p>
                  </div>
                </div>
              </div>

              <div className="course-performance">
                <h2>Course Performance</h2>
                <div className="performance-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Students</th>
                        <th>Responses</th>
                        <th>Avg Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td><strong>{course.name}</strong></td>
                          <td>{course.students}</td>
                          <td>{course.responses}</td>
                          <td>{course.avgRating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="analytics-content">
              <div className="analytics-table">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Total Students</th>
                      <th>Responses</th>
                      <th>Response Rate</th>
                      <th>Avg Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td><strong>{course.name}</strong></td>
                        <td>{course.students}</td>
                        <td>{course.responses}</td>
                        <td>{Math.round((course.responses / course.students) * 100)}%</td>
                        <td>{course.avgRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'courses' && (
            <div className="courses-content">
              <div className="section-header">
                <h2>Course Management</h2>
              </div>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.id} className="course-card">
                    <h3>{course.name}</h3>
                    <div className="course-stats">
                      <div className="stat">
                        <span className="stat-label">Students</span>
                        <span className="stat-value">{course.students}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Responses</span>
                        <span className="stat-value">{course.responses}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{course.avgRating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'forms' && (
            <div className="forms-content">
              <div className="section-header">
                <h2>Form Management</h2>
                <button 
                  className="primary-btn"
                  onClick={() => setActiveView('builder')}
                >
                  Create New Form
                </button>
              </div>
              <div className="forms-table">
                <table>
                  <thead>
                    <tr>
                      <th>Form Title</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Responses</th>
                      <th>Created</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map(form => (
                      <tr key={form.id}>
                        <td><strong>{form.title}</strong></td>
                        <td>{form.course}</td>
                        <td><span className="status-active">{form.status}</span></td>
                        <td>{form.responses}</td>
                        <td>{form.created}</td>
                        <td>{form.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'builder' && (
            <FormBuilder onBack={() => setActiveView('forms')} />
          )}
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;