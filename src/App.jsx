import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Habits from "./pages/Habits";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-[#0b0b0b] text-white">
                <Habits />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/app" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
