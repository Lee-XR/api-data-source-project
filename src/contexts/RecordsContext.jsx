import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import venueRecords from '../assets/json/Skiddle-venues.json';

const testRecords = [
	{
		id: 1,
		name: 'Tom',
		age: 15
	},
	{
		id: 2,
		name: 'Jane',
		age: 22
	},
	{
		id: 3,
		name: 'Bill',
		age: 53
	}
]

const RecordsContext = createContext([]);

function RecordsContextProvider({ children }) {
	const [records, setRecords] = useState(venueRecords);
	// const [records, setRecords] = useState(testRecords);
	const [totalRecordCount, setTotalRecordCount] = useState(records.length);
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
				getAllowProcessing: [allowProcessing, setAllowProcessing],
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