// Simple data manager to handle feedback submissions and analytics
class DataManager {
  constructor() {
    this.init();
  }

  async init() {
    this.feedbackData = await this.loadData();
  }

  async loadData() {
    const stored = localStorage.getItem('feedbackSystemData');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Load initial data from feedback-data.json
    try {
      const response = await fetch('/src/data/feedback-data.json');
      const data = await response.json();
      return data;
    } catch (error) {
      // Fallback data if file can't be loaded
      return {
        courses: {
          "Mathematics": [
            { question: "Rate the overall teaching quality", average: 4.2, responses: ["5 - Excellent", "4 - Very Good", "5 - Excellent", "3 - Good", "4 - Very Good"] },
            { question: "Were course materials helpful", average: 4.5, responses: ["5 - Excellent", "5 - Excellent", "4 - Very Good", "4 - Very Good", "5 - Excellent"] },
            { question: "Clarity of explanations by instructor", average: 4.0, responses: ["4 - Very Good", "3 - Good", "5 - Excellent", "4 - Very Good", "4 - Very Good"] },
            { question: "Was the course pace appropriate", average: 3.8, responses: ["Yes", "No", "Yes", "Yes", "No"] },
            { question: "Overall satisfaction with course", average: 4.3, responses: ["5 - Excellent", "4 - Very Good", "4 - Very Good", "5 - Excellent", "3 - Good"] }
          ],
          "Computer Science": [
            { question: "Effectiveness of lab sessions", average: 4.0, responses: ["4 - Very Good", "4 - Very Good", "5 - Excellent", "3 - Good", "4 - Very Good"] },
            { question: "Well-designed assignments", average: 4.2, responses: ["Yes", "Yes", "Yes", "No", "Yes"] },
            { question: "Clarity of theoretical concepts", average: 3.9, responses: ["4 - Very Good", "3 - Good", "4 - Very Good", "4 - Very Good", "5 - Excellent"] },
            { question: "Satisfied with assignment feedback", average: 3.7, responses: ["Yes", "No", "Yes", "Yes", "No"] }
          ],
          "Physics": [
            { question: "Quality of lab instructions", average: 4.1, responses: ["4 - Very Good", "5 - Excellent", "3 - Good", "4 - Very Good"] },
            { question: "Experiments relevant to theory", average: 4.3, responses: ["Yes", "Yes", "Yes", "No"] },
            { question: "Lab timing sufficient for experiments", average: 3.5, responses: ["No", "Yes", "Yes", "No"] },
            { question: "Instructor responsiveness to questions", average: 4.5, responses: ["5 - Excellent", "4 - Very Good", "5 - Excellent", "4 - Very Good"] }
          ],
          "English": [
            { question: "Communication skills improvement", average: 4.0, responses: ["4 - Very Good", "4 - Very Good", "5 - Excellent"] },
            { question: "Course content relevance", average: 3.8, responses: ["3 - Good", "4 - Very Good", "4 - Very Good"] }
          ],
          "Chemistry": [
            { question: "Lab safety measures", average: 3.8, responses: ["3 - Good", "4 - Very Good", "4 - Very Good"] },
            { question: "Equipment quality", average: 4.2, responses: ["4 - Very Good", "5 - Excellent", "4 - Very Good"] }
          ],
          "Biology": [
            { question: "Microscopy lab sessions", average: 4.4, responses: ["5 - Excellent", "4 - Very Good", "4 - Very Good", "5 - Excellent"] },
            { question: "Field study organization", average: 4.1, responses: ["Yes", "Yes", "No", "Yes"] },
            { question: "Specimen quality for practicals", average: 3.9, responses: ["4 - Very Good", "3 - Good", "4 - Very Good", "4 - Very Good"] }
          ],
          "History": [
            { question: "Research methodology teaching", average: 4.0, responses: ["4 - Very Good", "4 - Very Good", "5 - Excellent"] },
            { question: "Primary source analysis skills", average: 4.3, responses: ["Yes", "Yes", "Yes"] },
            { question: "Discussion sessions effectiveness", average: 3.7, responses: ["3 - Good", "4 - Very Good", "4 - Very Good"] }
          ],

        },
        pendingForms: [
          {
            id: 1,
            title: "Mathematics - Calculus I",
            description: "Evaluate your Calculus I learning experience",
            date: "Due: Dec 15, 2025",
            course: "MATH101",
            instructor: "Dr. Smith",
            questions: [
              { id: 1, text: "Rate the overall teaching quality", type: "rating" },
              { id: 2, text: "Were course materials helpful", type: "rating" },
              { id: 3, text: "Clarity of explanations by instructor", type: "rating" },
              { id: 4, text: "Was the course pace appropriate", type: "yesno" },
              { id: 5, text: "Overall satisfaction with course", type: "rating" }
            ]
          },
          {
            id: 2,
            title: "Computer Science - Data Structures",
            description: "Feedback on lab sessions and programming assignments",
            date: "Due: Dec 18, 2025",
            course: "CS202",
            instructor: "Prof. Johnson",
            questions: [
              { id: 1, text: "Effectiveness of lab sessions", type: "rating" },
              { id: 2, text: "Well-designed assignments", type: "yesno" },
              { id: 3, text: "Clarity of theoretical concepts", type: "rating" },
              { id: 4, text: "Satisfied with assignment feedback", type: "yesno" }
            ]
          },
          {
            id: 3,
            title: "Physics - Mechanics Lab",
            description: "Share your lab experiment experience",
            date: "Due: Dec 20, 2025",
            course: "PHY105",
            instructor: "Dr. Brown",
            questions: [
              { id: 1, text: "Quality of lab instructions", type: "rating" },
              { id: 2, text: "Experiments relevant to theory", type: "yesno" },
              { id: 3, text: "Lab timing sufficient for experiments", type: "yesno" },
              { id: 4, text: "Instructor responsiveness to questions", type: "rating" }
            ]
          }
        ],
        completedForms: [
          {
            id: 4,
            title: "English Communication Skills",
            description: "Language lab and communication feedback",
            date: "Completed: Nov 28, 2025",
            course: "ENG101",
            instructor: "Dr. Wilson",
            status: "completed"
          }
        ]
      };
    }
  }

