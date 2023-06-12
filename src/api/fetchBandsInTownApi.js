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
				console.log('empty');
				return {
					totalHits: 0,
					records: [],
				};
			}

			return {
				totalHits: Array.isArray(response.data) ? response.data.length : 1,
				records: Array.isArray(response.data) ? response.data : [response.data],
			};
		})
		.catch((error) => {
			let errorMsg = '';
			if (error.response) {
				errorMsg = error.response.data.error;
			} else {
				errorMsg = error.message;
			}
			return { error: errorMsg };
		});
}