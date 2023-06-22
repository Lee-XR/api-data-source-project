import { dataProcessInstance } from '../configs/axiosConfig';
import { downloadFile } from '../utils/fileUtils';

async function mapFields(apiName, records) {
	return await dataProcessInstance
		.post(`/mapping/${apiName}`, records)
		.then((response) => {
            const csvData = new Blob([response.data]);
			downloadFile(csvData, 'mapped-fields.csv');
			return;
		})
		.catch((error) => {
			if (error.response) {
                throw new Error(error.response.data.error)
			} else {
                throw new Error(error.message);
			}
		});
}

async function downloadCsv() {}

async function saveToDatabase() {}

export { mapFields, downloadCsv, saveToDatabase };
