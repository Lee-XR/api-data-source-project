import { createContext, useReducer } from "react";
import PropTypes from 'prop-types';
import { fetchSkiddle } from '../api/fetchSkiddleApi.js';
import { fetchDataThistle } from '../api/fetchDataThistleApi.js';
import { fetchBandsInTown } from '../api/fetchBandsInTownApi.js';

import { Skiddle } from '../components/Skiddle.jsx';
import { DataThistle } from '../components/DataThistle.jsx';
import { BandsInTown } from '../components/BandsInTown.jsx';

const ApiProperties = {
	Skiddle: {
        name: 'Skiddle',
        url: import.meta.env.VITE_SKIDDLE_API_URL,
		component: Skiddle,
		fetchFunc: fetchSkiddle,
	},
	DataThistle: {
        name: 'DataThistle',
        url: import.meta.env.VITE_DATATHISTLE_API_URL,
		component: DataThistle,
		fetchFunc: fetchDataThistle,
	},
	BandsInTown: {
        name: 'BandsInTown',
        url: import.meta.env.VITE_BANDSINTOWN_API_URL,
		component: BandsInTown,
		fetchFunc: fetchBandsInTown,
	},
};

const apiArray = ['Skiddle', 'DataThistle', 'BandsInTown'];

function apiReducer(state, action) {
    switch(action.type) {
        case 'CHANGE_API':
            return ApiProperties[action.apiName];

        default:
            return state;
    }
}

const ApiContext = createContext(null);

function ApiContextProvider({ children }) {
    const [apiState, apiDispatch] = useReducer(apiReducer, ApiProperties.Skiddle);

    return (
        <ApiContext.Provider value={{apiArray, apiState, apiDispatch}}>
            { children }
        </ApiContext.Provider>
    )
}

ApiContextProvider.propTypes = {
    children: PropTypes.node
}

export { ApiContext, ApiContextProvider }