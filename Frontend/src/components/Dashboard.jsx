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
    fetchEmployees({ ...filters, search, sort: `${sort.field}:${sort.order}` })
      .then(res => setEmployees(res.data ? res.data.data : []));
  }, [filters, reload, search, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <FilterPanel setFilters={setFilters} />
        <input
          type="text"
          placeholder="Search by name, email, or keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-64"
        />
        <select
          value={sort.field}
          onChange={e => setSort(s => ({ ...s, field: e.target.value }))}
          className="select select-bordered"
        >
          <option value="name">Name</option>
          <option value="submission_date">Submission Date</option>
          <option value="learning_score">Learning Attitude Score</option>
        </select>
        <select
          value={sort.order}
          onChange={e => setSort(s => ({ ...s, order: e.target.value }))}
          className="select select-bordered"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <AddEditForm onSuccess={() => setReload(r => !r)} />
      <EmployeeTable employees={employees} onChange={() => setReload(r => !r)} />
    </div>
  );
}