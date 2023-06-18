import { createBrowserRouter } from "react-router-dom";

import { App } from '../App.jsx';
import { DataFetching } from '../pages/DataFetching.jsx';
import { DataProcessing } from '../pages/DataProcessing.jsx';

export const router = createBrowserRouter([
    {
		path: "/",
		Component: App,
		children: [
			{
				index: true,
				Component: DataFetching,
			},
			{
				path: "data-processing",
				Component: DataProcessing
			}
		]
	}
]);