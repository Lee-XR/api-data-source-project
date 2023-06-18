import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const RecordsContext = createContext([]);

export function RecordsContextProvider(props) {
	const [records, setRecords] = useState([]);
	const [totalRecordCount, setTotalRecordCount] = useState(0);
	const [allowProcessing, setAllowProcessing] = useState(false);

    useEffect(() => {
        setAllowProcessing(records.length > 0);
    }, records);

	return (
		<RecordsContext.Provider
			value={{
				records,
				setRecords,
				totalRecordCount,
				setTotalRecordCount,
				allowProcessing,
				setAllowProcessing,
			}}
		>
			{props.children}
		</RecordsContext.Provider>
	);
}

RecordsContextProvider.propTypes = {
	children: PropTypes.node,
};
