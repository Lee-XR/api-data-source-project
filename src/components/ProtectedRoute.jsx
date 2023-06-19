import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { RecordsContext } from "../contexts/RecordsContext";

export function ProtectedRoute({ children }) {
    const { getAllowProcessing } = useContext(RecordsContext);
    const [allowProcessing] = getAllowProcessing;

    if (!allowProcessing) {
        return <Navigate to="/" />
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node
}