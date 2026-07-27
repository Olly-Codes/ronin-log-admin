import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import UsersPage from "./pages/dashboard/UsersPage";
import ReviewsPage from "./pages/dashboard/ReviewsPage";
import CommentsPage from "./pages/dashboard/CommentsPage";
import GenresPage from "./pages/dashboard/GenresPage";
import NewReviewPage from "./pages/dashboard/NewReviewPage";
import ReviewDetailsPage from "./pages/dashboard/ReviewDetailsPage";
import EditReviewPage from "./pages/dashboard/EditReviewPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {

  const { loading, user } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={ user ? <Navigate to="/admin/dashboard" /> : <Navigate to="/auth/login" />} />
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
            <Route path="reviews/new" element={<NewReviewPage />}></Route>
            <Route path="reviews/:id" element={<ReviewDetailsPage />}></Route>
            <Route path="comments" element={<CommentsPage />}></Route>
            <Route path="genres" element={<GenresPage />}></Route>
            <Route path="reviews/:id/edit" element={<EditReviewPage />}></Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
