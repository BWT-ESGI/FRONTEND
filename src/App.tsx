import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "@/pages/global/LoginPage";
import UserManagerPage from "@/pages/teacher/UserManagerPage";
import { ThemeProvider } from "./hooks/theme-provider";
import PromotionManagerPage from "@/pages/global/promotion/PromotionManagerPage";
import PromotionEditorPage from "@/pages/global/promotion/PromotionEditorPage";
import NotFoundPage from "@/pages/global/NotFoundPage";
import PromotionEditStudentPage from "@/components/project/PromotionEditStudentComponent";
import ProjectListPage from "@/pages/global/project/ProjectListPage";
import UserCreatePage from "@/pages/teacher/UserCreatePage";
import StudentRegisterPage from "@/pages/global/StudentRegisterPage";
import HomePage from "@/pages/global/HomePage";
import { QueryClient, QueryClientProvider } from "react-query";
import ProjectDashboardWrapper from "@/pages/teacher/ProjectDashboardWrapper";
import ProjectEditWrapper from "@/pages/teacher/ProjectEditWrapper";
import HomeDashboardPage from "@/pages/global/HomeDashboardPage";
import IsAuthenticatedWall from "@/middleware/IsAuthenticatedWall";
import IsTeacherWall from "@/middleware/IsTeacherWall";
import ScoringGridPage from "@/pages/teacher/ScoringGridPage";
import IsStudentWall from "@/middleware/IsStudentWall";
import ProjectStudentDashboardPage from "@/pages/student/ProjectStudentDashboardPage";
import JoinGroupProjectPage from "@/pages/student/JoinGroupProjectPage";
import ProjectCorrectionPage from "./pages/teacher/ProjectCorrectionPage";
import DefenseCorrectionPage from "./pages/teacher/DefenseCorrectionPage";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-right" />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/register/:id" element={<StudentRegisterPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route element={<IsAuthenticatedWall />}>
              <Route path="/dashboard" element={<HomeDashboardPage />} />

              {/* ============== PROMOTION ============== */}
              <Route path="/promotions" element={<PromotionManagerPage />} />
              <Route path="/promotions/:id" element={<PromotionEditorPage />} />

              {/* ============== PROJET ============== */}

              <Route element={<IsStudentWall />}>
                <Route path="/students/projets" element={<ProjectListPage />} />
                <Route path="/students/projets/:id" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/livrables" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/rapports" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/notes" element={<ProjectStudentDashboardPage />} />
                <Route path="/students/projets/:id/rejoindre" element={<JoinGroupProjectPage />} />
              </Route>

              {/* ============== TEACHER ============== */}
              <Route element={<IsTeacherWall />}>
                {/* ============== PROMOTION ============== */}
                <Route path="/promotions/:id/ajouter-etudiant" element={<PromotionEditStudentPage />} />

                <Route path="/grille-notation" element={<ScoringGridPage />} />

                {/* ============== PROJET ============== */}
                <Route path="/projets" element={<ProjectListPage />} />
                <Route path="/projets/:id" element={<ProjectDashboardWrapper />} />
                <Route path="/projets/:id/editer" element={<ProjectEditWrapper />} />
                <Route path="/projets/:id/projets/correction" element={<ProjectCorrectionPage />} />
                <Route path="/projets/:id/soutenances/correction" element={<DefenseCorrectionPage />} />
                {/* ============== UTILISATEUR ============== */}
                <Route path="/gestion-utilisateurs/create" element={<UserCreatePage />} />
                <Route path="/gestion-utilisateurs" element={<UserManagerPage />} />
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