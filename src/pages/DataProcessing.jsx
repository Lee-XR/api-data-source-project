import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useImportLatestCsv } from '../hooks/UseImportData.jsx';
import { useAbortRequest } from '../hooks/UseAbortRequest.jsx';
import { mapFields, matchRecords } from '../api/dataProcessApi.js';

import { ApiContext } from '../contexts/ApiContext.jsx';
import { LatestCsvContext } from '../contexts/LatestCsvContext.jsx';
import { ResultsContext } from '../contexts/ResultsContext.jsx';
import { FunctionResponseContext } from '../contexts/FunctionResponseContext.jsx';

import { Header } from '../components/Header.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { ResultsList } from '../components/ResultsList.jsx';

export function DataProcessing() {
	const { apiState } = useContext(ApiContext);
	const { latestCsv } = useContext(LatestCsvContext);
	const { resultsState, resultsDispatch } = useContext(ResultsContext);
	const { inputRecordsJson, mappedCsv } = resultsState;
	const { responseState, responseDispatch, responseTimeout } = useContext(
		FunctionResponseContext
	);
	const { isRunning, isError, isDone, successMsg, errorMsg } = responseState;
	const importLatestCsv = useImportLatestCsv();
	const { requestAbortController, requestAbortSignal } = useAbortRequest();

	async function updateCsv(e) {
		const newCsvFile = e.target.files[0];
		if (newCsvFile) {
			if (responseTimeout.current) {
				clearTimeout(responseTimeout.current);
				responseTimeout.current = null;
			}

			responseDispatch({ type: 'START_FUNCTION' });
			await importLatestCsv(newCsvFile)
				.then((response) => {
					responseDispatch({
						type: 'HANDLE_RESPONSE',
						successMsg: response.successMsg,
					});
				})
				.catch((error) => {
					console.error(error);
					responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
				});

			e.target.value = '';
		} else {
			responseDispatch({
				type: 'HANDLE_ERROR',
				errorMsg: 'Import file not found.',
			});
		}

		responseTimeout.current = setTimeout(
			() => responseDispatch({ type: 'RESET_RESPONSE' }),
			5000
		);
	}

	async function mapFieldFunction() {
		if (responseTimeout.current) {
			clearTimeout(responseTimeout.current);
			responseTimeout.current = null;
		}

		if (latestCsv.count === 0) {
			responseDispatch({
				type: 'HANDLE_ERROR',
				errorMsg: 'Import the latest CSV data first.',
			});
		} else if (inputRecordsJson.data.length === 0) {
			responseDispatch({ type: 'HANDLE_ERROR', errorMsg: 'No data provided.' });
		} else {
			responseDispatch({ type: 'START_FUNCTION' });
			const apiName = apiState.name.toLowerCase();

			await mapFields(
				apiName,
				inputRecordsJson.data,
				latestCsv.data,
				requestAbortSignal
			)
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
				})
				.catch((error) => {
					if (!requestAbortSignal.aborted) {
						console.error(error);
						responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
					}
				});
		}

		responseTimeout.current = setTimeout(
			() => responseDispatch({ type: 'RESET_RESPONSE' }),
			5000
		);
	}

	async function matchRecordsFunction() {
		if (responseTimeout.current) {
			clearTimeout(responseTimeout.current);
			responseTimeout.current = null;
		}

		if (latestCsv.count === 0) {
			responseDispatch({
				type: 'HANDLE_ERROR',
				errorMsg: 'Import the latest CSV data first.',
			});
		} else if (mappedCsv.data.length === 0) {
			responseDispatch({ type: 'HANDLE_ERROR', errorMsg: 'No data provided.' });
		} else {
			responseDispatch({ type: 'START_FUNCTION' });
			const apiName = apiState.name.toLowerCase();

			await matchRecords(
				apiName,
				mappedCsv.data,
				latestCsv.data,
				requestAbortSignal
			)
				.then(
					({
						zeroMatchCsv,
						zeroMatchCount,
						hasMatchCsv,
						hasMatchCount,
						successMsg,
					}) => {
						resultsDispatch({
							type: 'UPDATE',
							resultType: 'zeroMatchCsv',
							data: zeroMatchCsv,
							count: zeroMatchCount,
						});
						resultsDispatch({
							type: 'UPDATE',
							resultType: 'hasMatchCsv',
							data: hasMatchCsv,
							count: hasMatchCount,
						});
						responseDispatch({
							type: 'HANDLE_RESPONSE',
							successMsg: successMsg,
						});
					}
				)
				.catch((error) => {
					if (!requestAbortSignal.aborted) {
						responseDispatch({ type: 'HANDLE_ERROR', errorMsg: error.message });
					}
				});
		}

		responseTimeout.current = setTimeout(
			() => responseDispatch({ type: 'RESET_RESPONSE' }),
			5000
		);
	}

	useEffect(() => {
		responseDispatch({ type: 'RESET_RESPONSE' });

		return () => {
			requestAbortController.abort();
			clearTimeout(responseTimeout.current);
			responseTimeout.current = null;
		};
	}, []);

	return (
		<>
			<Header>
				<Link to='/'>Back</Link>
			</Header>

			<main>
				<h2>{apiState.name} API Data Processing</h2>
				<p className={latestCsv.count === 0 ? 'error-msg' : ''}>
					Latest CSV Data: <b>{latestCsv.count}</b> Records
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
					<input
						type='file'
						name='csv-data-update'
						id='csv-data-update'
						className={isRunning ? 'disabled file-input-btn' : 'file-input-btn'}
						disabled={isRunning}
						accept='text/csv, application/vnd.ms-excel'
						onChange={updateCsv}
					/>
					<label
						htmlFor='csv-data-update'
						className={
							isRunning ? 'disabled file-input-label' : 'file-input-label'
						}
						disabled={isRunning}
					>
						Imported Latest CSV Data
					</label>
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
