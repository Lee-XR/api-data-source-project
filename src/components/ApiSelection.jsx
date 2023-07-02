import { memo, useContext, useState } from 'react';
import { ApiContext } from '../contexts/ApiContext';

import '../styles/header.css';

export const ApiSelection = memo(function ApiSelection() {
	const { apiArray, apiState, apiDispatch } = useContext(ApiContext);
	const [selectedNum, setSelectedNum] = useState(() => {
		const index = apiArray.indexOf(apiState.name);
		return index === -1 ? 0 : index;
	});

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
});