import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './configs/routerConfig.jsx';
import { ApiContextProvider } from './contexts/ApiContext.jsx';
import { ResultsContextProvider } from './contexts/ResultsContext.jsx';
import { FunctionResponseContextProvider } from './contexts/FunctionResponseContext.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ApiContextProvider>
			<ResultsContextProvider>
				<FunctionResponseContextProvider>
					<RouterProvider router={router} />
				</FunctionResponseContextProvider>
			</ResultsContextProvider>
		</ApiContextProvider>
	</React.StrictMode>
);
