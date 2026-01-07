import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Habits from "./pages/Habits";

// Loading fallback
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper (requires authentication)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

// Public route wrapper (redirects to /app if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/app" replace />;

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - redirect to /app if authenticated */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected routes - redirect to /login if not authenticated */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
                <Habits />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to /app */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;