  saveData() {
    localStorage.setItem('feedbackSystemData', JSON.stringify(this.feedbackData));
  }

  submitFeedback(formId, responses) {
    const form = this.feedbackData.pendingForms.find(f => f.id === formId);
    if (!form) return;

    // Extract course name from title
    const courseName = form.title.split(' - ')[0];
    
    // Initialize course data if not exists
    if (!this.feedbackData.courses[courseName]) {
      this.feedbackData.courses[courseName] = form.questions.map(q => ({
        question: q.text,
        responses: [],
        average: 0
      }));
    }

    // Add responses to course data
    form.questions.forEach((question, index) => {
      const response = responses[question.id];
      if (response !== undefined) {
        const courseQuestion = this.feedbackData.courses[courseName][index];
        
        if (question.type === 'rating') {
          // Convert rating text back to number for average calculation
          const ratingValue = typeof response === 'number' ? response : parseInt(response);
          courseQuestion.responses.push(`${ratingValue} - ${this.getRatingText(ratingValue)}`);
          
          // Recalculate average
          const numericResponses = courseQuestion.responses
            .map(r => parseInt(r.split(' - ')[0]))
            .filter(n => !isNaN(n));
          courseQuestion.average = numericResponses.length > 0 
            ? numericResponses.reduce((sum, val) => sum + val, 0) / numericResponses.length 
            : 0;
        } else {
          // Yes/No responses
          courseQuestion.responses.push(response);
          // For yes/no, calculate percentage of "Yes" responses
          const yesCount = courseQuestion.responses.filter(r => r === 'Yes').length;
          courseQuestion.average = courseQuestion.responses.length > 0 
            ? (yesCount / courseQuestion.responses.length) * 5 
            : 0;
        }
      }
    });

    // Move form from pending to completed
    this.feedbackData.pendingForms = this.feedbackData.pendingForms.filter(f => f.id !== formId);
    this.feedbackData.completedForms.push({
      ...form,
      status: 'completed',
      date: `Completed: ${new Date().toLocaleDateString()}`
    });

    this.saveData();
  }

  getRatingText(rating) {
    const texts = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return texts[rating] || 'Unknown';
  }

  addForm(newForm) {
    newForm.id = Date.now();
    this.feedbackData.pendingForms.push(newForm);
    this.saveData();
  }

  updateForm(formId, updatedForm) {
    const index = this.feedbackData.pendingForms.findIndex(f => f.id === formId);
    if (index !== -1) {
      this.feedbackData.pendingForms[index] = { ...updatedForm, id: formId };
      this.saveData();
    }
  }

  deleteForm(formId) {
    this.feedbackData.pendingForms = this.feedbackData.pendingForms.filter(f => f.id !== formId);
    this.saveData();
  }

  getData() {
    return this.feedbackData;
  }
}

export default new DataManager();