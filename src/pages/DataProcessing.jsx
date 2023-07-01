import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResultsContext } from '../contexts/ResultsContext.jsx';
import { ApiContext } from '../contexts/ApiContext.jsx';
import { mapFields, matchRecords } from '../api/dataProcessApi.js';
import { FunctionResponseContext } from '../contexts/FunctionResponseContext.jsx';

import { Header } from '../components/Header.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { ResultsList } from '../components/ResultsList.jsx';

export function DataProcessing() {
	const {
		getRecords,
		getRecordType,
		getMappedCsv,
		getZeroMatchCsv,
		getHasMatchCsv,
	} = useContext(ResultsContext);
	const [records] = getRecords;
	const [recordType] = getRecordType;
	const [mappedCsv, setMappedCsv] = getMappedCsv;
	const [zeroMatchCsv, setZeroMatchCsv] = getZeroMatchCsv;
	const [hasMatchCsv, setHasMatchCsv] = getHasMatchCsv;
	const { apiState } = useContext(ApiContext);
	const [
		{ isRunning, isError, isDone, successMsg, errorMsg },
		responseDispatch,
	] = useContext(FunctionResponseContext);
	const timeout = useRef(null);

	async function mapFieldFunction() {
		if (timeout.current) {
			clearTimeout(timeout.current);
		}
		responseDispatch({ type: 'START_FUNCTION' });
		const apiName = apiState.name.toLowerCase();

		await mapFields(apiName, records)
			.then((response) => {
				setMappedCsv({
					csvString: response.mappedCsv,
					count: response.mappedCount,
				});
				responseDispatch({
					type: 'HANDLE_RESPONSE',
					successMsg: response.successMsg,
				});
				timeout.current = setTimeout(() => responseDispatch({ type: 'RESET_RESPONSE' }), 5000);
			})
			.catch((error) => {
				console.error(error);
				responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
				timeout.current = setTimeout(() => responseDispatch({ type: 'RESET_RESPONSE' }), 5000);
			});
	}

	async function matchRecordsFunction() {
		if (timeout.current) {
			clearTimeout(timeout.current);
		}
		responseDispatch({ type: 'START_FUNCTION' });
		const apiName = apiState.name.toLowerCase();

		await matchRecords(apiName, mappedCsv?.csvString)
			.then((response) => {
				setZeroMatchCsv({
					csvString: response.zeroMatchCsv,
					count: response.zeroMatchCount,
				});
				setHasMatchCsv({
					csvString: response.hasMatchCsv,
					count: response.hasMatchCount,
				});
				responseDispatch({
					type: 'HANDLE_RESPONSE',
					successMsg: response.successMsg,
				});
				timeout.current = setTimeout(() => responseDispatch({ type: 'RESET_RESPONSE' }), 5000);
			})
			.catch((error) => {
				responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
				timeout.current = setTimeout(() => responseDispatch({ type: 'RESET_RESPONSE' }), 5000);
			});
	}

	useEffect(() => {
		responseDispatch({ type: 'RESET_RESPONSE' });

		return () => {
			clearTimeout(timeout.current);
		}
	}, []);

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
					{!isRunning && !isError && !isDone && (
						<span>Awaiting Process</span>
					)}
					{!isRunning && !isError && isDone && (
						<span>Processing Done... {successMsg}</span>
					)}
					{isRunning && !isError && (
						<>
							<span>Processing...</span>
							<Spinner />
						</>
					)}
					{!isRunning && isError && (
						<span className='error-msg'>{errorMsg}</span>
					)}
				</div>

				<div className='btns'>
					<button
						className={isRunning ? 'disabled' : ''}
						disabled={isRunning}
						onClick={mapFieldFunction}
					>
						Map Venue Fields
					</button>
					<button
						className={isRunning ? 'disabled' : ''}
						disabled={isRunning}
						onClick={matchRecordsFunction}
					>
						Match Venue Records
					</button>
				</div>

				<ResultsList />
			</main>
		</>
	);
}
