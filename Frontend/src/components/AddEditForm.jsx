import React, { useState } from 'react';
import { addEmployee } from '../api';

const initial = {
  name: '', email: '', role: '', assessment_submitted: false,
  assessment_answers: { q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '', q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: '' },
  tags: [],
};

export default function AddEditForm({ onSuccess }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, checked } = e.target;
    if (name.startsWith('q')) {
      setForm(f => ({ ...f, assessment_answers: { ...f.assessment_answers, [name]: value } }));
    } else if (name === 'assessment_submitted') {
      setForm(f => ({ ...f, assessment_submitted: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await addEmployee(form);
    setForm(initial);
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 border border-gray-200 rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Add Employee</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="input input-bordered w-40" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="input input-bordered w-40" />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Role" required className="input input-bordered w-40" />
        <label className="flex items-center gap-1">
          <input type="checkbox" name="assessment_submitted" checked={form.assessment_submitted} onChange={handleChange} className="checkbox" />
          Assessment Submitted
        </label>
      </div>
      <div>
        <h4 className="font-medium mb-1">Assessment Answers</h4>
        <div className="flex flex-wrap gap-2">
          {Object.keys(form.assessment_answers).map(q => (
            <input
              key={q}
              name={q}
              value={form.assessment_answers[q]}
              onChange={handleChange}
              placeholder={q.toUpperCase()}
              className="input input-bordered w-24"
            />
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary mt-3">{loading ? 'Adding...' : 'Add Employee'}</button>
    </form>
  );
}