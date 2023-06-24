import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecordsContext } from '../contexts/RecordsContext.jsx';
import { ApiContext } from '../contexts/ApiContext.jsx';
import {
	mapFields,
	matchRecords,
	saveToDatabase,
} from '../api/dataProcessApi.js';
import { downloadFile } from '../utils/fileUtils.js';

import { Header } from '../components/Header.jsx';
import { Spinner } from '../components/Spinner.jsx';

export function DataProcessing() {
	const { getRecords, getRecordType, getMappedRecordsString } =
		useContext(RecordsContext);
	const [records] = getRecords;
	const [recordType] = getRecordType;
	const [mappedRecordsString, setMappedRecordsString] = getMappedRecordsString;
	const { apiState } = useContext(ApiContext);

	const [isProcessing, setIsProcessing] = useState(false);
	const [processingDone, setProcessingDone] = useState(false);
	const [isError, setIsError] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	function initSettings() {
		setIsProcessing(true);
		setProcessingDone(false);
		setIsError(false);
	}

	function handleResponse(response) {
		setIsProcessing(false);
		setIsError(false);
		setProcessingDone(true);
		setSuccessMsg(response.successMsg);
	}

	function handleError(error) {
		console.log(error);
		setIsProcessing(false);
		setIsError(true);
		setErrorMsg(error.message);
		console.error(error);
	}

	async function mapFieldFunction() {
		initSettings();
		const apiName = apiState.name.toLowerCase();

		await mapFields(apiName, records)
			.then((response) => {
				if (response.csvString) {
					setMappedRecordsString(response.csvString);
				}
				handleResponse(response);
			})
			.catch((error) => {
				handleError(error);
			});
	}

	async function matchRecordsFunction() {
		initSettings();
		const apiName = apiState.name.toLowerCase();

		await matchRecords(apiName, mappedRecordsString)
			.then((response) => {
				handleResponse(response);
			})
			.catch((error) => {
				handleError(error);
			});
	}

	async function saveToDatabaseFunction() {
		initSettings();
		const apiName = apiState.name.toLowerCase();

		await saveToDatabase()
			.then((response) => {
				handleResponse(response);
			})
			.catch((error) => {
				handleError(error);
			});
	}

	// Download processed records as CSV file
	function downloadCsv() {
		const csvData = new Blob([mappedRecordsString]);
		downloadFile(csvData, `${apiState.name}-mapped.csv`);
	}

	return (
		<>
			<Header>
				<Link to='/'>Back</Link>
			</Header>
			<main>
				<h2>{apiState.name} API Data Processing</h2>
				<p>
					Fetched <b>{records.length}</b> results
				</p>
				<div className='msg-box'>
					{!isProcessing && !isError && !processingDone && (
						<span>Awaiting Process</span>
					)}
					{!isProcessing && !isError && processingDone && (
						<span>Processing Done... {successMsg}</span>
					)}
					{isProcessing && !isError && (
						<>
							<span>Processing...</span>
							<Spinner />
						</>
					)}
					{!isProcessing && isError && (
						<span className='error-msg'>{errorMsg}</span>
					)}
				</div>

				<div className='btns'>
					<button
						disabled={isProcessing || recordType !== 'venues'}
						onClick={mapFieldFunction}
					>
						Map Venue Fields
					</button>
					<button
						disabled={isProcessing || recordType !== 'venues'}
						onClick={downloadCsv}
					>
						Download CSV
					</button>
					<button
						disabled={isProcessing || recordType !== 'venues'}
						onClick={matchRecordsFunction}
					>
						Compare Venue Records
					</button>
					<button
						disabled={isProcessing || recordType !== 'venues'}
						onClick={saveToDatabaseFunction}
					>
						Save To Database
					</button>
				</div>

				{/* Manual comparison for mapped data */}
			</main>
		</>
	);
}
