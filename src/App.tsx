import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import GlobalLoader from './components/GlobalLoader';
import Dashboard from './pages/Dashboard';
import GenerateQR from './pages/GenerateQR';
import ScanQR from './pages/ScanQR';
import QRHistory from './pages/QRHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Logos from './pages/Logos';
import Templates from './pages/Templates';
import QrDataPage from './pages/QrDataPage';

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
      <Route path="/admin/qrData/:data" element={<QrDataPage/>} />
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
        path="/admin/generate"
        element={
          <ProtectedRoute>
            <GenerateQR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scan"
        element={
          <ProtectedRoute>
            <ScanQR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <ProtectedRoute>
            <QRHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logos"
        element={
          <ProtectedRoute>
            <Logos />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/admin/templates"
        element={
          <ProtectedRoute>
            <Templates />
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
