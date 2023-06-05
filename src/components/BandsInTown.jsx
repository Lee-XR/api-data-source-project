import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { OptionsSection } from './OptionsSection';

import '../styles/api.css';

export function BandsInTown(props) {
    const { setApiType, setApiSingleId, setApiParams, setResetApi } = props;
	const [params, setParams] = useState({});

    useEffect(() => {
        setApiType('artists');
    }, []);

    return (
        <div className="api-options">
            <OptionsSection>
                
            </OptionsSection>
        </div>
    )
}

BandsInTown.propTypes = {
    setApiType: PropTypes.func,
    setApiSingleId: PropTypes.func,
    setApiParams: PropTypes.func,
    setResetApi: PropTypes.func
}