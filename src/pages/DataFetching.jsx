import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadFile } from '../utils/fileUtils.js';
import { ApiContext } from '../contexts/ApiContext.jsx';
import { RecordsContext } from '../contexts/RecordsContext.jsx';

import { Header } from '../components/Header.jsx';
import { ApiSelection } from '../components/ApiSelection.jsx';
import { Spinner } from '../components/Spinner.jsx';


export function DataFetching() {
	const { getRecords, getTotalRecordCount, getAllowProcessing } = useContext(RecordsContext);
	const [records, setRecords] = getRecords;
	const [totalRecordCount, setTotalRecordCount] = getTotalRecordCount;
	const [allowProcessing] = getAllowProcessing;
	const { apiState } = useContext(ApiContext);

	const [apiEndpoint, setApiEndpoint] = useState('');
	const [apiSingleId, setApiSingleId] = useState(null);
	const [apiParams, setApiParams] = useState('');
	const [resetApi, setResetApi] = useState(null);

	const [isFetching, setIsFetching] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	// Return selected API component
	const ApiComponent = apiState.component;

	// Fetch data from API
	async function fetchData() {
		setIsFetching(true);
		setIsError(false);
		await apiState.fetchFunc(apiEndpoint, apiSingleId, apiParams)
			.then(({ totalHits, totalRecords }) => {
				setTotalRecordCount(parseInt(totalHits));
				setRecords([...records, ...totalRecords]);
				setIsFetching(false);
			})
			.catch((err) => {
				setIsFetching(false);
				setIsError(true);
				setErrorMsg(err.message);
				console.error(err.message);
			});
	}

	// Reset API options
	function resetOptions() {
		const reset = confirm('Are you sure to reset all options?');
		if (reset === true) {
			resetApi();
		}
	}

	// Reset records
	function resetRecords() {
		const reset = confirm('Are you sure to reset all records?');
		if (reset === true) {
			setTotalRecordCount(0);
			setRecords([]);
			setIsFetching(false);
			setIsError(false);
		}
	}

	// Download records as JSON file
	function downloadJson() {
		const jsonData = new Blob([JSON.stringify(records, null, 2)], {
			type: 'application/json',
		});
		const filename =`${selectedApi}-${apiEndpoint}.json`;
		downloadFile(jsonData, filename);
	}

	return (
		<>
			{/* Header with API selection */}
			<Header>
				<ApiSelection />
			</Header>

			<main>
				{/* API name, URL & search parameters */}
				<h2>{apiState.name} API</h2>
				<p>
					<b>
						{apiState.url}
						{apiEndpoint}
						{apiSingleId ? `/${apiSingleId}` : ''}
						/?{new URLSearchParams(apiParams).toString()}
					</b>
				</p>

				{/* Fetching, error & total results message */}
				<div className='msg-box'>
					{isFetching && !isError && (
						<>
							<span>Fetching...</span>
							<Spinner />
						</>
					)}
					{!isFetching && !isError && (
						<span>
							Returned <b>{records.length}</b> of <b>{totalRecordCount}</b>{' '}
							results
						</span>
					)}
					{!isFetching && isError && (
						<span className='error-msg'>{errorMsg}</span>
					)}
				</div>

				<div className='btns'>
					<button
						onClick={fetchData}
						disabled={isFetching}
					>
						Fetch Data
					</button>
					<button
						onClick={downloadJson}
						disabled={isFetching}
					>
						Download JSON
					</button>
					<button
						onClick={resetOptions}
						disabled={isFetching}
					>
						Reset Options
					</button>
					<button
						onClick={resetRecords}
						disabled={isFetching}
					>
						Reset Results
					</button>
					<Link to='data-processing'>
						<button disabled={!allowProcessing}>Process Data</button>
					</Link>
				</div>

				{/* Display selected API options */}
				<ApiComponent
					setApiEndpoint={setApiEndpoint}
					setApiSingleId={setApiSingleId}
					setApiParams={setApiParams}
					setResetApi={setResetApi}
				/>
			</main>
		</>
	);
}
