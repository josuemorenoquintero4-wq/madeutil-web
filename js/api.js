/* ==============================================
   MADE UTIL — API CLIENT v3.0
   Frontend API communication layer
   ============================================== */

// Definición unificada de API_BASE
const API_BASE = (() => {
    const hostname = window.location.hostname;
    
    // Si estamos en localhost usar puerto 3001 si aplica, sino usar ruta relativa para todo (Render/Vercel)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const port = window.location.port;
        if (port === '3001') {
            return '';
        }
        return 'http://localhost:3001';
    }
    
    // En producción (Render), utilizar la misma URL
    return '';
})();

const API = {
    // ==================== GENERIC FETCH ====================
    async request(endpoint, options = {}) {
        const url = `${API_BASE}/api${endpoint}`;
        const config = {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Send cookies
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error.message);
            throw error;
        }
    },

    // ==================== AUTH ====================
    auth: {
        async login(username, password) {
            return API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
        },
        async logout() {
            return API.request('/auth/logout', { method: 'POST' });
        },
        async me() {
            return API.request('/auth/me');
        },
        async changePassword(currentPassword, newPassword) {
            return API.request('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword })
            });
        },
        async getWorkers() {
            return API.request('/auth/workers');
        },
        async getAllWorkers() {
            return API.request('/auth/workers/all');
        },
        async createWorker(data) {
            return API.request('/auth/workers', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async updateWorker(id, data) {
            return API.request(`/auth/workers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        async deleteWorker(id) {
            return API.request(`/auth/workers/${id}`, { method: 'DELETE' });
        }
    },

    // ==================== PROJECTS ====================
    projects: {
        async getAll(filters = {}) {
            const params = new URLSearchParams(filters).toString();
            return API.request(`/projects${params ? '?' + params : ''}`);
        },
        async getPublic(category) {
            const params = category ? `?category=${category}` : '';
            return API.request(`/projects/public${params}`);
        },
        async getOne(id) {
            return API.request(`/projects/${id}`);
        },
        async create(data) {
            return API.request('/projects', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async update(id, data) {
            return API.request(`/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        async delete(id) {
            return API.request(`/projects/${id}`, { method: 'DELETE' });
        },
        async toggleFeatured(id) {
            return API.request(`/projects/${id}/toggle-featured`, { method: 'PUT' });
        }
    },

    // ==================== LEADS ====================
    leads: {
        async getAll(filters = {}) {
            const params = new URLSearchParams(filters).toString();
            return API.request(`/leads${params ? '?' + params : ''}`);
        },
        async getStats() {
            return API.request('/leads/stats');
        },
        async getOne(id) {
            return API.request(`/leads/${id}`);
        },
        async create(data) {
            return API.request('/leads', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async updateStatus(id, estado) {
            return API.request(`/leads/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ estado })
            });
        },
        async assign(id, assigned_to) {
            return API.request(`/leads/${id}/assign`, {
                method: 'PUT',
                body: JSON.stringify({ assigned_to })
            });
        },
        async updateNotes(id, notes) {
            return API.request(`/leads/${id}/notes`, {
                method: 'PUT',
                body: JSON.stringify({ notes })
            });
        },
        async updateStep(id, step) {
            return API.request(`/leads/${id}/step`, {
                method: 'PUT',
                body: JSON.stringify({ step })
            });
        },
        async delete(id) {
            return API.request(`/leads/${id}`, { method: 'DELETE' });
        }
    },

    // ==================== CLIENTS ====================
    clients: {
        async getAll(filters = {}) {
            const params = new URLSearchParams(filters).toString();
            return API.request(`/clients${params ? '?' + params : ''}`);
        },
        async getOne(id) {
            return API.request(`/clients/${id}`);
        },
        async create(data) {
            return API.request('/clients', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async update(id, data) {
            return API.request(`/clients/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        async delete(id) {
            return API.request(`/clients/${id}`, { method: 'DELETE' });
        }
    },

    // ==================== TASKS ====================
    tasks: {
        async getAll(filters = {}) {
            const params = new URLSearchParams(filters).toString();
            return API.request(`/tasks${params ? '?' + params : ''}`);
        },
        async getStats() {
            return API.request('/tasks/stats');
        },
        async suggestWorker(specialty, description) {
            const params = new URLSearchParams({ specialty_required: specialty || '', description: description || '' }).toString();
            return API.request(`/tasks/suggest-worker?${params}`);
        },
        async create(data) {
            return API.request('/tasks', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async update(id, data) {
            return API.request(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        async updateStatus(id, status) {
            return API.request(`/tasks/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        },
        async reassign(id, assigned_to) {
            return API.request(`/tasks/${id}/reassign`, {
                method: 'PUT',
                body: JSON.stringify({ assigned_to })
            });
        },
        async delete(id) {
            return API.request(`/tasks/${id}`, { method: 'DELETE' });
        }
    },

    // ==================== UPLOAD ====================
    upload: {
        async uploadImage(file, folder = 'projects') {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', folder);

            const url = `${API_BASE}/api/upload`;
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: formData // No Content-Type header - browser sets it with boundary
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        },
        async uploadMultiple(files, folder = 'projects') {
            const formData = new FormData();
            for (const file of files) {
                formData.append('images', file);
            }
            formData.append('folder', folder);

            const url = `${API_BASE}/api/upload/multiple`;
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
        },
        async deleteImage(filename) {
            return API.request(`/upload/${filename}`, { method: 'DELETE' });
        }
    },

    // ==================== WORKERS ====================
    workers: {
        async checkIn() {
            return API.request('/workers/check-in', { method: 'POST' });
        },
        async checkOut() {
            return API.request('/workers/check-out', { method: 'POST' });
        },
        async getTimeStatus() {
            return API.request('/workers/time-status');
        },
        async getTimeHistory(params = {}) {
            const qs = new URLSearchParams(params).toString();
            return API.request(`/workers/time-history${qs ? '?' + qs : ''}`);
        },
        async getAllTimeToday() {
            return API.request('/workers/all-time-today');
        },
        async getMaterials(type) {
            const params = type ? `?type=${type}` : '';
            return API.request(`/workers/materials${params}`);
        },
        async createMaterial(data) {
            return API.request('/workers/materials', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        async updateMaterial(id, data) {
            return API.request(`/workers/materials/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        async getActivity(limit = 50) {
            return API.request(`/workers/activity?limit=${limit}`);
        },
        async getDashboard() {
            return API.request('/workers/dashboard');
        }
    }
};

// Make globally available
window.API = API;
