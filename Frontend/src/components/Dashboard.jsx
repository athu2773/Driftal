import React, { useEffect, useState } from 'react';
import { fetchEmployees } from '../api';
import FilterPanel from './FilterPanel';
import EmployeeTable from './EmployeeTable';
import AddEditForm from './AddEditForm';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });

  useEffect(() => {
    const filterKeyMap = {
      assessment_submitted: 'assessmentSubmitted',
      role: 'role',
      interest: 'interestArea',
      goal: 'longTermGoal',
      culture: 'workCulture',
      learning: 'learningAttitude',
    };

    const mappedFilters = Object.fromEntries(
      Object.entries(filters).map(([k, v]) => [filterKeyMap[k] || k, v])
    );

    fetchEmployees({ ...mappedFilters, search, sort: `${sort.field}:${sort.order}` })
      .then(res => setEmployees(res.data || []));
  }, [filters, reload, search, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-8 text-center drop-shadow-lg tracking-tight animate-pulse">Employee Dashboard</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-white/80 rounded-xl shadow-lg p-4 border border-blue-100 backdrop-blur-md">
          <FilterPanel setFilters={setFilters} />
          <input
            type="text"
            placeholder="Search by name, email, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input input-bordered w-64 focus:ring-2 focus:ring-pink-400 transition-all duration-200 shadow-sm"
          />
          <select
            value={sort.field}
            onChange={e => setSort(s => ({ ...s, field: e.target.value }))}
            className="select select-bordered focus:ring-2 focus:ring-blue-400"
          >
            <option value="name">Name</option>
            <option value="submission_date">Submission Date</option>
            <option value="learning_score">Learning Attitude Score</option>
          </select>
          <select
            value={sort.order}
            onChange={e => setSort(s => ({ ...s, order: e.target.value }))}
            className="select select-bordered focus:ring-2 focus:ring-purple-400"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all duration-300">
            <AddEditForm onSuccess={() => setReload(r => !r)} />
          </div>
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-pink-100 hover:shadow-2xl transition-all duration-300">
            <EmployeeTable employees={employees} onChange={() => setReload(r => !r)} />
          </div>
        </div>
      </div>
    </div>
  );
}