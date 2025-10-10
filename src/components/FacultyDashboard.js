import React, { useState } from 'react';

const FacultyDashboard = ({ user, onLogout }) => {
  const [selectedCourse, setSelectedCourse] = useState('Mathematics');
  
  const feedbackData = {
    Mathematics: [
      { question: "Course Content Rating", average: 4.2, responses: [
        "Excellent content organization", "Could use more practical examples", "Very comprehensive"
      ]},
      { question: "Teaching Effectiveness", average: 4.5, responses: [
        "Professor explains concepts clearly", "Very engaging lectures", "Always available for help"
      ]}
    ],
    "Computer Science": [
      { question: "Lab Session Helpfulness", average: 4.0, responses: [
        "Lab instructions were clear", "Need more time for complex projects", "TA support was excellent"
      ]}
    ]
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Faculty Dashboard</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-content">
        <section className="analytics-section">
          <h2>Feedback Analytics</h2>
          
          <div className="course-selector">
            <label>Select Course: </label>
            <select 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <div className="analytics-cards">
            <div className="stat-card">
              <h3>Overall Rating</h3>
              <div className="rating">4.3/5</div>
              <p>Based on 42 responses</p>
            </div>
            
            <div className="stat-card">
              <h3>Response Rate</h3>
              <div className="rating">85%</div>
              <p>42 out of 50 students</p>
            </div>
            
            <div className="stat-card">
              <h3>Improvement Areas</h3>
              <div className="rating">2</div>
              <p>Needs attention</p>
            </div>
          </div>
        </section>

        <section className="detailed-feedback">
          <h2>Detailed Feedback - {selectedCourse}</h2>
          
          {feedbackData[selectedCourse]?.map((item, index) => (
            <div key={index} className="feedback-item">
              <div className="feedback-header">
                <h4>{item.question}</h4>
                <span className="average-rating">Avg: {item.average}/5</span>
              </div>
              
              <div className="responses-list">
                <h5>Student Comments:</h5>
                {item.responses.map((response, idx) => (
                  <div key={idx} className="response-item">
                    "{response}"
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Create New Feedback Form</button>
            <button className="action-btn">Export Feedback Data</button>
            <button className="action-btn">Generate Report</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FacultyDashboard;