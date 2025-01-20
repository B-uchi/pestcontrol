import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import PestControlDashboard from './pages/PestControlDashboard';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (user.role === 'farmer') {
    return <FarmerDashboard />;
  }
  if (user.role === 'pestcontrol') {
    return <PestControlDashboard />;
  }
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}