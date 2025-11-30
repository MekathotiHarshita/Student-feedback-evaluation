import React, { useState, useEffect } from 'react';
import FeedbackForm from './FeedbackForm';
import '../styles/StudentDashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [pendingForms, setPendingForms] = useState([]);
  const [completedForms, setCompletedForms] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadDashboardData();
    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateTimeAndGreeting = () => {
    const now = new Date();
    setCurrentTime(now);
    
    const hour = now.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const loadDashboardData = () => {
    const pending = [
      {
        id: 'form-1',
        title: 'Mathematics Course Evaluation',
        course: 'Mathematics',
        instructor: 'Dr. Smith',
        dueDate: '2025-12-05',
        questions: [
          { id: 1, text: 'How would you rate the overall course content?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 2, text: 'How would you rate the instructor teaching effectiveness?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 3, text: 'Was the course material well organized?', type: 'yesno', options: ['Yes', 'No'] },
          { id: 4, text: 'How would you rate the clarity of explanations?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 5, text: 'Were assignments relevant to course objectives?', type: 'yesno', options: ['Yes', 'No'] },
          { id: 6, text: 'How would you rate the instructor availability for help?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 7, text: 'Would you recommend this course to other students?', type: 'yesno', options: ['Yes', 'No'] }
        ]
      },
      {
        id: 'form-2',
        title: 'Computer Science Course Evaluation',
        course: 'Computer Science',
        instructor: 'Prof. Johnson',
        dueDate: '2025-12-10',
        questions: [
          { id: 1, text: 'How would you rate the overall course content?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 2, text: 'How would you rate the instructor teaching effectiveness?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 3, text: 'Were the programming assignments challenging but fair?', type: 'yesno', options: ['Yes', 'No'] },
          { id: 4, text: 'How would you rate the lab sessions?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 5, text: 'Was the instructor responsive to questions?', type: 'yesno', options: ['Yes', 'No'] },
          { id: 6, text: 'How would you rate the course difficulty level?', type: 'rating', options: ['1 - Too Easy', '2 - Easy', '3 - Just Right', '4 - Difficult', '5 - Too Difficult'] },
          { id: 7, text: 'Would you take another course with this instructor?', type: 'yesno', options: ['Yes', 'No'] }
        ]
      },
      {
        id: 'form-3',
        title: 'English Literature Course Evaluation',
        course: 'English Literature',
        instructor: 'Dr. Brown',
        dueDate: '2025-12-02',
        questions: [
          { id: 1, text: 'How would you rate the overall course content?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 2, text: 'How would you rate the instructor teaching effectiveness?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 3, text: 'Were the reading assignments appropriate for the course level?', type: 'yesno', options: ['Yes', 'No'] },
          { id: 4, text: 'How would you rate the class discussions?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 5, text: 'Was the instructor available for office hours?', type: 'yesno', options: ['Yes', 'No'] },
          { id: 6, text: 'How would you rate the feedback on your essays?', type: 'rating', options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
          { id: 7, text: 'Would you recommend this course to other students?', type: 'yesno', options: ['Yes', 'No'] }
        ]
      }
    ];

    const completed = JSON.parse(localStorage.getItem('feedbackData') || '{}').completedForms || [
      {
        id: 'comp-1',
        title: 'Physics Course Evaluation',
        course: 'Physics',
        instructor: 'Dr. Wilson',
        completedDate: '2025-01-15'
      }
    ];

    setPendingForms(pending);
    setCompletedForms(completed);
  };

  const handleFormSubmit = (formId, responses) => {
    const form = pendingForms.find(f => f.id === formId);
    if (!form) return;

    const completedForm = {
      id: `comp-${Date.now()}`,
      title: form.title,
      course: form.course,
      instructor: form.instructor,
      completedDate: new Date().toISOString().split('T')[0],
      responses
    };

    const updatedCompleted = [...completedForms, completedForm];
    const updatedPending = pendingForms.filter(f => f.id !== formId);

    setCompletedForms(updatedCompleted);
    setPendingForms(updatedPending);

    const savedData = JSON.parse(localStorage.getItem('feedbackData') || '{}');
    savedData.completedForms = updatedCompleted;
    localStorage.setItem('feedbackData', JSON.stringify(savedData));

    setSelectedForm(null);
    loadDashboardData();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyClass = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days <= 1) return 'urgent';
    if (days <= 3) return 'warning';
    return 'normal';
  };

  if (selectedForm) {
    return (
      <FeedbackForm
        form={selectedForm}
        onSubmit={handleFormSubmit}
        onCancel={() => setSelectedForm(null)}
      />
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-left">
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>Student</p>
              <p>{user.email}</p>
            </div>
          </div>


        </div>
      </div>

      <div className="dashboard-right">
        <div className="content-section">
          <div className="section-header">
            <h1>Student Feedback System</h1>
            <div className="header-right">
              <button onClick={onLogout} className="logout-btn">Logout</button>
              <div className="progress-overview">
                <div className="progress-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                      strokeDasharray={`${completedForms.length * 10}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">
                      {Math.round((completedForms.length / (completedForms.length + pendingForms.length)) * 100) || 0}%
                    </text>
                  </svg>
                  <div className="progress-label">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pending-section">
            <h2>Pending Forms</h2>
            <div className="forms-list">
              {pendingForms.map(form => (
                <div key={form.id} className={`form-card ${getUrgencyClass(form.dueDate)}`}>
                  <div className="form-info">
                    <h3>{form.title}</h3>
                    <p><strong>Course:</strong> {form.course}</p>
                    <p><strong>Instructor:</strong> {form.instructor}</p>
                    <p><strong>Due Date:</strong> {form.dueDate}</p>
                    <div className="urgency-indicator">
                      {getDaysUntilDue(form.dueDate) <= 1 ? 
                        <span className="urgent-text">Due Tomorrow!</span> :
                        <span className="days-left">{getDaysUntilDue(form.dueDate)} days left</span>
                      }
                    </div>
                  </div>
                  <button 
                    className="feedback-btn"
                    onClick={() => setSelectedForm(form)}
                  >
                    Give Feedback
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="completed-section">
            <h2>Completed Forms</h2>
            <div className="completed-list">
              {completedForms.map(form => (
                <div key={form.id} className="completed-card">
                  <div className="completed-info">
                    <h4>{form.title}</h4>
                    <p><strong>Course:</strong> {form.course}</p>
                    <p><strong>Instructor:</strong> {form.instructor}</p>
                    <p><strong>Completed:</strong> {form.completedDate}</p>
                  </div>
                  <span className="status-badge">Completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;