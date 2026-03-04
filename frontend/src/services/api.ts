import axios from 'axios';

const getBaseURL = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (!url.endsWith('/api')) {
        url = `${url.replace(/\/$/, '')}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true, // Send/receive HTTP-only cookies automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — relies on automatic withCredentials for cookies
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor — auto-logout and redirect on expired/invalid session
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[Auth] Session expired or invalid — clearing session and redirecting to login.');
            if (typeof window !== 'undefined') {
                // Clear all auth related storage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('auth-storage');

                // Do not redirect if already on login page to avoid loops
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login?session_expired=true';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
