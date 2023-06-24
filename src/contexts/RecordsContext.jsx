import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import venueFields from '../assets/json/Skiddle-venues.json';

const RecordsContext = createContext(null);

function RecordsContextProvider({ children }) {
	const [records, setRecords] = useState(venueFields);
	const [totalRecordCount, setTotalRecordCount] = useState(records.length);
	const [mappedRecordsString, setMappedRecordsString] = useState('');
	const [recordType, setRecordType] = useState('venues');
	const [allowProcessing, setAllowProcessing] = useState(false);

	useEffect(() => {
		fetch('./Skiddle-mapped.csv')
			.then((response) => {
				return response.text();
			})
			.then((response) => {
				setMappedRecordsString(response);
			});
	}, []);

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
				getMappedRecordsString: [mappedRecordsString, setMappedRecordsString],
			}}
		>
			{children}
		</RecordsContext.Provider>
	);
}

RecordsContextProvider.propTypes = {
	children: PropTypes.node,
};

export { RecordsContext, RecordsContextProvider };
