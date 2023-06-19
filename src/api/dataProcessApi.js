import { dataProcessInstance } from "../configs/axiosConfig";

async function mapFields(records) {
 await dataProcessInstance.post('/process/mapping', records)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    })
}

async function downloadCsv() {

}

async function saveToDatabase() {

}

export { mapFields, downloadCsv, saveToDatabase }