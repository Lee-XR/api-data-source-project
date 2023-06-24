import { dataProcessInstance } from '../configs/axiosConfig';

async function mapFields(apiName, records) {
	return await dataProcessInstance
		.post(`/mapping/${apiName}`, records)
		.then((response) => {
			if (response.data) {
				return {
					successMsg: 'Records mapped successfully.',
					csvString: response.data,
				};
			}

			throw new Error('No response found');
		})
		.catch((error) => {
			if (error.response.data.error) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}

async function matchRecords(apiName, csvString) {
	return await dataProcessInstance
		.post(`/matching/${apiName}`, csvString)
		.then((response) => {
			if (response.data) {
				return {
					successMsg: 'Records matched successfully.',
				};
			}

			throw new Error('No response found');
		})
		.catch((error) => {
			console.log(error);
			if (error.response.data.error) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}

async function saveToDatabase() {
	alert('No function added yet');
}

export { mapFields, matchRecords, saveToDatabase };
