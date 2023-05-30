import axios from 'axios';

// Instance connect to Skiddle API
async function fetchSkiddle(endpoint, params) {
	const baseUrl = 'https://www.skiddle.com/api/v1/';
	const api_key = '795164c8536dbac9f1147fce29672a54';
	const parameters = new URLSearchParams(params);
	parameters.append('api_key', api_key);

	return await axios
		.get(`${baseUrl}${endpoint}`, {
			params: parameters,
		})
		.then((response) => response.data);

	// const instance = axios.create({
	// 	baseURL: baseUrl,
	// 	method: 'GET',
	// 	params: parameters,
	// });
	// return await instance.get(endpoint).then((response) => response.data);

    // const response = await fetch(`${baseUrl}${endpoint}/?${parameters.toString()}`, {
    //     method: 'GET'
    // });
    // return await response.json();
}

// Instance connect to DataThistle API
function dataThistleInstance() {}

// Instance connect to BandsInTown API
function bandsInTownInstance() {}

export { fetchSkiddle, dataThistleInstance, bandsInTownInstance };
