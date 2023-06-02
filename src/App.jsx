import { useEffect, useState } from 'react';
import {
	fetchBandsInTown,
	fetchDataThistle,
	fetchSkiddle,
} from './fetchApi.js';

import Header from './components/Header';
import { Skiddle } from './components/Skiddle';

import './App.css';

function App() {
	const [selectedApi, setSelectedApi] = useState('Skiddle');
	const [apiUrl, setApiUrl] = useState('');
	const [apiType, setApiType] = useState('');
	const [apiSingleId, setApiSingleId] = useState(null);
	const [apiParams, setApiParams] = useState('');
	const [apiFetch, setApiFetch] = useState(null);
	const [apiReset, setApiReset] = useState(null);

	const [isFetching, setIsFetching] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [totalRecords, setTotalRecords] = useState(0);
	const [records, setRecords] = useState([]);

	// Fetch data from API
	async function fetchData() {
		setIsFetching(true);
		setIsError(false);
		await apiFetch(apiType, apiSingleId, apiParams)
			.then((response) => {
				if (response.error) {
					setIsError(true);
					setErrorMsg(response.error);
				} else {
					setTotalRecords(parseInt(response.totalHits));
					setRecords([...records, ...response.records]);
				}
				setIsFetching(false);
			})
			.catch((err) => {
				setIsFetching(false);
				setIsError(true);
				setErrorMsg(err);
				console.log(err);
				console.error(err);
			});
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
		link.download = `${selectedApi}-${apiType}.json`;
		document.body.appendChild(link);
		link.click();
		window.URL.revokeObjectURL(url);
	}

	// Set selected API axios method to fetch data
	useEffect(() => {
		if (selectedApi === 'Skiddle') {
			setApiUrl(import.meta.env.VITE_SKIDDLE_API_URL);
			setApiFetch(() => fetchSkiddle);
		}
		if (selectedApi === 'DataThistle') {
			setApiUrl(import.meta.env.VITE_DATATHISTLE_API_URL);
			setApiFetch(() => fetchDataThistle);
		}
		if (selectedApi === 'BandsInTown') {
			setApiUrl(import.meta.env.VITE_BANDSINTOWN_API_URL);
			setApiFetch(() => fetchBandsInTown);
		}
	}, [selectedApi]);

	// Reset fetched records & total records count
	useEffect(() => {
		setTotalRecords(0);
		setRecords([]);
	}, [apiUrl, apiType]);

	return (
		<>
			<Header setSelectedApi={setSelectedApi} />

			<main>
				<h2>{selectedApi} API</h2>
				<p>
					<b>
						{apiUrl}
						{apiType}
						{apiSingleId ? `/${apiSingleId}` : ''}
						/?{new URLSearchParams(apiParams).toString()}
					</b>
				</p>

				<p>
					{isFetching && !isError && <span>Fetching...</span>}
					{!isFetching && !isError && (
						<span>
							Returned <b>{records.length}</b> of <b>{totalRecords}</b> results
						</span>
					)}
					{!isFetching && isError && (
						<span style={{ color: 'red' }}>{errorMsg}</span>
					)}
				</p>

				<div className='btns'>
					<button onClick={fetchData}>Fetch Data</button>
					<button onClick={downloadJson}>Download JSON</button>
					<button onClick={() => apiReset()}>Reset Options</button>
					{/* <button onClick={downloadXML}>Download XML</button> */}
					{/* <button onClick={downloadCSV}>Download CSV</button> */}
				</div>

				{selectedApi === 'Skiddle' && (
					<Skiddle
						setApiType={setApiType}
						setApiSingleId={setApiSingleId}
						setApiParams={setApiParams}
						setApiReset={setApiReset}
					/>
				)}
			</main>

			{/* <div className='data-count'>
				{currentOffset} of {totalCount} result(s)
			</div> */}

			{/* <div className='fields'>
				{data.length > 0 && data.map((record, index) => (
					<div key={record.id} className='field'>
						<span>{index + 1}</span>
						<span>{record.eventname}</span>
					</div>
				))}
				{Array.from(fieldset.keys()).map((key, index) => (
					<div
						key={key}
						className='field'
					>
						<span>{index + 1}</span>
						<span>{key}</span>
					</div>
				))} 
			</div> */}
		</>
	);
}

export default App;
