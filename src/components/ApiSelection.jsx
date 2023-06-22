import { useContext, useState } from 'react';
import { ApiContext } from '../contexts/ApiContext';

import '../styles/header.css';

export function ApiSelection() {
	const { apiArray, apiState, apiDispatch } = useContext(ApiContext);
	const [selectedNum, setSelectedNum] = useState(apiArray.indexOf(apiState.name));

	function selectApi(index) {
		setSelectedNum(index);
		apiDispatch({ type: 'CHANGE_API', apiName: apiArray[index] });
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