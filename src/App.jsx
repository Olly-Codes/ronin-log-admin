import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import UsersPage from "./pages/Dashboard/UsersPage";
import ReviewsPage from "./pages/Dashboard/ReviewsPage";
import CommentsPage from "./pages/Dashboard/CommentsPage";
import GenresPage from "./pages/Dashboard/GenresPage";

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
          >
            <Route index element={<DashboardHome />}></Route>
            <Route path="users" element={<UsersPage />}></Route>
            <Route path="reviews" element={<ReviewsPage />}></Route>
            <Route path="comments" element={<CommentsPage />}></Route>
            <Route path="genres" element={<GenresPage />}></Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
