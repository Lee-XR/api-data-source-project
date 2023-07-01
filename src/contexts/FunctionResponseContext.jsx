import { createContext, useReducer, useRef } from "react";
import PropTypes from 'prop-types';

const responseInitState = {
    isRunning: false,
    isError: false,
    isDone: false,
    successMsg: '',
    errorMsg: ''
}

function responseReducer(state, action) {
    switch(action.type) {
        case 'RESET_RESPONSE': 
            return responseInitState;

        case 'START_FUNCTION':
            return {
                ...state,
                isRunning: true,
                isError: false,
                isDone: false,
            }

        case 'HANDLE_RESPONSE':
            return {
                ...state,
                isRunning: false,
                isDone: true,
                successMsg: action.successMsg
            }

        case 'HANDLE_ERROR':
            return {
                ...state,
                isRunning: false,
                isError: true,
                errorMsg: action.errorMsg
            }

        default:
            return responseInitState;
    }
}

const FunctionResponseContext = createContext(responseInitState);

function FunctionResponseContextProvider({ children }) {
    const [responseState, responseDispatch] = useReducer(responseReducer, responseInitState);
    const responseTimeout = useRef(null);

    return (
            <FunctionResponseContext.Provider value={{responseState, responseDispatch, responseTimeout}}>
            {children}
        </FunctionResponseContext.Provider>
    )
}

FunctionResponseContextProvider.propTypes = {
    children: PropTypes.node
}

export { FunctionResponseContext, FunctionResponseContextProvider }