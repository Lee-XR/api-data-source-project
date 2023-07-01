import PropTypes from 'prop-types';
import '../styles/header.css';

export function Header({ children }) {
	return <header>{children}</header>;
}

Header.propTypes = {
	children: PropTypes.node,
};
