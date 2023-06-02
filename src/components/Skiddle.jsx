import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/api.css';

/*
	EVENT & VENUE types code & type name
	~ EVENT code must all be UPPERCASE
	~ VENUE code must all be lowercase
 */
const eventTypes = [
	{
		code: 'FEST',
		type: 'Festivals'
	},
	{
		code: 'LIVE',
		type: 'Live Music'
	},
	{
		code: 'CLUB',
		type: 'Clubbing / Dance Music'
	},
	{
		code: 'DATE',
		type: 'Dating Event'
	},
	{
		code: 'THEATRE',
		type: 'Theatre / Dance'
	},
	{
		code: 'COMEDY',
		type: 'Comedy'
	},
	{
		code: 'EXHIB',
		type: 'Exhibitions and Attractions'
	},
	{
		code: 'KIDS',
		type: 'Kids / Family Event'
	},
	{
		code: 'BARPUB',
		type: 'Bar / Pub Event'
	},
	{
		code: 'LGB',
		type: 'Gay / Lesbian Event'
	},
	{
		code: 'SPORT',
		type: 'Sporting Event'
	},
	{
		code: 'ARTS',
		type: 'The Arts'
	},
]
const venueTypes = [
	{
		code: 'b',
		type: 'Bar / Pub'
	},
	{
		code: 'n',
		type: 'Nightclub'
	},
	{
		code: 'l',
		type: 'Live Music'
	},
	{
		code: 'o',
		type: 'Outdoor Venue'
	},
	{
		code: 't',
		type: 'Theatre'
	},
	{
		code: 's',
		type: 'Sports Ground'
	},
	{
		code: 'g',
		type: 'Gallery'
	},
]

