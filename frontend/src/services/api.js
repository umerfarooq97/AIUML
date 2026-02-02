/**
 * API Service for backend communication
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request:', config.url, 'Token:', token ? 'Present' : 'Missing');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (email, password) => {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Diagram API
export const diagramAPI = {
    generate: async (prompt, diagramType = null) => {
        const response = await api.post('/diagrams/generate', {
            prompt,
            diagram_type: diagramType,
        });
        return response.data;
    },

    save: async (prompt, title, mermaidCode, diagramType) => {
        const response = await api.post('/diagrams/save', {
            prompt,
            title,
            mermaid_code: mermaidCode,
            diagram_type: diagramType,
        });
        return response.data;
    },

    list: async (page = 1, pageSize = 20) => {
        const response = await api.get(`/diagrams/?page=${page}&page_size=${pageSize}`);
        return response.data;
    },

    get: async (diagramId) => {
        const response = await api.get(`/diagrams/${diagramId}`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/diagrams/${id}`);
        return response.data;
    },
};

export const adminAPI = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getUsers: async (skip = 0, limit = 100) => {
        const response = await api.get(`/admin/users?skip=${skip}&limit=${limit}`);
        return response.data;
    },
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }
};

export default api;
