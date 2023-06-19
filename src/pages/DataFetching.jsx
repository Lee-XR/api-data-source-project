import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSkiddle } from '../api/fetchSkiddleApi.js';
import { fetchDataThistle } from '../api/fetchDataThistleApi.js';
import { fetchBandsInTown } from '../api/fetchBandsInTownApi.js';
import { RecordsContext } from '../contexts/RecordsContext.jsx';

import { Header } from '../components/Header.jsx';
import { ApiSelection } from '../components/ApiSelection.jsx';
import { Skiddle } from '../components/Skiddle.jsx';
import { DataThistle } from '../components/DataThistle.jsx';
import { BandsInTown } from '../components/BandsInTown.jsx';
import { Spinner } from '../components/Spinner.jsx';

// Individual API component and fetch data function
const ComponentMap = {
	Skiddle: {
		component: Skiddle,
		fetchFunc: fetchSkiddle,
	},
	DataThistle: {
		component: DataThistle,
		fetchFunc: fetchDataThistle,
	},
	BandsInTown: {
		component: BandsInTown,
		fetchFunc: fetchBandsInTown,
	},
};

export function DataFetching() {
	const { getRecords, getTotalRecordCount, getAllowProcessing } = useContext(RecordsContext);
	const [records, setRecords] = getRecords;
	const [totalRecordCount, setTotalRecordCount] = getTotalRecordCount;
	const [allowProcessing] = getAllowProcessing;


	const [selectedApi, setSelectedApi] = useState('Skiddle');
	const [apiUrl, setApiUrl] = useState('');
	const [apiEndpoint, setApiEndpoint] = useState('');
	const [apiSingleId, setApiSingleId] = useState(null);
	const [apiParams, setApiParams] = useState('');
	const [fetchApi, setFetchApi] = useState(null);
	const [resetApi, setResetApi] = useState(null);

	const [isFetching, setIsFetching] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	// Return selected API component
	const ApiComponent = ComponentMap[selectedApi].component;

	// Fetch data from API
	async function fetchData() {
		setIsFetching(true);
		setIsError(false);
		await fetchApi(apiEndpoint, apiSingleId, apiParams)
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
		const url = window.URL.createObjectURL(jsonData);
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.download = `${selectedApi}-${apiEndpoint}.json`;
		document.body.appendChild(link);
		link.click();
		window.URL.revokeObjectURL(url);
	}

	// Set selected API URL & axios method to fetch data
	useEffect(() => {
		const uppercaseName = selectedApi.toUpperCase();
		setApiUrl(import.meta.env[`VITE_${uppercaseName}_API_URL`]);
		setFetchApi(() => ComponentMap[selectedApi].fetchFunc);
	}, [selectedApi]);

	return (
		<>
			{/* Header with API selection */}
			<Header>
				<ApiSelection setSelectedApi={setSelectedApi} />
			</Header>

			<main>
				{/* API name, URL & search parameters */}
				<h2>{selectedApi} API</h2>
				<p>
					<b>
						{apiUrl}
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
