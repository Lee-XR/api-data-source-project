import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const resultsInitState = {
	inputRecordsJson: {
		data: [],
		count: 0,
	},
	mappedCsv: {
		data: '',
		count: 0,
	},
	zeroMatchCsv: {
		data: '',
		count: 0,
	},
	hasMatchCsv: {
		data: '',
		count: 0,
	},
};

function resultsReducer(state, action) {
	switch (action.type) {
		case 'RESET': {
			switch (action.resultType) {
				case 'inputRecordsJson':
					return {
						...state,
						inputRecordsJson: {
							data: [],
							count: 0,
						},
					};

				case 'mappedCsv':
					return {
						...state,
						mappedCsv: {
							data: '',
							count: 0,
						},
					};

				case 'zeroMatchCsv':
					return {
						...state,
						zeroMatchCsv: {
							data: '',
							count: 0,
						},
					};

				case 'hasMatchCsv':
					return {
						...state,
						hasMatchCsv: {
							data: '',
							count: 0,
						},
					};

				default:
					return state;
			}
		}

		case 'UPDATE': {
			switch (action.resultType) {
				case 'inputRecordsJson':
					return {
						...state,
						inputRecordsJson: {
							data: action.data,
							count: action.count,
						},
					};

				case 'mappedCsv':
					return {
						...state,
						mappedCsv: {
							data: action.data,
							count: action.count,
						},
					};

				case 'zeroMatchCsv':
					return {
						...state,
						zeroMatchCsv: {
							data: action.data,
							count: action.count,
						},
					};

				case 'hasMatchCsv':
					return {
						...state,
						hasMatchCsv: {
							data: action.data,
							count: action.count,
						},
					};

				default:
					return state;
			}
		}

		default:
			return state;
	}
}

const ResultsContext = createContext(resultsInitState);

function ResultsContextProvider({ children }) {
	const [resultsState, resultsDispatch] = useReducer(
		resultsReducer,
		resultsInitState
	);

	return (
		<ResultsContext.Provider value={{resultsState, resultsDispatch}}>
			{children}
		</ResultsContext.Provider>
	);
}

ResultsContextProvider.propTypes = {
	children: PropTypes.node,
};

export { ResultsContext, ResultsContextProvider };
