import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/global/LoginPage";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import UserManagerPage from "./pages/teacher/UserManagerPage";
import { ThemeProvider } from "./hooks/theme-provider";
import PromotionManagerPage from "./pages/teacher/PromotionManagerPage";
import PromotionEditorPage from "./pages/teacher/PromotionEditorPage";
import NotFoundPage from "./pages/global/NotFoundPage";
import PromotionAddStudentPage from "./pages/teacher/PromotionAddStudentPage";
import ProjectManagerPage from "./pages/global/ProjectManagerPage";
import ProjectDashboardPage from "./pages/teacher/ProjectDashboardPage";
import UserCreatePage from "./pages/teacher/UserCreatePage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import StudentRegisterPage from "@/pages/global/StudentRegisterPage";
import HomePage from "./pages/global/HomePage";
import ProjectCreatePage from "./pages/teacher/ProjectCreatePage";
import ProjectEditPage from "./pages/teacher/ProjectEditPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/register/:id" element={<StudentRegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />

            {/* ============== PROMOTION ============== */}
            <Route path="/gestion-promotions" element={<PromotionManagerPage />} />
            <Route path="/gestion-promotions/:id" element={<PromotionEditorPage />} />
            <Route path="/gestion-promotions/:id/ajouter-etudiant" element={<PromotionAddStudentPage />} />

            {/* ============== PROJET ============== */}
            <Route path="/gestion-projets" element={<ProjectManagerPage />} />
            <Route path="/gestion-projets/:id" element={<ProjectDashboardPage />} />
            <Route path="/gestion-projets/ajouter" element={<ProjectCreatePage />} />
            <Route path="/gestion-projets/:id/editer" element={<ProjectEditPage />} />

            {/* ============== UTILISATEUR ============== */}
            <Route path="/gestion-utilisateurs/create" element={<UserCreatePage />} />
            <Route path="/gestion-utilisateurs" element={<UserManagerPage />} />

          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </GoogleOAuthProvider>

  );
};

export default App;