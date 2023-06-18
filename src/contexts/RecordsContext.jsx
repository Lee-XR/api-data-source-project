import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const RecordsContext = createContext([]);

export function RecordsContextProvider(props) {
    const [records, setRecords] = useState([]);
    const [totalRecordCount, setTotalRecordCount] = useState(0);

    return (
        <RecordsContext.Provider value={{records, setRecords, totalRecordCount, setTotalRecordCount}}>
            {props.children}
        </RecordsContext.Provider>
    )
}

RecordsContextProvider.propTypes = {
    children: PropTypes.node
}