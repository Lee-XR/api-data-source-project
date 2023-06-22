import PropTypes from 'prop-types';
import '../styles/header.css';

export function Header (props) {
	const { children } = props;
    
	return (
		<header>
			{ children }
		</header>
	);
}

Header.propTypes = {
    children: PropTypes.node
}