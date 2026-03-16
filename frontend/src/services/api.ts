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
    headers: {},
});

// Local variable to store token and avoid circular dependencies with useAuth
let authToken: string | null = null;

/**
 * Synchronize the auth token from the store to the API service.
 * This avoids circular dependency issues.
 */
export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// Request interceptor — relies on automatic withCredentials for cookies, but adds header as fallback
api.interceptors.request.use(
    (config) => {
        if (authToken && authToken !== 'undefined') {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — auto-logout and redirect on expired/invalid session
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn('[Auth] Session expired or invalid — clearing session and redirecting to login.');
            if (typeof window !== 'undefined') {
                try {
                    // Clear the IndexedDB storage used by Zustand
                    const { del } = await import('idb-keyval');
                    await del('auth-storage-v2');
                    setAuthToken(null);

                    // Do not redirect if already on login page to avoid loops
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login?session_expired=true';
                    }
                } catch (err) {
                    console.error('[Auth] Failed to clear session storage:', err);
                }
            }
        }
        return Promise.reject(error);
    }
);


export default api;
