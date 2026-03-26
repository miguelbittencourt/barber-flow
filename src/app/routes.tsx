import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { Services } from './pages/Services';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { getAuthToken } from './utils/storage';
import { Navigate } from 'react-router';

// Auth guard component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);
