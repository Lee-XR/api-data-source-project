import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import venueRecords from '../assets/json/Skiddle-venues.json';

const RecordsContext = createContext(null);

function RecordsContextProvider({ children }) {
	const [records, setRecords] = useState(venueRecords);
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