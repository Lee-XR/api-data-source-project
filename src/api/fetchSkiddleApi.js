import axios from 'axios';

// Single fetch promise for Skiddle API
export async function singleFetchSkiddle(type, id, params) {

	return await axios
		.post('api/skiddle', {type, id, params})
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