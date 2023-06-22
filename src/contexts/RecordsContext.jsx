import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const RecordsContext = createContext(null);

function RecordsContextProvider({ children }) {
	const [records, setRecords] = useState([]);
	const [totalRecordCount, setTotalRecordCount] = useState(records.length);
	const [mappedRecordsString, setMappedRecordsString] = useState('');
	const [recordType, setRecordType] = useState('venues');
	const [allowProcessing, setAllowProcessing] = useState(false);

	useEffect(() => {
		if (records.length > 0) {
			setAllowProcessing(true);
		} else {
			setAllowProcessing(false);
		}
	}, [records]);

	return (
		<RecordsContext.Provider
			value={{
				getRecords: [records, setRecords],
				getTotalRecordCount: [totalRecordCount, setTotalRecordCount],
				getRecordType: [recordType, setRecordType],
				getAllowProcessing: [allowProcessing, setAllowProcessing],
				getMappedRecordsString: [mappedRecordsString, setMappedRecordsString]
			}}
		>
			{children}
		</RecordsContext.Provider>
	);
}

RecordsContextProvider.propTypes = {
	children: PropTypes.node,
};

export { RecordsContext, RecordsContextProvider }