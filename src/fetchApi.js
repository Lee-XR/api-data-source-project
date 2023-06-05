import axios from 'axios';

// Instance connect to Skiddle API
async function fetchSkiddle(type, id, params) {
	const url =
		import.meta.env.MODE === 'production'
			? import.meta.env.VITE_SKIDDLE_SDK_PROD_URL
			: import.meta.env.VITE_SKIDDLE_SDK_DEV_URL;
	const data = { type, id, params };

	return await axios
		.post(url, data)
		.then((response) => {
			return {
				totalHits: response.data.totalcount || 0,
				records: response.data.results || [],
			};
		})
		.catch((error) => {
			let errorMsg = '';
			if (error.response) {
				errorMsg = error.response.data.error;
			} else {
				errorMsg = error.message;
			}
			return { error: errorMsg};
		});
}

// Instance connect to DataThistle API
function fetchDataThistle() {}

// Instance connect to BandsInTown API
async function fetchBandsInTown(endpoint, id, params) {
	const url = import.meta.env.VITE_BANDSINTOWN_API_URL;
	const app_id = import.meta.env.VITE_BANDSINTOWN_APP_ID;
	const apiParams = {
		app_id,
		...params
	}

	return await axios.get(`${url}${endpoint}`, { params: apiParams })
		.then((response) => {
			if (response.data === '') {
				console.log('empty');
				return {
					totalHits: 0,
					records: []
				}
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
			return { error: errorMsg};
		})
}

export { fetchSkiddle, fetchDataThistle, fetchBandsInTown };
