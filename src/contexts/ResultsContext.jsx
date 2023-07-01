import { createContext, useState } from 'react';
import PropTypes from 'prop-types';



const ResultsContext = createContext(null);

function ResultsContextProvider({ children }) {
	const [records, setRecords] = useState([]);
	const [totalRecordCount, setTotalRecordCount] = useState(records.length);
	const [mappedCsv, setMappedCsv] = useState({ csvString: '', count: 0 });
	const [zeroMatchCsv, setZeroMatchCsv] = useState({ csvString: '', count: 0 });
	const [hasMatchCsv, setHasMatchCsv] = useState({ csvString: '', count: 0 });
	const [recordType, setRecordType] = useState('');

	return (
		<ResultsContext.Provider
			value={{
				getRecords: [records, setRecords],
				getTotalRecordCount: [totalRecordCount, setTotalRecordCount],
				getRecordType: [recordType, setRecordType],
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
