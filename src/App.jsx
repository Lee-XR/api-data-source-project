import { useEffect, useState } from 'react';
import { fetchSkiddle } from './api/fetchSkiddleApi.js';
import { fetchDataThistle } from './api/fetchDataThistleApi.js';
import { fetchBandsInTown } from './api/fetchBandsInTownApi.js';

import { Header } from './components/Header';
import { Skiddle } from './components/Skiddle';
import { DataThistle } from './components/DataThistle.jsx';
import { BandsInTown } from './components/BandsInTown.jsx';

import './App.css';

// Individual API component and fetch data function
const ComponentMap = {
	Skiddle: {
		component: Skiddle,
		fetchFunc: fetchSkiddle
	},
	DataThistle: {
		component: DataThistle,
		fetchFunc: fetchDataThistle
	},
	BandsInTown: {
		component: BandsInTown,
		fetchFunc: fetchBandsInTown
	}
};

function App() {
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
	const [totalRecords, setTotalRecords] = useState(0);
	const [records, setRecords] = useState([]);

	// Return selected API component
	const ApiComponent = ComponentMap[selectedApi].component;

	// Fetch data from API
	async function fetchData() {
		setIsFetching(true);
		setIsError(false);
		await fetchApi(apiEndpoint, apiSingleId, apiParams)
			.then((response) => {
				setTotalRecords(parseInt(response.totalHits));
				setRecords([...records, ...response.records]);
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
			setTotalRecords(0);
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

	// Reset fetched records & total records count
	useEffect(() => {
		setTotalRecords(0);
		setRecords([]);
	}, [apiUrl, apiEndpoint]);

	return (
		<>
			{/* Header with API selection */}
			<Header setSelectedApi={setSelectedApi} />

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
				<p>
					{isFetching && !isError && <span>Fetching...</span>}
					{!isFetching && !isError && (
						<span>
							Returned <b>{records.length}</b> of <b>{totalRecords}</b> results
						</span>
					)}
					{!isFetching && isError && (
						<span className='error-msg'>{errorMsg}</span>
					)}
				</p>

				<div className='btns'>
					<button onClick={fetchData}>Fetch Data</button>
					<button onClick={downloadJson}>Download JSON</button>
					<button onClick={resetOptions}>Reset Options</button>
					<button onClick={resetRecords}>Reset Results</button>
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

export default App;
