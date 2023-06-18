import axios from 'axios';

export const skiddleInstance = axios.create({
    baseURL: 
        import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_SKIDDLE_SDK_URL_PROD
            : import.meta.env.VITE_SKIDDLE_SDK_URL_DEV,
    headers: {
        'Content-Type': "application/json"
    }
});

export const bandsintownInstance = axios.create({
    baseURL: import.meta.env.VITE_BANDSINTOWN_API_URL,
    headers: {
        'Content-Type': "application/json"
    }
});

export const dataProcessInstance = axios.create({
    baseURL: 
        import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_BACKEND_BASE_URL_PROD
            : import.meta.env.VITE_BACKEND_BASE_URL_DEV,
    headers: {
        'Content-Type': "application/json"
    }
});