export function Skiddle(props) {
	const { setApiType, setApiSingleId, setApiParams, setResetApi } = props;
	const [params, setParams] = useState({});

	const [searchType, setSearchType] = useState('events');
	const [isIndivSearch, setIsIndivSearch] = useState(false);
	const [indivId, setIndivId] = useState('');
	const [includeDescription, setIncludeDescription] = useState(false);

	const [canGeoSearch, setCanGeoSearch] = useState(true);
	const [isLatLongGeo, setIsLatLongGeo] = useState(true);
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [city, setCity] = useState('');
	const [radius, setRadius] = useState('');

	const [includeTypeIdSearch, setIncludeTypeIdSearch] = useState(false);
	const [idSearchType, setIdSearchType] = useState('');
	const [venueId, setVenueId] = useState('');
	const [brandId, setBrandId] = useState('');
	const [artistId, setArtistId] = useState('');
	const [genreId, setGenreId] = useState('');

	const [canKeywordSearch, setCanKeywordSearch] = useState(true);
	const [keyword, setKeyword] = useState('');
	const [minDate, setMinDate] = useState('');
	const [maxDate, setMaxDate] = useState('');
	const [canTypeSearch, setCanTypeSearch] = useState(true);
	const [type, setType] = useState('');
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);

	// Add search parameters to url
	function addParam(key, value) {
		const prevParams = Object.fromEntries(
			Object.entries(params).filter(([k, v]) => k !== key)
		);
		if (value === '' || value === false) {
			setParams({ ...prevParams });
		} else {
			setParams({ ...prevParams, [key]: value });
		}
	}

	// Remove search parameters from url
	function removeParams(keys) {
		let newParams = { ...params };
		keys.forEach((key) => {
			newParams = Object.fromEntries(
				Object.entries(newParams).filter(([k, v]) => k !== key)
			);
		});
		setParams({ ...newParams });
	}

	// Clear add inputs
	function clearInput() {
		setIsIndivSearch(false);
		setIncludeDescription(false);
		setIncludeTypeIdSearch(false);
		setIndivId('');
		setLatitude('');
		setLongitude('');
		setCity('');
		setRadius('');
		setIdSearchType('');
		setVenueId('');
		setBrandId('');
		setArtistId('');
		setGenreId('');
		setKeyword('');
		setMinDate('');
		setMaxDate('');
		setType('');
		removeParams([
			'description', 
			'latitude', 'longitude', 'city', 'radius', 
			'venueid', 'b', 'a', 'g', 
			'keyword', 'name', 'minDate', 'maxDate', 'eventcode', 'type', 'limit', 'offset'
		]);
	}

	// Change search type option and input settings
	function changeType(type) {
		setApiType(type);
		setSearchType(type);
		setCanGeoSearch(type === 'events' || type === 'venues');
		setCanKeywordSearch(type === 'events' || type === 'artists');
		setCanTypeSearch(type === 'events' || type === 'venues');
		setLimit(type === 'artists' ? 10 : 20);
		setOffset(0);

		clearInput();
	}

	// Change type ID search option
	function changeIdSearchType(type) {
		setIdSearchType(type);
		setVenueId('');
		setBrandId('');
		setArtistId('');
		setGenreId('');
		removeParams(['venueid', 'b', 'a', 'g']);
	}

	// Toggle individual type search
	function toggleIndivSearch() {
		setIsIndivSearch(!isIndivSearch);
		setIndivId('');
	}

	// Toggle type ID search
	function toggleTypeIdSearch() {
		setIncludeTypeIdSearch(!includeTypeIdSearch);
		setIdSearchType('');
		setVenueId('');
		setBrandId('');
		setArtistId('');
		setGenreId('');
		removeParams(['venueid', 'b', 'a', 'g']);
	}

	// Set reset settings function
	useEffect(() => {
		setResetApi(() => clearInput);
	}, []);

	// Set search type, individual type ID & url for paramter
	useEffect(() => {
		setApiType(searchType);
		setApiSingleId(isIndivSearch ? indivId : null);
		setApiParams(params);
	}, [params, indivId]);

	return (
		<div className='api-container'>
			<div className='api-options'>
				{/* Select search type */}
				<div className='search-types'>
					{/* Radio buttons for search type */}
					<span className='option-title'>Select search type:</span>
					<div
						className='search-type-options'
						onChange={(e) => changeType(e.target.value)}
					>
						<label htmlFor='events-radio'>
							<input
								type='radio'
								name='search-type'
								id='events-radio'
								value='events'
								defaultChecked
							/>
							Events
						</label>
						<label htmlFor='venues-radio'>
							<input
								type='radio'
								name='search-type'
								id='venues-radio'
								value='venues'
							/>
							Venues
						</label>
						<label htmlFor='artists-radio'>
							<input
								type='radio'
								name='search-type'
								id='artists-radio'
								value='artists'
							/>
							Artists
						</label>
					</div>

					{/* Checkbox select individual record ID search */}
					<label htmlFor='individual-search-checkbox'>
						<span className='option-title'>Individual Search</span>
						<input
							type='checkbox'
							name='individual-search-checkbox'
							className='search-checkbox'
							checked={isIndivSearch}
							onChange={() => toggleIndivSearch()}
						/>
					</label>
					<label
						htmlFor='individual-search-input'
						className='search-input'
					>
						ID:
						<input
							type='number'
							id='individual-search-input'
							disabled={!isIndivSearch}
							value={indivId}
							onChange={(e) => setIndivId(parseInt(e.target.value) || '')}
						/>
					</label>

					{/* Checkbox select include genre & artist info *EVENTS ONLY* */}
					<label
						htmlFor='include-description-checkbox'
						className={searchType === 'events' ? '' : 'disabled'}
					>
						<span className='option-title'>Include Genre & Artist Info:</span>
						<input
							type='checkbox'
							id='include-description-checkbox'
							className='search-checkbox'
							checked={includeDescription}
							name='description'
							onChange={(e) => {
								setIncludeDescription(!includeDescription);
								addParam(e.target.name, !includeDescription);
							}}
						/>
					</label>
				</div>

				{/* Search by geographic location data */}
				<div className={canGeoSearch ? 'geo-search' : 'geo-search disabled'}>
					<span className='option-title'>Geographic search using:</span>

					<div className='geo-search-options'>
						<label htmlFor='lat-long-radio'>
							<input
								type='radio'
								name='geo-search-type'
								id='lat-long-radio'
								disabled={!canGeoSearch}
								checked={isLatLongGeo}
								onChange={() => setIsLatLongGeo(true)}
							/>
							Latitude, Longitude & Radius
						</label>
						<label htmlFor='city-radio'>
							<input
								type='radio'
								name='geo-search-type'
								id='city-radio'
								checked={!isLatLongGeo}
								disabled={!canGeoSearch || searchType === 'venues'}
								onChange={() => setIsLatLongGeo(false)}
							/>
							City & Radius
						</label>
					</div>

					{isLatLongGeo && (
						<>
							<label
								htmlFor='latitude-search'
								className='search-input'
							>
								Latitude:
								<input
									type='number'
									name='latitude'
									disabled={!canGeoSearch}
									value={latitude}
									onChange={(e) => {
										setLatitude(parseInt(e.target.value) || '');
										addParam(e.target.name, parseInt(e.target.value) || '');
									}}
								/>
							</label>
							<label
								htmlFor='longitude-search'
								className='search-input'
							>
								Longitude:
								<input
									type='number'
									name='longitude'
									disabled={!canGeoSearch}
									value={longitude}
									onChange={(e) => {
										setLongitude(parseInt(e.target.value) || '');
										addParam(e.target.name, parseInt(e.target.value) || '');
									}}
								/>
							</label>
						</>
					)}
					{!isLatLongGeo && (
						<label
							htmlFor='city-search'
							className='search-input'
						>
							City:
							<input
								type='text'
								name='city'
								disabled={!canGeoSearch}
								value={city}
								onChange={(e) => {
									setCity(e.target.value);
									addParam(e.target.name, e.target.value);
								}}
							/>
						</label>
					)}
					<label
						htmlFor='radius-search'
						className='search-input'
					>
						Radius:
						<input
							type='number'
							name='radius'
							disabled={!canGeoSearch}
							value={radius}
							onChange={(e) => {
								setRadius(parseInt(e.target.value) || '');
								addParam(e.target.name, parseInt(e.target.value) || '');
							}}
						/>
					</label>
				</div>

				{/* Search by other type ID */}
				<div
					className={
						searchType === 'events' || searchType === 'artists'
							? 'type-id-search'
							: 'type-id-search disabled'
					}
				>
					<label htmlFor='type-id-search-checkbox'>
						<span className='option-title'>Search by type ID:</span>
						<input
							type='checkbox'
							name='type-id-search-checkbox'
							className='search-checkbox'
							checked={includeTypeIdSearch}
							onChange={() => toggleTypeIdSearch()}
						/>
					</label>
					<div
						className={
							searchType === 'events' || searchType === 'artists'
								? 'search-input'
								: 'search-input disabled'
						}
					>
						<label htmlFor='venue-id-radio'>
							<input
								type='radio'
								name='type-id-search-option'
								id='venue-id-radio'
								value='venue'
								checked={idSearchType === 'venue'}
								disabled={!includeTypeIdSearch}
								onChange={(e) => changeIdSearchType(e.target.value)}
							/>
							Venue ID:
						</label>
						<input
							type='number'
							name='venueid'
							id='venue-id-input'
							disabled={idSearchType !== 'venue'}
							value={venueId}
							onChange={(e) => {
								setVenueId(parseInt(e.target.value));
								addParam(e.target.name, parseInt(e.target.value));
							}}
						/>
					</div>
					<div
						className={
							searchType === 'events' || searchType === 'artists'
								? 'search-input'
								: 'search-input disabled'
						}
					>
						<label htmlFor='brand-id-radio'>
							<input
								type='radio'
								name='type-id-search-option'
								id='brand-id-radio'
								value='brand'
								disabled={!includeTypeIdSearch}
								onChange={(e) => changeIdSearchType(e.target.value)}
							/>
							Brand ID:
						</label>
						<input
							type='number'
							name='b'
							id='brand-id-input'
							disabled={idSearchType !== 'brand'}
							checked={idSearchType === 'brand'}
							value={brandId}
							onChange={(e) => {
								setBrandId(parseInt(e.target.value));
								addParam(e.target.name, parseInt(e.target.value));
							}}
						/>
					</div>
					<div
						className={
							searchType === 'events' ? 'search-input' : 'search-input disabled'
						}
					>
						<label htmlFor='artist-id-radio'>
							<input
								type='radio'
								name='type-id-search-option'
								id='artist-id-radio'
								value='artist'
								disabled={!includeTypeIdSearch}
								onChange={(e) => changeIdSearchType(e.target.value)}
							/>
							Artist ID:
						</label>
						<input
							type='number'
							name='a'
							id='artist-id-input'
							disabled={idSearchType !== 'artist'}
							checked={idSearchType === 'artist'}
							value={artistId}
							onChange={(e) => {
								setArtistId(parseInt(e.target.value));
								addParam(e.target.name, parseInt(e.target.value));
							}}
						/>
					</div>
					<div
						className={
							searchType === 'events' ? 'search-input' : 'search-input disabled'
						}
					>
						<label htmlFor='genre-id-radio'>
							<input
								type='radio'
								name='type-id-search-option'
								id='genre-id-radio'
								value='genre'
								disabled={!includeTypeIdSearch}
								onChange={(e) => changeIdSearchType(e.target.value)}
							/>
							Genre ID:
						</label>
						<input
							type='number'
							name='g'
							id='genre-id-input'
							disabled={idSearchType !== 'genre'}
							checked={idSearchType === 'genre'}
							value={genreId}
							onChange={(e) => {
								setGenreId(parseInt(e.target.value));
								addParam(e.target.name, parseInt(e.target.value));
							}}
						/>
					</div>
				</div>

				{/* Search by name, data range OR type, set records return limit */}
				<div className='other-search'>
					<label
						htmlFor='keyword-search'
						className={
							canKeywordSearch ? 'search-input' : 'search-input disabled'
						}
					>
						<span className='option-title'>Keyword Search:</span>
						<input
							type='text'
							name={searchType === 'events' ? 'keyword' : 'name'}
							id='keyword-search'
							value={keyword}
							onChange={(e) => {
								setKeyword(e.target.value);
								addParam(e.target.name, e.target.value);
							}}
						/>
					</label>

					<div className='search-input'>
						<span className='option-title'>Date Range Search:</span>
						<div className='date-range-search-options'>
							<label htmlFor='min-date'>
								Min Date:
								<input
									type='date'
									name='minDate'
									id='minDate'
									value={minDate}
									onChange={(e) => {
										setMinDate(e.target.value);
										addParam(e.target.name, e.target.value);
									}}
								/>
							</label>
							<label htmlFor='max-date'>
								Max Date:
								<input
									type='date'
									name='maxDate'
									id='maxDate'
									min={minDate}
									value={maxDate}
									onChange={(e) => {
										setMaxDate(e.target.value);
										addParam(e.target.name, e.target.value);
									}}
								/>
							</label>
						</div>
					</div>

					<label
						htmlFor='type-search'
						className={canTypeSearch ? 'search-input' : 'search-input disabled'}
					>
						<span className='option-title'>{searchType} Type Search:</span>
						<select
							name={searchType === 'events' ? 'eventcode' : 'type'}
							id={`${searchType}-type-search`}
							disabled={!canTypeSearch}
							value={type}
							onChange={(e) => {
								setType(e.target.value);
								addParam(e.target.name, e.target.value);
							}}
						>
							<option
								value=''
								disabled
							>
								Select a type
							</option>
							{searchType === 'events' && eventTypes.map((eventType) => (
								<option key={eventType.code} value={eventType.code}>
									{eventType.type}
								</option>
							))}
							{searchType === 'venues' && venueTypes.map((venueType) => (
								<option key={venueType.code} value={venueType.code}>
									{venueType.type}
								</option>
							))}
						</select>
					</label>

					<label
						htmlFor='return-limit'
						className='search-input'
					>
						<span className='option-title'>Return Limit (0-100):</span>
						<input
							type='number'
							name='limit'
							id='return-limit'
							min={0}
							max={100}
							value={limit}
							onChange={(e) => {
								setLimit(parseInt(e.target.value) || '');
								addParam(e.target.name, parseInt(e.target.value) || '');
							}}
						/>
					</label>

					<label
						htmlFor='return-offset'
						className='search-input'
					>
						<span className='option-title'>Return Offset:</span>
						<input
							type='number'
							name='offset'
							id='return-offset'
							value={offset}
							onChange={(e) => {
								setOffset(parseInt(e.target.value) || '');
								addParam(e.target.name, parseInt(e.target.value) || '');
							}}
						/>
					</label>
				</div>
			</div>
		</div>
	);
}

Skiddle.propTypes = {
	setApiType: PropTypes.func,
	setApiSingleId: PropTypes.func,
	setApiParams: PropTypes.func,
	setResetApi: PropTypes.func
};
