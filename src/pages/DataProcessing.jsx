import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResultsContext } from '../contexts/ResultsContext.jsx';
import { ApiContext } from '../contexts/ApiContext.jsx';
import { mapFields, matchRecords } from '../api/dataProcessApi.js';
import { FunctionResponseContext } from '../contexts/FunctionResponseContext.jsx';

import { Header } from '../components/Header.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { ResultsList } from '../components/ResultsList.jsx';

export function DataProcessing() {
	const { apiState } = useContext(ApiContext);
	const { resultsState, resultsDispatch } = useContext(ResultsContext);
	const { inputRecordsJson, mappedCsv } = resultsState;
	const { responseState, responseDispatch, responseTimeout} = useContext(FunctionResponseContext);
	const { isRunning, isError, isDone, successMsg, errorMsg } = responseState;

	async function mapFieldFunction() {
		if (responseTimeout.current) {
			clearTimeout(responseTimeout.current);
		}
		responseDispatch({ type: 'START_FUNCTION' });
		const apiName = apiState.name.toLowerCase();

		await mapFields(apiName, inputRecordsJson.data)
			.then(({ mappedCsv, mappedCount, successMsg }) => {
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'mappedCsv',
					data: mappedCsv,
					count: mappedCount,
				});
				responseDispatch({
					type: 'HANDLE_RESPONSE',
					successMsg: successMsg,
				});
				responseTimeout.current = setTimeout(
					() => responseDispatch({ type: 'RESET_RESPONSE' }),
					5000
				);
			})
			.catch((error) => {
				console.error(error);
				responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
				responseTimeout.current = setTimeout(
					() => responseDispatch({ type: 'RESET_RESPONSE' }),
					5000
				);
			});
	}

	async function matchRecordsFunction() {
		if (responseTimeout.current) {
			clearTimeout(responseTimeout.current);
		}
		responseDispatch({ type: 'START_FUNCTION' });
		const apiName = apiState.name.toLowerCase();

		await matchRecords(apiName, mappedCsv.data)
			.then(({ zeroMatchCsv, zeroMatchCount, hasMatchCsv, hasMatchCount, successMsg }) => {
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'zeroMatchCsv',
					data: zeroMatchCsv,
					count: zeroMatchCount
				});
				resultsDispatch({
					type: 'UPDATE',
					resultType: 'hasMatchCsv',
					data: hasMatchCsv,
					count: hasMatchCount
				});
				responseDispatch({
					type: 'HANDLE_RESPONSE',
					successMsg: successMsg,
				});
				responseTimeout.current = setTimeout(
					() => responseDispatch({ type: 'RESET_RESPONSE' }),
					5000
				);
			})
			.catch((error) => {
				responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
				responseTimeout.current = setTimeout(
					() => responseDispatch({ type: 'RESET_RESPONSE' }),
					5000
				);
			});
	}

	useEffect(() => {
		responseDispatch({ type: 'RESET_RESPONSE' });

		return () => {
			clearTimeout(responseTimeout.current);
		};
	}, []);

	return (
		<>
			<Header>
				<Link to='/'>Back</Link>
			</Header>

			<main>
				<h2>{apiState.name} API Data Processing</h2>
				<p>
					Fetched <b>{inputRecordsJson.data.length}</b> results
				</p>

				<div className='msg-box'>
					{!isRunning && !isError && !isDone && <span>Awaiting Process</span>}
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
