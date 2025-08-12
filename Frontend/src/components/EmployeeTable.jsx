import React, { useState } from 'react';
import EmployeeModal from './EmployeeModal';

export default function EmployeeTable({ employees }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full mt-4 border border-gray-200 rounded-lg shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Tags/Highlights</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.length ? employees.map(emp => (
            <tr key={emp._id || emp.id} className="hover:bg-blue-50">
              <td className="px-4 py-2">{emp.name}</td>
              <td className="px-4 py-2">{emp.role}</td>
              <td className="px-4 py-2">{emp.email}</td>
              <td className="px-4 py-2">
                {emp.status ? (
                  <span className="font-semibold">
                    {emp.status}
                  </span>
                ) : (
                  <span className={emp.assessment_submitted ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {emp.assessment_submitted ? 'Submitted' : 'Not Submitted'}
                  </span>
                )}
              </td>
              <td className="px-4 py-2">{emp.tags ? emp.tags.join(', ') : ''}</td>
              <td className="px-4 py-2">
                <button className="btn btn-sm btn-primary" onClick={() => setSelected(emp)}>View</button>
              </td>
            </tr>
          )) : <tr><td colSpan={6} className="text-center py-4">No employees found.</td></tr>}
        </tbody>
      </table>
      {selected && (
        <EmployeeModal employee={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}