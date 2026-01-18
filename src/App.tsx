// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AuthPage from './components/auth/AuthPage';
import HomePage from './pages/HomePage';
import ExperimentsListPage from './pages/ExperimentsListPage';
import HClExperiment from './components/experiments/HClExperiment';

// Protected Route компоненті
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthPage />} 
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experiments"
          element={
            <ProtectedRoute>
              <ExperimentsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experiment/:id"
          element={
            <ProtectedRoute>
              <HClExperiment />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;