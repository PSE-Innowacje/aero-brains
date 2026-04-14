import { createBrowserRouter, Navigate } from 'react-router-dom';
import RequireRole from './auth/RequireRole';
import AppShell from './layout/AppShell';
import LoginPage from './layout/LoginPage';

import HelicopterList from './features/helicopters/HelicopterList';
import HelicopterForm from './features/helicopters/HelicopterForm';
import CrewList from './features/crew/CrewList';
import CrewForm from './features/crew/CrewForm';
import LandingSiteList from './features/landing-sites/LandingSiteList';
import LandingSiteForm from './features/landing-sites/LandingSiteForm';
import UserList from './features/users/UserList';
import UserForm from './features/users/UserForm';
import OperationList from './features/operations/OperationList';
import OperationForm from './features/operations/OperationForm';
import FlightOrderList from './features/flight-orders/FlightOrderList';
import FlightOrderForm from './features/flight-orders/FlightOrderForm';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireRole roles={['ADMINISTRATOR', 'PLANNER', 'SUPERVISOR', 'PILOT']}>
        <AppShell />
      </RequireRole>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/operations" replace />,
      },
      // Administration
      {
        path: 'helicopters',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <HelicopterList />
          </RequireRole>
        ),
      },
      {
        path: 'helicopters/:id',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <HelicopterForm />
          </RequireRole>
        ),
      },
      {
        path: 'crew',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <CrewList />
          </RequireRole>
        ),
      },
      {
        path: 'crew/:id',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <CrewForm />
          </RequireRole>
        ),
      },
      {
        path: 'landing-sites',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <LandingSiteList />
          </RequireRole>
        ),
      },
      {
        path: 'landing-sites/:id',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <LandingSiteForm />
          </RequireRole>
        ),
      },
      {
        path: 'users',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <UserList />
          </RequireRole>
        ),
      },
      {
        path: 'users/:id',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <UserForm />
          </RequireRole>
        ),
      },
      // Operations
      {
        path: 'operations',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'PLANNER', 'SUPERVISOR', 'PILOT']}>
            <OperationList />
          </RequireRole>
        ),
      },
      {
        path: 'operations/:id',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'PLANNER', 'SUPERVISOR', 'PILOT']}>
            <OperationForm />
          </RequireRole>
        ),
      },
      // Flight Orders
      {
        path: 'flight-orders',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <FlightOrderList />
          </RequireRole>
        ),
      },
      {
        path: 'flight-orders/:id',
        element: (
          <RequireRole roles={['ADMINISTRATOR', 'SUPERVISOR', 'PILOT']}>
            <FlightOrderForm />
          </RequireRole>
        ),
      },
    ],
  },
]);
