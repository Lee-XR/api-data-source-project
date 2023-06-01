import axios from 'axios';

// Instance connect to Skiddle API
async function fetchSkiddle(type, id, params) {
	const url =
		import.meta.env.MODE === 'production'
			? import.meta.env.VITE_SKIDDLE_SDK_PROD_URL
			: import.meta.env.VITE_SKIDDLE_SDK_DEV_URL;
	return await axios
		.post(url, {
			type,
			id,
			params,
		})
		.then((response) => {
			return {
				totalHits: response.data.totalcount,
				records: response.data.results,
			};
		})
		.catch((error) => {
			return error.response;
		});
}

// Instance connect to DataThistle API
function fetchDataThistle() {}

// Instance connect to BandsInTown API
function fetchBandsInTown() {}

export { fetchSkiddle, fetchDataThistle, fetchBandsInTown };
