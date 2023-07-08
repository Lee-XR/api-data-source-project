import { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
	useImportInputJson,
	useImportMappedCsv,
	useImportZeroMatchCsv,
	useImportHasMatchCsv,
} from '../hooks/UseImportData';
import { flattenArrayObject } from '../utils/dataUtils';
import { downloadFile } from '../utils/fileUtils';
import { parse, unparse } from 'papaparse';

import { ApiContext } from '../contexts/ApiContext';
import { ResultsContext } from '../contexts/ResultsContext';
import { FunctionResponseContext } from '../contexts/FunctionResponseContext';

import '../styles/resultsList.css';

function ResultBox({ resultInfo }) {
	const { name, data, count, filename, acceptFiletype, importFunc, resetFunc } =
		resultInfo;
	const { apiDispatch } = useContext(ApiContext);
	const { responseDispatch, responseTimeout } = useContext(
		FunctionResponseContext
	);

	async function importData(e) {
		const importFile = e.target.files[0];
		if (importFile) {
			await importFunc(importFile)
				.then((response) => {
					apiDispatch({ type: 'CHANGE_API', apiName: 'NoApi' });
					responseDispatch({
						type: 'HANDLE_RESPONSE',
						successMsg: response.successMsg,
					});
				})
				.catch((error) => {
					console.error(error);
					responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
				});

			e.target.value = '';
		} else {
			responseDispatch({
				type: 'HANDLE_ERROR',
				errorMsg: 'Import file not found.',
			});
		}
		responseTimeout.current = setTimeout(
			() => responseDispatch({ type: 'RESET_RESPONSE' }),
			5000
		);
	}

	function downloadResults(e) {
		const selectedFiletype = e.target.value;
		if (selectedFiletype === 'csv') {
			let csvString = data;
			if (typeof csvString !== 'string') {
				const flattenedData = data.map((record) => flattenArrayObject(record));
				csvString = unparse(flattenedData, { header: true });
			}
			downloadFile(csvString, filename, selectedFiletype);
		} else {
			let jsonData = data;
			if (typeof jsonData !== 'object') {
				jsonData = parse(data, { header: true });
			}
			downloadFile(jsonData, filename, selectedFiletype);
		}
		e.target.value = '';
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
				<span>{`${count} Results`}</span>
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
				<select
					className={
						count === 0 ? 'download-select disabled' : 'download-select'
					}
					disabled={count === 0}
					defaultValue=''
					onChange={downloadResults}
				>
					<option
						value=''
						disabled
					>
						Download
					</option>
					<option value='json'>JSON</option>
					<option value='csv'>CSV</option>
				</select>
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
	const { inputRecordsJson, mappedCsv, zeroMatchCsv, hasMatchCsv } =
		resultsState;

	const resultBoxInfo = [
		{
			name: `${apiState.name} API Data JSON`,
			data: inputRecordsJson.data,
			count: inputRecordsJson.count,
			filename: `${apiState.name}-input-records`,
			acceptFiletype: 'application/json',
			importFunc: useImportInputJson(),
			resetFunc: () =>
				resultsDispatch({ type: 'RESET', resultType: 'inputRecordsJson' }),
		},
		{
			name: 'Field-Mapped Records CSV',
			data: mappedCsv.data,
			count: mappedCsv.count,
			filename: `${apiState.name}-mapped`,
			acceptFiletype: 'text/csv, application/vnd.ms-excel',
			importFunc: useImportMappedCsv(),
			resetFunc: () =>
				resultsDispatch({ type: 'RESET', resultType: 'mappedCsv' }),
		},
		{
			name: 'Zero-Match Records CSV',
			data: zeroMatchCsv.data,
			count: zeroMatchCsv.count,
			filename: `${apiState.name}-zero-match`,
			acceptFiletype: 'text/csv, application/vnd.ms-excel',
			importFunc: useImportZeroMatchCsv(),
			resetFunc: () =>
				resultsDispatch({ type: 'RESET', resultType: 'zeroMatchCsv' }),
		},
		{
			name: 'Has-Match Records CSV',
			data: hasMatchCsv.data,
			count: hasMatchCsv.count,
			filename: `${apiState.name}-has-match`,
			acceptFiletype: 'text/csv, application/vnd.ms-excel',
			importFunc: useImportHasMatchCsv(),
			resetFunc: () =>
				resultsDispatch({ type: 'RESET', resultType: 'hasMatchCsv' }),
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
