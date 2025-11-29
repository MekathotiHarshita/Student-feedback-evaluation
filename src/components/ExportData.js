import React from 'react';

const ExportData = ({ coursesData, onClose }) => {
  const exportToCSV = () => {
    let csvContent = "Course,Question,Average Rating,Total Responses,Individual Responses\n";
    
    Object.keys(coursesData).forEach(courseName => {
      coursesData[courseName].forEach(question => {
        const responses = question.responses.join('; ');
        csvContent += `"${courseName}","${question.question}",${question.average},${question.responses.length},"${responses}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    let printContent = `
      <html>
        <head>
          <title>Feedback Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #7c3aed; }
            h2 { color: #1e293b; margin-top: 30px; }
            .course { margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
            .question { margin: 15px 0; }
            .rating { font-weight: bold; color: #7c3aed; }
            .responses { margin-left: 20px; font-size: 0.9em; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>Student Feedback Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
    `;

    Object.keys(coursesData).forEach(courseName => {
      printContent += `<div class="course"><h2>${courseName}</h2>`;
      coursesData[courseName].forEach(question => {
        printContent += `
          <div class="question">
            <strong>${question.question}</strong>
            <div class="rating">Average: ${question.average.toFixed(1)}/5 (${question.responses.length} responses)</div>
            <div class="responses">Responses: ${question.responses.join(', ')}</div>
          </div>
        `;
      });
      printContent += '</div>';
    });

    printContent += '</body></html>';
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(30, 41, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '400px', border: '2px solid #f1f5f9' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Export Feedback Data</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            onClick={exportToCSV}
            style={{ 
              padding: '12px 20px', 
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
          >
            📊 Export to CSV
          </button>
          
          <button 
            onClick={printReport}
            style={{ 
              padding: '12px 20px', 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
          >
            🖨️ Print Report
          </button>
          
          <button 
            onClick={onClose}
            style={{ 
              padding: '12px 20px', 
              background: '#e2e8f0', 
              color: '#475569', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600' 
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportData;