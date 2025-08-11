import React, { useState } from 'react';

const initial = {
  assessment_submitted: '',
  role: '',
  interest: '',
  goal: '',
  culture: '',
  learning: '',
};

export default function FilterPanel({ setFilters }) {
  const [local, setLocal] = useState(initial);

  const handleChange = e => {
    const { name, value } = e.target;
    setLocal(l => ({ ...l, [name]: value }));
    setFilters(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <select name="assessment_submitted" value={local.assessment_submitted} onChange={handleChange} className="select select-bordered">
        <option value="">All</option>
        <option value="true">Submitted</option>
        <option value="false">Not Submitted</option>
      </select>
      <input name="role" value={local.role} onChange={handleChange} placeholder="Role" className="input input-bordered w-32" />
      <select name="interest" value={local.interest} onChange={handleChange} className="select select-bordered">
        <option value="">Interest Area</option>
        <option value="AI Enthusiast">AI Enthusiast</option>
        <option value="HR-Tech Passionate">HR-Tech Passionate</option>
        <option value="Looking to explore">Looking to explore</option>
      </select>
      <select name="goal" value={local.goal} onChange={handleChange} className="select select-bordered">
        <option value="">Long-Term Goal</option>
        <option value="Career-focused">Career-focused</option>
        <option value="Entrepreneurial">Entrepreneurial</option>
        <option value="Technically inclined">Technically inclined</option>
        <option value="Unclear/Exploring">Unclear/Exploring</option>
      </select>
      <select name="culture" value={local.culture} onChange={handleChange} className="select select-bordered">
        <option value="">Work Culture</option>
        <option value="Prefers healthy culture">Prefers healthy culture</option>
        <option value="Salary-driven">Salary-driven</option>
      </select>
      <select name="learning" value={local.learning} onChange={handleChange} className="select select-bordered">
        <option value="">Learning Attitude</option>
        <option value="Active Learner">Active Learner</option>
        <option value="Passive/No recent skill added">Passive/No recent skill added</option>
      </select>
    </div>
  );
}