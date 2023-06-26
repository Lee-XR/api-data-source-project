import PropTypes from 'prop-types';

import '../styles/resultsList.css';
import { useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext';
import { downloadFile } from '../utils/fileUtils';

function ResultBox({ resultInfo }) {
	const { name, data, count, filename } = resultInfo;

	function downloadResults() {
        const filetype = filename.split(".").pop();
        downloadFile(data, filename, filetype);
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
                    onClick={downloadResults}
				>
					Download
				</button>
			</div>
		</div>
	);
}

ResultBox.propTypes = {
	resultInfo: PropTypes.object
};

export function ResultsList({ results, recordType }) {
	const { apiState } = useContext(ApiContext);
	const { records, mappedCsv, zeroMatchCsv, hasMatchCsv } = results;

	return (
		<div className='container'>
			<ResultBox
				resultInfo={{
					name: `${apiState.name} API Data`,
					data: records,
					count: records.length,
					filename: `${apiState.name}-${recordType}.json`,
				}}
			/>
			<ResultBox
				resultInfo={{
					name: 'Field-Mapped Records CSV',
					data: mappedCsv.csvString,
					count: mappedCsv.count,
					filename: `${apiState.name}-mapped.csv`,
				}}
			/>
			<ResultBox
				resultInfo={{
					name: 'Zero-Match Records CSV',
					data: zeroMatchCsv.csvString,
					count: zeroMatchCsv.count,
					filename: `${apiState.name}-zero-match.csv`,
				}}
			/>
			<ResultBox
				resultInfo={{
					name: 'Has-Match Records CSV',
					data: hasMatchCsv.csvString,
					count: hasMatchCsv.count,
					filename: `${apiState.name}-has-match.csv`,
				}}
			/>
		</div>
	);
}

ResultsList.propTypes = {
	results: PropTypes.object,
	recordType: PropTypes.string,
};
