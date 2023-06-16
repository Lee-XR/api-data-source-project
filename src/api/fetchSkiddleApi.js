import axios from 'axios';

const instance = axios.create({
	baseURL:
		import.meta.env.MODE === 'production'
			? import.meta.env.VITE_BACKEND_BASE_URL_PROD
			: import.meta.env.VITE_BACKEND_BASE_URL_DEV,
});

// Single fetch promise for Skiddle API
export async function fetchSkiddle(type, id, params) {
	return await instance
		.post('api/skiddle', { type, id, params })
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}
