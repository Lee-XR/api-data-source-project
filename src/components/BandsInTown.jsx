import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCurrentDate } from '../utils/dateUtils.js';
import { replaceWhiteSpace } from '../utils/stringUtils.js';

import { OptionsSection } from './OptionsSection';

import '../styles/apiOptions.css';

export function BandsInTown(props) {
	const { setApiEndpoint, setApiParams, setResetApi } = props;
	const [dateParam, setDateParam] = useState({});

	const [searchType, setSearchType] = useState('artists');
	const [artistSearchOption, setArtistSearchOption] = useState('');
	const [artistName, setArtistName] = useState('');
	const [artistId, setArtistId] = useState('');

	const [eventsDateOption, setEventsDateOption] = useState('');
	const [minDate, setMinDate] = useState('');
	const [maxDate, setMaxDate] = useState('');

	// Clear all inputs
	function clearInput() {
        setDateParam({});
		setArtistName('');
		setArtistId('');
		setArtistSearchOption('');
		setEventsDateOption('');
		setMinDate('');
		setMaxDate('');
	}

	// Add date parameter to URL
	function addDateParam(value) {
		if (value !== 'date-range') {
			setMinDate('');
			setMaxDate('');
			setDateParam({ date: value });
		} else {
            const today = getCurrentDate();
			setMinDate(today);
			setMaxDate(today);
			setDateParam({ date: `${today}, ${today}` });
		}
	}

    // Change search type option & input settings
	function changeType(type) {
		setSearchType(type);
		clearInput();

		if (type === 'events') {
			setArtistSearchOption('artist-name');
			setEventsDateOption('upcoming');
		}
	}

    // Change artist search option
	function changeArtistSearchOption(option) {
		setArtistSearchOption(option);
		setArtistName('');
		setArtistId('');
	}

	// Set reset settings function
	useEffect(() => {
		setResetApi(() => clearInput);
	}, []);

    // Set search endpoint, artist search option & date parameter for URL
    useEffect(() => {
        let id = artistId ? `id_${artistId}` : '';
        let endpoint = `artists/${replaceWhiteSpace(artistName) || id }`;
        if (searchType === 'events') {
            endpoint = `${endpoint}/events`;
        }

        setApiEndpoint(endpoint);
        setApiParams(dateParam);
        
    }, [searchType, artistName, artistId, dateParam]);

	return (
		<div className='api-options'>

			{/* Select search type & artist search option input */}
			<OptionsSection>
				{/* Radio buttons search type selection row */}
				<span className='option-title'>Select search type:</span>
				<div
					className='selections-flex-row'
					onChange={(e) => changeType(e.target.value)}
				>
					<label htmlFor='artist-info-radio'>
						<input
							type='radio'
							name='search-type'
							id='artist-info-radio'
							value='artists'
							defaultChecked
						/>
						Artists Info
					</label>
					<label htmlFor='artist-events-radio'>
						<input
							type='radio'
							name='search-type'
							id='artist-events-radio'
							value='events'
						/>
						Artists Events
					</label>
				</div>

				{/* Radio buttons artist search option selection & input */}
				<span className='option-title'>Search by Artist:</span>
				<div className='search-input'>
					<label htmlFor='artist-name-radio'>
						<input
							type='radio'
							name='artist-search-option'
							id='artist-name-radio'
							value='artist-name'
							checked={artistSearchOption === 'artist-name'}
							onChange={(e) => changeArtistSearchOption(e.target.value)}
						/>
						Artist Name:
					</label>
					<input
						type='text'
						name='artist-name'
						id='artist-name-input'
						disabled={artistSearchOption !== 'artist-name'}
						value={artistName}
						onChange={(e) => setArtistName(e.target.value)}
					/>
				</div>
				<div className='search-input'>
					<label htmlFor='artist-id-radio'>
						<input
							type='radio'
							name='artist-search-option'
							id='artist-id-radio'
							value='artist-id'
							checked={artistSearchOption === 'artist-id'}
							disabled={searchType !== 'artists'}
							onChange={(e) => changeArtistSearchOption(e.target.value)}
						/>
						Artist ID:
					</label>
					<input
						type='number'
						name='artist-id'
						id='artist-id-input'
						disabled={artistSearchOption !== 'artist-id'}
						value={artistId}
						onChange={(e) => setArtistId(e.target.valueAsNumber || '')}
					/>
				</div>
			</OptionsSection>

			{/* Select artist events date option */}
			<OptionsSection isDisabled={searchType === 'artists'}>
				<span className='option-title'>Search By Event Date:</span>
				<label htmlFor='events-upcoming'>
					<input
						type='radio'
						name='events-date-option'
						id='events-upcoming'
						value='upcoming'
						checked={eventsDateOption === 'upcoming'}
						disabled={searchType !== 'events'}
						onChange={(e) => {
							setEventsDateOption(e.target.value);
							addDateParam(e.target.value);
						}}
					/>
					Upcoming Events
				</label>
				<label htmlFor='events-past'>
					<input
						type='radio'
						name='events-date-option'
						id='events-past'
						value='past'
						checked={eventsDateOption === 'past'}
						disabled={searchType !== 'events'}
						onChange={(e) => {
							setEventsDateOption(e.target.value);
							addDateParam(e.target.value);
						}}
					/>
					Past Events
				</label>
				<label htmlFor='events-all'>
					<input
						type='radio'
						name='events-date-option'
						id='events-all'
						value='all'
						checked={eventsDateOption === 'all'}
						disabled={searchType !== 'events'}
						onChange={(e) => {
							setEventsDateOption(e.target.value);
							addDateParam(e.target.value);
						}}
					/>
					All Events
				</label>
				<div className='search-input'>
					<label htmlFor='events-date-range'>
						<input
							type='radio'
							name='events-date-option'
							id='events-date-range'
							value='date-range'
							checked={eventsDateOption === 'date-range'}
							disabled={searchType !== 'events'}
							onChange={(e) => {
								setEventsDateOption(e.target.value);
								addDateParam(e.target.value);
							}}
						/>
						Date Range:
					</label>
					<div className='selections-flex-row'>
						<label htmlFor='min-date'>
							Min Date:
							<input
								type='date'
								name='min-date'
								id='min-date'
								disabled={eventsDateOption !== 'date-range'}
								value={minDate}
								onChange={(e) => {
									setMinDate(e.target.value);
                                    setDateParam({ date: `${e.target.value},${maxDate}` });
								}}
							/>
						</label>
						<label htmlFor='max-date'>
							Max Date:
							<input
								type='date'
								name='max-date'
								id='max-date'
								min={minDate}
								disabled={eventsDateOption !== 'date-range'}
								value={maxDate}
								onChange={(e) => {
									setMaxDate(e.target.value);
                                    setDateParam({ date: `${minDate},${e.target.value}` });
								}}
							/>
						</label>
					</div>
				</div>
			</OptionsSection>
		</div>
	);
}

BandsInTown.propTypes = {
	setApiEndpoint: PropTypes.func,
	setApiParams: PropTypes.func,
	setResetApi: PropTypes.func,
};
