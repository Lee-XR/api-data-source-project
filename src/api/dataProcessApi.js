import { dataProcessInstance } from '../configs/axiosConfig';

async function mapFields(apiName, records, abortSignal) {
	return await dataProcessInstance
		.post(`/mapping/${apiName}`, records, { signal: abortSignal })
		.then((response) => {
			if (response.data) {
				return {
					successMsg: 'Records mapped successfully.',
					mappedCsv: response.data.mappedCsv,
					mappedCount: response.data.mappedCount
				};
			}

			throw new Error('No response found');
		})
		.catch((error) => {
			if (error.response?.data?.error) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}

async function matchRecords(apiName, csvString, abortSignal) {
	return await dataProcessInstance
		.post(`/matching/${apiName}`, csvString, { signal: abortSignal })
		.then((response) => {
			if (response.data) {
				return {
					successMsg: 'Records matched successfully.',
					zeroMatchCsv: response.data.zeroMatchCsv,
					zeroMatchCount: response.data.zeroMatchCount,
					hasMatchCsv: response.data.hasMatchCsv,
					hasMatchCount: response.data.hasMatchCount,
				};
			}

			throw new Error('No response found');
		})
		.catch((error) => {
			if (error.response?.data?.error) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}

export { mapFields, matchRecords };
