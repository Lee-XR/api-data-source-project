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
			if (error.response) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}

async function compareRecords() {
	alert('No function added yet');
}

async function saveToDatabase() {
	alert('No function added yet');
}

export { mapFields, compareRecords, saveToDatabase };
