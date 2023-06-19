import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/header.css';

const apiArray = ['Skiddle', 'DataThistle', 'BandsInTown'];

export function ApiSelection(props) {
    const { setSelectedApi } = props;
	const [selectedNum, setSelectedNum] = useState(0);

	function selectApi(index) {
		setSelectedNum(index);
        setSelectedApi(apiArray[index]);
	}

	return (
		<ul style={{ '--item-num': selectedNum }}>
			{apiArray.map((api, index) => (
				<li
					key={index}
					onClick={() => selectApi(index)}
				>
					{api}
				</li>
			))}
		</ul>
	);
}

ApiSelection.propTypes = {
    setSelectedApi: PropTypes.func
}