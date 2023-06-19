import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { mapFields, downloadCsv, saveToDatabase } from '../api/dataProcessApi.js';
import { RecordsContext } from '../contexts/RecordsContext.jsx';

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
	const { getRecords, getTotalRecordCount } = useContext(RecordsContext);
	const [records] = getRecords;
	const [totalRecordCount] = getTotalRecordCount;

	const [isProcessing, setIsProcessing] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	async function runFunction(callback) {
		setIsProcessing(true);
		setIsError(false);

		await callback(records)
			.then((response) => {
				setIsProcessing(false);
				setIsError(false);
				console.log(response);
			})
			.catch((err) => {
				setIsProcessing(false);
				setIsError(true);
				setErrorMsg(err.message)
				console.error(err.message);
			});
	}

	return (
		<>
			<Header>
				<Link to='/'>Back</Link>
			</Header>
			<main>
				<h2>Data Processing</h2>
				<div className='msg-box'>
					{isProcessing && !isError && (
						<>
							<span>Processing...</span>
							<Spinner />
						</>
					)}
					{!isProcessing && !isError && (
						<span>
							<b>{records.length}</b> results
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
