import axios from 'axios';

// Fetch data from BandsInTown API
export async function fetchBandsInTown(endpoint, id, params) {
	const url = import.meta.env.VITE_BANDSINTOWN_API_URL;
	const app_id = import.meta.env.VITE_BANDSINTOWN_APP_ID;
	const apiParams = {
		app_id,
		...params,
	};

	return await axios
		.get(`${url}${endpoint}`, { params: apiParams })
		.then((response) => {
			if (response.data === '') {
				return {
					totalHits: 0,
					totalRecords: [],
				};
			}

			return {
				totalHits: Array.isArray(response.data) ? response.data.length : 1,
				totalRecords: Array.isArray(response.data) ? response.data : [response.data],
			};
		})
		.catch((error) => {
			if (error.response?.data?.error) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}