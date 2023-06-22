import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecordsContext } from '../contexts/RecordsContext.jsx';
import { ApiContext } from '../contexts/ApiContext.jsx';
import {
	mapFields,
	compareRecords,
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

	async function runFunction(callback) {
		setIsProcessing(true);
		setProcessingDone(false);
		setIsError(false);
		const apiName = apiState.name.toLowerCase();

		await callback(apiName, records)
			.then((response) => {
				if (response.csvString) {
					setMappedRecordsString(response.csvString);
				}
				setIsProcessing(false);
				setIsError(false);
				setProcessingDone(true);
				setSuccessMsg(response.successMsg);
			})
			.catch((err) => {
				setIsProcessing(false);
				setIsError(true);
				setErrorMsg(err.message);
				console.error(err);
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
						onClick={() => runFunction(mapFields)}
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
						onClick={() => compareRecords()}
					>
						Compare Venue Records
					</button>
					<button
						disabled={isProcessing || recordType !== 'venues'}
						onClick={() => saveToDatabase()}
					>
						Save To Database
					</button>
				</div>

				{/* Manual comparison for mapped data */}
			</main>
		</>
	);
}
