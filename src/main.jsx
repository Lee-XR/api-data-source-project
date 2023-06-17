import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { RecordsContextProvider } from './contexts/RecordsContext.jsx';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<RecordsContextProvider>
		<App />
	</RecordsContextProvider>
	// </React.StrictMode>,
);