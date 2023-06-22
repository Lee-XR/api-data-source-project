import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './configs/routerConfig.jsx';
import { ApiContextProvider } from './contexts/ApiContext.jsx';
import { RecordsContextProvider } from './contexts/RecordsContext.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
	<ApiContextProvider>
		<RecordsContextProvider>
			<RouterProvider router={router} />
		</RecordsContextProvider>
	</ApiContextProvider>
	// </React.StrictMode>,
);
