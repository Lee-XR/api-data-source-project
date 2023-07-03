import { useContext } from 'react';
import { checkFileType } from '../utils/fileUtils';
import { getCsvRowCount } from '../utils/stringUtils';
import { LatestCsvContext } from '../contexts/LatestCsvContext';
import { ResultsContext } from '../contexts/ResultsContext';

const jsonOnlyError = new Error(
	'File cannot be imported. Must be .json file only.'
);
const csvOnlyError = new Error(
	'File cannot be imported. Must be .csv file only.'
);

function useImportLatestCsv() {
	const { setLatestCsv } = useContext(LatestCsvContext);

	return async (csvFile) => {
		const validFileType = 'csv';
		const isValid = checkFileType(csvFile, validFileType);
		if (!isValid) {
			throw csvOnlyError;
		}

		await csvFile
			.text()
			.then((result) => {
				setLatestCsv({ data: result, count: getCsvRowCount(result) });
			})
			.catch((error) => {
				throw error;
			});

		return { successMsg: `${csvFile.name} successfully imported.` };
	};
}

function useImportInputJson() {
	const { resultsDispatch } = useContext(ResultsContext);

	return async (jsonFile) => {
		const validFileType = 'json';
		const isValid = checkFileType(jsonFile, validFileType);
		if (!isValid) {
			throw jsonOnlyError;
		}

		await jsonFile
			.text()
			.then((result) => {
				const parsedResult = JSON.parse(result);
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'inputRecordsJson',
					data: parsedResult,
					count: parsedResult.length,
				});
			})
			.catch((error) => {
				throw error;
			});

		return { successMsg: `${jsonFile.name} successfully imported.` };
	};
}

function useImportMappedCsv() {
	const { resultsDispatch } = useContext(ResultsContext);

	return async (csvFile) => {
		const validFileType = 'csv';
		const isValid = checkFileType(csvFile, validFileType);
		if (!isValid) {
			throw csvOnlyError;
		}

		await csvFile
			.text()
			.then((result) => {
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'mappedCsv',
					data: result,
					count: getCsvRowCount(result),
				});
			})
			.catch((error) => {
				throw error;
			});

		return { successMsg: `${csvFile.name} successfully imported.` };
	};
}

function useImportZeroMatchCsv() {
	const { resultsDispatch } = useContext(ResultsContext);

	return async (csvFile) => {
		const validFileType = 'csv';
		const isValid = checkFileType(csvFile, validFileType);
		if (!isValid) {
			throw csvOnlyError;
		}

		await csvFile
			.text()
			.then((result) => {
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'zeroMatchCsv',
					data: result,
					count: getCsvRowCount(result),
				});
			})
			.catch((error) => {
				throw error;
			});

		return { successMsg: `${csvFile.name} sucessfully imported.` };
	};
}

function useImportHasMatchCsv() {
	const { resultsDispatch } = useContext(ResultsContext);

	return async (csvFile) => {
		const validFileType = 'csv';
		const isValid = checkFileType(csvFile, validFileType);
		if (!isValid) {
			throw csvOnlyError;
		}

		await csvFile
			.text()
			.then((result) => {
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'hasMatchCsv',
					data: result,
					count: getCsvRowCount(result),
				});
			})
			.catch((error) => {
				throw error;
			});

		return { successMsg: `${csvFile.name} sucessfully imported.` };
	};
}

export {
	useImportLatestCsv,
	useImportInputJson,
	useImportMappedCsv,
	useImportZeroMatchCsv,
	useImportHasMatchCsv,
};
