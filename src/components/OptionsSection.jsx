import PropTypes from 'prop-types';

import '../styles/api.css';

export function OptionsSection(props) {
	const { children, isDisabled } = props;

	return (
		<div
			className={isDisabled ? 'options-section disabled' : 'options-section'}
		>
			{children}
		</div>
	);
}

OptionsSection.propTypes = {
	children: PropTypes.node,
	isDisabled: PropTypes.bool,
};

OptionsSection.defaultProps = {
    isDisabled: false
}
