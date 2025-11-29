# Student Feedback System

A comprehensive web application for collecting and analyzing student feedback on courses, instructors, and institutional services.

## Features

### For Students
- **Secure Login** - Email-based authentication with captcha verification
- **Interactive Feedback Forms** - Multi-step forms with rating scales, yes/no questions, and multiple choice
- **Progress Tracking** - Visual progress indicators and question counters
- **Review & Submit** - Review all responses before final submission
- **Dashboard** - View pending and completed feedback forms
- **Profile Management** - Update personal information and preferences

### For Faculty/Admin
- **Analytics Dashboard** - View aggregated feedback data and ratings
- **Course Management** - Assign courses and manage student sections
- **Form Builder** - Create custom feedback forms with different question types
- **Data Visualization** - Rating analysis charts and completion statistics
- **Detailed Feedback** - Access individual responses and comments
- **Profile Management** - Update faculty information and department details

## Technology Stack

- **Frontend**: React.js
- **Styling**: CSS3 with modern design patterns
- **Data**: JSON-based data structure
- **Authentication**: Form-based with captcha verification

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Open http://localhost:5173 in your browser
   - Choose Student or Faculty login
   - Use any email format for students
   - Use any ID for faculty

## Project Structure

```
src/
├── components/
│   ├── Login.js              # Authentication component
│   ├── StudentDashboard.js   # Student interface
│   ├── FacultyDashboard.js   # Faculty/Admin interface
│   ├── FeedbackForm.js       # Multi-step feedback form
│   ├── FormBuilder.js        # Admin form creation tool
│   └── Captcha.js           # Security verification
├── data/
│   └── feedback-data.json    # Sample data structure
├── styles/
│   ├── App.css              # Global styles
│   ├── Login.css            # Authentication styles
│   ├── Dashboard.css        # Dashboard layouts
│   ├── FeedbackForm.css     # Form styling
│   ├── FormBuilder.css      # Form builder styles
│   └── Captcha.css          # Captcha component styles
└── App.js                   # Main application component
```

## Key Components

### Authentication System
- Dual login interface for students and faculty
- Email validation for students
- Captcha verification for security
- Session management with user profiles

### Feedback Collection
- Multi-step form interface with progress tracking
- Support for rating scales (1-5), yes/no questions, and multiple choice
- Response validation and review system
- Automatic form completion tracking

### Analytics & Reporting
- Real-time feedback aggregation
- Course-wise rating analysis
- Student participation tracking
- Visual data representation with charts

### Form Management
- Dynamic form builder for creating custom surveys
- Question type selection (rating, yes/no, multiple choice)
- Form assignment to courses and instructors
- Form lifecycle management

## Data Structure

The system uses a JSON-based data structure with:
- **Courses**: Feedback data organized by course name
- **Pending Forms**: Active feedback forms awaiting responses
- **Completed Forms**: Historical feedback submissions
- **User Profiles**: Student and faculty information

## Customization

The system is designed to be easily customizable:
- Modify question types in FormBuilder component
- Adjust styling through CSS files
- Extend data structure in feedback-data.json
- Add new dashboard features in respective components

## Future Enhancements

- Database integration for persistent data storage
- Advanced analytics with trend analysis
- Email notifications for pending feedback
- Export functionality for reports
- Mobile-responsive design improvements
- Multi-language support

## License

This project is created for educational purposes and institutional use.