import { useContext } from 'react';
import { checkFileType } from '../utils/fileUtils';
import { ResultsContext } from '../contexts/ResultsContext';
import { getCsvRowCount } from '../utils/stringUtils';

function useImportInputJson() {
	const { getRecords, getTotalRecordCount } = useContext(ResultsContext);
	const [records, setRecords] = getRecords;
	const [totalRecordCount, setTotalRecordCount] = getTotalRecordCount;

	return async (jsonFile) => {
        const validFileType = 'json';
        const isValid = checkFileType(jsonFile, validFileType);
        if (!isValid) {
            throw new Error('File cannot be imported. Must be .json file only.');
        }

        await jsonFile.text()
            .then((result) => {
                const parsedResult = JSON.parse(result);
                setRecords(parsedResult);
                setTotalRecordCount(parsedResult.length);
            })
            .catch((error) => {
                throw error;
            })

		return {successMsg: `${jsonFile.name} successfully imported.`};
	};
}

function useImportMappedCsv() {
	const { getMappedCsv } = useContext(ResultsContext);
	const [mappedCsv, setMappedCsv] = getMappedCsv;

	return async (csvFile) => {
        const validFileType = 'csv';
        const isValid = checkFileType(csvFile, validFileType);
        if (!isValid) {
            throw new Error('File cannot be imported. Must be .json file only.');
        }

		await csvFile.text()
			.then((result) => {
				setMappedCsv({
					csvString: result,
					count: getCsvRowCount(result),
				});
			})
			.catch((error) => {
				throw error;
			});

		return {successMsg: `${csvFile.name} successfully imported.`};
	};
}

function useImportZeroMatchCsv() {
    const { getZeroMatchCsv } = useContext(ResultsContext);
    const [zeroMatchCsv, setZeroMatchCsv] = getZeroMatchCsv;

    return async (csvFile) => {
        const validFileType = 'csv';
        const isValid = checkFileType(csvFile, validFileType);
        if (!isValid) {
            throw new Error('File cannot be imported. Must be .csv file only.');
        }

        await csvFile.text()
            .then((result) => {
                setZeroMatchCsv({
                    csvString: result,
                    count: getCsvRowCount(result)
                });
            })
            .catch((error) => {
                throw error;
            });

        return {successMsg: `${csvFile.name} sucessfully imported.`};
    }
}

function useImportHasMatchCsv() {
    const { getHasMatchCsv } = useContext(ResultsContext);
    const [hasMatchCsv, setHasMatchCsv] = getHasMatchCsv;

    return async (csvFile) => {
        const validFileType = 'csv';
        const isValid = checkFileType(csvFile, validFileType);
        if (!isValid) {
            throw new Error('File cannot be imported. Must be .csv file only.');
        }

        await csvFile.text()
            .then((result) => {
                setHasMatchCsv({
                    csvString: result,
                    count: getCsvRowCount(result)
                });
            })
            .catch((error) => {
                throw error;
            });

        return {successMsg: `${csvFile.name} sucessfully imported.`};
    }
}

export {
	useImportInputJson,
	useImportMappedCsv,
	useImportZeroMatchCsv,
	useImportHasMatchCsv,
};
