import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import axios from 'axios';

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>,
);

axios.defaults.baseURL =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_BACKEND_BASE_URL_PROD
		: import.meta.env.VITE_BACKEND_BASE_URL_DEV;
