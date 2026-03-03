import axios from 'axios';

const getBaseURL = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Ensure the URL ends with /api
    if (!url.endsWith('/api')) {
        url = `${url.replace(/\/$/, '')}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only clear if it's an auth error, not if it's a "User not found" which might be 404
            console.warn('Unauthorized request detected. Clearing auth state.');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                // We don't want to force refresh here as it might loop, 
                // but components using useAuth will react to the missing token if synced
            }
        }
        return Promise.reject(error);
    }
);

export default api;
