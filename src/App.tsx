import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import UserManagerPage from "./pages/UserManagerPage";
import { ThemeProvider } from "./hooks/theme-provider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/gestion-utilisateurs" element={<UserManagerPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
};

export default App;