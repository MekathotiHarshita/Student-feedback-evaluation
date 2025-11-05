import React, { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import './styles/App.css';
import './styles/Login.css';
import './styles/Dashboard.css';
import './styles/FeedbackForm.css';  // Make sure this line is here

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return ( 
    <div className="App">
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : currentUser.type === 'student' ? (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <FacultyDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;