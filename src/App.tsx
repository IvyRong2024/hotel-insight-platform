import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { BrandView } from './pages/BrandView';
import { HotelView } from './pages/HotelView';
import { PriceMonitoring } from './pages/PriceMonitoring';
import { ActionCenter } from './pages/ActionCenter';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
      <Route path="/brand" element={<ProtectedRoute><BrandView /></ProtectedRoute>} />
      <Route path="/hotel" element={<ProtectedRoute><HotelView /></ProtectedRoute>} />
      <Route path="/price" element={<ProtectedRoute><PriceMonitoring /></ProtectedRoute>} />
      <Route path="/actions" element={<ProtectedRoute><ActionCenter /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
