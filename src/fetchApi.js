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
				records: response.data.results || {},
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
function fetchBandsInTown() {}

export { fetchSkiddle, fetchDataThistle, fetchBandsInTown };
