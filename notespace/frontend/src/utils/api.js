import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('notespace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('notespace_token');
      localStorage.removeItem('notespace_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Notes
export const getNotes = (params) => API.get('/notes', { params });
export const getPinnedNotes = () => API.get('/notes/pinned');
export const getTrashedNotes = () => API.get('/notes/trash');
export const getNote = (id) => API.get(`/notes/${id}`);
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const togglePin = (id) => API.patch(`/notes/${id}/pin`);
export const trashNote = (id) => API.patch(`/notes/${id}/trash`);
export const restoreNote = (id) => API.patch(`/notes/${id}/restore`);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const emptyTrash = () => API.delete('/notes/trash/empty');

export default API;
