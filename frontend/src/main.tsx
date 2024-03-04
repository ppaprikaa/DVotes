import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage';
import PollsPage from './pages/PollsPage';
import CreatePollPage from './pages/CreatePollPage';
import PollPage from './pages/PollPage';

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <div>404 Not Found</div>,
	},
	{
		path: "/poll/:id?",
		element: <PollPage />
	},
	{
		path: "/polls/:page?",
		element: <PollsPage />
	},
	{
		path: "/polls/create",
		element: <CreatePollPage />
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
