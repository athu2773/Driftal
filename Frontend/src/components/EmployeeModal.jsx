import React from 'react';

export default function EmployeeModal({ employee, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg min-w-[350px] shadow-lg">
        <h2 className="text-2xl font-bold mb-2">{employee.name}</h2>
        <p className="mb-1"><b>Email:</b> {employee.email}</p>
        <p className="mb-1"><b>Role:</b> {employee.role}</p>
        <p className="mb-1"><b>Status:</b> <span className={employee.assessment_submitted ? 'text-green-600' : 'text-red-600'}>{employee.assessment_submitted ? 'Submitted' : 'Not Submitted'}</span></p>
        <p className="mb-2"><b>Tags:</b> {employee.tags ? employee.tags.join(', ') : ''}</p>
        <h3 className="font-semibold mt-4 mb-2">Assessment Answers</h3>
        <ol className="list-decimal ml-6 mb-4">
          {employee.assessment_answers && Object.entries(employee.assessment_answers).map(([q, ans]) => (
            <li key={q}><b>{q}:</b> {ans}</li>
          ))}
        </ol>
        <button className="btn btn-sm btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}