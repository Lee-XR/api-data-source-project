import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecordsContext } from '../contexts/RecordsContext.jsx';
import { ApiContext } from '../contexts/ApiContext.jsx';
import {
	mapFields,
	downloadCsv,
	saveToDatabase,
} from '../api/dataProcessApi.js';

import { Header } from '../components/Header.jsx';
import { Spinner } from '../components/Spinner.jsx';

const clickBtns = [
	{
		name: 'Map Fields',
		function: mapFields,
	},
	{
		name: 'Download CSV',
		function: downloadCsv,
	},
	{
		name: 'Save To Database',
		function: saveToDatabase,
	},
];

export function DataProcessing() {
	const { getRecords } = useContext(RecordsContext);
	const [records] = getRecords;
	const { apiState } = useContext(ApiContext);

	const [isProcessing, setIsProcessing] = useState(false);
	const [processingDone, setProcessingDone] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	async function runFunction(callback) {
		setIsProcessing(true);
		setIsError(false);
		setProcessingDone(false);
		const apiName = apiState.name.toLowerCase();

		await callback(apiName, records)
			.then(() => {
				setIsProcessing(false);
				setIsError(false);
				setProcessingDone(true);
			})
			.catch((err) => {
				setIsProcessing(false);
				setIsError(true);
				setErrorMsg(err.message);
				console.error(err);
			});
	}

	return (
		<>
			<Header>
				<Link to='/'>Back</Link>
			</Header>
			<main>
				<h2>{apiState.name} Api Data Processing</h2>
				<div className='msg-box'>
					{isProcessing && !isError && (
						<>
							<span>Processing...</span>
							<Spinner />
						</>
					)}
					{!isProcessing && !isError && !processingDone && (
						<span>
							<b>{records.length}</b> results
						</span>
					)}
					{!isProcessing && !isError && processingDone && (
						<span>
							Processing Done
						</span>
					)}
					{!isProcessing && isError && (
						<span className='error-msg'>{errorMsg}</span>
					)}
				</div>

				<div className='btns'>
					{clickBtns.map((btn, index) => (
						<button
							key={index}
							disabled={isProcessing}
							onClick={() => runFunction(btn.function)}
						>
							{btn.name}
						</button>
					))}
				</div>

				{/* Manual comparison for mapped data */}
			</main>
		</>
	);
}
