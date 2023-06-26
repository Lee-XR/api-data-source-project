import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { ResultsContext } from "../contexts/ResultsContext";

export function ProtectedRoute({ children }) {
    const { getAllowProcessing } = useContext(ResultsContext);
    const [allowProcessing] = getAllowProcessing;

    if (!allowProcessing) {
        return <Navigate to="/" />
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node
}