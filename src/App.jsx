import { useEffect, useState } from 'react';
import { fetchSkiddle } from './fetchApi.js';

import Header from './components/Header';
import { Skiddle } from './components/Skiddle';

import './App.css';

function App() {
	const [selectedApi, setSelectedApi] = useState('Skiddle');
	const [apiUrl, setApiUrl] = useState('');
	const [apiEndpoint, setApiEndpoint] = useState('');
	const [apiParams, setApiParams] = useState('');
	const [apiFetch, setApiFetch] = useState(null);

	// Fetch data from API
	async function fetchData() {
		await apiFetch(apiEndpoint, apiParams)
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	useEffect(() => {
		if (selectedApi === 'Skiddle') {
			setApiUrl('https://www.skiddle.com/api/v1/');
			setApiFetch(() => fetchSkiddle);
		}
		if (selectedApi === 'DataThistle') {
			setApiFetch(null);
		}
		if (selectedApi === 'BandsInTown') {
			setApiFetch(null);
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
						{apiEndpoint}/?{apiParams.toString()}
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
						setApiEndpoint={setApiEndpoint}
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
