import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ResultsContext = createContext(null);

function ResultsContextProvider({ children }) {
	const [records, setRecords] = useState([]);
	const [totalRecordCount, setTotalRecordCount] = useState(records.length);
	const [mappedCsv, setMappedCsv] = useState({ csvString: '', count: 0 });
	const [zeroMatchCsv, setZeroMatchCsv] = useState({ csvString: '', count: 0 });
	const [hasMatchCsv, setHasMatchCsv] = useState({ csvString: '', count: 0 });
	const [recordType, setRecordType] = useState('');
	const [allowProcessing, setAllowProcessing] = useState(false);

	useEffect(() => {
		if (records.length > 0) {
			setAllowProcessing(true);
		} else {
			setAllowProcessing(false);
		}
	}, [records]);

	return (
		<ResultsContext.Provider
			value={{
				getRecords: [records, setRecords],
				getTotalRecordCount: [totalRecordCount, setTotalRecordCount],
				getRecordType: [recordType, setRecordType],
				getAllowProcessing: [allowProcessing, setAllowProcessing],
				getMappedCsv: [mappedCsv, setMappedCsv],
				getZeroMatchCsv: [zeroMatchCsv, setZeroMatchCsv],
				getHasMatchCsv: [hasMatchCsv, setHasMatchCsv],
			}}
		>
			{children}
		</ResultsContext.Provider>
	);
}

ResultsContextProvider.propTypes = {
	children: PropTypes.node,
};

export { ResultsContext, ResultsContextProvider };
