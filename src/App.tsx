import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/global/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import UserManagerPage from "./pages/teacher/UserManagerPage";
import { ThemeProvider } from "./hooks/theme-provider";
import PromotionManagerPage from "./pages/teacher/PromotionManagerPage";
import PromotionEditorPage from "./pages/teacher/PromotionEditorPage";
import NotFoundPage from "./pages/global/NotFoundPage";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/gestion-utilisateurs" element={<UserManagerPage />} />
            <Route path="/gestion-promotions" element={<PromotionManagerPage />} />
            <Route path="/gestion-promotions/:id" element={<PromotionEditorPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
};

export default App;