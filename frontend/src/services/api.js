const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erreur HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Tasks & Jira
  getTasks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/tasks${q ? `?${q}` : ''}`);
  },
  getTaskById: (id) => request(`/tasks/${id}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  toggleSubtask: (taskId, subtaskId) =>
    request(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`, { method: 'PATCH' }),
  getActivityLogs: () => request('/tasks/logs/activity'),

  // Slots & Calendar
  getSlots: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/slots${q ? `?${q}` : ''}`);
  },
  createSlot: (data) => request('/slots', { method: 'POST', body: JSON.stringify(data) }),
  updateSlot: (id, data) => request(`/slots/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSlot: (id) => request(`/slots/${id}`, { method: 'DELETE' }),
  assignTaskToSlot: (data) =>
    request('/slots/assign-task', { method: 'POST', body: JSON.stringify(data) }),

  // Applications & Interviews
  getApplications: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/jobs${q ? `?${q}` : ''}`);
  },
  createApplication: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateApplication: (id, data) =>
    request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApplication: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  addInterview: (data) =>
    request('/jobs/interview', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getDashboardMetrics: () => request('/analytics/dashboard'),

  // AI Assistant
  detectConflicts: () => request('/ai/conflicts'),
  getWeeklySummary: () => request('/ai/summary'),
  getReminders: () => request('/ai/reminders'),
  optimizeSchedule: (apply = false) =>
    request(`/ai/optimize${apply ? '?apply=true' : ''}`, { method: 'POST' }),
  chatAI: (prompt) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ prompt }) }),

  // Notes & Docs
  getNotes: (category) => request(`/notes${category ? `?category=${category}` : ''}`),
  createNote: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (id, data) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
};
