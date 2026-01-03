import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import GlobalLoader from './components/GlobalLoader';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Drivers from './pages/Drivers';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import PendingOrders from './pages/PendingOrders';
import InProgressOrders from './pages/InProgressOrders';
import CompletedOrders from './pages/CompletedOrders';
import CancelledOrders from './pages/CancelledOrders';
import Vehicles from './pages/Vehicles';
import Trucks from './pages/Trucks';
import Motorcycles from './pages/Motorcycles';
import Settings from './pages/Settings';
import Login from './pages/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/drivers"
        element={
          <ProtectedRoute>
            <Drivers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/pending"
        element={
          <ProtectedRoute>
            <PendingOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/in-progress"
        element={
          <ProtectedRoute>
            <InProgressOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/completed"
        element={
          <ProtectedRoute>
            <CompletedOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/cancelled"
        element={
          <ProtectedRoute>
            <CancelledOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vehicles"
        element={
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/trucks"
        element={
          <ProtectedRoute>
            <Trucks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/motorcycles"
        element={
          <ProtectedRoute>
            <Motorcycles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <GlobalLoader />
    </Router>
  );
}

export default App;
