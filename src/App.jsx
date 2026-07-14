import { BrowserRouter, Routes, Route } from "react-router";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {

  const { loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route 
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
