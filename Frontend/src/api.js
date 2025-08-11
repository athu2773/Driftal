const API_URL = 'http://localhost:5000'; 

export async function fetchEmployees(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/employees?${query}`);
  return await res.json();
}

export async function fetchEmployee(id) {
  const res = await fetch(`${API_URL}/employees/${id}`);
  return await res.json();
}

export async function addEmployee(data) {
  const res = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateEmployee(id, data) {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function exportCSV(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/employees/export/csv?${query}`, {
    responseType: 'blob',
  });
  return await res.blob();
}