import PropTypes from 'prop-types';

import '../styles/apiOptions.css';

export function ApiOptionsSection(props) {
	const { children, isDisabled } = props;

	return (
		<div
			className={isDisabled ? 'options-section disabled' : 'options-section'}
		>
			{children}
		</div>
	);
}

ApiOptionsSection.propTypes = {
	children: PropTypes.node,
	isDisabled: PropTypes.bool,
};

ApiOptionsSection.defaultProps = {
    isDisabled: false
}
