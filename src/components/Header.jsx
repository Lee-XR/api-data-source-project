import { useState } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const apiArray = ['Skiddle', 'DataThistle', 'BandsInTown'];

const Header = (props) => {
    const { setSelectedApi } = props;
	const [selectedNum, setSelectedNum] = useState(0);

	function selectApi(index) {
		setSelectedNum(index);
        setSelectedApi(apiArray[index]);
	}

	return (
		<header>
			<ul style={{ '--item-num': selectedNum }}>
                {apiArray.map((api, index) => (
                    <li key={index} onClick={() => selectApi(index)}>
                        {api}
                    </li>
                ))}
			</ul>
		</header>
	);
};

Header.propTypes = {
    setSelectedApi: PropTypes.func
}

export default Header;
