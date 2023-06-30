import { createBrowserRouter } from "react-router-dom";

import { App } from '../App.jsx';
import { DataFetching } from '../pages/DataFetching.jsx';
import { DataProcessing } from '../pages/DataProcessing.jsx';

export const router = createBrowserRouter([
    {
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				element: <DataFetching />,
			},
			{
				path: "data-processing",
				element: <DataProcessing />
			}
		]
	}
]);