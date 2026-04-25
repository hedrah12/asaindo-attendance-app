import api from './client';

export const authService = {
    login: async (email, password, device_id, push_token = null) => {
        const response = await api.post('/login', { email, password, device_id, push_token });
        return response.data;
    },
    logout: async () => {
        await api.post('/logout');
    },
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },
    updatePushToken: async (push_token) => {
        const response = await api.post('/update-push-token', { push_token });
        return response.data;
    }
};

export const attendanceService = {
    getSummary: async () => {
        const response = await api.get('/attendance/summary');
        return response.data;
    },
    getHistory: async () => {
        const response = await api.get('/attendance/history');
        return response.data;
    },
    checkIn: async (data) => {
        const response = await api.post('/attendance/check-in', data);
        return response.data;
    },
    checkOut: async (data) => {
        const response = await api.post('/attendance/check-out', data);
        return response.data;
    },
    getLeaveRequests: async () => {
        const response = await api.get('/leave-requests');
        return response.data;
    },
    submitLeaveRequest: async (formData) => {
        const response = await api.post('/leave-requests', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    overtimeCheckIn: async (data) => {
        const response = await api.post('/overtime/check-in', data);
        return response.data;
    },
    overtimeCheckOut: async (data) => {
        const response = await api.post('/overtime/check-out', data);
        return response.data;
    },
    searchEmployees: async (query) => {
        const response = await api.get('/employees/search', { params: { query } });
        return response.data;
    },
    submitManualAttendance: async (data) => {
        const response = await api.post('/attendance/manual', data);
        return response.data;
    }
};
