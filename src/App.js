import React, { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {user.type === 'student' ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        <FacultyDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;