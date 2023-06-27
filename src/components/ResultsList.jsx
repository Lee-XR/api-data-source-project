import PropTypes from 'prop-types';

import '../styles/resultsList.css';
import { useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext';
import { downloadFile } from '../utils/fileUtils';
import { ResultsContext } from '../contexts/ResultsContext';

function ResultBox({ resultInfo }) {
	const { name, data, count, filename, resetFunc } = resultInfo;

	function downloadResults() {
		const filetype = filename.split('.').pop();
		downloadFile(data, filename, filetype);
	}

	function resetResults() {
		const reset = confirm(`Are you sure to reset ${name} results?`);
		if (reset === true) {
			resetFunc();
		}
	}

	return (
		<div className='box'>
			<div className='info'>
				<h3>{name}</h3>
				<span>{count === 0 ? 'No Data Available' : `${count} Results`}</span>
			</div>
			<div className='download-btn'>
				<button
					className={count === 0 ? 'disabled' : ''}
					disabled={count === 0}
					onClick={resetResults}
				>
					Reset
				</button>
				<button
					className={count === 0 ? 'disabled' : ''}
					disabled={count === 0}
					onClick={downloadResults}
				>
					Download
				</button>
			</div>
		</div>
	);
}

ResultBox.propTypes = {
	resultInfo: PropTypes.object,
};

export function ResultsList() {
	const { apiState } = useContext(ApiContext);
	const {
		getRecords,
		getTotalRecordCount,
		getRecordType,
		getMappedCsv,
		getZeroMatchCsv,
		getHasMatchCsv,
	} = useContext(ResultsContext);
	const [records, setRecords] = getRecords;
	const [totalRecordCount, setTotalRecordCount] = getTotalRecordCount;
	const [recordType] = getRecordType;
	const [mappedCsv, setMappedCsv] = getMappedCsv;
	const [zeroMatchCsv, setZeroMatchCsv] = getZeroMatchCsv;
	const [hasMatchCsv, setHasMatchCsv] = getHasMatchCsv;

	const resultBoxInfo = [
		{
			name: `${apiState.name} API Data JSON`,
			data: records,
			count: totalRecordCount,
			filename: `${apiState.name}-${recordType}.json`,
			resetFunc: () => {
				setRecords('');
				setTotalRecordCount(0);
			},
		},
		{
			name: 'Field-Mapped Records CSV',
			data: mappedCsv.csvString,
			count: mappedCsv.count,
			filename: `${apiState.name}-mapped.csv`,
			resetFunc: () => setMappedCsv({ csvString: '', count: 0 }),
		},
		{
			name: 'Zero-Match Records CSV',
			data: zeroMatchCsv.csvString,
			count: zeroMatchCsv.count,
			filename: `${apiState.name}-zero-match.csv`,
			resetFunc: () => setZeroMatchCsv({ csvString: '', count: 0 }),
		},
		{
			name: 'Has-Match Records CSV',
			data: hasMatchCsv.csvString,
			count: hasMatchCsv.count,
			filename: `${apiState.name}-has-match.csv`,
			resetFunc: () => setHasMatchCsv({ csvString: '', count: 0 }),
		},
	];

	return (
		<div className='container'>
			{resultBoxInfo.map((box) => (
				<ResultBox
					key={box.name}
					resultInfo={box}
				/>
			))}
		</div>
	);
}
