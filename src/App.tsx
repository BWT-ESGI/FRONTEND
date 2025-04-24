import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/global/LoginPage";
import UserManagerPage from "./pages/teacher/UserManagerPage";
import { ThemeProvider } from "./hooks/theme-provider";
import PromotionManagerPage from "./pages/global/promotion/PromotionManagerPage";
import PromotionEditorPage from "./pages/global/promotion/PromotionEditorPage";
import NotFoundPage from "./pages/global/NotFoundPage";
import PromotionAddStudentPage from "./pages/teacher/PromotionAddStudentPage";
import ProjectManagerPage from "./pages/global/project/ProjectManagerPage";
import UserCreatePage from "./pages/teacher/UserCreatePage";
import StudentRegisterPage from "@/pages/global/StudentRegisterPage";
import HomePage from "./pages/global/HomePage";
import ProjectCreatePage from "./pages/teacher/ProjectCreatePage";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import ProjectDashboardWrapper from "./pages/teacher/ProjectDashboardWrapper";
import ProjectEditWrapper from "./pages/teacher/ProjectEditWrapper";
import HomeDashboardPage from "./pages/global/HomeDashboardPage";
import IsAuthenticatedWall from "./middleware/IsAuthenticatedWall";
import IsTeacherWall from "./middleware/IsTeacherWall";
import ScoringGridPage from "./pages/teacher/ScoringGridPage";
import IsStudentWall from "./middleware/IsStudentWall";
import ProjectStudentDashboardPage from "./pages/student/ProjectStudentDashboardPage";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-right" />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/auth/register/:id"
              element={<StudentRegisterPage />}
            />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route element={<IsAuthenticatedWall />}>
              <Route path="/dashboard" element={<HomeDashboardPage />} />

              {/* ============== PROMOTION ============== */}
              <Route path="/promotions" element={<PromotionManagerPage />} />
              <Route path="/promotions/:id" element={<PromotionEditorPage />} />

              {/* ============== PROJET ============== */}
              <Route path="/projets" element={<ProjectManagerPage />} />

              <Route element={<IsStudentWall />}>
                <Route path="/students/projets/:id" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/livrables" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/rapports" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/notes" element={<ProjectStudentDashboardPage />} />
              </Route>

              {/* ============== TEACHER ============== */}
              <Route element={<IsTeacherWall />}>
                {/* ============== PROMOTION ============== */}
                <Route
                  path="/promotions/:id/ajouter-etudiant"
                  element={<PromotionAddStudentPage />}
                />

                <Route path="/grille-notation" element={<ScoringGridPage />} />

                {/* ============== PROJET ============== */}
                <Route
                  path="/projets/:id"
                  element={<ProjectDashboardWrapper />}
                />
                <Route
                  path="/projets/ajouter"
                  element={<ProjectCreatePage />}
                />
                <Route
                  path="/projets/:id/editer"
                  element={<ProjectEditWrapper />}
                />

                {/* ============== UTILISATEUR ============== */}
                <Route
                  path="/gestion-utilisateurs/create"
                  element={<UserCreatePage />}
                />
                <Route
                  path="/gestion-utilisateurs"
                  element={<UserManagerPage />}
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;