import { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { useImportInputJson, useImportMappedCsv, useImportZeroMatchCsv, useImportHasMatchCsv } from '../hooks/UseImportData';
import { downloadFile } from '../utils/fileUtils';

import { ApiContext } from '../contexts/ApiContext';
import { ResultsContext } from '../contexts/ResultsContext';
import { FunctionResponseContext } from '../contexts/FunctionResponseContext';

import '../styles/resultsList.css';

function ResultBox({ resultInfo }) {
	const { name, data, count, filename, acceptFiletype, importFunc, resetFunc } = resultInfo;
	const { responseDispatch, responseTimeout } = useContext(FunctionResponseContext);

	async function importData(e) {
		const importFile = e.target.files[0];
		if (importFile) {
			await importFunc(importFile)
				.then((response) => {
					responseDispatch({type: 'HANDLE_RESPONSE', successMsg: response.successMsg});
					responseTimeout.current = setTimeout(() => responseDispatch({type: 'RESET_RESPONSE'}), 5000);
				})
				.catch((error) => {
					console.error(error);
					responseDispatch({type: 'HANDLE_ERROR', errorMsg: error.message});
					responseTimeout.current = setTimeout(() => responseDispatch({type: 'RESET_RESPONSE'}), 5000);
				});

			e.target.value = '';
		} else {
			responseDispatch({type: 'HANDLE_ERROR', errorMsg: 'Import file not found.'});
			responseTimeout.current = setTimeout(() => responseDispatch({type: 'RESET_RESPONSE'}), 5000);
		}
	}

	function downloadResults() {
		const filetype = filename.split('.').pop();
		downloadFile(data, filename, filetype);
	}

	function resetResults() {
		const reset = confirm(`Are you sure to reset ${name} results?`);
		if (reset === true) {
			resetFunc();
		}
	}

	return (
		<div className='box'>
			<div className='info'>
				<h3>{name}</h3>
				<span>{count === 0 ? 'No Data Available' : `${count} Results`}</span>
			</div>
			<div className='action-btns'>
				<input
					type='file'
					name={`${name}-file-data-import`}
					id={`${name}-file-data-import`}
					accept={acceptFiletype}
					className='file-input-btn'
					onChange={importData}
				/>
				<label
					htmlFor={`${name}-file-data-import`}
					className='file-input-label'
				>
					Import
				</label>
				<button
					className={count === 0 ? 'disabled' : ''}
					disabled={count === 0}
					onClick={resetResults}
				>
					Reset
				</button>
				<button
					className={count === 0 ? 'disabled' : ''}
					disabled={count === 0}
					onClick={downloadResults}
				>
					Download
				</button>
			</div>
		</div>
	);
}

ResultBox.propTypes = {
	resultInfo: PropTypes.object,
};

export const ResultsList = memo(function ResultsList() {
	const { apiState } = useContext(ApiContext);
	const { resultsState, resultsDispatch } = useContext(ResultsContext);
	const { inputRecordsJson, mappedCsv, zeroMatchCsv, hasMatchCsv } = resultsState;

	const resultBoxInfo = [
		{
			name: `${apiState.name} API Data JSON`,
			data: inputRecordsJson.data,
			count: inputRecordsJson.count,
			filename: `${apiState.name}-input-records.json`,
			acceptFiletype: 'application/json',
			importFunc: useImportInputJson(),
			resetFunc: () => resultsDispatch({ type: 'RESET', resultType: 'inputRecordsJson' }),
		},
		{
			name: 'Field-Mapped Records CSV',
			data: mappedCsv.csvString,
			count: mappedCsv.count,
			filename: `${apiState.name}-mapped.csv`,
			acceptFiletype: 'text/csv, application/vnd.ms-excel',
			importFunc: useImportMappedCsv(),
			resetFunc: () => resultsDispatch({ type: 'RESET', resultType: 'mappedCsv' }),
		},
		{
			name: 'Zero-Match Records CSV',
			data: zeroMatchCsv.csvString,
			count: zeroMatchCsv.count,
			filename: `${apiState.name}-zero-match.csv`,
			acceptFiletype: 'text/csv, application/vnd.ms-excel',
			importFunc: useImportZeroMatchCsv(),
			resetFunc: () => resultsDispatch({ type: 'RESET', resultType: 'zeroMatchCsv' }),
		},
		{
			name: 'Has-Match Records CSV',
			data: hasMatchCsv.csvString,
			count: hasMatchCsv.count,
			filename: `${apiState.name}-has-match.csv`,
			acceptFiletype: 'text/csv, application/vnd.ms-excel',
			importFunc: useImportHasMatchCsv(),
			resetFunc: () => resultsDispatch({ type: 'RESET', resultType: 'hasMatchCsv' }),
		},
	];

	return (
		<div className='container'>
			{resultBoxInfo.map((box) => (
				<ResultBox
					key={box.name}
					resultInfo={box}
				/>
			))}
		</div>
	);
});
