import { useState } from "react";
import { createContext } from "react";
import PropTypes from 'prop-types';

const LatestCsvContext = createContext('');

function LatestCsvContextProvider({ children }) {
    const [latestCsv, setLatestCsv] = useState({data: '', count: 0});

    return (
        <LatestCsvContext.Provider value={{latestCsv, setLatestCsv}}>
            {children}
        </LatestCsvContext.Provider>
    )
}

LatestCsvContextProvider.propTypes = {
    children: PropTypes.node
}

export { LatestCsvContext, LatestCsvContextProvider }