import { useEffect, useState } from 'react';
import { fetchBandsInTown, fetchDataThistle, fetchSkiddle } from './fetchApi.js';

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

	const [records, setRecords] = useState([]);

	// Fetch data from API
	async function fetchData() {
		console.log(1, 'fetch');
		await apiFetch(apiType, apiSingleId, apiParams)
			.then((response) => {
				console.log(response);
				setRecords([...records, ...response.records]);
			})
			.catch((err) => {
				console.error(err);
			});
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

				<div className='btns'>
					<button onClick={fetchData}>Fetch Data</button>
					<button onClick={fetchData}>Generate JSON</button>
					<button onClick={fetchData}>Generate XML</button>
					<button onClick={fetchData}>Generate CSV</button>
				</div>

				{selectedApi === 'Skiddle' && (
					<Skiddle
						setApiType={setApiType}
						setApiSingleId={setApiSingleId}
						setApiParams={setApiParams}
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
